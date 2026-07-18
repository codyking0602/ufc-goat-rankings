-- Profile-targeted Play challenges for the canonical GOAT26 app profile.
-- Phase 2E refinement: direct inbox delivery plus short-link fallback.
-- Run after supabase/play-shared-system.sql and the app-profile migrations. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.play_challenges
  add column if not exists recipient_member_id uuid references public.pick_group_members(id) on delete set null,
  add column if not exists recipient_opened_at timestamptz;

create index if not exists play_challenges_recipient_idx
  on public.play_challenges(recipient_member_id,created_at desc)
  where recipient_member_id is not null;

create or replace function public.play_send_profile_challenge(
  p_member_token text,
  p_recipient_member_id uuid,
  p_game_type text,
  p_game_version text,
  p_setup jsonb,
  p_result jsonb,
  p_metadata jsonb default '{}'::jsonb,
  p_expires_days integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'')));
  v_version text:=trim(coalesce(p_game_version,'1'));
  v_group public.pick_groups;
  v_sender public.pick_group_members;
  v_recipient public.pick_group_members;
  v_code text;
  v_id uuid;
  v_try integer;
  v_days integer:=greatest(1,least(coalesce(p_expires_days,30),365));
begin
  if v_game !~ '^[a-z0-9][a-z0-9-]{1,49}$' then
    raise exception 'Invalid Play game type.';
  end if;
  if char_length(v_version) not between 1 and 80 then
    raise exception 'Invalid Play game version.';
  end if;
  if jsonb_typeof(coalesce(p_setup,'{}'::jsonb)) not in ('object','array') then
    raise exception 'Challenge setup must be JSON.';
  end if;
  if jsonb_typeof(coalesce(p_result,'{}'::jsonb)) not in ('object','array') then
    raise exception 'Challenge result must be JSON.';
  end if;
  if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object' then
    raise exception 'Challenge metadata must be an object.';
  end if;
  if pg_column_size(coalesce(p_setup,'{}'::jsonb))>65536
     or pg_column_size(coalesce(p_result,'{}'::jsonb))>65536 then
    raise exception 'Challenge data is too large.';
  end if;

  select * into v_group
  from public.pick_groups
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

  if not found then
    raise exception 'GOAT26 has not been activated yet.';
  end if;

  select * into v_sender
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    raise exception 'Profile access was not recognized.';
  end if;

  select * into v_recipient
  from public.pick_group_members
  where id=p_recipient_member_id
    and group_id=v_group.id
    and coalesce(is_active,true);

  if not found then
    raise exception 'That Octagon HQ profile is no longer available.';
  end if;
  if v_recipient.id=v_sender.id then
    raise exception 'Choose another profile for the challenge.';
  end if;

  for v_try in 1..25 loop
    v_code:=public.play_random_code(6);
    begin
      insert into public.play_challenges(
        code,game_type,game_version,creator_group_id,creator_member_id,
        recipient_member_id,setup,creator_result,metadata,expires_at
      ) values (
        v_code,v_game,v_version,v_group.id,v_sender.id,
        v_recipient.id,coalesce(p_setup,'{}'::jsonb),coalesce(p_result,'{}'::jsonb),
        coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('delivery','profile'),
        now()+(v_days||' days')::interval
      ) returning id into v_id;
      exit;
    exception when unique_violation then
      v_id:=null;
    end;
  end loop;

  if v_id is null then
    raise exception 'Could not create a unique challenge code. Try again.';
  end if;

  return jsonb_build_object(
    'ok',true,
    'code',v_code,
    'game_type',v_game,
    'game_version',v_version,
    'recipient',jsonb_build_object(
      'id',v_recipient.id,
      'display_name',v_recipient.display_name,
      'fighter_avatar_slug',v_recipient.fighter_avatar_slug,
      'profile_photo_data',v_recipient.profile_photo_data
    ),
    'creator',jsonb_build_object(
      'id',v_sender.id,
      'display_name',v_sender.display_name
    ),
    'created_at',now()
  );
end;
$$;

