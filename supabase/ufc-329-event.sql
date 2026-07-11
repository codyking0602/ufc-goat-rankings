-- UFC 329 live Picks event.
-- Run in Supabase SQL Editor. Safe to rerun.

insert into public.pick_events(id,name,subtitle,event_type,event_date,location,card_rule,status,source_note)
values(
  'ufc-329-2026-07-11',
  'UFC 329',
  'McGregor vs. Holloway 2',
  'numbered',
  '2026-07-11 21:00:00+00',
  'Las Vegas, Nevada',
  'Full card',
  'live',
  'Confirmed event-day 13-fight lineup. Bout lock times are conservative estimates.'
)
on conflict(id) do update set
  name=excluded.name,
  subtitle=excluded.subtitle,
  event_type=excluded.event_type,
  event_date=excluded.event_date,
  location=excluded.location,
  card_rule=excluded.card_rule,
  status=excluded.status,
  source_note=excluded.source_note;

insert into public.pick_fights(id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,winner_name,result_status)
values
  ('ufc329-gandra-reese','ufc-329-2026-07-11',1,'Early Prelims','Middleweight','Ryan Gandra','Zach Reese','2026-07-11 21:00:00+00',null,'scheduled'),
  ('ufc329-basharat-garza','ufc-329-2026-07-11',2,'Early Prelims','Bantamweight','Farid Basharat','John Garza','2026-07-11 21:30:00+00',null,'scheduled'),
  ('ufc329-pinas-almeida','ufc-329-2026-07-11',3,'Early Prelims','Middleweight','Damian Pinas','Cesar Almeida','2026-07-11 22:00:00+00',null,'scheduled'),
  ('ufc329-cortez-wang','ufc-329-2026-07-11',4,'Early Prelims','Women''s Flyweight','Tracy Cortez','Wang Cong','2026-07-11 22:30:00+00',null,'scheduled'),
  ('ufc329-riley-kamaka','ufc-329-2026-07-11',5,'Prelims','Featherweight','Luke Riley','Kai Kamaka III','2026-07-11 23:00:00+00',null,'scheduled'),
  ('ufc329-garbrandt-yanez','ufc-329-2026-07-11',6,'Prelims','Bantamweight','Cody Garbrandt','Adrian Yanez','2026-07-11 23:30:00+00',null,'scheduled'),
  ('ufc329-steveson-ellison','ufc-329-2026-07-11',7,'Prelims','Heavyweight','Gable Steveson','Elisha Ellison','2026-07-12 00:00:00+00',null,'scheduled'),
  ('ufc329-krylov-whittaker','ufc-329-2026-07-11',8,'Prelims','Light Heavyweight','Nikita Krylov','Robert Whittaker','2026-07-12 00:30:00+00',null,'scheduled'),
  ('ufc329-green-mckinney','ufc-329-2026-07-11',9,'Main Card','Lightweight','King Green','Terrance McKinney','2026-07-12 01:00:00+00',null,'scheduled'),
  ('ufc329-royval-kavanagh','ufc-329-2026-07-11',10,'Main Card','Flyweight','Brandon Royval','Lone''er Kavanagh','2026-07-12 01:35:00+00',null,'scheduled'),
  ('ufc329-sandhagen-bautista','ufc-329-2026-07-11',11,'Main Card','Bantamweight','Cory Sandhagen','Mario Bautista','2026-07-12 02:10:00+00',null,'scheduled'),
  ('ufc329-saint-denis-pimblett','ufc-329-2026-07-11',12,'Co-Main Event','Lightweight','Benoit Saint Denis','Paddy Pimblett','2026-07-12 02:45:00+00',null,'scheduled'),
  ('ufc329-mcgregor-holloway','ufc-329-2026-07-11',13,'Main Event','Welterweight','Conor McGregor','Max Holloway','2026-07-12 03:45:00+00',null,'scheduled')
on conflict(id) do update set
  event_id=excluded.event_id,
  bout_order=excluded.bout_order,
  card_section=excluded.card_section,
  weight_class=excluded.weight_class,
  red_name=excluded.red_name,
  blue_name=excluded.blue_name,
  lock_at=excluded.lock_at;
