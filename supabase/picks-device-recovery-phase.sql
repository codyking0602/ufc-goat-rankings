-- Picks identity and device recovery.
-- Run after supabase/picks-correctness-cleanup-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists recovery_key_hash bytea,
  add column if not exists recovery_key_created_at timestamptz,
  add column if not exists recovery_claim_hash bytea,
  add column if not exists recovery_claim_expires_at timestamptz,
  add column if not exists last_recovered_at timestamptz;

create or replace function public.picks_member_recovery_status(
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

  if not found then raise exception 'Group access expired. Recover your profile or rejoin the group.'; end if;

  return jsonb_build_object(
    'group_code',v_group.code,
    'display_name',v_member.display_name,
    'is_owner',v_group.owner_member_id=v_member.id,
    'has_recovery_key',v_member.recovery_key_hash is not null,
    'recovery_key_created_at',v_member.recovery_key_created_at,
    'last_recovered_at',v_member.last_recovered_at
  );
end;
$$;

create or replace function public.picks_member_generate_recovery_key(
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
  v_raw text:=upper(substr(encode(gen_random_bytes(8),'hex'),1,12));
  v_key text;
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

  if not found then raise exception 'Group access expired. Recover your profile or rejoin the group.'; end if;

  v_key:=substr(v_raw,1,4)||'-'||substr(v_raw,5,4)||'-'||substr(v_raw,9,4);

  update public.pick_group_members
  set recovery_key_hash=digest(v_raw,'sha256'),
      recovery_key_created_at=now(),
      recovery_claim_hash=null,
      recovery_claim_expires_at=null
  where id=v_member.id;

  return jsonb_build_object(
    'saved',true,
    'group_code',v_group.code,
    'display_name',v_member.display_name,
    'is_owner',v_group.owner_member_id=v_member.id,
    'recovery_key',v_key,
    'created_at',now()
  );
end;
$$;

create or replace function public.picks_commissioner_issue_member_recovery(
  p_group_code text,
  p_admin_token text,
  p_member_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_raw text:=upper(substr(encode(gen_random_bytes(8),'hex'),1,12));
  v_code text;
  v_expires timestamptz:=now()+interval '30 minutes';
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');

  if not found then raise exception 'Only the commissioner can create a recovery code.'; end if;

  select * into v_member
  from public.pick_group_members
  where id=p_member_id
    and group_id=v_group.id
    and coalesce(is_active,true);

  if not found then raise exception 'That active member was not found.'; end if;

  v_code:=substr(v_raw,1,4)||'-'||substr(v_raw,5,4)||'-'||substr(v_raw,9,4);

  update public.pick_group_members
  set recovery_claim_hash=digest(v_raw,'sha256'),
      recovery_claim_expires_at=v_expires
  where id=v_member.id;

  return jsonb_build_object(
    'member_id',v_member.id,
    'display_name',v_member.display_name,
    'recovery_code',v_code,
    'expires_at',v_expires
  );
end;
$$;

create or replace function public.picks_member_recover(
  p_group_code text,
  p_display_name text,
  p_recovery_code text
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
  v_code text:=upper(regexp_replace(coalesce(p_recovery_code,''),'[^A-Za-z0-9]','','g'));
  v_member_token text:=encode(gen_random_bytes(24),'hex');
  v_admin_token text:=null;
  v_new_raw text:=upper(substr(encode(gen_random_bytes(8),'hex'),1,12));
  v_new_key text;
  v_is_owner boolean:=false;
begin
  if char_length(trim(coalesce(p_display_name,''))) not between 1 and 30
     or char_length(v_code)<>12 then
    raise exception 'Recovery details did not match.';
  end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code));

  if not found then raise exception 'Recovery details did not match.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and lower(display_name)=lower(trim(p_display_name))
    and coalesce(is_active,true)
    and (
      recovery_key_hash=digest(v_code,'sha256')
      or (
        recovery_claim_hash=digest(v_code,'sha256')
        and recovery_claim_expires_at>now()
      )
    );

  if not found then raise exception 'Recovery details did not match or the temporary code expired.'; end if;

  v_is_owner:=v_group.owner_member_id=v_member.id;
  v_new_key:=substr(v_new_raw,1,4)||'-'||substr(v_new_raw,5,4)||'-'||substr(v_new_raw,9,4);

  update public.pick_group_members
  set member_token_hash=digest(v_member_token,'sha256'),
      recovery_key_hash=digest(v_new_raw,'sha256'),
      recovery_key_created_at=now(),
      recovery_claim_hash=null,
      recovery_claim_expires_at=null,
      last_recovered_at=now()
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
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'member_token',v_member_token,
    'admin_token',v_admin_token,
    'is_owner',v_is_owner,
    'recovery_key',v_new_key,
    'rooms',v_rooms,
    'active_room',case when v_active_room.id is null then null else jsonb_build_object(
      'code',v_active_room.code,
      'event_id',v_active_room.event_id
    ) end
  );
end;
$$;

grant execute on function public.picks_member_recovery_status(text,text) to anon,authenticated;
grant execute on function public.picks_member_generate_recovery_key(text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_issue_member_recovery(text,text,uuid) to anon,authenticated;
grant execute on function public.picks_member_recover(text,text,text) to anon,authenticated;
