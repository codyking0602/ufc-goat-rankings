-- Repair the live tiered Picks scoring assignment.
-- UFC Oklahoma City and every later event use four points per correct pick
-- plus the odds-based Underdog Lock bonus.

update public.pick_events
set scoring_version='tiered-v1'
where event_date >= '2026-07-18 00:00:00-05'::timestamptz
  and scoring_version is distinct from 'tiered-v1';

alter table public.pick_events
  alter column scoring_version set default 'tiered-v1';

do $$
begin
  if public.picks_correct_pick_points('tiered-v1',1)<>4 then
    raise exception 'Tiered correct-pick scoring must equal 4.';
  end if;
  if public.picks_tiered_lock_bonus(100)<>1
     or public.picks_tiered_lock_bonus(150)<>2
     or public.picks_tiered_lock_bonus(175)<>2
     or public.picks_tiered_lock_bonus(200)<>3
     or public.picks_tiered_lock_bonus(250)<>4
     or public.picks_tiered_lock_bonus(300)<>5
     or public.picks_tiered_lock_bonus(350)<>6
     or public.picks_tiered_lock_bonus(400)<>7 then
    raise exception 'Tiered Underdog Lock bonus schedule is invalid.';
  end if;
end $$;
