-- Picks member PIN room/group code compatibility fix.
-- Run after supabase/picks-member-pin-login-fix.sql. Safe to rerun.
-- Accepts either the permanent group code or any linked event-room code.

create extension if not exists pgcrypto;

create or replace function public.picks_member_login_pin(
  p_group_code text,
  p_display_name text,
  p_pin text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_active_room public.pick_rooms;
  v_rooms jsonb;
  v_entered_code text:=upper(regexp_replace(coalesce(p_group_code,''),'[^A-Za-z0-9]','','g'));
  v_name text:=trim(coalesce(p_display_name,''));
  v_pin text:=regexp_replace(coalesce(p_pin,''),'[^0-9]','','g');
  v_member_token text:=encode(gen_random_bytes(24),'hex');
  v_admin_token text:=null;
  v_is_owner boolean:=false;
  v_attempts integer:=0;
begin
  v_entered_code:=translate(v_entered_code,'OILSZGQ','0115260');

  if char_length(v_entered_code)<>6 then
    return jsonb_build_object('ok',false,'error','Group or room code must be 6 characters.');
  end if;

  if char_length(v_name) not between 1 and 30 then
    return jsonb_build_object('ok',false,'error','Enter the exact profile name shown on the leaderboard.');
  end if;

  if char_length(v_pin)<>4 then
    return jsonb_build_object('ok',false,'error','PIN must be exactly 4 numbers.');
  end if;

  select g.* into v_group
  from public.pick_groups g
  where g.code=v_entered_code
     or exists(
       select 1
       from public.pick_rooms r
       where r.group_id=g.id and r.code=v_entered_code
     )
  order by case when g.code=v_entered_code then 0 else 1 end
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','That group or room code was not found. Check 0 versus O.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and lower(display_name)=lower(v_name)
    and coalesce(is_active,true)
  for update;

  if not found then
    return jsonb_build_object('ok',false,'error','That profile name was not found in this group.');
  end if;

  if v_member.pin_locked_until is not null and v_member.pin_locked_until>now() then
    return jsonb_build_object('ok',false,'error','Too many incorrect attempts. Try again in 15 minutes.');
  end if;

  if v_member.pin_hash is null then
    return jsonb_build_object('ok',false,'error','This profile does not have a PIN yet. Set or reset it from a logged-in device.');
  end if;

  if v_member.pin_hash<>crypt(v_pin,v_member.pin_hash) then
    v_attempts:=coalesce(v_member.pin_failed_attempts,0)+1;

    update public.pick_group_members
    set pin_failed_attempts=case when v_attempts>=5 then 0 else v_attempts end,
        pin_locked_until=case when v_attempts>=5 then now()+interval '15 minutes' else null end
    where id=v_member.id;

    if v_attempts>=5 then
      return jsonb_build_object('ok',false,'error','PIN was incorrect. Sign-in is locked for 15 minutes.');
    end if;

    return jsonb_build_object(
      'ok',false,
      'error',format('PIN was incorrect. %s attempt%s remaining before a 15-minute lock.',5-v_attempts,case when 5-v_attempts=1 then '' else 's' end)
    );
  end if;

  v_is_owner:=v_group.owner_member_id=v_member.id;

  update public.pick_group_members
  set member_token_hash=digest(v_member_token,'sha256'),
      pin_failed_attempts=0,
      pin_locked_until=null,
      last_pin_login_at=now()
  where id=v_member.id;

  update public.pick_room_members
  set member_token_hash=digest(v_member_token,'sha256')
  where group_member_id=v_member.id;

  if v_is_owner then
    v_admin_token:=encode(gen_random_bytes(24),'hex');

    update public.pick_groups
    set admin_token_hash=digest(v_admin_token,'sha256')
    where id=v_group.id;

    update public.pick_rooms
    set admin_token_hash=digest(v_admin_token,'sha256')
    where group_id=v_group.id;
  end if;

  select r.* into v_active_room
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id
    and ge.event_id=v_group.active_event_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'code',r.code,
    'event_id',r.event_id
  ) order by r.created_at),'[]'::jsonb)
  into v_rooms
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id;

  return jsonb_build_object(
    'ok',true,
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token,
    'admin_token',v_admin_token,
    'is_owner',v_is_owner,
    'rooms',v_rooms,
    'active_room',case when v_active_room.id is null then null else jsonb_build_object(
      'code',v_active_room.code,
      'event_id',v_active_room.event_id
    ) end
  );
end;
$$;

create or replace function public.picks_commissioner_set_member_pin(
  p_group_code text,
  p_admin_token text,
  p_member_id uuid,
  p_pin text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_pin text:=regexp_replace(coalesce(p_pin,''),'[^0-9]','','g');
  v_entered_code text:=upper(regexp_replace(coalesce(p_group_code,''),'[^A-Za-z0-9]','','g'));
begin
  v_entered_code:=translate(v_entered_code,'OILSZGQ','0115260');

  if char_length(v_pin)<>4 then
    raise exception 'PIN must be exactly 4 numbers.';
  end if;

  select g.* into v_group
  from public.pick_groups g
  where (g.code=v_entered_code
     or exists(
       select 1
       from public.pick_rooms r
       where r.group_id=g.id and r.code=v_entered_code
     ))
    and g.admin_token_hash=digest(p_admin_token,'sha256')
  order by case when g.code=v_entered_code then 0 else 1 end
  limit 1;

  if not found then raise exception 'Commissioner access did not match this group or room.'; end if;

  select * into v_member
  from public.pick_group_members
  where id=p_member_id
    and group_id=v_group.id
    and coalesce(is_active,true);

  if not found then raise exception 'That active member was not found.'; end if;

  update public.pick_group_members
  set pin_hash=crypt(v_pin,gen_salt('bf',8)),
      pin_set_at=now(),
      pin_failed_attempts=0,
      pin_locked_until=null
  where id=v_member.id;

  return jsonb_build_object(
    'saved',true,
    'group_code',v_group.code,
    'entered_code',v_entered_code,
    'member_id',v_member.id,
    'display_name',v_member.display_name,
    'has_pin',true
  );
end;
$$;

grant execute on function public.picks_member_login_pin(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_set_member_pin(text,text,uuid,text) to anon,authenticated;
