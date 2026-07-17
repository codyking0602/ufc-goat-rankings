-- UFC App canonical group migration: GOAT26.
-- Run after the Picks commissioner, PIN, and shared Play identity migrations.
-- Safe to rerun. This renames the existing Cody-owned active group in place;
-- it does not copy or delete members, rooms, seasons, picks, or Play history.

create extension if not exists pgcrypto;

create table if not exists public.app_group_migration_log (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null unique,
  group_id uuid not null references public.pick_groups(id) on delete restrict,
  old_code text not null,
  new_code text not null,
  active_member_count integer not null default 0,
  linked_event_count integer not null default 0,
  selection_count integer not null default 0,
  migrated_at timestamptz not null default now()
);

alter table public.app_group_migration_log enable row level security;
revoke all on public.app_group_migration_log from anon,authenticated;

do $$
declare
  v_existing public.pick_groups;
  v_candidate public.pick_groups;
  v_old_code text;
  v_active_members integer:=0;
  v_events integer:=0;
  v_selections integer:=0;
begin
  select * into v_existing
  from public.pick_groups
  where code='GOAT26';

  if found then
    if not exists (
      select 1
      from public.pick_group_members gm
      where gm.id=v_existing.owner_member_id
        and lower(trim(gm.display_name))='cody'
        and coalesce(gm.is_active,true)
    ) then
      raise exception 'GOAT26 already belongs to a different group owner. No changes were made.';
    end if;

    update public.pick_groups
    set name='UFC App'
    where id=v_existing.id;

    return;
  end if;

  -- The real friend group should rank first because it has the most active members,
  -- then the most saved Picks activity, then the most linked UFC events.
  select ranked.group_row,
         ranked.active_member_count,
         ranked.linked_event_count,
         ranked.selection_count
  into v_candidate,v_active_members,v_events,v_selections
  from (
    select
      g as group_row,
      (select count(*)::integer
       from public.pick_group_members gm2
       where gm2.group_id=g.id and coalesce(gm2.is_active,true)) as active_member_count,
      (select count(*)::integer
       from public.pick_group_events ge
       where ge.group_id=g.id) as linked_event_count,
      (select count(*)::integer
       from public.pick_group_events ge
       join public.pick_room_members rm on rm.room_id=ge.room_id
       join public.pick_selections ps on ps.member_id=rm.id
       where ge.group_id=g.id) as selection_count,
      coalesce((select max(ge.created_at) from public.pick_group_events ge where ge.group_id=g.id),g.created_at) as last_activity
    from public.pick_groups g
    join public.pick_group_members owner_member on owner_member.id=g.owner_member_id
    where lower(trim(owner_member.display_name))='cody'
      and coalesce(owner_member.is_active,true)
  ) ranked
  order by ranked.active_member_count desc,
           ranked.selection_count desc,
           ranked.linked_event_count desc,
           ranked.last_activity desc
  limit 1;

  if v_candidate.id is null then
    raise exception 'No active Cody-owned Picks group was found. No changes were made.';
  end if;

  if v_active_members<2 then
    raise exception 'The best Cody-owned group has fewer than two active members. No changes were made.';
  end if;

  v_old_code:=v_candidate.code;

  update public.pick_groups
  set code='GOAT26',
      name='UFC App'
  where id=v_candidate.id;

  insert into public.app_group_migration_log(
    migration_key,group_id,old_code,new_code,
    active_member_count,linked_event_count,selection_count
  ) values (
    'canonical-group-goat26-v1',v_candidate.id,v_old_code,'GOAT26',
    v_active_members,v_events,v_selections
  )
  on conflict(migration_key) do nothing;
end;
$$;

create or replace function public.app_canonical_group_audit(
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_migration public.app_group_migration_log;
begin
  select * into v_group
  from public.pick_groups
  where code='GOAT26';

  if not found then
    return jsonb_build_object('ok',false,'error','GOAT26 has not been activated yet.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    return jsonb_build_object('ok',false,'error','Canonical profile access was not verified.');
  end if;

  select * into v_migration
  from public.app_group_migration_log
  where migration_key='canonical-group-goat26-v1';

  return jsonb_build_object(
    'ok',true,
    'group',jsonb_build_object(
      'id',v_group.id,
      'code',v_group.code,
      'name',v_group.name,
      'active_event_id',v_group.active_event_id
    ),
    'me',jsonb_build_object(
      'id',v_member.id,
      'display_name',v_member.display_name,
      'is_owner',v_group.owner_member_id=v_member.id,
      'has_pin',v_member.pin_hash is not null
    ),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',gm.id,
        'display_name',gm.display_name,
        'is_active',coalesce(gm.is_active,true),
        'has_pin',gm.pin_hash is not null,
        'is_owner',v_group.owner_member_id=gm.id,
        'joined_at',gm.created_at
      ) order by gm.created_at,gm.id)
      from public.pick_group_members gm
      where gm.group_id=v_group.id
    ),'[]'::jsonb),
    'counts',jsonb_build_object(
      'active_members',(select count(*) from public.pick_group_members gm where gm.group_id=v_group.id and coalesce(gm.is_active,true)),
      'events',(select count(*) from public.pick_group_events ge where ge.group_id=v_group.id),
      'rooms',(select count(*) from public.pick_rooms r where r.group_id=v_group.id),
      'seasons',(select count(*) from public.pick_group_seasons s where s.group_id=v_group.id),
      'saved_picks',(
        select count(*)
        from public.pick_group_events ge
        join public.pick_room_members rm on rm.room_id=ge.room_id
        join public.pick_selections ps on ps.member_id=rm.id
        where ge.group_id=v_group.id
      )
    ),
    'events',coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_id',ge.event_id,
        'room_code',r.code,
        'status',e.status,
        'created_at',ge.created_at
      ) order by ge.created_at desc)
      from public.pick_group_events ge
      join public.pick_rooms r on r.id=ge.room_id
      left join public.pick_events e on e.id=ge.event_id
      where ge.group_id=v_group.id
    ),'[]'::jsonb),
    'migration',case when v_migration.id is null then null else jsonb_build_object(
      'old_code',v_migration.old_code,
      'new_code',v_migration.new_code,
      'active_member_count',v_migration.active_member_count,
      'linked_event_count',v_migration.linked_event_count,
      'selection_count',v_migration.selection_count,
      'migrated_at',v_migration.migrated_at
    ) end
  );
end;
$$;

grant execute on function public.app_canonical_group_audit(text) to anon,authenticated;
