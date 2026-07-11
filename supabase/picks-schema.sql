-- UFC Picks multiplayer schema for Supabase.
-- Run this once in the Supabase SQL editor, then add the project URL and anon key
-- to assets/data/supabase-config.js. Never expose the service-role key.

create extension if not exists pgcrypto;

create table if not exists public.pick_events (
  id text primary key,
  name text not null,
  subtitle text,
  event_type text not null check (event_type in ('numbered','fight-night')),
  event_date timestamptz not null,
  location text,
  card_rule text not null,
  status text not null default 'upcoming' check (status in ('upcoming','live','complete','hidden')),
  source_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.pick_fights (
  id text primary key,
  event_id text not null references public.pick_events(id) on delete cascade,
  bout_order integer not null,
  card_section text not null,
  weight_class text not null,
  red_name text not null,
  blue_name text not null,
  lock_at timestamptz not null,
  winner_name text,
  result_status text not null default 'scheduled' check (result_status in ('scheduled','complete','draw','no-contest','cancelled')),
  unique(event_id,bout_order),
  check (winner_name is null or winner_name in (red_name,blue_name))
);

create table if not exists public.pick_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  event_id text not null references public.pick_events(id) on delete cascade,
  name text not null,
  admin_token_hash bytea not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pick_room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.pick_rooms(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 30),
  member_token_hash bytea not null,
  created_at timestamptz not null default now()
);

create unique index if not exists pick_room_members_name_unique
  on public.pick_room_members(room_id,lower(display_name));

create table if not exists public.pick_selections (
  member_id uuid not null references public.pick_room_members(id) on delete cascade,
  fight_id text not null references public.pick_fights(id) on delete cascade,
  fighter_name text not null,
  picked_at timestamptz not null default now(),
  primary key(member_id,fight_id)
);

alter table public.pick_events enable row level security;
alter table public.pick_fights enable row level security;
alter table public.pick_rooms enable row level security;
alter table public.pick_room_members enable row level security;
alter table public.pick_selections enable row level security;

revoke all on public.pick_events,public.pick_fights,public.pick_rooms,public.pick_room_members,public.pick_selections from anon,authenticated;

create or replace function public.picks_public_events()
returns jsonb
language sql
security definer
set search_path=public
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
          'winner',case when f.result_status='complete' then f.winner_name else null end
        ) order by f.bout_order)
        from public.pick_fights f
        where f.event_id=e.id and f.result_status<>'cancelled'
      ),'[]'::jsonb)
    ) event_json
    from public.pick_events e
    where e.status in ('upcoming','live','complete')
  ) visible_events;
$$;

