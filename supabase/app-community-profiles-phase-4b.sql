-- Octagon HQ Phase 4B: shared community profiles and published UFC Top 10s.
-- Safe to rerun after app profile, Play challenge, daily leaderboard, and War Room migrations.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists goat_top_ten jsonb not null default '[]'::jsonb,
  add column if not exists goat_top_ten_updated_at timestamptz;

create or replace function public.app_profile_set_top_ten(
  p_member_token text,
  p_top_ten jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_top_ten jsonb:=coalesce(p_top_ten,'[]'::jsonb);
  v_count integer;
  v_distinct_count integer;
begin
  if jsonb_typeof(v_top_ten)<>'array' then
    return jsonb_build_object('ok',false,'error','Your Top 10 must be a list.');
  end if;

  v_count:=jsonb_array_length(v_top_ten);
  if v_count not in (0,10) then
    return jsonb_build_object('ok',false,'error','Publish exactly ten fighters, or clear the list.');
  end if;

  if exists(
    select 1
    from jsonb_array_elements(v_top_ten) item
    where jsonb_typeof(item)<>'string'
       or nullif(trim(item#>>'{}'),'') is null
       or char_length(trim(item#>>'{}'))>100
  ) then
    return jsonb_build_object('ok',false,'error','Every Top 10 entry must be a valid fighter name.');
  end if;

  select count(distinct lower(trim(item#>>'{}'))) into v_distinct_count
  from jsonb_array_elements(v_top_ten) item;
  if v_distinct_count<>v_count then
    return jsonb_build_object('ok',false,'error','Each fighter can appear only once.');
  end if;

  select * into v_group
  from public.pick_groups
  where coalesce(is_canonical,false) or code='GOAT26'
  order by coalesce(is_canonical,false) desc
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
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
  end if;

  update public.pick_group_members
  set goat_top_ten=v_top_ten,
      goat_top_ten_updated_at=case when v_count=10 then now() else null end,
      profile_updated_at=now()
  where id=v_member.id
  returning * into v_member;

  return jsonb_build_object(
    'ok',true,
    'member_id',v_member.id,
    'top_ten',v_member.goat_top_ten,
    'top_ten_updated_at',v_member.goat_top_ten_updated_at
  );
end;
$$;

create or replace function public.app_profile_community_snapshot(
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
  where coalesce(is_canonical,false) or code='GOAT26'
  order by coalesce(is_canonical,false) desc
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
    return jsonb_build_object('ok',false,'error','Your Octagon HQ profile was not recognized.');
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
    'me_id',v_member.id,
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',gm.id,
        'display_name',gm.display_name,
        'fighter_avatar_slug',gm.fighter_avatar_slug,
        'profile_photo_data',gm.profile_photo_data,
        'is_admin',coalesce(gm.is_app_admin,false) or v_group.owner_member_id=gm.id,
        'top_ten',coalesce(gm.goat_top_ten,'[]'::jsonb),
        'top_ten_updated_at',gm.goat_top_ten_updated_at,
        'profile_updated_at',gm.profile_updated_at,
        'challenge_stats',jsonb_build_object(
          'sent',(select count(*) from public.play_challenges c where c.creator_member_id=gm.id and c.recipient_member_id is not null),
          'received',(select count(*) from public.play_challenges c where c.recipient_member_id=gm.id),
          'completed',(select count(*) from public.play_challenge_attempts a where a.responder_member_id=gm.id)
        ),
        'daily_stats',jsonb_build_object(
          'days',(select count(*) from public.play_daily_attempts d where d.member_id=gm.id and d.game_type='find-leader'),
          'perfect_tens',(select count(*) from public.play_daily_attempts d where d.member_id=gm.id and d.game_type='find-leader' and d.best_score>=10)
        ),
        'war_stats',jsonb_build_object(
          'posts',(select count(*) from public.octagon_messages m where m.author_member_id=gm.id and m.parent_message_id is null and m.deleted_at is null),
          'replies',(select count(*) from public.octagon_messages m where m.author_member_id=gm.id and m.parent_message_id is not null and m.deleted_at is null)
        ),
        'last_active_at',greatest(
          coalesce((select max(m.created_at) from public.octagon_messages m where m.author_member_id=gm.id and m.deleted_at is null),'epoch'::timestamptz),
          coalesce((select max(a.completed_at) from public.play_challenge_attempts a where a.responder_member_id=gm.id),'epoch'::timestamptz),
          coalesce((select max(c.created_at) from public.play_challenges c where c.creator_member_id=gm.id),'epoch'::timestamptz),
          coalesce(gm.profile_updated_at,'epoch'::timestamptz)
        )
      ) order by lower(gm.display_name),gm.id)
      from public.pick_group_members gm
      where gm.group_id=v_group.id and coalesce(gm.is_active,true)
    ),'[]'::jsonb)
  );
end;
$$;

grant execute on function public.app_profile_set_top_ten(text,jsonb) to anon,authenticated;
grant execute on function public.app_profile_community_snapshot(text) to anon,authenticated;
