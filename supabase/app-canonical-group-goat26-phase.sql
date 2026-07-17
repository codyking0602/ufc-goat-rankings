-- UFC App canonical group migration: GOAT26.
-- Run after the Picks commissioner, social-retention, member-PIN, and shared Play identity migrations.
-- Safe to rerun. This renames the verified five-member friend group in place;
-- it does not copy or delete members, rooms, seasons, picks, or Play history.

create extension if not exists pgcrypto;

alter table public.pick_groups
  add column if not exists is_canonical boolean not null default false;

create unique index if not exists pick_groups_one_canonical
  on public.pick_groups((is_canonical))
  where is_canonical;

alter table public.pick_group_members
  add column if not exists fighter_avatar_slug text,
  add column if not exists is_app_admin boolean not null default false;

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
  v_expected_names text[]:=array['cody','daddy','rhonda','shane','tyler']::text[];
  v_existing public.pick_groups;
  v_candidate_id uuid;
  v_candidate_count integer:=0;
  v_old_code text;
  v_active_members integer:=0;
  v_events integer:=0;
  v_selections integer:=0;
  v_actual_names text[];
begin
  select * into v_existing
  from public.pick_groups
  where code='GOAT26';

  if found then
    select coalesce(array_agg(lower(trim(gm.display_name)) order by lower(trim(gm.display_name))),array[]::text[])
    into v_actual_names
    from public.pick_group_members gm
    where gm.group_id=v_existing.id
      and coalesce(gm.is_active,true);

    if v_actual_names<>v_expected_names then
      raise exception 'GOAT26 exists, but its active members are not Cody, Daddy, Rhonda, Shane, and Tyler. No changes were made.';
    end if;

    if not exists (
      select 1
      from public.pick_group_members gm
      where gm.id=v_existing.owner_member_id
        and lower(trim(gm.display_name))='cody'
        and coalesce(gm.is_active,true)
    ) then
      raise exception 'GOAT26 exists, but Cody is not its active commissioner. No changes were made.';
    end if;

    v_candidate_id:=v_existing.id;
    v_old_code:=coalesce((
      select log.old_code
      from public.app_group_migration_log log
      where log.group_id=v_existing.id
      order by log.migrated_at
      limit 1
    ),'GOAT26');
  else
    select count(*),min(candidate.id::text)::uuid
    into v_candidate_count,v_candidate_id
    from (
      select g.id
      from public.pick_groups g
      join public.pick_group_members owner_member
        on owner_member.id=g.owner_member_id
      where lower(trim(g.name))='ufc picks'
        and lower(trim(owner_member.display_name))='cody'
        and coalesce(owner_member.is_active,true)
        and (
          select coalesce(array_agg(lower(trim(gm.display_name)) order by lower(trim(gm.display_name))),array[]::text[])
          from public.pick_group_members gm
          where gm.group_id=g.id
            and coalesce(gm.is_active,true)
        )=v_expected_names
    ) candidate;

    if v_candidate_count=0 or v_candidate_id is null then
      raise exception 'The verified UFC Picks group with Cody, Daddy, Rhonda, Shane, and Tyler was not found. No changes were made.';
    end if;

    if v_candidate_count<>1 then
      raise exception 'More than one group matches the five-member UFC Picks fingerprint. No changes were made.';
    end if;

    select code into v_old_code
    from public.pick_groups
    where id=v_candidate_id;
  end if;

  select count(*)::integer
  into v_active_members
  from public.pick_group_members gm
  where gm.group_id=v_candidate_id
    and coalesce(gm.is_active,true);

  select count(*)::integer
  into v_events
  from public.pick_group_events ge
  where ge.group_id=v_candidate_id;

  select count(*)::integer
  into v_selections
  from public.pick_rooms r
  join public.pick_room_members rm on rm.room_id=r.id
  join public.pick_selections ps on ps.member_id=rm.id
  where r.group_id=v_candidate_id;

  update public.pick_groups
  set is_canonical=false
  where id<>v_candidate_id and is_canonical;

  update public.pick_groups
  set code='GOAT26',
      name='UFC Picks',
      is_canonical=true
  where id=v_candidate_id;

  update public.pick_group_members
  set is_app_admin=(lower(trim(display_name))='cody')
  where group_id=v_candidate_id;

  insert into public.app_group_migration_log(
    migration_key,group_id,old_code,new_code,
    active_member_count,linked_event_count,selection_count,migrated_at
  ) values (
    'canonical-group-goat26-v2',v_candidate_id,v_old_code,'GOAT26',
    v_active_members,v_events,v_selections,now()
  )
  on conflict(migration_key) do update
  set group_id=excluded.group_id,
      old_code=excluded.old_code,
      new_code=excluded.new_code,
      active_member_count=excluded.active_member_count,
      linked_event_count=excluded.linked_event_count,
      selection_count=excluded.selection_count,
      migrated_at=excluded.migrated_at;
