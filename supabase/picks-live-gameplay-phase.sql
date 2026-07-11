-- Picks live gameplay phase.
-- Adds odds, one Underdog Lock per player, live pick reveals, and UFC 329 odds/results.
-- Safe to run more than once in Supabase SQL Editor.

alter table public.pick_fights add column if not exists red_odds integer;
alter table public.pick_fights add column if not exists blue_odds integer;
alter table public.pick_fights add column if not exists odds_source text;
alter table public.pick_fights add column if not exists odds_updated_at timestamptz;
alter table public.pick_selections add column if not exists is_underdog_lock boolean not null default false;

create unique index if not exists pick_selections_one_underdog_lock
  on public.pick_selections(member_id)
  where is_underdog_lock;

create or replace function public.picks_public_events()
returns jsonb
language sql
security definer
set search_path=public,extensions
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
          'winner',case when f.result_status='complete' then f.winner_name else null end,
          'resultStatus',f.result_status,
          'redOdds',f.red_odds,
          'blueOdds',f.blue_odds,
          'oddsSource',f.odds_source,
          'oddsUpdatedAt',f.odds_updated_at
        ) order by f.bout_order)
        from public.pick_fights f
        where f.event_id=e.id and f.result_status<>'cancelled'
      ),'[]'::jsonb)
    ) event_json
    from public.pick_events e
    where e.status in ('upcoming','live','complete')
  ) visible_events;
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
set search_path=public,extensions
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

  insert into public.pick_selections(member_id,fight_id,fighter_name,picked_at,is_underdog_lock)
  values(v_member.id,v_fight.id,p_fighter_name,now(),false)
  on conflict(member_id,fight_id) do update set
    fighter_name=excluded.fighter_name,
    picked_at=excluded.picked_at,
    is_underdog_lock=case
      when pick_selections.fighter_name=excluded.fighter_name then pick_selections.is_underdog_lock
      else false
    end;

  return jsonb_build_object('saved',true,'fight_id',v_fight.id,'fighter_name',p_fighter_name);
end;
$$;

