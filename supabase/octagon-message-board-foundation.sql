-- Octagon weekly message-board database foundation.
-- Run after the GOAT26 canonical identity and universal profile migrations.
-- Safe to rerun. This phase creates storage and data guards only; client-facing
-- message RPCs and Realtime subscriptions are intentionally deferred.

create extension if not exists pgcrypto;

create or replace function public.octagon_week_start(
  p_at timestamptz default now()
)
returns date
language sql
stable
set search_path=public,extensions
as $$
  select (p_at at time zone 'America/Chicago')::date
    - (extract(isodow from (p_at at time zone 'America/Chicago'))::integer - 1);
$$;

create table if not exists public.octagon_access (
  member_id uuid primary key references public.pick_group_members(id) on delete restrict,
  group_id uuid not null references public.pick_groups(id) on delete restrict,
  can_access boolean not null default false,
  granted_by_member_id uuid references public.pick_group_members(id) on delete restrict,
  enabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint octagon_access_enabled_at_check check (
    (can_access and enabled_at is not null)
    or (not can_access)
  )
);

create table if not exists public.octagon_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.pick_groups(id) on delete restrict,
  author_member_id uuid not null references public.pick_group_members(id) on delete restrict,
  week_start date not null default public.octagon_week_start(now()),
  parent_message_id uuid references public.octagon_messages(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by_member_id uuid references public.pick_group_members(id) on delete restrict,
  constraint octagon_messages_body_length check (char_length(trim(body)) between 1 and 500),
  constraint octagon_messages_delete_pair check (
    (deleted_at is null and deleted_by_member_id is null)
    or (deleted_at is not null and deleted_by_member_id is not null)
  ),
  constraint octagon_messages_not_self_reply check (parent_message_id is null or parent_message_id <> id)
);

create table if not exists public.octagon_reactions (
  message_id uuid not null references public.octagon_messages(id) on delete cascade,
  member_id uuid not null references public.pick_group_members(id) on delete restrict,
  reaction text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (message_id,member_id),
  constraint octagon_reactions_value check (reaction in ('like','dislike'))
);

create index if not exists octagon_access_group_enabled_idx
  on public.octagon_access(group_id,can_access,member_id);

create index if not exists octagon_messages_week_feed_idx
  on public.octagon_messages(group_id,week_start,created_at,id)
  where deleted_at is null;

create index if not exists octagon_messages_parent_idx
  on public.octagon_messages(parent_message_id,created_at,id)
  where parent_message_id is not null;

create index if not exists octagon_messages_author_idx
  on public.octagon_messages(author_member_id,created_at desc);

create index if not exists octagon_reactions_message_idx
  on public.octagon_reactions(message_id,reaction,created_at);

create or replace function public.octagon_validate_access_row()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_member_group_id uuid;
  v_granter_group_id uuid;
  v_is_canonical boolean;
begin
  select gm.group_id
  into v_member_group_id
  from public.pick_group_members gm
  where gm.id=new.member_id
    and coalesce(gm.is_active,true);

  if not found or v_member_group_id<>new.group_id then
    raise exception 'Octagon access must belong to an active member of the same group.';
  end if;

  select (coalesce(g.is_canonical,false) or g.code='GOAT26')
  into v_is_canonical
  from public.pick_groups g
  where g.id=new.group_id;

  if coalesce(v_is_canonical,false) is not true then
    raise exception 'Octagon access is limited to the canonical GOAT26 group.';
  end if;

  if new.granted_by_member_id is not null then
    select gm.group_id
    into v_granter_group_id
    from public.pick_group_members gm
    where gm.id=new.granted_by_member_id
      and coalesce(gm.is_active,true);

    if not found or v_granter_group_id<>new.group_id then
      raise exception 'Octagon access must be granted by an active member of the same group.';
    end if;
  end if;

  if new.can_access and new.enabled_at is null then
    new.enabled_at:=now();
  elsif not new.can_access then
    new.enabled_at:=null;
  end if;

  new.updated_at:=now();
  return new;
end;
$$;

create or replace function public.octagon_validate_message_row()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_author_group_id uuid;
  v_deleter_group_id uuid;
  v_parent public.octagon_messages;
