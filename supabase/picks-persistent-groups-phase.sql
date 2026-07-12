-- Persistent UFC Picks groups.
-- One stable group link, the same members, new event rooms, and cumulative standings.
-- Run after the prior Picks migrations. Safe to rerun.

create extension if not exists pgcrypto;

create table if not exists public.pick_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  admin_token_hash bytea not null,
  active_event_id text references public.pick_events(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.pick_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 30),
  member_token_hash bytea not null,
  created_at timestamptz not null default now()
);

create unique index if not exists pick_group_members_name_unique
  on public.pick_group_members(group_id,lower(display_name));

alter table public.pick_rooms
  add column if not exists group_id uuid references public.pick_groups(id) on delete cascade;

alter table public.pick_room_members
  add column if not exists group_member_id uuid references public.pick_group_members(id) on delete cascade;

create unique index if not exists pick_room_members_group_member_unique
  on public.pick_room_members(room_id,group_member_id)
  where group_member_id is not null;

create table if not exists public.pick_group_events (
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  event_id text not null references public.pick_events(id) on delete cascade,
  room_id uuid not null unique references public.pick_rooms(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(group_id,event_id)
);

alter table public.pick_groups enable row level security;
alter table public.pick_group_members enable row level security;
alter table public.pick_group_events enable row level security;
revoke all on public.pick_groups,public.pick_group_members,public.pick_group_events from anon,authenticated;

-- Convert every existing event room into the first event of its own persistent group.
insert into public.pick_groups(id,code,name,admin_token_hash,active_event_id,created_at)
select r.id,r.code,r.name,r.admin_token_hash,r.event_id,r.created_at
from public.pick_rooms r
where not exists(select 1 from public.pick_groups g where g.code=r.code)
on conflict do nothing;

update public.pick_rooms r
set group_id=g.id
from public.pick_groups g
where r.group_id is null and g.code=r.code;

insert into public.pick_group_members(id,group_id,display_name,member_token_hash,created_at)
select m.id,r.group_id,m.display_name,m.member_token_hash,m.created_at
from public.pick_room_members m
join public.pick_rooms r on r.id=m.room_id
where r.group_id is not null
on conflict do nothing;

update public.pick_room_members m
set group_member_id=gm.id
from public.pick_rooms r,public.pick_group_members gm
where m.room_id=r.id
  and gm.group_id=r.group_id
  and lower(gm.display_name)=lower(m.display_name)
  and m.group_member_id is null;

insert into public.pick_group_events(group_id,event_id,room_id,created_at)
select r.group_id,r.event_id,r.id,r.created_at
from public.pick_rooms r
where r.group_id is not null
on conflict do nothing;

-- New rooms are now persistent groups automatically.
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
  v_group public.pick_groups;
  v_group_member public.pick_group_members;
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
    exit when not exists(select 1 from public.pick_rooms where code=v_code)
      and not exists(select 1 from public.pick_groups where code=v_code);
    if v_attempt>10 then raise exception 'Could not generate group code.'; end if;
  end loop;

  insert into public.pick_groups(code,name,admin_token_hash,active_event_id)
  values(v_code,coalesce(nullif(trim(p_room_name),''),'Fight Picks'),digest(v_admin_token,'sha256'),p_event_id)
  returning * into v_group;

  insert into public.pick_rooms(code,event_id,name,admin_token_hash,group_id)
  values(v_code,p_event_id,v_group.name,v_group.admin_token_hash,v_group.id)
  returning * into v_room;

  insert into public.pick_group_events(group_id,event_id,room_id)
  values(v_group.id,p_event_id,v_room.id);

  update public.pick_events set admin_room_id=v_room.id
  where id=p_event_id and admin_room_id is null;

  select admin_room_id=v_room.id into v_is_result_admin
  from public.pick_events where id=p_event_id;

  insert into public.pick_group_members(group_id,display_name,member_token_hash)
  values(v_group.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_group_member;

  insert into public.pick_room_members(room_id,display_name,member_token_hash,group_member_id)
  values(v_room.id,v_group_member.display_name,v_group_member.member_token_hash,v_group_member.id)
  returning * into v_member;

  return jsonb_build_object(
    'room',jsonb_build_object(
      'id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id,
      'group_code',v_group.code,'is_result_admin',v_is_result_admin
    ),
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token,
    'admin_token',v_admin_token
  );
end;
$$;

-- Joining an event room now joins the permanent group and all of its linked event rooms.
create or replace function public.picks_join_room(
  p_room_code text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_group public.pick_groups;
  v_group_member public.pick_group_members;
  v_member public.pick_room_members;
  v_member_token text:=encode(gen_random_bytes(24),'hex');
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;
  select * into v_group from public.pick_groups where id=v_room.group_id;
  if not found then raise exception 'Picks group not found.'; end if;
  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30 then
    raise exception 'Enter a display name between 1 and 30 characters.';
  end if;
  if exists(select 1 from public.pick_group_members where group_id=v_group.id and lower(display_name)=lower(trim(p_display_name))) then
    raise exception 'That name is already being used in this group.';
  end if;

  insert into public.pick_group_members(group_id,display_name,member_token_hash)
  values(v_group.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_group_member;

  insert into public.pick_room_members(room_id,display_name,member_token_hash,group_member_id)
  select ge.room_id,v_group_member.display_name,v_group_member.member_token_hash,v_group_member.id
  from public.pick_group_events ge where ge.group_id=v_group.id
  on conflict do nothing;

  select * into v_member from public.pick_room_members
  where room_id=v_room.id and group_member_id=v_group_member.id;

  return jsonb_build_object(
    'room',jsonb_build_object('id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id,'group_code',v_group.code),
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token
  );
end;
$$;

create or replace function public.picks_group_public(p_group_code text)
returns jsonb
language sql
security definer
set search_path=public,extensions
as $$
  select jsonb_build_object(
    'code',g.code,
    'name',g.name,
    'active_event_id',g.active_event_id,
    'active_room_code',r.code,
    'event_name',e.name,
    'event_subtitle',e.subtitle,
    'event_status',e.status,
    'member_count',(select count(*) from public.pick_group_members gm where gm.group_id=g.id)
  )
  from public.pick_groups g
  left join public.pick_group_events ge on ge.group_id=g.id and ge.event_id=g.active_event_id
  left join public.pick_rooms r on r.id=ge.room_id
  left join public.pick_events e on e.id=g.active_event_id
  where g.code=upper(trim(p_group_code));
$$;

create or replace function public.picks_group_for_room(
  p_room_code text,
  p_member_token text,
  p_admin_token text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_group public.pick_groups;
  v_member public.pick_room_members;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;
  select * into v_member from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the group.'; end if;
  select * into v_group from public.pick_groups where id=v_room.group_id;
  if not found then raise exception 'Picks group not found.'; end if;

  return jsonb_build_object(
    'group_code',v_group.code,
    'group_name',v_group.name,
    'active_event_id',v_group.active_event_id,
    'is_admin',coalesce(v_group.admin_token_hash=digest(p_admin_token,'sha256'),false)
  );
end;
$$;

create or replace function public.picks_join_group(
  p_group_code text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_group_member public.pick_group_members;
  v_active_room public.pick_rooms;
  v_member_token text:=encode(gen_random_bytes(24),'hex');
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;
  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30 then
    raise exception 'Enter a display name between 1 and 30 characters.';
  end if;
  if exists(select 1 from public.pick_group_members where group_id=v_group.id and lower(display_name)=lower(trim(p_display_name))) then
    raise exception 'That name is already being used in this group.';
  end if;

  insert into public.pick_group_members(group_id,display_name,member_token_hash)
  values(v_group.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_group_member;

  insert into public.pick_room_members(room_id,display_name,member_token_hash,group_member_id)
  select ge.room_id,v_group_member.display_name,v_group_member.member_token_hash,v_group_member.id
  from public.pick_group_events ge where ge.group_id=v_group.id
  on conflict do nothing;

  select r.* into v_active_room
  from public.pick_group_events ge join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=v_group.active_event_id;

  return jsonb_build_object(
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_group_member.id,'display_name',v_group_member.display_name),
    'member_token',v_member_token,
    'active_room',case when v_active_room.id is null then null else jsonb_build_object('code',v_active_room.code,'event_id',v_active_room.event_id) end
  );
end;
$$;

create or replace function public.picks_group_snapshot(
  p_group_code text,
  p_member_token text,
  p_admin_token text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_me public.pick_group_members;
  v_active_room public.pick_rooms;
  v_members jsonb;
  v_events jsonb;
  v_available jsonb;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;
  select * into v_me from public.pick_group_members
  where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Group access expired. Rejoin the group.'; end if;

  select r.* into v_active_room
  from public.pick_group_events ge join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=v_group.active_event_id;

  with member_event_scores as (
    select
      gm.id group_member_id,
      gm.display_name,
      ge.event_id,
      e.status event_status,
      count(s.fight_id)::integer picks_made,
      count(s.fight_id) filter(where f.result_status='complete' and f.winner_name=s.fighter_name)::integer correct,
      count(s.fight_id) filter(where f.result_status='complete' and f.winner_name=s.fighter_name and s.is_underdog_lock)::integer bonus
    from public.pick_group_members gm
    cross join public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    left join public.pick_room_members rm on rm.room_id=ge.room_id and rm.group_member_id=gm.id
    left join public.pick_selections s on s.member_id=rm.id
    left join public.pick_fights f on f.id=s.fight_id
    where gm.group_id=v_group.id and ge.group_id=v_group.id
    group by gm.id,gm.display_name,ge.event_id,e.status
  ), event_maxes as (
    select event_id,max(correct+bonus) max_score
    from member_event_scores
    where event_status='complete'
    group by event_id
  ), member_totals as (
    select
      mes.group_member_id,
      max(mes.display_name) display_name,
      sum(mes.picks_made)::integer picks_made,
      sum(mes.correct)::integer correct,
      sum(mes.bonus)::integer lock_bonus,
      sum(mes.correct+mes.bonus)::integer points,
      count(*) filter(where mes.picks_made>0)::integer events_played,
      count(*) filter(where mes.event_status='complete' and mes.picks_made>0 and em.max_score>0 and mes.correct+mes.bonus=em.max_score)::integer event_wins
    from member_event_scores mes
    left join event_maxes em on em.event_id=mes.event_id
    group by mes.group_member_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',mt.group_member_id,
    'display_name',mt.display_name,
    'picks_made',mt.picks_made,
    'correct',mt.correct,
    'lock_bonus',mt.lock_bonus,
    'points',mt.points,
    'events_played',mt.events_played,
    'event_wins',mt.event_wins,
    'accuracy',case when mt.picks_made>0 then round(100.0*mt.correct/mt.picks_made)::integer else 0 end
  ) order by mt.points desc,mt.event_wins desc,mt.correct desc,mt.display_name),'[]'::jsonb)
  into v_members from member_totals mt;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_id',e.id,'room_code',r.code,'name',e.name,'subtitle',e.subtitle,
    'event_date',e.event_date,'status',e.status,'is_active',e.id=v_group.active_event_id
  ) order by e.event_date desc),'[]'::jsonb)
  into v_events
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,'name',e.name,'subtitle',e.subtitle,'event_date',e.event_date,'status',e.status
  ) order by e.event_date),'[]'::jsonb)
  into v_available
  from public.pick_events e
  where e.status in ('upcoming','live')
    and not exists(select 1 from public.pick_group_events ge where ge.group_id=v_group.id and ge.event_id=e.id);

  return jsonb_build_object(
    'group',jsonb_build_object(
      'id',v_group.id,'code',v_group.code,'name',v_group.name,'active_event_id',v_group.active_event_id,
      'is_admin',coalesce(v_group.admin_token_hash=digest(p_admin_token,'sha256'),false)
    ),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'active_room',case when v_active_room.id is null then null else jsonb_build_object('code',v_active_room.code,'event_id',v_active_room.event_id) end,
    'members',v_members,
    'events',v_events,
    'available_events',v_available
  );
