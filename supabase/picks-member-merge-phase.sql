-- Merge duplicate Picks profiles without losing picks, points, locks, or event history.
-- Run after supabase/picks-archive-admin-phase.sql. Safe to rerun.
-- This migration also performs the requested one-time Daddy -> TONY merge when that exact pair exists.

create extension if not exists pgcrypto;

create or replace function public.picks_merge_group_members_internal(
  p_source_member_id uuid,
  p_target_member_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_source public.pick_group_members;
  v_target public.pick_group_members;
  v_group public.pick_groups;
  v_source_pick_count integer:=0;
  v_moved_pick_count integer:=0;
begin
  if p_source_member_id=p_target_member_id then
    raise exception 'Choose two different member profiles.';
  end if;

  select * into v_source
  from public.pick_group_members
  where id=p_source_member_id;
  if not found then raise exception 'Source member not found.'; end if;

  select * into v_target
  from public.pick_group_members
  where id=p_target_member_id;
  if not found then raise exception 'Target member not found.'; end if;

  if v_source.group_id<>v_target.group_id then
    raise exception 'Both profiles must belong to the same group.';
  end if;

  select * into v_group
  from public.pick_groups
  where id=v_source.group_id;
  if not found then raise exception 'Picks group not found.'; end if;

  if v_group.owner_member_id=v_source.id then
    raise exception 'Transfer commissioner ownership before merging that profile.';
  end if;

  if not coalesce(v_target.is_active,true) then
    raise exception 'The target profile must be active.';
  end if;

  insert into public.pick_room_members(
    room_id,
    display_name,
    member_token_hash,
    group_member_id,
    created_at
  )
  select
    ge.room_id,
    v_target.display_name,
    v_target.member_token_hash,
    v_target.id,
    v_target.created_at
  from public.pick_group_events ge
  where ge.group_id=v_target.group_id
    and not exists(
      select 1
      from public.pick_room_members rm
      where rm.room_id=ge.room_id
        and rm.group_member_id=v_target.id
    )
  on conflict do nothing;

  select count(*)::integer into v_source_pick_count
  from public.pick_selections s
  join public.pick_room_members source_room on source_room.id=s.member_id
  where source_room.group_member_id=v_source.id;

  with moved as (
    insert into public.pick_selections(
      member_id,
      fight_id,
      fighter_name,
      picked_at,
      is_underdog_lock
    )
    select
      target_room.id,
      s.fight_id,
      s.fighter_name,
      s.picked_at,
      s.is_underdog_lock
    from public.pick_room_members source_room
    join public.pick_room_members target_room
      on target_room.room_id=source_room.room_id
     and target_room.group_member_id=v_target.id
    join public.pick_selections s on s.member_id=source_room.id
    where source_room.group_member_id=v_source.id
    on conflict(member_id,fight_id) do nothing
    returning 1
  )
  select count(*)::integer into v_moved_pick_count from moved;

  delete from public.pick_group_members
  where id=v_source.id;

  return jsonb_build_object(
    'merged',true,
    'source_member_id',v_source.id,
    'source_name',v_source.display_name,
    'target_member_id',v_target.id,
    'target_name',v_target.display_name,
    'source_pick_count',v_source_pick_count,
    'moved_pick_count',v_moved_pick_count,
    'conflicting_pick_count',greatest(v_source_pick_count-v_moved_pick_count,0)
  );
end;
$$;

revoke all on function public.picks_merge_group_members_internal(uuid,uuid) from public,anon,authenticated;

create or replace function public.picks_commissioner_merge_member(
  p_group_code text,
  p_admin_token text,
  p_source_member_id uuid,
  p_target_member_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group_id uuid;
  v_source_group_id uuid;
  v_target_group_id uuid;
begin
  v_group_id:=public.picks_group_require_admin(p_group_code,p_admin_token);

  select group_id into v_source_group_id
  from public.pick_group_members
  where id=p_source_member_id;

  select group_id into v_target_group_id
  from public.pick_group_members
  where id=p_target_member_id;

  if v_source_group_id is null or v_target_group_id is null then
    raise exception 'One of those member profiles no longer exists.';
  end if;

  if v_source_group_id<>v_group_id or v_target_group_id<>v_group_id then
    raise exception 'Both profiles must belong to this group.';
  end if;

  return public.picks_merge_group_members_internal(p_source_member_id,p_target_member_id);
end;
$$;

grant execute on function public.picks_commissioner_merge_member(text,text,uuid,uuid) to anon,authenticated;

-- Requested one-time cleanup: Daddy was the same person as the active TONY profile.
-- Transfer Daddy's saved selections to TONY, then remove the duplicate profile.
do $$
declare
  v_pair record;
begin
  for v_pair in
    select
      source_member.id source_member_id,
      target_member.id target_member_id
    from public.pick_group_members source_member
    join public.pick_group_members target_member
      on target_member.group_id=source_member.group_id
    join public.pick_groups g on g.id=source_member.group_id
    where lower(trim(source_member.display_name))='daddy'
      and not coalesce(source_member.is_active,true)
      and lower(trim(target_member.display_name))='tony'
      and coalesce(target_member.is_active,true)
      and source_member.id<>target_member.id
      and g.owner_member_id is distinct from source_member.id
  loop
    perform public.picks_merge_group_members_internal(
      v_pair.source_member_id,
      v_pair.target_member_id
    );
  end loop;
end $$;