create or replace function public.picks_set_underdog_lock(
  p_room_code text,
  p_member_token text,
  p_fight_id text,
  p_fighter_name text
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
  v_odds integer;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;

  select * into v_member from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the room.'; end if;

  select * into v_fight from public.pick_fights where id=p_fight_id and event_id=v_room.event_id;
  if not found or v_fight.result_status<>'scheduled' or now()>=v_fight.lock_at then
    raise exception 'That fight is locked.';
  end if;

  if p_fighter_name=v_fight.red_name then v_odds:=v_fight.red_odds;
  elsif p_fighter_name=v_fight.blue_name then v_odds:=v_fight.blue_odds;
  else raise exception 'Invalid fighter selection.';
  end if;

  if coalesce(v_odds,0)<=0 then raise exception 'The Underdog Lock must be used on a betting underdog.'; end if;

  if not exists(
    select 1 from public.pick_selections
    where member_id=v_member.id and fight_id=v_fight.id and fighter_name=p_fighter_name
  ) then
    raise exception 'Pick that fighter before setting the Underdog Lock.';
  end if;

  update public.pick_selections set is_underdog_lock=false where member_id=v_member.id;
  update public.pick_selections
    set is_underdog_lock=true
    where member_id=v_member.id and fight_id=v_fight.id and fighter_name=p_fighter_name;

  return jsonb_build_object('saved',true,'fight_id',v_fight.id,'fighter_name',p_fighter_name,'is_underdog_lock',true);
end;
$$;

create or replace function public.picks_room_snapshot(
  p_room_code text,
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
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
      select jsonb_agg(jsonb_build_object(
        'fight_id',s.fight_id,
        'fighter_name',s.fighter_name,
        'is_underdog_lock',s.is_underdog_lock
      ))
      from public.pick_selections s where s.member_id=v_me.id
    ),'[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,
        'display_name',m.display_name,
        'picks_made',(select count(*) from public.pick_selections s where s.member_id=m.id),
        'correct',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name),
        'upset_bonus',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name),
        'score',(
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name)
          +
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name)
        ),
        'visible_picks',coalesce((
          select jsonb_agg(jsonb_build_object(
            'fight_id',s2.fight_id,
            'fighter_name',s2.fighter_name,
            'is_underdog_lock',s2.is_underdog_lock
          ))
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
grant execute on function public.picks_save_pick(text,text,text,text) to anon,authenticated;
grant execute on function public.picks_set_underdog_lock(text,text,text,text) to anon,authenticated;
grant execute on function public.picks_room_snapshot(text,text) to anon,authenticated;

-- UFC 329 was a 14-fight card after Alessandro Costa vs. Cody Durden was added.
-- Move existing order values out of the way before assigning canonical event order.
update public.pick_fights
set bout_order=bout_order+100
where event_id='ufc-329-2026-07-11' and bout_order<100;

insert into public.pick_fights(
  id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,winner_name,result_status,
  red_odds,blue_odds,odds_source,odds_updated_at
)
values
  ('ufc329-durden-costa','ufc-329-2026-07-11',1,'Early Prelims','Flyweight','Cody Durden','Alessandro Costa','2026-07-11 21:00:00+00','Alessandro Costa','complete',205,-250,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-gandra-reese','ufc-329-2026-07-11',2,'Early Prelims','Middleweight','Ryan Gandra','Zach Reese','2026-07-11 21:30:00+00','Ryan Gandra','complete',-155,130,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-basharat-garza','ufc-329-2026-07-11',3,'Early Prelims','Bantamweight','Farid Basharat','John Garza','2026-07-11 22:00:00+00','Farid Basharat','complete',-600,440,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-pinas-almeida','ufc-329-2026-07-11',4,'Early Prelims','Middleweight','Damian Pinas','Cesar Almeida','2026-07-11 22:30:00+00','Damian Pinas','complete',-218,180,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-cortez-wang','ufc-329-2026-07-11',5,'Early Prelims','Women''s Flyweight','Tracy Cortez','Wang Cong','2026-07-11 23:00:00+00',null,'scheduled',-110,-110,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-riley-kamaka','ufc-329-2026-07-11',6,'Prelims','Featherweight','Luke Riley','Kai Kamaka III','2026-07-11 23:30:00+00',null,'scheduled',-310,250,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-garbrandt-yanez','ufc-329-2026-07-11',7,'Prelims','Bantamweight','Cody Garbrandt','Adrian Yanez','2026-07-12 00:00:00+00',null,'scheduled',310,-395,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-steveson-ellison','ufc-329-2026-07-11',8,'Prelims','Heavyweight','Gable Steveson','Elisha Ellison','2026-07-12 00:30:00+00',null,'scheduled',-3200,1400,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-krylov-whittaker','ufc-329-2026-07-11',9,'Prelims','Light Heavyweight','Nikita Krylov','Robert Whittaker','2026-07-12 01:00:00+00',null,'scheduled',164,-198,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-green-mckinney','ufc-329-2026-07-11',10,'Main Card','Lightweight','King Green','Terrance McKinney','2026-07-12 01:30:00+00',null,'scheduled',140,-166,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-royval-kavanagh','ufc-329-2026-07-11',11,'Main Card','Flyweight','Brandon Royval','Lone''er Kavanagh','2026-07-12 02:00:00+00',null,'scheduled',185,-235,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-sandhagen-bautista','ufc-329-2026-07-11',12,'Main Card','Bantamweight','Cory Sandhagen','Mario Bautista','2026-07-12 02:30:00+00',null,'scheduled',-155,130,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-saint-denis-pimblett','ufc-329-2026-07-11',13,'Co-Main Event','Lightweight','Benoit Saint Denis','Paddy Pimblett','2026-07-12 03:00:00+00',null,'scheduled',-155,130,'MMA Mania odds snapshot','2026-07-09 03:11:00+00'),
  ('ufc329-mcgregor-holloway','ufc-329-2026-07-11',14,'Main Event','Welterweight','Conor McGregor','Max Holloway','2026-07-12 03:45:00+00',null,'scheduled',185,-225,'MMA Mania odds snapshot','2026-07-09 03:11:00+00')
on conflict(id) do update set
  event_id=excluded.event_id,
  bout_order=excluded.bout_order,
  card_section=excluded.card_section,
  weight_class=excluded.weight_class,
  red_name=excluded.red_name,
  blue_name=excluded.blue_name,
  lock_at=excluded.lock_at,
  winner_name=excluded.winner_name,
  result_status=excluded.result_status,
  red_odds=excluded.red_odds,
  blue_odds=excluded.blue_odds,
  odds_source=excluded.odds_source,
  odds_updated_at=excluded.odds_updated_at;

update public.pick_events
set source_note='Confirmed event-day 14-fight lineup. Odds are a July 9 MMA Mania snapshot. Results are updated manually.'
where id='ufc-329-2026-07-11';