end;
$$;

create or replace function public.picks_group_add_event(
  p_group_code text,
  p_admin_token text,
  p_event_id text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_room public.pick_rooms;
  v_code text;
  v_attempt integer:=0;
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can add an event.'; end if;
  if not exists(select 1 from public.pick_events where id=p_event_id and status in ('upcoming','live')) then
    raise exception 'That event is not available for picks.';
  end if;

  select r.* into v_room
  from public.pick_group_events ge join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=p_event_id;

  if v_room.id is null then
    loop
      v_attempt:=v_attempt+1;
      v_code:=upper(substr(encode(gen_random_bytes(6),'hex'),1,6));
      exit when not exists(select 1 from public.pick_rooms where code=v_code)
        and not exists(select 1 from public.pick_groups where code=v_code);
      if v_attempt>10 then raise exception 'Could not create the event room.'; end if;
    end loop;

    insert into public.pick_rooms(code,event_id,name,admin_token_hash,group_id)
    values(v_code,p_event_id,v_group.name,v_group.admin_token_hash,v_group.id)
    returning * into v_room;

    insert into public.pick_group_events(group_id,event_id,room_id)
    values(v_group.id,p_event_id,v_room.id);

    insert into public.pick_room_members(room_id,display_name,member_token_hash,group_member_id)
    select v_room.id,gm.display_name,gm.member_token_hash,gm.id
    from public.pick_group_members gm where gm.group_id=v_group.id;
  end if;

  update public.pick_groups set active_event_id=p_event_id where id=v_group.id;
  update public.pick_events set admin_room_id=v_room.id where id=p_event_id and admin_room_id is null;

  return jsonb_build_object('saved',true,'group_code',v_group.code,'room_code',v_room.code,'event_id',p_event_id);
end;
$$;

grant execute on function public.picks_create_room(text,text,text) to anon,authenticated;
grant execute on function public.picks_join_room(text,text) to anon,authenticated;
grant execute on function public.picks_group_public(text) to anon,authenticated;
grant execute on function public.picks_group_for_room(text,text,text) to anon,authenticated;
grant execute on function public.picks_join_group(text,text) to anon,authenticated;
grant execute on function public.picks_group_snapshot(text,text,text) to anon,authenticated;
grant execute on function public.picks_group_add_event(text,text,text) to anon,authenticated;
