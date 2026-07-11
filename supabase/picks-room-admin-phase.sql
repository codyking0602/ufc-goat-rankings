-- Picks private room-owner results phase.
-- Run once in Supabase SQL Editor. Safe to rerun.

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
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code))
    and admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'Room-owner access is not available on this device.';
  end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;

  if not found then
    raise exception 'Fight not found for this room.';
  end if;

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
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code))
    and admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'Room-owner access is not available on this device.';
  end if;

  if p_event_status not in ('upcoming','live','complete') then
    raise exception 'Invalid event status.';
  end if;

  update public.pick_events
  set status=p_event_status
  where id=v_room.event_id;

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

grant execute on function public.picks_admin_set_fight_result(text,text,text,text,text,integer) to anon,authenticated;
grant execute on function public.picks_admin_set_event_status(text,text,text) to anon,authenticated;
grant execute on function public.picks_public_events() to anon,authenticated;
