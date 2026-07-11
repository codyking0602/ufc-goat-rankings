-- Picks private room-owner results phase.
-- Run once in Supabase SQL Editor. Safe to rerun.

alter table public.pick_events
  add column if not exists admin_room_id uuid references public.pick_rooms(id) on delete set null;

create or replace function public.picks_create_room(
  p_event_id text,
  p_display_name text,
  p_room_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_admin_token text:=encode(gen_random_bytes(24),'hex');
  v_member_token text:=encode(gen_random_bytes(24),'hex');
  v_code text;
  v_attempt integer:=0;
  v_is_result_admin boolean:=false;
begin
  if not exists(select 1 from public.pick_events where id=p_event_id and status in ('upcoming','live')) then
    raise exception 'That event is not open for picks.';
  end if;

  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30 then
    raise exception 'Enter a display name between 1 and 30 characters.';
  end if;

  loop
    v_attempt:=v_attempt+1;
    v_code:=upper(substr(encode(gen_random_bytes(6),'hex'),1,6));
    exit when not exists(select 1 from public.pick_rooms where code=v_code);
    if v_attempt>10 then raise exception 'Could not generate room code.'; end if;
  end loop;

  insert into public.pick_rooms(code,event_id,name,admin_token_hash)
  values(v_code,p_event_id,coalesce(nullif(trim(p_room_name),''),'Fight Picks'),digest(v_admin_token,'sha256'))
  returning * into v_room;

  -- The first room created after this phase becomes the single results-admin room.
  update public.pick_events
  set admin_room_id=v_room.id
  where id=p_event_id and admin_room_id is null;

  select admin_room_id=v_room.id into v_is_result_admin
  from public.pick_events where id=p_event_id;

  insert into public.pick_room_members(room_id,display_name,member_token_hash)
  values(v_room.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_member;

  return jsonb_build_object(
    'room',jsonb_build_object(
      'id',v_room.id,
      'code',v_room.code,
      'name',v_room.name,
      'event_id',v_room.event_id,
      'is_result_admin',v_is_result_admin
    ),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token,
    'admin_token',v_admin_token
  );
end;
$$;

create or replace function public.picks_room_snapshot(
  p_room_code text,
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_me public.pick_room_members;
  v_is_result_admin boolean:=false;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;

  select * into v_me from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the room.'; end if;

  select admin_room_id=v_room.id into v_is_result_admin
  from public.pick_events where id=v_room.event_id;

  return jsonb_build_object(
    'room',jsonb_build_object(
      'id',v_room.id,
      'code',v_room.code,
      'name',v_room.name,
      'event_id',v_room.event_id,
      'is_result_admin',v_is_result_admin
    ),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'my_picks',coalesce((
      select jsonb_agg(jsonb_build_object(
        'fight_id',s.fight_id,
        'fighter_name',s.fighter_name,
        'is_underdog_lock',s.is_underdog_lock
      ))
      from public.pick_selections s where s.member_id=v_me.id
    ),'[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,
        'display_name',m.display_name,
        'picks_made',(select count(*) from public.pick_selections s where s.member_id=m.id),
        'correct',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name),
        'upset_bonus',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name),
        'score',(
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name)
          +
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name)
        ),
        'visible_picks',coalesce((
          select jsonb_agg(jsonb_build_object(
            'fight_id',s2.fight_id,
            'fighter_name',s2.fighter_name,
            'is_underdog_lock',s2.is_underdog_lock
          ))
          from public.pick_selections s2
          join public.pick_fights f2 on f2.id=s2.fight_id
          where s2.member_id=m.id and (m.id=v_me.id or now()>=f2.lock_at or f2.result_status<>'scheduled')
        ),'[]'::jsonb)
      ) order by m.created_at)
      from public.pick_room_members m where m.room_id=v_room.id
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.picks_admin_set_fight_result(
  p_room_code text,
  p_admin_token text,
  p_fight_id text,
  p_result_status text,
  p_winner_name text default null,
  p_reopen_minutes integer default 15
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_fight public.pick_fights;
begin
  select r.* into v_room
  from public.pick_rooms r
  join public.pick_events e on e.id=r.event_id and e.admin_room_id=r.id
  where r.code=upper(trim(p_room_code))
    and r.admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'This room is not the event results-admin room.';
  end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;

  if not found then raise exception 'Fight not found for this room.'; end if;

  if p_result_status not in ('scheduled','complete','draw','no-contest','cancelled') then
    raise exception 'Invalid fight status.';
  end if;

  if p_result_status='complete' and p_winner_name not in (v_fight.red_name,v_fight.blue_name) then
    raise exception 'Choose one of the two fighters as the winner.';
  end if;

  update public.pick_fights
  set result_status=p_result_status,
      winner_name=case when p_result_status='complete' then p_winner_name else null end,
      lock_at=case
        when p_result_status='scheduled'
          then greatest(lock_at,now()+make_interval(mins=>greatest(coalesce(p_reopen_minutes,15),1)))
        else lock_at
      end
  where id=v_fight.id;

  if p_result_status<>'scheduled' then
    update public.pick_events
    set status=case when status='upcoming' then 'live' else status end
    where id=v_room.event_id;
  end if;

  return jsonb_build_object(
    'saved',true,
    'fight_id',v_fight.id,
    'result_status',p_result_status,
    'winner_name',case when p_result_status='complete' then p_winner_name else null end
  );
end;
$$;

create or replace function public.picks_admin_set_event_status(
  p_room_code text,
  p_admin_token text,
  p_event_status text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
begin
  select r.* into v_room
  from public.pick_rooms r
  join public.pick_events e on e.id=r.event_id and e.admin_room_id=r.id
  where r.code=upper(trim(p_room_code))
    and r.admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'This room is not the event results-admin room.';
  end if;

  if p_event_status not in ('upcoming','live','complete') then
    raise exception 'Invalid event status.';
  end if;

  update public.pick_events set status=p_event_status where id=v_room.event_id;
  return jsonb_build_object('saved',true,'event_id',v_room.event_id,'status',p_event_status);
end;
$$;

-- Keep cancelled/void fights visible so room history remains understandable.
create or replace function public.picks_public_events()
returns jsonb
language sql
security definer
set search_path=public,extensions
as $$
  select coalesce(jsonb_agg(event_json order by (event_json->>'eventDate')::timestamptz),'[]'::jsonb)
  from (
    select jsonb_build_object(
      'id',e.id,
      'name',e.name,
      'subtitle',e.subtitle,
      'eventType',e.event_type,
      'eventDate',e.event_date,
      'location',e.location,
      'cardRule',e.card_rule,
      'status',e.status,
      'sourceNote',e.source_note,
      'fights',coalesce((
        select jsonb_agg(jsonb_build_object(
          'id',f.id,
          'order',f.bout_order,
          'cardSection',f.card_section,
          'weightClass',f.weight_class,
          'red',f.red_name,
          'blue',f.blue_name,
          'lockAt',f.lock_at,
          'winner',case when f.result_status='complete' then f.winner_name else null end,
          'resultStatus',f.result_status,
          'redOdds',f.red_odds,
          'blueOdds',f.blue_odds,
          'oddsSource',f.odds_source,
          'oddsUpdatedAt',f.odds_updated_at
        ) order by f.bout_order)
        from public.pick_fights f
        where f.event_id=e.id
      ),'[]'::jsonb)
    ) event_json
    from public.pick_events e
    where e.status in ('upcoming','live','complete')
  ) visible_events;
$$;

grant execute on function public.picks_create_room(text,text,text) to anon,authenticated;
grant execute on function public.picks_room_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_admin_set_fight_result(text,text,text,text,text,integer) to anon,authenticated;
grant execute on function public.picks_admin_set_event_status(text,text,text) to anon,authenticated;
grant execute on function public.picks_public_events() to anon,authenticated;
