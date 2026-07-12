-- Manual fight locking + 15-minute earlier UFC 329 lock times.
-- Run after supabase/picks-room-admin-phase.sql.
-- Safe to rerun.

create or replace function public.picks_admin_set_fight_lock(
  p_room_code text,
  p_admin_token text,
  p_fight_id text,
  p_locked boolean,
  p_reopen_minutes integer default 15
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_fight public.pick_fights;
  v_lock_at timestamptz;
begin
  select r.* into v_room
  from public.pick_rooms r
  join public.pick_events e on e.id=r.event_id and e.admin_room_id=r.id
  where r.code=upper(trim(p_room_code))
    and r.admin_token_hash=digest(p_admin_token,'sha256');

  if not found then
    raise exception 'This room is not the event results-admin room.';
  end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;

  if not found then
    raise exception 'Fight not found for this room.';
  end if;

  if v_fight.result_status<>'scheduled' then
    raise exception 'Clear the posted result before changing this fight lock.';
  end if;

  v_lock_at:=case
    when p_locked then now()
    else now()+make_interval(mins=>greatest(coalesce(p_reopen_minutes,15),1))
  end;

  update public.pick_fights
  set lock_at=v_lock_at
  where id=v_fight.id;

  return jsonb_build_object(
    'saved',true,
    'fight_id',v_fight.id,
    'locked',p_locked,
    'lock_at',v_lock_at
  );
end;
$$;

grant execute on function public.picks_admin_set_fight_lock(text,text,text,boolean,integer) to anon,authenticated;

-- UFC 329 automatic lock times are now 15 minutes earlier than the original schedule.
update public.pick_fights
set lock_at=case id
  when 'ufc329-durden-costa' then '2026-07-11T15:45:00-05:00'::timestamptz
  when 'ufc329-gandra-reese' then '2026-07-11T16:15:00-05:00'::timestamptz
  when 'ufc329-basharat-garza' then '2026-07-11T16:45:00-05:00'::timestamptz
  when 'ufc329-pinas-almeida' then '2026-07-11T17:15:00-05:00'::timestamptz
  when 'ufc329-cortez-wang' then '2026-07-11T17:45:00-05:00'::timestamptz
  when 'ufc329-riley-kamaka' then '2026-07-11T18:15:00-05:00'::timestamptz
  when 'ufc329-garbrandt-yanez' then '2026-07-11T18:45:00-05:00'::timestamptz
  when 'ufc329-steveson-ellison' then '2026-07-11T19:15:00-05:00'::timestamptz
  when 'ufc329-krylov-whittaker' then '2026-07-11T19:45:00-05:00'::timestamptz
  when 'ufc329-green-mckinney' then '2026-07-11T20:15:00-05:00'::timestamptz
  when 'ufc329-royval-kavanagh' then '2026-07-11T20:45:00-05:00'::timestamptz
  when 'ufc329-sandhagen-bautista' then '2026-07-11T21:15:00-05:00'::timestamptz
  when 'ufc329-saint-denis-pimblett' then '2026-07-11T21:45:00-05:00'::timestamptz
  when 'ufc329-mcgregor-holloway' then '2026-07-11T22:30:00-05:00'::timestamptz
  else lock_at
end
where event_id='ufc-329-2026-07-11';
