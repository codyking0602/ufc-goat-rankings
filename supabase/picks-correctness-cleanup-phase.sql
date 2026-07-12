-- Picks cleanup step 1: scoring and event-state correctness.
-- Run after picks-social-retention-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

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
  v_unresolved integer:=0;
  v_next_event_id text;
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

  if p_event_status='complete' then
    select count(*)::integer into v_unresolved
    from public.pick_fights
    where event_id=v_room.event_id and result_status='scheduled';

    if v_unresolved>0 then
      raise exception '% fight(s) still need results. Resolve them or mark them cancelled before completing the event.',v_unresolved;
    end if;
  end if;

  update public.pick_events set status=p_event_status where id=v_room.event_id;

  if v_room.group_id is not null then
    if p_event_status in ('upcoming','live') then
      update public.pick_groups set active_event_id=v_room.event_id where id=v_room.group_id;
    elsif p_event_status='complete' then
      select e.id into v_next_event_id
      from public.pick_group_events ge
      join public.pick_events e on e.id=ge.event_id
      where ge.group_id=v_room.group_id
        and e.id<>v_room.event_id
        and e.status in ('live','upcoming')
      order by case when e.status='live' then 0 else 1 end,e.event_date
      limit 1;

      update public.pick_groups
      set active_event_id=v_next_event_id
      where id=v_room.group_id
        and (active_event_id=v_room.event_id or active_event_id is null);
    end if;
  end if;

  return jsonb_build_object(
    'saved',true,
    'event_id',v_room.event_id,
    'status',p_event_status,
    'unresolved_count',v_unresolved,
    'active_event_id',v_next_event_id
  );
end;
$$;