end;
$$;

create or replace function public.app_profile_resolve(
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
  v_active_room public.pick_rooms;
  v_rooms jsonb;
begin
  select * into v_group
  from public.pick_groups
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','GOAT26 has not been activated yet.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    return jsonb_build_object('ok',false,'error','Profile access was not recognized.');
  end if;

  select r.* into v_active_room
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id
    and ge.event_id=v_group.active_event_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'code',r.code,
    'event_id',r.event_id
  ) order by r.created_at),'[]'::jsonb)
  into v_rooms
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id;

  return jsonb_build_object(
    'ok',true,
    'group',jsonb_build_object(
      'id',v_group.id,
      'code',v_group.code,
      'name',v_group.name
    ),
    'member',jsonb_build_object(
      'id',v_member.id,
      'display_name',v_member.display_name,
      'fighter_avatar_slug',v_member.fighter_avatar_slug,
      'is_admin',coalesce(v_member.is_app_admin,false) or v_group.owner_member_id=v_member.id
    ),
    'member_token',p_member_token,
    'rooms',v_rooms,
    'active_room',case when v_active_room.id is null then null else jsonb_build_object(
      'code',v_active_room.code,
      'event_id',v_active_room.event_id
    ) end
  );
end;
$$;

create or replace function public.app_profile_login(
  p_display_name text,
  p_pin text
)
returns jsonb
language sql
security definer
set search_path=public,extensions
as $$
  select public.picks_member_login_pin('GOAT26',p_display_name,p_pin);
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
  v_expected_names text[]:=array['cody','daddy','rhonda','shane','tyler']::text[];
  v_actual_names text[];
begin
  select * into v_group
  from public.pick_groups
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

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

  if not (coalesce(v_member.is_app_admin,false) or v_group.owner_member_id=v_member.id) then
    return jsonb_build_object('ok',false,'error','Only Cody can view the canonical-group audit.');
  end if;

  select coalesce(array_agg(lower(trim(gm.display_name)) order by lower(trim(gm.display_name))),array[]::text[])
  into v_actual_names
  from public.pick_group_members gm
  where gm.group_id=v_group.id
    and coalesce(gm.is_active,true);

  select * into v_migration
  from public.app_group_migration_log
  where group_id=v_group.id
  order by migrated_at desc
  limit 1;

  return jsonb_build_object(
    'ok',true,
    'fingerprint_matches',v_actual_names=v_expected_names,
    'group',jsonb_build_object(
      'id',v_group.id,
      'code',v_group.code,
      'name',v_group.name,
      'is_canonical',v_group.is_canonical,
      'active_event_id',v_group.active_event_id
    ),
    'me',jsonb_build_object(
      'id',v_member.id,
      'display_name',v_member.display_name,
      'is_owner',v_group.owner_member_id=v_member.id,
      'is_app_admin',coalesce(v_member.is_app_admin,false),
      'has_pin',v_member.pin_hash is not null
    ),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',gm.id,
        'display_name',gm.display_name,
        'is_active',coalesce(gm.is_active,true),
        'has_pin',gm.pin_hash is not null,
        'is_owner',v_group.owner_member_id=gm.id,
        'is_app_admin',coalesce(gm.is_app_admin,false),
        'fighter_avatar_slug',gm.fighter_avatar_slug,
        'saved_picks',(
          select count(*)
          from public.pick_room_members rm
          join public.pick_selections ps on ps.member_id=rm.id
          where rm.group_member_id=gm.id
        ),
        'events_played',(
          select count(distinct rm.room_id)
          from public.pick_room_members rm
          join public.pick_selections ps on ps.member_id=rm.id
          where rm.group_member_id=gm.id
        ),
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
        from public.pick_rooms r
        join public.pick_room_members rm on rm.room_id=r.id
        join public.pick_selections ps on ps.member_id=rm.id
        where r.group_id=v_group.id
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

grant execute on function public.app_profile_resolve(text) to anon,authenticated;
grant execute on function public.app_profile_login(text,text) to anon,authenticated;
grant execute on function public.app_canonical_group_audit(text) to anon,authenticated;