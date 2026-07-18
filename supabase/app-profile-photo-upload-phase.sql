-- Persistent circular profile-photo support for the shared GOAT26 profile.
-- Final release sync: 2026-07-18.
-- Run after supabase/app-profile-avatar-phase.sql. Safe to rerun.
-- Photos are cropped/compressed in the browser before this function is called.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists profile_photo_data text;

create or replace function public.app_profile_group_snapshot(
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
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','GOAT26 has not been activated yet.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    return jsonb_build_object('ok',false,'error','Profile access was not recognized.');
  end if;

  return jsonb_build_object(
    'ok',true,
    'group',jsonb_build_object(
      'id',v_group.id,
      'code',v_group.code,
      'name',v_group.name,
      'member_count',(
        select count(*)
        from public.pick_group_members gm
        where gm.group_id=v_group.id and coalesce(gm.is_active,true)
      )
    ),
    'me',jsonb_build_object(
      'id',v_member.id,
      'display_name',v_member.display_name,
      'fighter_avatar_slug',v_member.fighter_avatar_slug,
      'profile_photo_data',v_member.profile_photo_data,
      'is_admin',coalesce(v_member.is_app_admin,false) or v_group.owner_member_id=v_member.id,
      'profile_updated_at',v_member.profile_updated_at
    ),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',gm.id,
        'display_name',gm.display_name,
        'fighter_avatar_slug',gm.fighter_avatar_slug,
        'profile_photo_data',gm.profile_photo_data,
        'is_admin',coalesce(gm.is_app_admin,false) or v_group.owner_member_id=gm.id,
        'profile_updated_at',gm.profile_updated_at
      ) order by lower(gm.display_name),gm.id)
      from public.pick_group_members gm
      where gm.group_id=v_group.id and coalesce(gm.is_active,true)
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.app_profile_set_photo(
  p_member_token text,
  p_profile_photo_data text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_photo text:=nullif(trim(coalesce(p_profile_photo_data,'')), '');
begin
  if v_photo is not null then
    if char_length(v_photo)>240000 then
      return jsonb_build_object('ok',false,'error','That photo is too large. Choose another image and try again.');
    end if;
    if v_photo !~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$' then
      return jsonb_build_object('ok',false,'error','Choose a valid JPG, PNG, or WebP photo.');
    end if;
  end if;

  select * into v_group
  from public.pick_groups
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

  if not found then
    return jsonb_build_object('ok',false,'error','GOAT26 has not been activated yet.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true)
  for update;

  if not found then
    return jsonb_build_object('ok',false,'error','Profile access was not recognized.');
  end if;

  update public.pick_group_members
  set profile_photo_data=v_photo,
      profile_updated_at=now()
  where id=v_member.id
  returning * into v_member;

  return jsonb_build_object(
    'ok',true,
    'member',jsonb_build_object(
      'id',v_member.id,
      'display_name',v_member.display_name,
      'fighter_avatar_slug',v_member.fighter_avatar_slug,
      'profile_photo_data',v_member.profile_photo_data,
      'is_admin',coalesce(v_member.is_app_admin,false) or v_group.owner_member_id=v_member.id,
      'profile_updated_at',v_member.profile_updated_at
    )
  );
end;
$$;

grant execute on function public.app_profile_group_snapshot(text) to anon,authenticated;
grant execute on function public.app_profile_set_photo(text,text) to anon,authenticated;