create or replace function public.picks_create_room(
  p_event_id text,
  p_display_name text,
  p_room_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_admin_token text:=encode(gen_random_bytes(24),'hex');
  v_member_token text:=encode(gen_random_bytes(24),'hex');
  v_code text;
  v_attempt integer:=0;
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
    exit when not exists(select 1 from public.pick_rooms where code=v_code);
    if v_attempt>10 then raise exception 'Could not generate room code.'; end if;
  end loop;
  insert into public.pick_rooms(code,event_id,name,admin_token_hash)
  values(v_code,p_event_id,coalesce(nullif(trim(p_room_name),''),'Fight Picks'),digest(v_admin_token,'sha256'))
  returning * into v_room;
  insert into public.pick_room_members(room_id,display_name,member_token_hash)
  values(v_room.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_member;
  return jsonb_build_object(
    'room',jsonb_build_object('id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token,
    'admin_token',v_admin_token
  );
end;
$$;

create or replace function public.picks_join_room(
  p_room_code text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_member_token text:=encode(gen_random_bytes(24),'hex');
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;
  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30 then
    raise exception 'Enter a display name between 1 and 30 characters.';
  end if;
  if exists(select 1 from public.pick_room_members where room_id=v_room.id and lower(display_name)=lower(trim(p_display_name))) then
    raise exception 'That name is already being used in this room.';
  end if;
  insert into public.pick_room_members(room_id,display_name,member_token_hash)
  values(v_room.id,trim(p_display_name),digest(v_member_token,'sha256'))
  returning * into v_member;
  return jsonb_build_object(
    'room',jsonb_build_object('id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token
  );
end;
$$;

create or replace function public.picks_save_pick(
  p_room_code text,
  p_member_token text,
  p_fight_id text,
  p_fighter_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_fight public.pick_fights;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;
  select * into v_member from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the room.'; end if;
  select * into v_fight from public.pick_fights where id=p_fight_id and event_id=v_room.event_id;
  if not found or v_fight.result_status='cancelled' then raise exception 'Fight not found.'; end if;
  if now()>=v_fight.lock_at or v_fight.result_status<>'scheduled' then raise exception 'That fight is locked.'; end if;
  if p_fighter_name not in (v_fight.red_name,v_fight.blue_name) then raise exception 'Invalid fighter selection.'; end if;
  insert into public.pick_selections(member_id,fight_id,fighter_name,picked_at)
  values(v_member.id,v_fight.id,p_fighter_name,now())
  on conflict(member_id,fight_id) do update set fighter_name=excluded.fighter_name,picked_at=excluded.picked_at;
  return jsonb_build_object('saved',true,'fight_id',v_fight.id,'fighter_name',p_fighter_name);
end;
$$;

create or replace function public.picks_room_snapshot(
  p_room_code text,
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_room public.pick_rooms;
  v_me public.pick_room_members;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;
  select * into v_me from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the room.'; end if;

  return jsonb_build_object(
    'room',jsonb_build_object('id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'my_picks',coalesce((
      select jsonb_agg(jsonb_build_object('fight_id',s.fight_id,'fighter_name',s.fighter_name))
      from public.pick_selections s where s.member_id=v_me.id
    ),'[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,
        'display_name',m.display_name,
        'picks_made',(select count(*) from public.pick_selections s where s.member_id=m.id),
        'score',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name),
        'visible_picks',coalesce((
          select jsonb_agg(jsonb_build_object('fight_id',s2.fight_id,'fighter_name',s2.fighter_name))
          from public.pick_selections s2
          join public.pick_fights f2 on f2.id=s2.fight_id
          where s2.member_id=m.id and (m.id=v_me.id or now()>=f2.lock_at or f2.result_status<>'scheduled')
        ),'[]'::jsonb)
      ) order by m.created_at)
      from public.pick_room_members m where m.room_id=v_room.id
    ),'[]'::jsonb)
  );
end;
$$;

grant execute on function public.picks_public_events() to anon,authenticated;
grant execute on function public.picks_create_room(text,text,text) to anon,authenticated;
grant execute on function public.picks_join_room(text,text) to anon,authenticated;
grant execute on function public.picks_save_pick(text,text,text,text) to anon,authenticated;
grant execute on function public.picks_room_snapshot(text,text) to anon,authenticated;

-- Initial Fight Night card. Fight Nights intentionally contain only the main card.
insert into public.pick_events(id,name,subtitle,event_type,event_date,location,card_rule,status,source_note)
values(
  'ufc-oklahoma-city-2026-07-18','UFC Oklahoma City','Du Plessis vs. Usman','fight-night',
  '2026-07-19 00:00:00+00','Oklahoma City, Oklahoma','Main card only','upcoming',
  'Manual card. Update bout order and estimated lock times if the UFC card changes.'
)
on conflict(id) do update set name=excluded.name,subtitle=excluded.subtitle,event_type=excluded.event_type,event_date=excluded.event_date,location=excluded.location,card_rule=excluded.card_rule,status=excluded.status,source_note=excluded.source_note;

insert into public.pick_fights(id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at)
values
  ('okc-ricci-kline','ufc-oklahoma-city-2026-07-18',1,'Main Card','Women''s Strawweight','Tabatha Ricci','Fatima Kline','2026-07-19 00:00:00+00'),
  ('okc-mcmillen-montes','ufc-oklahoma-city-2026-07-18',2,'Main Card','Featherweight','Tommy McMillen','Alberto Montes','2026-07-19 00:30:00+00'),
  ('okc-tavares-barriault','ufc-oklahoma-city-2026-07-18',3,'Main Card','Middleweight','Brad Tavares','Marc-André Barriault','2026-07-19 01:00:00+00'),
  ('okc-cannonier-duncan','ufc-oklahoma-city-2026-07-18',4,'Main Card','Middleweight','Jared Cannonier','Christian Leroy Duncan','2026-07-19 01:30:00+00'),
  ('okc-du-plessis-usman','ufc-oklahoma-city-2026-07-18',5,'Main Event','Middleweight','Dricus Du Plessis','Kamaru Usman','2026-07-19 02:00:00+00')
on conflict(id) do update set event_id=excluded.event_id,bout_order=excluded.bout_order,card_section=excluded.card_section,weight_class=excluded.weight_class,red_name=excluded.red_name,blue_name=excluded.blue_name,lock_at=excluded.lock_at;
