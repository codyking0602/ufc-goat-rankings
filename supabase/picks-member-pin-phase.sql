-- UFC Picks member PIN authentication.
-- Run after supabase/picks-device-recovery-phase.sql. Safe to rerun.
-- Adds portable member sign-in with group code + display name + 4-digit PIN.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists pin_hash text,
  add column if not exists pin_set_at timestamptz,
  add column if not exists pin_failed_attempts integer not null default 0,
  add column if not exists pin_locked_until timestamptz,
  add column if not exists last_pin_login_at timestamptz;

create or replace function public.picks_member_pin_status(
  p_group_code text,
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code));

  if not found then raise exception 'Group not found.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(p_member_token,'sha256')
    and coalesce(is_active,true);

  if not found then raise exception 'Group access expired. Sign in to your profile again.'; end if;

  return jsonb_build_object(
    'group_code',v_group.code,
    'display_name',v_member.display_name,
    'is_owner',v_group.owner_member_id=v_member.id,
    'has_pin',v_member.pin_hash is not null,
    'pin_set_at',v_member.pin_set_at,
    'last_pin_login_at',v_member.last_pin_login_at
  );
end;
$$;

create or replace function public.picks_member_set_pin(
  p_group_code text,
  p_member_token text,
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
  v_pin text:=trim(coalesce(p_pin,''));
begin
  if v_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 numbers.';
  end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code));

  if not found then raise exception 'Group not found.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(p_member_token,'sha256')
    and coalesce(is_active,true);

  if not found then raise exception 'Group access expired. Sign in to your profile again.'; end if;

  update public.pick_group_members
  set pin_hash=crypt(v_pin,gen_salt('bf',8)),
      pin_set_at=now(),
      pin_failed_attempts=0,
      pin_locked_until=null
  where id=v_member.id;

  return jsonb_build_object(
    'saved',true,
    'group_code',v_group.code,
    'display_name',v_member.display_name,
    'has_pin',true
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
  v_pin text:=trim(coalesce(p_pin,''));
begin
  if v_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 numbers.';
  end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');

  if not found then raise exception 'Only the commissioner can set a member PIN.'; end if;

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
    'member_id',v_member.id,
    'display_name',v_member.display_name,
    'has_pin',true
  );
end;
$$;

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
  v_pin text:=trim(coalesce(p_pin,''));
  v_member_token text:=encode(gen_random_bytes(24),'hex');
  v_admin_token text:=null;
  v_is_owner boolean:=false;
  v_attempts integer:=0;
begin
  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30
     or v_pin !~ '^[0-9]{4}$' then
    return jsonb_build_object('ok',false,'error','Enter the group code, exact profile name, and 4-digit PIN.');
  end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code));

  if not found then
    return jsonb_build_object('ok',false,'error','Sign-in details did not match.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and lower(display_name)=lower(trim(p_display_name))
    and coalesce(is_active,true)
  for update;

  if not found then
    return jsonb_build_object('ok',false,'error','Sign-in details did not match.');
  end if;

  if v_member.pin_locked_until is not null and v_member.pin_locked_until>now() then
    return jsonb_build_object('ok',false,'error','Too many incorrect attempts. Try again in 15 minutes.');
  end if;

  if v_member.pin_hash is null then
    return jsonb_build_object('ok',false,'error','This profile does not have a PIN yet. Ask the commissioner to set one.');
  end if;

  if v_member.pin_hash<>crypt(v_pin,v_member.pin_hash) then
    v_attempts:=coalesce(v_member.pin_failed_attempts,0)+1;
    update public.pick_group_members
    set pin_failed_attempts=case when v_attempts>=5 then 0 else v_attempts end,
        pin_locked_until=case when v_attempts>=5 then now()+interval '15 minutes' else null end
    where id=v_member.id;

    if v_attempts>=5 then
      return jsonb_build_object('ok',false,'error','Too many incorrect attempts. Try again in 15 minutes.');
    end if;

    return jsonb_build_object('ok',false,'error','Sign-in details did not match.');
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

grant execute on function public.picks_member_pin_status(text,text) to anon,authenticated;
grant execute on function public.picks_member_set_pin(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_set_member_pin(text,text,uuid,text) to anon,authenticated;
grant execute on function public.picks_member_login_pin(text,text,text) to anon,authenticated;
