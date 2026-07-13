-- Picks archive and commissioner administration improvements.
-- Run after picks-member-pin-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

create or replace function public.picks_commissioner_update_season(
  p_group_code text,
  p_admin_token text,
  p_season_name text,
  p_correct_points integer,
  p_underdog_bonus integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group_id uuid;
  v_season public.pick_group_seasons;
  v_scoring_locked boolean:=false;
begin
  v_group_id:=public.picks_group_require_admin(p_group_code,p_admin_token);
  select * into v_season
  from public.pick_group_seasons
  where group_id=v_group_id and is_active
  order by starts_at desc
  limit 1;

  if not found then raise exception 'Active season not found.'; end if;
  if char_length(trim(coalesce(p_season_name,''))) not between 2 and 40 then
    raise exception 'Enter a season name between 2 and 40 characters.';
  end if;
  if p_correct_points not between 1 and 5 or p_underdog_bonus not between 0 and 5 then
    raise exception 'Scoring values are outside the allowed range.';
  end if;

  select exists(
    select 1
    from public.pick_selections sel
    join public.pick_room_members rm on rm.id=sel.member_id
    join public.pick_group_events ge on ge.room_id=rm.room_id
    where ge.season_id=v_season.id
  ) into v_scoring_locked;

  if v_scoring_locked then
    update public.pick_group_seasons
    set name=trim(p_season_name)
    where id=v_season.id;
  else
    update public.pick_group_seasons
    set name=trim(p_season_name),
        correct_points=p_correct_points,
        underdog_bonus=p_underdog_bonus
    where id=v_season.id;
  end if;

  return jsonb_build_object(
    'saved',true,
    'season_id',v_season.id,
    'name',trim(p_season_name),
    'scoring_locked',v_scoring_locked,
    'correct_points',case when v_scoring_locked then v_season.correct_points else p_correct_points end,
    'underdog_bonus',case when v_scoring_locked then v_season.underdog_bonus else p_underdog_bonus end
  );
end;
$$;

create or replace function public.picks_commissioner_rename_member(
  p_group_code text,
  p_admin_token text,
  p_member_id uuid,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group_id uuid;
  v_member public.pick_group_members;
  v_name text:=trim(coalesce(p_display_name,''));
begin
  v_group_id:=public.picks_group_require_admin(p_group_code,p_admin_token);
  if char_length(v_name) not between 1 and 30 then
    raise exception 'Enter a member name between 1 and 30 characters.';
  end if;

  select * into v_member
  from public.pick_group_members
  where id=p_member_id and group_id=v_group_id;
  if not found then raise exception 'Member not found.'; end if;

  if exists(
    select 1 from public.pick_group_members
    where group_id=v_group_id
      and id<>v_member.id
      and lower(display_name)=lower(v_name)
  ) then
    raise exception 'That name is already being used in this group.';
  end if;

  update public.pick_group_members
  set display_name=v_name
  where id=v_member.id;

  update public.pick_room_members
  set display_name=v_name
  where group_member_id=v_member.id;

  return jsonb_build_object('saved',true,'member_id',v_member.id,'display_name',v_name);
end;
$$;

create or replace function public.picks_commissioner_set_member_pick(
  p_room_code text,
  p_admin_token text,
  p_member_id uuid,
  p_fight_id text,
  p_fighter_name text default null,
  p_is_underdog_lock boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_fight public.pick_fights;
  v_fighter text:=nullif(trim(coalesce(p_fighter_name,'')),'');
  v_odds integer;
begin
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code))
    and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can edit member picks.'; end if;

  select * into v_member
  from public.pick_room_members
  where id=p_member_id and room_id=v_room.id;
  if not found then raise exception 'Member not found in this event.'; end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;
  if not found then raise exception 'Fight not found in this event.'; end if;

  if v_fighter is null then
    delete from public.pick_selections
    where member_id=v_member.id and fight_id=v_fight.id;
    return jsonb_build_object('saved',true,'removed',true,'member_id',v_member.id,'fight_id',v_fight.id);
  end if;

  if v_fighter not in (v_fight.red_name,v_fight.blue_name) then
    raise exception 'Invalid fighter selection.';
  end if;

  if coalesce(p_is_underdog_lock,false) then
    if v_fighter=v_fight.red_name then v_odds:=v_fight.red_odds;
    else v_odds:=v_fight.blue_odds;
    end if;
    if coalesce(v_odds,0)<=0 then
      raise exception 'The Underdog Lock must be assigned to the betting underdog.';
    end if;
    update public.pick_selections
    set is_underdog_lock=false
    where member_id=v_member.id;
  end if;

  insert into public.pick_selections(member_id,fight_id,fighter_name,picked_at,is_underdog_lock)
  values(v_member.id,v_fight.id,v_fighter,now(),coalesce(p_is_underdog_lock,false))
  on conflict(member_id,fight_id) do update set
    fighter_name=excluded.fighter_name,
    picked_at=excluded.picked_at,
    is_underdog_lock=excluded.is_underdog_lock;

  return jsonb_build_object(
    'saved',true,
    'member_id',v_member.id,
    'fight_id',v_fight.id,
    'fighter_name',v_fighter,
    'is_underdog_lock',coalesce(p_is_underdog_lock,false)
  );
end;
$$;

grant execute on function public.picks_commissioner_update_season(text,text,text,integer,integer) to anon,authenticated;
grant execute on function public.picks_commissioner_rename_member(text,text,uuid,text) to anon,authenticated;
grant execute on function public.picks_commissioner_set_member_pick(text,text,uuid,text,text,boolean) to anon,authenticated;
