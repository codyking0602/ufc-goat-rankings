-- UFC Oklahoma City Picks event update under the locked full-card system.
-- Run in Supabase SQL Editor. Safe to rerun before the event.
-- The entire card is stored; Fight Night Picks expose only Main Card / Co-Main / Main Event rows.

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
  'Full 11-fight card stored as of July 16. Fight Night Picks show only the five-fight main card. Tavares vs. Barriault was cancelled; Hooper vs. Ramirez was promoted.'
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

-- Move current order values aside before assigning the canonical full-card order.
with staged as (
  select id,(-1000000-row_number() over(order by id))::integer as staged_order
  from public.pick_fights
  where event_id='ufc-oklahoma-city-2026-07-18'
)
update public.pick_fights f
set bout_order=staged.staged_order
from staged
where f.id=staged.id;

-- Reset selections for bouts removed from the official card, including Tavares vs. Barriault.
delete from public.pick_selections s
using public.pick_fights f
where s.fight_id=f.id
  and f.event_id='ufc-oklahoma-city-2026-07-18'
  and f.id not in (
    'okc-barbosa-melisano',
    'okc-hines-harris',
    'okc-coria-nicoll',
    'okc-franco-rodrigues',
    'okc-lebosnoyani-ko',
    'okc-delgado-bashi',
    'okc-mcmillen-montes',
    'okc-ricci-kline',
    'okc-hooper-ramirez',
    'okc-cannonier-duncan',
    'okc-du-plessis-usman'
  );

update public.pick_fights
set result_status='cancelled',winner_name=null,red_odds=null,blue_odds=null,odds_source=null,odds_updated_at=null
where event_id='ufc-oklahoma-city-2026-07-18'
  and id not in (
    'okc-barbosa-melisano',
    'okc-hines-harris',
    'okc-coria-nicoll',
    'okc-franco-rodrigues',
    'okc-lebosnoyani-ko',
    'okc-delgado-bashi',
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
  ('okc-barbosa-melisano','ufc-oklahoma-city-2026-07-18',1,'Prelims','Women''s Flyweight','Dione Barbosa','Anna Melisano','2026-07-18 21:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-hines-harris','ufc-oklahoma-city-2026-07-18',2,'Prelims','Heavyweight','Alvin Hines','RJ Harris','2026-07-18 21:30:00+00',null,'scheduled',null,null,null,null),
  ('okc-coria-nicoll','ufc-oklahoma-city-2026-07-18',3,'Prelims','Flyweight','Alden Coria','Stewart Nicoll','2026-07-18 22:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-franco-rodrigues','ufc-oklahoma-city-2026-07-18',4,'Prelims','Heavyweight','Felipe Franco','Levi Rodrigues Jr.','2026-07-18 22:30:00+00',null,'scheduled',null,null,null,null),
  ('okc-lebosnoyani-ko','ufc-oklahoma-city-2026-07-18',5,'Prelims','Welterweight','Jean-Paul Lebosnoyani','Seok Hyeon Ko','2026-07-18 23:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-delgado-bashi','ufc-oklahoma-city-2026-07-18',6,'Prelims','Featherweight','Jose Delgado','Austin Bashi','2026-07-18 23:30:00+00',null,'scheduled',null,null,null,null),
  ('okc-mcmillen-montes','ufc-oklahoma-city-2026-07-18',7,'Main Card','Featherweight','Tommy McMillen','Alberto Montes','2026-07-19 00:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-ricci-kline','ufc-oklahoma-city-2026-07-18',8,'Main Card','Women''s Strawweight','Tabatha Ricci','Fatima Kline','2026-07-19 00:30:00+00',null,'scheduled',null,null,null,null),
  ('okc-hooper-ramirez','ufc-oklahoma-city-2026-07-18',9,'Main Card','Lightweight','Chase Hooper','Mitch Ramirez','2026-07-19 01:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-cannonier-duncan','ufc-oklahoma-city-2026-07-18',10,'Co-Main Event','Middleweight','Jared Cannonier','Christian Leroy Duncan','2026-07-19 02:00:00+00',null,'scheduled',null,null,null,null),
  ('okc-du-plessis-usman','ufc-oklahoma-city-2026-07-18',11,'Main Event','Middleweight','Dricus Du Plessis','Kamaru Usman','2026-07-19 02:45:00+00',null,'scheduled',null,null,null,null)
on conflict(id) do update set
  event_id=excluded.event_id,
  bout_order=excluded.bout_order,
  card_section=excluded.card_section,
  weight_class=excluded.weight_class,
  red_name=excluded.red_name,
  blue_name=excluded.blue_name,
  lock_at=excluded.lock_at,
  winner_name=case when pick_fights.result_status='complete' then pick_fights.winner_name else null end,
  result_status=case when pick_fights.result_status='complete' then 'complete' else 'scheduled' end,
  red_odds=case
    when pick_fights.red_name<>excluded.red_name or pick_fights.blue_name<>excluded.blue_name then null
    else pick_fights.red_odds
  end,
  blue_odds=case
    when pick_fights.red_name<>excluded.red_name or pick_fights.blue_name<>excluded.blue_name then null
    else pick_fights.blue_odds
  end,
  odds_source=case
    when pick_fights.red_name<>excluded.red_name or pick_fights.blue_name<>excluded.blue_name then null
    else pick_fights.odds_source
  end,
  odds_updated_at=case
    when pick_fights.red_name<>excluded.red_name or pick_fights.blue_name<>excluded.blue_name then null
    else pick_fights.odds_updated_at
  end;

-- Fight Night prelims are stored for card movement tracking but can never retain Picks selections.
delete from public.pick_selections s
using public.pick_fights f
where s.fight_id=f.id
  and f.event_id='ufc-oklahoma-city-2026-07-18'
  and lower(f.card_section) not like '%main%';

-- Any same-ID opponent replacement invalidates the previous selection and Underdog Lock.
delete from public.pick_selections s
using public.pick_fights f
where s.fight_id=f.id
  and f.event_id='ufc-oklahoma-city-2026-07-18'
  and s.fighter_name not in (f.red_name,f.blue_name);