begin
  if tg_op='UPDATE' then
    if new.id<>old.id
      or new.group_id<>old.group_id
      or new.author_member_id<>old.author_member_id
      or new.week_start<>old.week_start
      or new.parent_message_id is distinct from old.parent_message_id
      or new.body<>old.body
      or new.created_at<>old.created_at
    then
      raise exception 'Octagon messages cannot be edited after posting.';
    end if;

    if old.deleted_at is not null and new.deleted_at is null then
      raise exception 'Deleted Octagon messages cannot be restored directly.';
    end if;
  else
    new.body:=trim(new.body);
    new.created_at:=coalesce(new.created_at,now());
    new.week_start:=public.octagon_week_start(new.created_at);
  end if;

  if char_length(trim(new.body)) not between 1 and 500 then
    raise exception 'Octagon messages must contain between 1 and 500 characters.';
  end if;

  select gm.group_id
  into v_author_group_id
  from public.pick_group_members gm
  where gm.id=new.author_member_id
    and coalesce(gm.is_active,true);

  if not found or v_author_group_id<>new.group_id then
    raise exception 'The Octagon author must be an active member of the message group.';
  end if;

  if new.parent_message_id is not null then
    select *
    into v_parent
    from public.octagon_messages m
    where m.id=new.parent_message_id;

    if not found then
      raise exception 'The Octagon reply target was not found.';
    end if;

    if v_parent.parent_message_id is not null then
      raise exception 'The Octagon supports one reply level only.';
    end if;

    if v_parent.group_id<>new.group_id or v_parent.week_start<>new.week_start then
      raise exception 'Replies must remain inside the same Octagon group and weekly board.';
    end if;

    if v_parent.deleted_at is not null then
      raise exception 'A deleted Octagon message cannot receive new replies.';
    end if;
  end if;

  if new.deleted_by_member_id is not null then
    select gm.group_id
    into v_deleter_group_id
    from public.pick_group_members gm
    where gm.id=new.deleted_by_member_id
      and coalesce(gm.is_active,true);

    if not found or v_deleter_group_id<>new.group_id then
      raise exception 'The deleting profile must be an active member of the same Octagon group.';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.octagon_validate_reaction_row()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_message public.octagon_messages;
  v_member_group_id uuid;
begin
  if tg_op='UPDATE' and (
    new.message_id<>old.message_id
    or new.member_id<>old.member_id
    or new.created_at<>old.created_at
  ) then
    raise exception 'An Octagon reaction can only change between like and dislike.';
  end if;

  select *
  into v_message
  from public.octagon_messages m
  where m.id=new.message_id;

  if not found or v_message.deleted_at is not null then
    raise exception 'Reactions require an active Octagon message.';
  end if;

  select gm.group_id
  into v_member_group_id
  from public.pick_group_members gm
  where gm.id=new.member_id
    and coalesce(gm.is_active,true);

  if not found or v_member_group_id<>v_message.group_id then
    raise exception 'The reacting profile must be an active member of the same Octagon group.';
  end if;

  new.updated_at:=now();
  return new;
end;
$$;

drop trigger if exists octagon_access_validate on public.octagon_access;
create trigger octagon_access_validate
before insert or update on public.octagon_access
for each row execute function public.octagon_validate_access_row();

drop trigger if exists octagon_messages_validate on public.octagon_messages;
create trigger octagon_messages_validate
before insert or update on public.octagon_messages
for each row execute function public.octagon_validate_message_row();

drop trigger if exists octagon_reactions_validate on public.octagon_reactions;
create trigger octagon_reactions_validate
before insert or update on public.octagon_reactions
for each row execute function public.octagon_validate_reaction_row();

alter table public.octagon_access enable row level security;
alter table public.octagon_messages enable row level security;
alter table public.octagon_reactions enable row level security;

revoke all on public.octagon_access from anon,authenticated;
revoke all on public.octagon_messages from anon,authenticated;
revoke all on public.octagon_reactions from anon,authenticated;

with canonical_group as (
  select g.id
  from public.pick_groups g
  where coalesce(g.is_canonical,false) or g.code='GOAT26'
  order by coalesce(g.is_canonical,false) desc
  limit 1
), canonical_members as (
  select
    gm.id as member_id,
    gm.group_id,
    lower(trim(gm.display_name))='cody' as is_cody
  from public.pick_group_members gm
  join canonical_group cg on cg.id=gm.group_id
  where coalesce(gm.is_active,true)
)
insert into public.octagon_access(
  member_id,group_id,can_access,granted_by_member_id,enabled_at
)
select
  cm.member_id,
  cm.group_id,
  cm.is_cody,
  case when cm.is_cody then cm.member_id else null end,
  case when cm.is_cody then now() else null end
from canonical_members cm
on conflict(member_id) do update
set group_id=excluded.group_id,
    can_access=public.octagon_access.can_access or excluded.can_access,
    granted_by_member_id=coalesce(public.octagon_access.granted_by_member_id,excluded.granted_by_member_id),
    enabled_at=case
      when public.octagon_access.can_access or excluded.can_access
        then coalesce(public.octagon_access.enabled_at,excluded.enabled_at,now())
      else null
    end,
    updated_at=now();

comment on table public.octagon_access is 'Per-profile access allowlist for the private Octagon message board.';
comment on table public.octagon_messages is 'Weekly GOAT26 Octagon posts and one-level replies. Messages are soft-deleted and not editable.';
comment on table public.octagon_reactions is 'One like or dislike per GOAT26 profile per Octagon message.';
comment on function public.octagon_week_start(timestamptz) is 'Returns the Monday start date for the America/Chicago Octagon week.';
