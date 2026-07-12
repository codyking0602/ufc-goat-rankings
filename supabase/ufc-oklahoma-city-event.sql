-- UFC Oklahoma City Picks event update.
-- Run in Supabase SQL Editor. Safe to rerun before the event.
-- Reuses the existing event ID so permanent-group history and room linkage stay intact.

insert into public.pick_events(
  id,name,subtitle,event_type,event_date,location,card_rule,status,source_note
)
values(
  'ufc-oklahoma-city-2026-07-18',
  'UFC Oklahoma City',
  'Du Plessis vs. Usman',
  'fight-night',
  '2026-07-19 00:00:00+00',
  'Paycom Center · Oklahoma City, Oklahoma',
  'Main card only',
  'upcoming',
  'Confirmed main-card fights as of July 12. Jacobe Smith remains off the Picks card until a replacement opponent is confirmed. Main-event odds are the BetOnline opening line.'
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

-- Void stale versions of the card without deleting history or submitted selections.
update public.pick_fights
set result_status='cancelled', winner_name=null
where event_id='ufc-oklahoma-city-2026-07-18'
  and id not in (
    'okc-mcmillen-montes',
    'okc-ricci-kline',
    'okc-hooper-ramirez',
    'okc-cannonier-duncan',
    'okc-du-plessis-usman'
  );

insert into public.pick_fights(
  id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,
  winner_name,result_status,red_odds,blue_odds,odds_source,odds_updated_at
)
values
  ('okc-mcmillen-montes','ufc-oklahoma-city-2026-07-18',1,'Main Card','Featherweight','Tommy McMillen','Alberto Montes','2026-07-19 00:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-ricci-kline','ufc-oklahoma-city-2026-07-18',2,'Main Card','Women''s Strawweight','Tabatha Ricci','Fatima Kline','2026-07-19 00:30:00+00',null,'scheduled',null,null,null,null),
  ('okc-hooper-ramirez','ufc-oklahoma-city-2026-07-18',3,'Main Card','Lightweight','Chase Hooper','Mitch Ramirez','2026-07-19 01:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-cannonier-duncan','ufc-oklahoma-city-2026-07-18',4,'Co-Main Event','Middleweight','Jared Cannonier','Christian Leroy Duncan','2026-07-19 02:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-du-plessis-usman','ufc-oklahoma-city-2026-07-18',5,'Main Event','Middleweight','Dricus Du Plessis','Kamaru Usman','2026-07-19 02:45:00+00',null,'scheduled',-350,285,'BetOnline opening line via MMA Mania','2026-06-22 14:15:00+00')
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