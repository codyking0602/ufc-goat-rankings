-- Secure RPC layer for the private GOAT26 Octagon message board.
-- Run after supabase/octagon-message-board-foundation.sql. Safe to rerun.

create extension if not exists pgcrypto;

create or replace function public.octagon_member_context(
  p_member_token text
)
returns table (
  group_id uuid,
  member_id uuid,
  display_name text,
  fighter_avatar_slug text,
  is_admin boolean,
  can_access boolean
)
language sql
stable
security definer
set search_path=public,extensions
as $$
  select
    g.id,
    gm.id,
    gm.display_name,
    gm.fighter_avatar_slug,
    (coalesce(gm.is_app_admin,false) or g.owner_member_id=gm.id),
    coalesce(oa.can_access,false)
  from public.pick_groups g
  join public.pick_group_members gm
    on gm.group_id=g.id
   and gm.member_token_hash=digest(coalesce(p_member_token,''),'sha256')
   and coalesce(gm.is_active,true)
  left join public.octagon_access oa
    on oa.member_id=gm.id
   and oa.group_id=g.id
  where coalesce(g.is_canonical,false) or g.code='GOAT26'
  order by coalesce(g.is_canonical,false) desc
  limit 1;
$$;

create or replace function public.octagon_access_status(
  p_member_token text
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  return jsonb_build_object(
    'ok',true,
    'can_access',v_ctx.can_access,
    'current_week_start',public.octagon_week_start(now()),
    'member',jsonb_build_object(
      'id',v_ctx.member_id,
      'display_name',v_ctx.display_name,
      'fighter_avatar_slug',v_ctx.fighter_avatar_slug,
      'is_admin',v_ctx.is_admin
    )
  );
end;
$$;

create or replace function public.octagon_snapshot(
  p_member_token text,
  p_week_start date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_current_week date:=public.octagon_week_start(now());
  v_week date;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  v_week:=coalesce(p_week_start,v_current_week);

  if v_week>v_current_week then
    return jsonb_build_object('ok',false,'error','That Octagon week has not opened yet.');
  end if;

  if v_week<v_current_week and not v_ctx.is_admin then
    return jsonb_build_object('ok',false,'error','Archived Octagon weeks are currently available only to Cody.');
  end if;

  return jsonb_build_object(
    'ok',true,
    'board',jsonb_build_object(
      'week_start',v_week,
      'week_end',v_week+6,
      'is_current',v_week=v_current_week,
      'timezone','America/Chicago',
      'max_characters',500
    ),
    'me',jsonb_build_object(
      'id',v_ctx.member_id,
      'display_name',v_ctx.display_name,
      'fighter_avatar_slug',v_ctx.fighter_avatar_slug,
      'is_admin',v_ctx.is_admin
    ),
    'available_weeks',case
      when v_ctx.is_admin then coalesce((
        select jsonb_agg(w.week_start order by w.week_start desc)
        from (
          select distinct m.week_start
          from public.octagon_messages m
          where m.group_id=v_ctx.group_id
          union
          select v_current_week
        ) w
      ),jsonb_build_array(v_current_week))
      else jsonb_build_array(v_current_week)
    end,
    'messages',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',m.id,
          'parent_message_id',m.parent_message_id,
          'body',case when m.deleted_at is null then m.body else null end,
          'created_at',m.created_at,
          'deleted',m.deleted_at is not null,
          'author',jsonb_build_object(
            'id',author.id,
            'display_name',author.display_name,
            'fighter_avatar_slug',author.fighter_avatar_slug,
            'is_admin',coalesce(author.is_app_admin,false) or g.owner_member_id=author.id
          ),
          'likes',case when m.deleted_at is null then (
            select count(*)
            from public.octagon_reactions r
            where r.message_id=m.id and r.reaction='like'
          ) else 0 end,
          'dislikes',case when m.deleted_at is null then (
            select count(*)
            from public.octagon_reactions r
            where r.message_id=m.id and r.reaction='dislike'
          ) else 0 end,
          'my_reaction',case when m.deleted_at is null then (
            select r.reaction
            from public.octagon_reactions r
            where r.message_id=m.id and r.member_id=v_ctx.member_id
          ) else null end,
          'can_delete',m.deleted_at is null and (m.author_member_id=v_ctx.member_id or v_ctx.is_admin)
        ) order by m.created_at,m.id
      )
      from public.octagon_messages m
      join public.pick_group_members author on author.id=m.author_member_id
      join public.pick_groups g on g.id=m.group_id
      where m.group_id=v_ctx.group_id
        and m.week_start=v_week
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.octagon_post_message(
  p_member_token text,
  p_body text,
  p_parent_message_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_body text:=trim(coalesce(p_body,''));
  v_week date:=public.octagon_week_start(now());
  v_parent public.octagon_messages;
  v_message public.octagon_messages;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  if char_length(v_body) not between 1 and 500 then
    return jsonb_build_object('ok',false,'error','Messages must contain between 1 and 500 characters.');
  end if;

  if p_parent_message_id is not null then
    select * into v_parent
    from public.octagon_messages m
    where m.id=p_parent_message_id
      and m.group_id=v_ctx.group_id
      and m.week_start=v_week
      and m.deleted_at is null;

    if not found then
      return jsonb_build_object('ok',false,'error','That reply target is not available in the current Octagon week.');
    end if;

    if v_parent.parent_message_id is not null then
      return jsonb_build_object('ok',false,'error','Replies can only be added to a top-level message.');
    end if;
  end if;

  insert into public.octagon_messages(
    group_id,author_member_id,week_start,parent_message_id,body
  ) values (
    v_ctx.group_id,v_ctx.member_id,v_week,p_parent_message_id,v_body
  )
  returning * into v_message;

  return jsonb_build_object(
    'ok',true,
    'message',jsonb_build_object(
      'id',v_message.id,
      'parent_message_id',v_message.parent_message_id,
      'body',v_message.body,
      'week_start',v_message.week_start,
      'created_at',v_message.created_at,
      'author',jsonb_build_object(
        'id',v_ctx.member_id,
        'display_name',v_ctx.display_name,
        'fighter_avatar_slug',v_ctx.fighter_avatar_slug,
        'is_admin',v_ctx.is_admin
      ),
      'likes',0,
      'dislikes',0,
      'my_reaction',null,
      'can_delete',true
    )
  );
end;
$$;

create or replace function public.octagon_set_reaction(
  p_member_token text,
  p_message_id uuid,
  p_reaction text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_message public.octagon_messages;
  v_reaction text:=nullif(lower(trim(coalesce(p_reaction,''))),'');
  v_likes integer;
  v_dislikes integer;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  if v_reaction in ('remove','none') then
    v_reaction:=null;
  end if;

  if v_reaction is not null and v_reaction not in ('like','dislike') then
    return jsonb_build_object('ok',false,'error','Choose like, dislike, or remove the reaction.');
  end if;

  select * into v_message
  from public.octagon_messages m
  where m.id=p_message_id
    and m.group_id=v_ctx.group_id
    and m.week_start=public.octagon_week_start(now())
    and m.deleted_at is null;

  if not found then
    return jsonb_build_object('ok',false,'error','That message is not active in the current Octagon week.');
  end if;

  if v_reaction is null then
    delete from public.octagon_reactions
    where message_id=v_message.id and member_id=v_ctx.member_id;
  else
    insert into public.octagon_reactions(message_id,member_id,reaction)
    values (v_message.id,v_ctx.member_id,v_reaction)
    on conflict(message_id,member_id) do update
    set reaction=excluded.reaction,
        updated_at=now();
  end if;

  select
    count(*) filter(where reaction='like')::integer,
    count(*) filter(where reaction='dislike')::integer
  into v_likes,v_dislikes
  from public.octagon_reactions
  where message_id=v_message.id;

  return jsonb_build_object(
    'ok',true,
    'message_id',v_message.id,
    'likes',coalesce(v_likes,0),
    'dislikes',coalesce(v_dislikes,0),
    'my_reaction',v_reaction
  );
end;
$$;

create or replace function public.octagon_delete_message(
  p_member_token text,
  p_message_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_message public.octagon_messages;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.can_access then
    return jsonb_build_object('ok',false,'error','The Octagon Beta is not enabled for this profile.');
  end if;

  select * into v_message
  from public.octagon_messages m
  where m.id=p_message_id
    and m.group_id=v_ctx.group_id
  for update;

  if not found or v_message.deleted_at is not null then
    return jsonb_build_object('ok',false,'error','That message is no longer active.');
  end if;

  if v_message.author_member_id<>v_ctx.member_id and not v_ctx.is_admin then
    return jsonb_build_object('ok',false,'error','You can only delete your own messages.');
  end if;

  update public.octagon_messages
  set deleted_at=now(),
      deleted_by_member_id=v_ctx.member_id
  where id=v_message.id;

  delete from public.octagon_reactions
  where message_id=v_message.id;

  return jsonb_build_object(
    'ok',true,
    'message_id',v_message.id,
    'deleted',true,
    'deleted_by_admin',v_ctx.is_admin and v_message.author_member_id<>v_ctx.member_id
  );
end;
$$;

create or replace function public.octagon_admin_set_access(
  p_member_token text,
  p_target_member_id uuid,
  p_can_access boolean
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_ctx record;
  v_target public.pick_group_members;
begin
  select * into v_ctx
  from public.octagon_member_context(p_member_token);

  if not found then
    return jsonb_build_object('ok',false,'error','Your GOAT26 profile was not recognized.');
  end if;

  if not v_ctx.is_admin then
    return jsonb_build_object('ok',false,'error','Only Cody can manage Octagon Beta access.');
  end if;

  if p_target_member_id=v_ctx.member_id and not p_can_access then
    return jsonb_build_object('ok',false,'error','Cody cannot remove his own Octagon Beta access.');
  end if;

  select * into v_target
  from public.pick_group_members gm
  where gm.id=p_target_member_id
    and gm.group_id=v_ctx.group_id
    and coalesce(gm.is_active,true);

  if not found then
    return jsonb_build_object('ok',false,'error','That active GOAT26 profile was not found.');
  end if;

  insert into public.octagon_access(
    member_id,group_id,can_access,granted_by_member_id,enabled_at
  ) values (
    v_target.id,v_ctx.group_id,p_can_access,v_ctx.member_id,
    case when p_can_access then now() else null end
  )
  on conflict(member_id) do update
  set group_id=excluded.group_id,
      can_access=excluded.can_access,
      granted_by_member_id=excluded.granted_by_member_id,
      enabled_at=excluded.enabled_at,
      updated_at=now();

  return jsonb_build_object(
    'ok',true,
    'member',jsonb_build_object(
      'id',v_target.id,
      'display_name',v_target.display_name,
      'fighter_avatar_slug',v_target.fighter_avatar_slug,
      'can_access',p_can_access
    )
  );
end;
$$;

-- Trigger and internal helpers are not public API endpoints.
revoke all on function public.octagon_week_start(timestamptz) from public,anon,authenticated;
revoke all on function public.octagon_validate_access_row() from public,anon,authenticated;
revoke all on function public.octagon_validate_message_row() from public,anon,authenticated;
revoke all on function public.octagon_validate_reaction_row() from public,anon,authenticated;
revoke all on function public.octagon_member_context(text) from public,anon,authenticated;

-- Only the token-verifying RPC surface is callable from the app.
revoke all on function public.octagon_access_status(text) from public;
revoke all on function public.octagon_snapshot(text,date) from public;
revoke all on function public.octagon_post_message(text,text,uuid) from public;
revoke all on function public.octagon_set_reaction(text,uuid,text) from public;
revoke all on function public.octagon_delete_message(text,uuid) from public;
revoke all on function public.octagon_admin_set_access(text,uuid,boolean) from public;

grant execute on function public.octagon_access_status(text) to anon,authenticated;
grant execute on function public.octagon_snapshot(text,date) to anon,authenticated;
grant execute on function public.octagon_post_message(text,text,uuid) to anon,authenticated;
grant execute on function public.octagon_set_reaction(text,uuid,text) to anon,authenticated;
grant execute on function public.octagon_delete_message(text,uuid) to anon,authenticated;
grant execute on function public.octagon_admin_set_access(text,uuid,boolean) to anon,authenticated;

comment on function public.octagon_access_status(text) is 'Verifies the current GOAT26 profile and private Octagon allowlist status.';
comment on function public.octagon_snapshot(text,date) is 'Loads one weekly Octagon board; archived weeks are Cody-only during beta.';
comment on function public.octagon_post_message(text,text,uuid) is 'Posts a current-week Octagon message or one-level reply using a verified member token.';
comment on function public.octagon_set_reaction(text,uuid,text) is 'Sets, changes, or removes the caller''s like/dislike reaction.';
comment on function public.octagon_delete_message(text,uuid) is 'Soft-deletes the caller''s message or lets Cody delete any GOAT26 message.';
comment on function public.octagon_admin_set_access(text,uuid,boolean) is 'Lets Cody enable or disable private Octagon Beta access per GOAT26 profile.';