create or replace function public.play_profile_challenge_inbox(
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
    'unread_count',(
      select count(*)
      from public.play_challenges c
      where c.recipient_member_id=v_member.id
        and c.status='active'
        and c.expires_at>now()
        and c.recipient_opened_at is null
        and not exists(
          select 1 from public.play_challenge_attempts a
          where a.challenge_id=c.id and a.responder_member_id=v_member.id
        )
    ),
    'rows',coalesce((
      select jsonb_agg(row_to_json(row_data)::jsonb order by row_data.created_at desc)
      from (
        select
          c.code,
          c.game_type,
          c.game_version,
          c.metadata,
          c.created_at,
          c.expires_at,
          c.recipient_opened_at as opened_at,
          creator.id as creator_member_id,
          creator.display_name as creator_name,
          creator.fighter_avatar_slug as creator_fighter_avatar_slug,
          creator.profile_photo_data as creator_profile_photo_data,
          attempt.completed_at,
          attempt.score,
          (attempt.id is not null) as completed
        from public.play_challenges c
        join public.pick_group_members creator on creator.id=c.creator_member_id
        left join public.play_challenge_attempts attempt
          on attempt.challenge_id=c.id and attempt.responder_member_id=v_member.id
        where c.recipient_member_id=v_member.id
          and c.status='active'
          and c.expires_at>now()
        order by c.created_at desc
        limit 30
      ) row_data
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.play_open_profile_challenge(
  p_member_token text,
  p_challenge_code text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_challenge public.play_challenges;
  v_creator public.pick_group_members;
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

  select * into v_challenge
  from public.play_challenges
  where code=upper(trim(coalesce(p_challenge_code,'')))
    and recipient_member_id=v_member.id
    and status='active'
    and expires_at>now()
  for update;

  if not found then
    return jsonb_build_object('ok',false,'error','That profile challenge was not found or has expired.');
  end if;

  update public.play_challenges
  set recipient_opened_at=coalesce(recipient_opened_at,now())
  where id=v_challenge.id
  returning * into v_challenge;

  select * into v_creator
  from public.pick_group_members
  where id=v_challenge.creator_member_id;

  return jsonb_build_object(
    'ok',true,
    'challenge',jsonb_build_object(
      'code',v_challenge.code,
      'game_type',v_challenge.game_type,
      'game_version',v_challenge.game_version,
      'setup',v_challenge.setup,
      'metadata',v_challenge.metadata,
      'creator_name',v_creator.display_name,
      'creator_member_id',v_creator.id,
      'delivery','profile',
      'created_at',v_challenge.created_at,
      'expires_at',v_challenge.expires_at
    )
  );
end;
$$;

create or replace function public.play_submit_profile_challenge(
  p_member_token text,
  p_challenge_code text,
  p_result jsonb,
  p_score numeric default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_challenge public.play_challenges;
  v_response jsonb;
begin
  select * into v_group
  from public.pick_groups
  where is_canonical or code='GOAT26'
  order by is_canonical desc
  limit 1;

  if not found then
    raise exception 'GOAT26 has not been activated yet.';
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    raise exception 'Profile access was not recognized.';
  end if;

  select * into v_challenge
  from public.play_challenges
  where code=upper(trim(coalesce(p_challenge_code,'')))
    and recipient_member_id=v_member.id
    and status='active'
    and expires_at>now();

  if not found then
    raise exception 'That profile challenge was not found or has expired.';
  end if;

  v_response:=public.play_submit_challenge(
    v_challenge.code,
    v_group.code,
    p_member_token,
    p_result,
    p_score,
    coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('delivery','profile')
  );

  return v_response||jsonb_build_object('delivery','profile');
end;
$$;

grant execute on function public.play_send_profile_challenge(text,uuid,text,text,jsonb,jsonb,jsonb,integer) to anon,authenticated;
grant execute on function public.play_profile_challenge_inbox(text) to anon,authenticated;
grant execute on function public.play_open_profile_challenge(text,text) to anon,authenticated;
grant execute on function public.play_submit_profile_challenge(text,text,jsonb,numeric,jsonb) to anon,authenticated;