create or replace function public.picks_admin_cancel_unresolved_and_complete(
  p_room_code text,
  p_admin_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_cancelled integer:=0;
  v_next_event_id text;
begin
  select r.* into v_room
  from public.pick_rooms r
  join public.pick_events e on e.id=r.event_id and e.admin_room_id=r.id
  where r.code=upper(trim(p_room_code))
    and r.admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'This room is not the event results-admin room.';
  end if;

  update public.pick_fights
  set result_status='cancelled',winner_name=null
  where event_id=v_room.event_id and result_status='scheduled';
  get diagnostics v_cancelled=row_count;

  update public.pick_events set status='complete' where id=v_room.event_id;

  if v_room.group_id is not null then
    select e.id into v_next_event_id
    from public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    where ge.group_id=v_room.group_id
      and e.id<>v_room.event_id
      and e.status in ('live','upcoming')
    order by case when e.status='live' then 0 else 1 end,e.event_date
    limit 1;

    update public.pick_groups
    set active_event_id=v_next_event_id
    where id=v_room.group_id
      and (active_event_id=v_room.event_id or active_event_id is null);
  end if;

  return jsonb_build_object(
    'saved',true,
    'event_id',v_room.event_id,
    'status','complete',
    'cancelled_count',v_cancelled,
    'active_event_id',v_next_event_id
  );
end;
$$;

create or replace function public.picks_group_snapshot(
  p_group_code text,p_member_token text,p_admin_token text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_me public.pick_group_members;
  v_season public.pick_group_seasons;
  v_active_room public.pick_rooms;
  v_members jsonb;
  v_events jsonb;
  v_available jsonb;
  v_past_seasons jsonb;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;

  select * into v_me from public.pick_group_members
  where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then raise exception 'Group access expired. Rejoin the group.'; end if;

  select * into v_season from public.pick_group_seasons
  where group_id=v_group.id and is_active order by starts_at desc limit 1;
  if not found then raise exception 'This group does not have an active season.'; end if;

  select r.* into v_active_room
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  join public.pick_events e on e.id=ge.event_id
  where ge.group_id=v_group.id
    and ge.event_id=v_group.active_event_id
    and ge.season_id=v_season.id
    and e.status in ('upcoming','live');

  with season_events as (
    select ge.event_id,ge.room_id,e.status event_status
    from public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    where ge.group_id=v_group.id and ge.season_id=v_season.id
  ), member_event_scores as (
    select
      gm.id group_member_id,gm.display_name,gm.is_active,se.event_id,se.event_status,
      count(sel.fight_id) filter(where f.result_status='complete' and f.winner_name is not null)::integer picks_made,
      count(sel.fight_id) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name)::integer correct,
      count(sel.fight_id) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name and sel.is_underdog_lock)::integer bonus
    from public.pick_group_members gm
    left join season_events se on true
    left join public.pick_room_members rm on rm.room_id=se.room_id and rm.group_member_id=gm.id
    left join public.pick_selections sel on sel.member_id=rm.id
    left join public.pick_fights f on f.id=sel.fight_id
    where gm.group_id=v_group.id
    group by gm.id,gm.display_name,gm.is_active,se.event_id,se.event_status
  ), event_maxes as (
    select event_id,max(correct*v_season.correct_points+bonus*v_season.underdog_bonus) max_score
    from member_event_scores where event_id is not null and event_status='complete' group by event_id
  ), member_totals as (
    select
      mes.group_member_id,max(mes.display_name) display_name,bool_or(mes.is_active) is_active,
      sum(mes.picks_made)::integer picks_made,sum(mes.correct)::integer correct,sum(mes.bonus)::integer lock_bonus,
      sum(mes.correct*v_season.correct_points+mes.bonus*v_season.underdog_bonus)::integer points,
      count(*) filter(where mes.event_id is not null and mes.picks_made>0)::integer events_played,
      count(*) filter(where mes.event_status='complete' and mes.picks_made>0 and em.max_score>0 and mes.correct*v_season.correct_points+mes.bonus*v_season.underdog_bonus=em.max_score)::integer event_wins
    from member_event_scores mes left join event_maxes em on em.event_id=mes.event_id
    group by mes.group_member_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',mt.group_member_id,'display_name',mt.display_name,'is_active',mt.is_active,
    'picks_made',mt.picks_made,'correct',mt.correct,'lock_bonus',mt.lock_bonus,'points',mt.points,
    'events_played',mt.events_played,'event_wins',mt.event_wins,
    'accuracy',case when mt.picks_made>0 then round(100.0*mt.correct/mt.picks_made)::integer else 0 end
  ) order by mt.points desc,mt.event_wins desc,mt.correct desc,mt.display_name),'[]'::jsonb)
  into v_members from member_totals mt where mt.is_active or mt.picks_made>0;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_id',e.id,'room_code',r.code,'name',e.name,'subtitle',e.subtitle,
    'event_date',e.event_date,'status',e.status,
    'is_active',(e.id=v_group.active_event_id and e.status in ('upcoming','live'))
  ) order by e.event_date desc),'[]'::jsonb)
  into v_events
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.season_id=v_season.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,'name',e.name,'subtitle',e.subtitle,'event_date',e.event_date,'status',e.status
  ) order by e.event_date),'[]'::jsonb)
  into v_available
  from public.pick_events e
  where e.status in ('upcoming','live')
    and not exists(select 1 from public.pick_group_events ge where ge.group_id=v_group.id and ge.event_id=e.id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',s.id,'name',s.name,'starts_at',s.starts_at,'ended_at',s.ended_at,
    'correct_points',s.correct_points,'underdog_bonus',s.underdog_bonus
  ) order by s.starts_at desc),'[]'::jsonb)
  into v_past_seasons
  from public.pick_group_seasons s where s.group_id=v_group.id and not s.is_active;

  return jsonb_build_object(
    'group',jsonb_build_object(
      'id',v_group.id,'code',v_group.code,'name',v_group.name,'active_event_id',v_group.active_event_id,
      'is_admin',coalesce(v_group.admin_token_hash=digest(p_admin_token,'sha256'),false),'owner_member_id',v_group.owner_member_id
    ),
    'season',jsonb_build_object(
      'id',v_season.id,'name',v_season.name,'starts_at',v_season.starts_at,
      'correct_points',v_season.correct_points,'underdog_bonus',v_season.underdog_bonus
    ),
    'past_seasons',v_past_seasons,
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'active_room',case when v_active_room.id is null then null else jsonb_build_object('code',v_active_room.code,'event_id',v_active_room.event_id) end,
    'members',v_members,'events',v_events,'available_events',v_available
  );
end;
$$;

-- Repair groups that still point to an already-completed event.
update public.pick_groups g
set active_event_id=(
  select e.id
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  where ge.group_id=g.id and e.status in ('live','upcoming')
  order by case when e.status='live' then 0 else 1 end,e.event_date
  limit 1
)
where g.active_event_id is null
   or exists(select 1 from public.pick_events e where e.id=g.active_event_id and e.status='complete');

grant execute on function public.picks_admin_set_event_status(text,text,text) to anon,authenticated;
grant execute on function public.picks_admin_cancel_unresolved_and_complete(text,text) to anon,authenticated;
grant execute on function public.picks_group_snapshot(text,text,text) to anon,authenticated;
