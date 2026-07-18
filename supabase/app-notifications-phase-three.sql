-- Octagon HQ Phase 3: server-triggered smart notifications.
-- Direct challenges, incomplete Picks reminders, and War Room activity.
-- Safe to rerun after the canonical profile, Picks, Play challenge, and War Room migrations.

create extension if not exists pgcrypto;
create extension if not exists pg_net;
create extension if not exists pg_cron;

create table if not exists public.app_notification_preferences (
  member_id uuid primary key references public.pick_group_members(id) on delete cascade,
  direct_challenges boolean not null default true,
  picks_reminders boolean not null default true,
  war_room_messages boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_notification_config (
  singleton boolean primary key default true check(singleton),
  internal_token text not null,
  edge_url text not null,
  anon_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  kind text not null check(kind in ('direct-challenge','picks-reminder','war-room','test')),
  source_key text not null unique,
  payload jsonb not null default '{}'::jsonb check(jsonb_typeof(payload)='object'),
  status text not null default 'pending' check(status in ('pending','sending','sent','failed')),
  attempts integer not null default 0 check(attempts>=0),
  available_at timestamptz not null default now(),
  sent_at timestamptz,
  delivered_count integer not null default 0,
  failed_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_notification_outbox_pending_idx
  on public.app_notification_outbox(status,available_at,created_at)
  where status in ('pending','failed');
create index if not exists app_notification_outbox_recipient_idx
  on public.app_notification_outbox(recipient_member_id,created_at desc);

alter table public.app_notification_preferences enable row level security;
alter table public.app_notification_config enable row level security;
alter table public.app_notification_outbox enable row level security;

revoke all on public.app_notification_preferences,public.app_notification_config,public.app_notification_outbox from public,anon,authenticated;

insert into public.app_notification_preferences(member_id)
select gm.id
from public.pick_group_members gm
join public.pick_groups g on g.id=gm.group_id
where (coalesce(g.is_canonical,false) or g.code='GOAT26')
  and coalesce(gm.is_active,true)
on conflict(member_id) do nothing;

create or replace function public.app_notification_member(
  p_member_token text
)
returns public.pick_group_members
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  v_member public.pick_group_members;
begin
  select gm.* into v_member
  from public.pick_group_members gm
  join public.pick_groups g on g.id=gm.group_id
  where (coalesce(g.is_canonical,false) or g.code='GOAT26')
    and gm.member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(gm.is_active,true)
  order by coalesce(g.is_canonical,false) desc
  limit 1;
  return v_member;
end;
$$;

create or replace function public.app_notification_preference_enabled(
  p_member_id uuid,
  p_kind text
)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select case lower(coalesce(p_kind,''))
    when 'direct-challenge' then coalesce(p.direct_challenges,true)
    when 'picks-reminder' then coalesce(p.picks_reminders,true)
    when 'war-room' then coalesce(p.war_room_messages,true)
    else true
  end
  from (select 1) seed
  left join public.app_notification_preferences p on p.member_id=p_member_id;
$$;

create or replace function public.app_queue_notification(
  p_recipient_member_id uuid,
  p_kind text,
  p_source_key text,
  p_payload jsonb,
  p_available_at timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  v_id uuid;
begin
  if p_recipient_member_id is null
     or nullif(trim(coalesce(p_source_key,'')),'') is null
     or jsonb_typeof(coalesce(p_payload,'{}'::jsonb))<>'object' then
    return null;
  end if;

  insert into public.app_notification_outbox(
    recipient_member_id,kind,source_key,payload,available_at
  ) values (
    p_recipient_member_id,lower(trim(p_kind)),trim(p_source_key),coalesce(p_payload,'{}'::jsonb),coalesce(p_available_at,now())
  )
  on conflict(source_key) do nothing
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.app_notification_settings(
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_member public.pick_group_members;
  v_preferences public.app_notification_preferences;
  v_public_key text;
  v_push_count integer:=0;
begin
  v_member:=public.app_notification_member(p_member_token);
  if v_member.id is null then
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;

  insert into public.app_notification_preferences(member_id)
  values(v_member.id)
  on conflict(member_id) do nothing;

  select * into v_preferences
  from public.app_notification_preferences
  where member_id=v_member.id;

  select count(*)::integer into v_push_count
  from public.octagon_push_subscriptions s
  where s.member_id=v_member.id and s.is_active;

  select c.public_key into v_public_key
  from public.octagon_push_config c
  where c.singleton
  limit 1;

  return jsonb_build_object(
    'ok',true,
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'preferences',jsonb_build_object(
      'direct_challenges',v_preferences.direct_challenges,
      'picks_reminders',v_preferences.picks_reminders,
      'war_room_messages',v_preferences.war_room_messages
    ),
    'push_enabled',v_push_count>0,
    'push_subscription_count',v_push_count,
    'vapid_public_key',v_public_key
  );
end;
$$;

create or replace function public.app_notification_update_preferences(
  p_member_token text,
  p_direct_challenges boolean,
  p_picks_reminders boolean,
  p_war_room_messages boolean
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_member public.pick_group_members;
  v_preferences public.app_notification_preferences;
begin
  v_member:=public.app_notification_member(p_member_token);
  if v_member.id is null then
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;

  insert into public.app_notification_preferences(
    member_id,direct_challenges,picks_reminders,war_room_messages,updated_at
  ) values (
    v_member.id,coalesce(p_direct_challenges,true),coalesce(p_picks_reminders,true),coalesce(p_war_room_messages,true),now()
  )
  on conflict(member_id) do update
  set direct_challenges=excluded.direct_challenges,
      picks_reminders=excluded.picks_reminders,
      war_room_messages=excluded.war_room_messages,
      updated_at=now()
  returning * into v_preferences;

  return jsonb_build_object(
    'ok',true,
    'preferences',jsonb_build_object(
      'direct_challenges',v_preferences.direct_challenges,
      'picks_reminders',v_preferences.picks_reminders,
      'war_room_messages',v_preferences.war_room_messages
    )
  );
end;
$$;

create or replace function public.app_register_push_subscription(
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
  v_member public.pick_group_members;
  v_subscription public.octagon_push_subscriptions;
begin
  v_member:=public.app_notification_member(p_member_token);
  if v_member.id is null then
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;
  if nullif(trim(coalesce(p_endpoint,'')),'') is null
     or nullif(trim(coalesce(p_p256dh,'')),'') is null
     or nullif(trim(coalesce(p_auth,'')),'') is null then
    return jsonb_build_object('ok',false,'error','The push subscription is incomplete.');
  end if;

  insert into public.octagon_push_subscriptions(
    member_id,group_id,endpoint,p256dh,auth,expiration_time,user_agent,is_active
  ) values (
    v_member.id,v_member.group_id,trim(p_endpoint),trim(p_p256dh),trim(p_auth),p_expiration_time,left(coalesce(p_user_agent,''),500),true
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

  insert into public.app_notification_preferences(member_id)
  values(v_member.id)
  on conflict(member_id) do nothing;

  return jsonb_build_object('ok',true,'subscription_id',v_subscription.id,'push_enabled',true);
end;
$$;

create or replace function public.app_remove_push_subscription(
  p_member_token text,
  p_endpoint text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_member public.pick_group_members;
  v_removed integer:=0;
begin
  v_member:=public.app_notification_member(p_member_token);
  if v_member.id is null then
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;

  update public.octagon_push_subscriptions
  set is_active=false,updated_at=now()
  where member_id=v_member.id
    and endpoint=trim(coalesce(p_endpoint,''));
  get diagnostics v_removed=row_count;

  return jsonb_build_object('ok',true,'removed',v_removed>0,'push_enabled',false);
end;
$$;

-- Compatibility wrappers keep the existing War Room Alerts control working.
create or replace function public.octagon_register_push_subscription(
  p_member_token text,
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_expiration_time bigint default null,
  p_user_agent text default null
)
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.app_register_push_subscription(
    p_member_token,p_endpoint,p_p256dh,p_auth,p_expiration_time,p_user_agent
  );
$$;

create or replace function public.octagon_remove_push_subscription(
  p_member_token text,
  p_endpoint text
)
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.app_remove_push_subscription(p_member_token,p_endpoint);
$$;

create or replace function public.app_notification_send_test(
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_member public.pick_group_members;
  v_id uuid;
begin
  v_member:=public.app_notification_member(p_member_token);
  if v_member.id is null then
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;

  v_id:=public.app_queue_notification(
    v_member.id,
    'test',
    'test:'||v_member.id::text||':'||gen_random_uuid()::text,
    jsonb_build_object(
      'title','Notifications are on',
      'body','Challenges, Picks reminders, and War Room alerts are ready.',
      'tag','octagon-hq-test',
      'url','./#home'
    ),
    now()
  );

  return jsonb_build_object('ok',v_id is not null,'queued',v_id is not null,'notification_id',v_id);
end;
$$;

create or replace function public.app_notify_profile_challenge()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  v_sender_name text;
begin
  if new.recipient_member_id is null
     or not public.app_notification_preference_enabled(new.recipient_member_id,'direct-challenge') then
    return new;
  end if;

  select display_name into v_sender_name
  from public.pick_group_members
  where id=new.creator_member_id;

  perform public.app_queue_notification(
    new.recipient_member_id,
    'direct-challenge',
    'direct-challenge:'||new.id::text||':'||new.recipient_member_id::text,
    jsonb_build_object(
      'title',coalesce(v_sender_name,'A friend')||' challenged you',
      'body','Find the Leader is waiting. Tap to play the exact board.',
      'tag','direct-challenge-'||new.code,
      'url','./?challenge='||new.code||'#play'
    ),
    now()
  );
  return new;
end;
$$;

drop trigger if exists app_notify_profile_challenge_insert on public.play_challenges;
create trigger app_notify_profile_challenge_insert
after insert on public.play_challenges
for each row execute function public.app_notify_profile_challenge();

create or replace function public.app_notify_war_room_message()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  v_sender_name text;
  v_recipient record;
  v_root_id uuid;
  v_body text;
begin
  select display_name into v_sender_name
  from public.pick_group_members
  where id=new.author_member_id;

  v_root_id:=coalesce(new.parent_message_id,new.id);
  v_body:=left(regexp_replace(coalesce(new.body,''),E'[\n\r\t]+',' ','g'),120);

  for v_recipient in
    select distinct gm.id
    from public.pick_group_members gm
    join public.octagon_access oa
      on oa.member_id=gm.id and oa.group_id=gm.group_id and oa.can_access
    where gm.group_id=new.group_id
      and gm.id<>new.author_member_id
      and coalesce(gm.is_active,true)
      and public.app_notification_preference_enabled(gm.id,'war-room')
      and (
        new.parent_message_id is null
        or gm.id in (
          select m.author_member_id
          from public.octagon_messages m
          where m.group_id=new.group_id
            and m.deleted_at is null
            and (m.id=v_root_id or m.parent_message_id=v_root_id)
        )
      )
  loop
    perform public.app_queue_notification(
      v_recipient.id,
      'war-room',
      'war-room:'||new.id::text||':'||v_recipient.id::text,
      jsonb_build_object(
        'title','The War Room',
        'body',case
          when new.parent_message_id is null then coalesce(v_sender_name,'A member')||': '||v_body
          else coalesce(v_sender_name,'A member')||' replied: '||v_body
        end,
        'tag','war-room-'||new.id::text,
        'url','./?share=war-room&message='||new.id::text||'&week='||new.week_start::text||'#war-room'
      ),
      now()
    );
  end loop;
  return new;
end;
$$;

drop trigger if exists app_notify_war_room_message_insert on public.octagon_messages;
create trigger app_notify_war_room_message_insert
after insert on public.octagon_messages
for each row execute function public.app_notify_war_room_message();

create or replace function public.app_queue_picks_reminders()
returns integer
language plpgsql
security definer
set search_path=public
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
  v_room public.pick_rooms;
  v_first_lock timestamptz;
  v_bucket integer:=0;
  v_member record;
  v_room_member_id uuid;
  v_missing integer;
  v_queued integer:=0;
  v_label text;
begin
  select * into v_group
  from public.pick_groups
  where coalesce(is_canonical,false) or code='GOAT26'
  order by coalesce(is_canonical,false) desc
  limit 1;
  if not found or v_group.active_event_id is null then return 0; end if;

  select * into v_event
  from public.pick_events
  where id=v_group.active_event_id and status in ('upcoming','live');
  if not found then return 0; end if;

  select r.* into v_room
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=v_event.id
  limit 1;
  if not found then return 0; end if;

  select min(f.lock_at) into v_first_lock
  from public.pick_fights f
  where f.event_id=v_event.id
    and f.result_status='scheduled'
    and f.lock_at>now()
    and (
      v_event.event_type='numbered'
      or lower(f.card_section) in ('main card','co-main event','main event')
    );
  if v_first_lock is null then return 0; end if;

  if now() between v_first_lock-interval '125 minutes' and v_first_lock-interval '115 minutes' then
    v_bucket:=120;
    v_label:='Picks close in 2 hours';
  elsif now() between v_first_lock-interval '25 minutes' and v_first_lock-interval '15 minutes' then
    v_bucket:=20;
    v_label:='Final call: picks close soon';
  else
    return 0;
  end if;

  for v_member in
    select gm.id,gm.display_name
    from public.pick_group_members gm
    where gm.group_id=v_group.id
      and coalesce(gm.is_active,true)
      and public.app_notification_preference_enabled(gm.id,'picks-reminder')
  loop
    select rm.id into v_room_member_id
    from public.pick_room_members rm
    where rm.room_id=v_room.id and rm.group_member_id=v_member.id
    limit 1;
    if v_room_member_id is null then continue; end if;

    select count(*)::integer into v_missing
    from public.pick_fights f
    where f.event_id=v_event.id
      and f.result_status='scheduled'
      and f.lock_at>now()
      and (
        v_event.event_type='numbered'
        or lower(f.card_section) in ('main card','co-main event','main event')
      )
      and not exists(
        select 1 from public.pick_selections s
        where s.member_id=v_room_member_id and s.fight_id=f.id
      );

    if v_missing>0 and public.app_queue_notification(
      v_member.id,
      'picks-reminder',
      'picks-reminder:'||v_event.id||':'||v_member.id::text||':'||v_bucket::text,
      jsonb_build_object(
        'title',v_label,
        'body',v_missing::text||' fight'||case when v_missing=1 then '' else 's' end||' still need picks for '||v_event.name||case when nullif(trim(coalesce(v_event.subtitle,'')),'') is null then '' else ': '||v_event.subtitle end||'.',
        'tag','picks-reminder-'||v_event.id||'-'||v_bucket::text,
        'url','./?share=picks-event&event='||v_event.id||'&picksView=event#picks'
      ),
      now()
    ) is not null then
      v_queued:=v_queued+1;
    end if;
  end loop;

  return v_queued;
end;
$$;

create or replace function public.app_notification_claim_batch(
  p_internal_token text,
  p_limit integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_rows jsonb;
begin
  if not exists(
    select 1 from public.app_notification_config
    where singleton and internal_token=coalesce(p_internal_token,'')
  ) then
    raise exception 'Notification worker was not authorized.';
  end if;

  update public.app_notification_outbox
  set status='pending',updated_at=now(),last_error='Recovered an interrupted delivery.'
  where status='sending' and updated_at<now()-interval '5 minutes';

  with candidates as (
    select id
    from public.app_notification_outbox
    where status in ('pending','failed')
      and available_at<=now()
      and attempts<5
    order by created_at
    for update skip locked
    limit greatest(1,least(coalesce(p_limit,50),100))
  ), claimed as (
    update public.app_notification_outbox o
    set status='sending',attempts=o.attempts+1,updated_at=now()
    from candidates c
    where o.id=c.id
    returning o.id,o.recipient_member_id,o.kind,o.payload,o.attempts
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',id,
    'recipient_member_id',recipient_member_id,
    'kind',kind,
    'payload',payload,
    'attempts',attempts
  ) order by id),'[]'::jsonb)
  into v_rows
  from claimed;

  return jsonb_build_object('ok',true,'rows',v_rows);
end;
$$;

create or replace function public.app_notification_finish(
  p_internal_token text,
  p_notification_id uuid,
  p_delivered integer,
  p_failed integer,
  p_error text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_sent boolean:=coalesce(p_delivered,0)>0 or coalesce(p_failed,0)=0;
begin
  if not exists(
    select 1 from public.app_notification_config
    where singleton and internal_token=coalesce(p_internal_token,'')
  ) then
    raise exception 'Notification worker was not authorized.';
  end if;

  update public.app_notification_outbox
  set status=case when v_sent then 'sent' else 'failed' end,
      sent_at=case when v_sent then now() else sent_at end,
      delivered_count=greatest(0,coalesce(p_delivered,0)),
      failed_count=greatest(0,coalesce(p_failed,0)),
      last_error=nullif(left(coalesce(p_error,''),1000),''),
      available_at=case when v_sent then available_at else now()+interval '5 minutes' end,
      updated_at=now()
  where id=p_notification_id;

  return jsonb_build_object('ok',true,'sent',v_sent);
end;
$$;

create or replace function public.app_notification_tick()
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_config public.app_notification_config;
  v_queued integer:=0;
  v_request bigint;
begin
  v_queued:=public.app_queue_picks_reminders();
  select * into v_config
  from public.app_notification_config
  where singleton
  limit 1;
  if not found then
    return jsonb_build_object('ok',false,'queued',v_queued,'error','Notification worker is not configured.');
  end if;

  select net.http_post(
    url:=v_config.edge_url,
    headers:=jsonb_build_object(
      'Content-Type','application/json',
      'apikey',v_config.anon_key
    ),
    body:=jsonb_build_object(
      'mode','drain',
      'internal_token',v_config.internal_token
    ),
    timeout_milliseconds:=15000
  ) into v_request;

  return jsonb_build_object('ok',true,'queued',v_queued,'request_id',v_request);
end;
$$;

create or replace function public.app_notification_schedule()
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_job record;
  v_job_id bigint;
begin
  for v_job in select jobid from cron.job where jobname='octagon-hq-smart-notifications' loop
    perform cron.unschedule(v_job.jobid);
  end loop;

  select cron.schedule(
    'octagon-hq-smart-notifications',
    '* * * * *',
    'select public.app_notification_tick();'
  ) into v_job_id;

  return jsonb_build_object('ok',true,'job_id',v_job_id);
end;
$$;

create or replace function public.app_notification_audit()
returns jsonb
language sql
security definer
set search_path=public
as $$
  select jsonb_build_object(
    'ok',true,
    'phase','phase-3-smart-notifications',
    'configured',exists(select 1 from public.app_notification_config where singleton),
    'preference_rows',(select count(*) from public.app_notification_preferences),
    'active_subscriptions',(select count(*) from public.octagon_push_subscriptions where is_active),
    'pending_outbox',(select count(*) from public.app_notification_outbox where status in ('pending','failed','sending')),
    'cron_scheduled',exists(select 1 from cron.job where jobname='octagon-hq-smart-notifications'),
    'challenge_trigger',exists(select 1 from pg_trigger where tgname='app_notify_profile_challenge_insert' and not tgisinternal),
    'war_room_trigger',exists(select 1 from pg_trigger where tgname='app_notify_war_room_message_insert' and not tgisinternal)
  );
$$;

revoke all on function public.app_notification_member(text) from public,anon,authenticated;
revoke all on function public.app_notification_preference_enabled(uuid,text) from public,anon,authenticated;
revoke all on function public.app_queue_notification(uuid,text,text,jsonb,timestamptz) from public,anon,authenticated;
revoke all on function public.app_notification_claim_batch(text,integer) from public,anon,authenticated;
revoke all on function public.app_notification_finish(text,uuid,integer,integer,text) from public,anon,authenticated;
revoke all on function public.app_notification_tick() from public,anon,authenticated;
revoke all on function public.app_notification_schedule() from public,anon,authenticated;
revoke all on function public.app_notification_audit() from public,anon,authenticated;

grant execute on function public.app_notification_settings(text) to anon,authenticated;
grant execute on function public.app_notification_update_preferences(text,boolean,boolean,boolean) to anon,authenticated;
grant execute on function public.app_register_push_subscription(text,text,text,text,bigint,text) to anon,authenticated;
grant execute on function public.app_remove_push_subscription(text,text) to anon,authenticated;
grant execute on function public.app_notification_send_test(text) to anon,authenticated;
grant execute on function public.octagon_register_push_subscription(text,text,text,text,bigint,text) to anon,authenticated;
grant execute on function public.octagon_remove_push_subscription(text,text) to anon,authenticated;
grant execute on function public.app_notification_claim_batch(text,integer) to service_role;
grant execute on function public.app_notification_finish(text,uuid,integer,integer,text) to service_role;
grant execute on function public.app_notification_audit() to service_role;
