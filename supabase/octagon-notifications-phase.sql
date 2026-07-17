-- Unread activity and private Web Push support for The Octagon.
-- Run after the Octagon message board and access-panel migrations. Safe to rerun.

create extension if not exists pgcrypto;

create table if not exists public.octagon_member_activity (
  member_id uuid primary key references public.pick_group_members(id) on delete cascade,
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists octagon_member_activity_group_idx
  on public.octagon_member_activity(group_id,last_seen_at desc);

create table if not exists public.octagon_push_config (
  singleton boolean primary key default true check(singleton),
  public_key text not null,
  private_key text not null,
  subject text not null default 'https://codyking0602.github.io/ufc-goat-rankings/',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.octagon_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.pick_group_members(id) on delete cascade,
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  expiration_time bigint,
  user_agent text,
  is_active boolean not null default true,
  failure_count integer not null default 0 check(failure_count>=0),
  last_success_at timestamptz,
  last_failure_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists octagon_push_subscriptions_member_idx
  on public.octagon_push_subscriptions(member_id,is_active);
create index if not exists octagon_push_subscriptions_group_idx
  on public.octagon_push_subscriptions(group_id,is_active);

alter table public.octagon_member_activity enable row level security;
alter table public.octagon_push_config enable row level security;
alter table public.octagon_push_subscriptions enable row level security;

revoke all on public.octagon_member_activity from public,anon,authenticated;
revoke all on public.octagon_push_config from public,anon,authenticated;
revoke all on public.octagon_push_subscriptions from public,anon,authenticated;

create or replace function public.octagon_activity_status(
  p_member_token text
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_week date:=public.octagon_week_start(now());
  v_last_seen timestamptz;
  v_unread integer:=0;
  v_latest timestamptz;
  v_push_count integer:=0;
  v_public_key text;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object(
      'ok',true,
      'can_access',false,
      'unread_count',0,
      'push_enabled',false,
      'member',jsonb_build_object(
        'id',v_ctx.member_id,
        'display_name',v_ctx.display_name,
        'fighter_avatar_slug',v_ctx.fighter_avatar_slug,
        'is_admin',v_ctx.is_admin
      )
    );
  end if;

  select a.last_seen_at into v_last_seen
  from public.octagon_member_activity a
  where a.member_id=v_ctx.member_id;

  select
    count(*)::integer,
    max(m.created_at)
  into v_unread,v_latest
  from public.octagon_messages m
  where m.group_id=v_ctx.group_id
    and m.week_start=v_week
    and m.deleted_at is null
    and m.author_member_id<>v_ctx.member_id
    and m.created_at>coalesce(v_last_seen,'epoch'::timestamptz);

  select count(*)::integer into v_push_count
  from public.octagon_push_subscriptions s
  where s.member_id=v_ctx.member_id
    and s.group_id=v_ctx.group_id
    and s.is_active;

  select c.public_key into v_public_key
  from public.octagon_push_config c
  where c.singleton
  limit 1;

  return jsonb_build_object(
    'ok',true,
    'can_access',true,
    'current_week_start',v_week,
    'unread_count',coalesce(v_unread,0),
    'last_seen_at',v_last_seen,
    'latest_unread_at',v_latest,
    'push_enabled',v_push_count>0,
    'push_subscription_count',v_push_count,
    'vapid_public_key',v_public_key,
    'member',jsonb_build_object(
      'id',v_ctx.member_id,
      'display_name',v_ctx.display_name,
      'fighter_avatar_slug',v_ctx.fighter_avatar_slug,
      'is_admin',v_ctx.is_admin
    )
  );
end;
$$;

create or replace function public.octagon_mark_seen(
  p_member_token text,
  p_seen_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_seen timestamptz:=least(coalesce(p_seen_at,now()),now());
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  insert into public.octagon_member_activity(member_id,group_id,last_seen_at)
  values(v_ctx.member_id,v_ctx.group_id,v_seen)
  on conflict(member_id) do update
  set group_id=excluded.group_id,
      last_seen_at=greatest(coalesce(public.octagon_member_activity.last_seen_at,'epoch'::timestamptz),excluded.last_seen_at),
      updated_at=now();

  return jsonb_build_object('ok',true,'last_seen_at',v_seen,'unread_count',0);
end;
$$;

create or replace function public.octagon_register_push_subscription(
  p_member_token text,
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_expiration_time bigint default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_subscription public.octagon_push_subscriptions;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  if nullif(trim(coalesce(p_endpoint,'')),'') is null
     or nullif(trim(coalesce(p_p256dh,'')),'') is null
     or nullif(trim(coalesce(p_auth,'')),'') is null then
    return jsonb_build_object('ok',false,'error','The push subscription is incomplete.');
  end if;

  insert into public.octagon_push_subscriptions(
    member_id,group_id,endpoint,p256dh,auth,expiration_time,user_agent,is_active
  ) values (
    v_ctx.member_id,v_ctx.group_id,trim(p_endpoint),trim(p_p256dh),trim(p_auth),p_expiration_time,left(coalesce(p_user_agent,''),500),true
  )
  on conflict(endpoint) do update
  set member_id=excluded.member_id,
      group_id=excluded.group_id,
      p256dh=excluded.p256dh,
      auth=excluded.auth,
      expiration_time=excluded.expiration_time,
      user_agent=excluded.user_agent,
      is_active=true,
      failure_count=0,
      updated_at=now()
  returning * into v_subscription;

  return jsonb_build_object(
    'ok',true,
    'subscription_id',v_subscription.id,
    'push_enabled',true
  );
end;
$$;

create or replace function public.octagon_remove_push_subscription(
  p_member_token text,
  p_endpoint text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_removed integer:=0;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  update public.octagon_push_subscriptions s
  set is_active=false,
      updated_at=now()
  where s.member_id=v_ctx.member_id
    and s.group_id=v_ctx.group_id
    and s.endpoint=trim(coalesce(p_endpoint,''));

  get diagnostics v_removed=row_count;
  return jsonb_build_object('ok',true,'removed',v_removed>0,'push_enabled',false);
end;
$$;

create or replace function public.octagon_push_delivery_context(
  p_member_token text,
  p_message_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_message public.octagon_messages;
  v_config public.octagon_push_config;
  v_subscriptions jsonb;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found or not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The sender profile was not verified.');
  end if;

  select * into v_message
  from public.octagon_messages m
  where m.id=p_message_id
    and m.group_id=v_ctx.group_id
    and m.author_member_id=v_ctx.member_id
    and m.deleted_at is null;

  if not found then
    return jsonb_build_object('ok',false,'error','The Octagon message was not verified.');
  end if;

  select * into v_config
  from public.octagon_push_config c
  where c.singleton
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','Push delivery is not configured.');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',s.id,
    'endpoint',s.endpoint,
    'p256dh',s.p256dh,
    'auth',s.auth,
    'member_id',s.member_id
  )),'[]'::jsonb)
  into v_subscriptions
  from public.octagon_push_subscriptions s
  join public.octagon_access oa
    on oa.member_id=s.member_id
   and oa.group_id=s.group_id
   and oa.can_access
  where s.group_id=v_ctx.group_id
    and s.member_id<>v_ctx.member_id
    and s.is_active;

  return jsonb_build_object(
    'ok',true,
    'message_id',v_message.id,
    'kind',case when v_message.parent_message_id is null then 'post' else 'reply' end,
    'sender',jsonb_build_object(
      'id',v_ctx.member_id,
      'display_name',v_ctx.display_name
    ),
    'vapid',jsonb_build_object(
      'public_key',v_config.public_key,
      'private_key',v_config.private_key,
      'subject',v_config.subject
    ),
    'subscriptions',v_subscriptions
  );
end;
$$;

revoke all on function public.octagon_activity_status(text) from public;
revoke all on function public.octagon_mark_seen(text,timestamptz) from public;
revoke all on function public.octagon_register_push_subscription(text,text,text,text,bigint,text) from public;
revoke all on function public.octagon_remove_push_subscription(text,text) from public;
revoke all on function public.octagon_push_delivery_context(text,uuid) from public,anon,authenticated;

grant execute on function public.octagon_activity_status(text) to anon,authenticated;
grant execute on function public.octagon_mark_seen(text,timestamptz) to anon,authenticated;
grant execute on function public.octagon_register_push_subscription(text,text,text,text,bigint,text) to anon,authenticated;
grant execute on function public.octagon_remove_push_subscription(text,text) to anon,authenticated;
grant execute on function public.octagon_push_delivery_context(text,uuid) to service_role;

comment on function public.octagon_activity_status(text) is 'Returns the caller''s current-week unread count and public push configuration.';
comment on function public.octagon_mark_seen(text,timestamptz) is 'Stores the verified GOAT26 member''s last-seen timestamp.';
comment on function public.octagon_register_push_subscription(text,text,text,text,bigint,text) is 'Registers or refreshes one browser push subscription for the verified member.';
comment on function public.octagon_remove_push_subscription(text,text) is 'Disables one browser push subscription owned by the verified member.';
comment on function public.octagon_push_delivery_context(text,uuid) is 'Service-role-only delivery context containing VAPID secrets and eligible recipient subscriptions.';
