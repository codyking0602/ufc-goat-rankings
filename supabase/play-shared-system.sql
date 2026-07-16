-- UFC Play shared identity, generic friend challenges, and generic daily leaderboards.
-- Run after supabase/picks-member-pin-phase.sql.
-- Safe to rerun. This replaces the original Keep/Cut-only Play migration.

create extension if not exists pgcrypto;

create table if not exists public.play_challenges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  game_type text not null,
  game_version text not null default '1',
  creator_group_id uuid not null references public.pick_groups(id) on delete cascade,
  creator_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  setup jsonb not null default '{}'::jsonb,
  creator_result jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  attempt_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '365 days')
);

alter table public.play_challenges
  add column if not exists game_version text not null default '1',
  add column if not exists setup jsonb not null default '{}'::jsonb,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists status text not null default 'active';

-- Upgrade rows from the original Keep/Cut-only schema without discarding them.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='play_challenges' and column_name='lineup'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='play_challenges' and column_name='pack_id'
  ) then
    execute $upgrade$
      update public.play_challenges
      set setup=jsonb_build_object(
        'packId',coalesce(nullif(pack_id,''),'ufc-careers'),
        'lineup',lineup
      )
      where setup='{}'::jsonb and lineup is not null
    $upgrade$;
    execute 'alter table public.play_challenges alter column lineup drop not null';
    execute 'alter table public.play_challenges alter column pack_id drop not null';
  end if;
end;
$$;

alter table public.play_challenges drop constraint if exists play_challenges_game_type;
alter table public.play_challenges drop constraint if exists play_challenges_lineup_array;
alter table public.play_challenges drop constraint if exists play_challenges_result_array;
alter table public.play_challenges drop constraint if exists play_challenges_code_format;
alter table public.play_challenges drop constraint if exists play_challenges_game_key;
alter table public.play_challenges drop constraint if exists play_challenges_version_length;
alter table public.play_challenges drop constraint if exists play_challenges_json_shape;
alter table public.play_challenges drop constraint if exists play_challenges_metadata_object;
alter table public.play_challenges drop constraint if exists play_challenges_status_check;
alter table public.play_challenges drop constraint if exists play_challenges_attempt_count_check;

alter table public.play_challenges
  add constraint play_challenges_code_format check (code ~ '^[A-Z2-9]{6}$'),
  add constraint play_challenges_game_key check (game_type ~ '^[a-z0-9][a-z0-9-]{1,49}$'),
  add constraint play_challenges_version_length check (char_length(game_version) between 1 and 80),
  add constraint play_challenges_json_shape check (
    jsonb_typeof(setup) in ('object','array')
    and jsonb_typeof(creator_result) in ('object','array')
  ),
  add constraint play_challenges_metadata_object check (jsonb_typeof(metadata)='object'),
  add constraint play_challenges_status_check check (status in ('active','closed','expired')),
  add constraint play_challenges_attempt_count_check check (attempt_count>=0);

create table if not exists public.play_challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.play_challenges(id) on delete cascade,
  responder_group_id uuid not null references public.pick_groups(id) on delete cascade,
  responder_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  result jsonb not null,
  score numeric,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  constraint play_challenge_attempts_one_per_player unique (challenge_id,responder_member_id)
);

alter table public.play_challenge_attempts
  add column if not exists score numeric,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.play_challenge_attempts drop constraint if exists play_challenge_attempts_result_array;
alter table public.play_challenge_attempts drop constraint if exists play_challenge_attempts_json_shape;
alter table public.play_challenge_attempts drop constraint if exists play_challenge_attempts_metadata_object;
alter table public.play_challenge_attempts
  add constraint play_challenge_attempts_json_shape check (jsonb_typeof(result) in ('object','array')),
  add constraint play_challenge_attempts_metadata_object check (jsonb_typeof(metadata)='object');

create table if not exists public.play_daily_challenges (
  challenge_day date not null,
  game_type text not null,
  game_version text not null,
  seed text not null,
  setup jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  max_score integer not null,
  created_at timestamptz not null default now(),
  primary key (challenge_day,game_type),
  constraint play_daily_challenges_game_key check (game_type ~ '^[a-z0-9][a-z0-9-]{1,49}$'),
  constraint play_daily_challenges_version_length check (char_length(game_version) between 1 and 80),
  constraint play_daily_challenges_setup_shape check (jsonb_typeof(setup) in ('object','array')),
  constraint play_daily_challenges_metadata_object check (jsonb_typeof(metadata)='object'),
  constraint play_daily_challenges_max_score check (max_score between 1 and 1000)
);

create table if not exists public.play_daily_attempts (
  challenge_day date not null,
  game_type text not null,
  game_version text not null default '1',
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  member_id uuid not null references public.pick_group_members(id) on delete cascade,
  official_score integer not null,
  best_score integer not null,
  max_score integer not null default 5,
  attempt_count integer not null default 1,
  official_result jsonb not null default '{}'::jsonb,
  best_result jsonb not null default '{}'::jsonb,
  first_completed_at timestamptz not null default now(),
  latest_completed_at timestamptz not null default now(),
  primary key (challenge_day,game_type,member_id)
);

alter table public.play_daily_attempts
  add column if not exists game_version text not null default '1',
  add column if not exists max_score integer not null default 5;

alter table public.play_daily_attempts drop constraint if exists play_daily_attempts_game_type;
alter table public.play_daily_attempts drop constraint if exists play_daily_attempts_score_range;
alter table public.play_daily_attempts drop constraint if exists play_daily_attempts_count_positive;
alter table public.play_daily_attempts drop constraint if exists play_daily_attempts_generic_score_range;
alter table public.play_daily_attempts drop constraint if exists play_daily_attempts_json_shape;
alter table public.play_daily_attempts
  add constraint play_daily_attempts_generic_score_range check (
    max_score between 1 and 1000
    and official_score between 0 and max_score
    and best_score between 0 and max_score
  ),
  add constraint play_daily_attempts_count_positive check (attempt_count>=1),
  add constraint play_daily_attempts_json_shape check (
    jsonb_typeof(official_result) in ('object','array')
    and jsonb_typeof(best_result) in ('object','array')
  );

create index if not exists play_challenges_creator_idx
  on public.play_challenges(creator_member_id,created_at desc);
create index if not exists play_challenges_game_idx
  on public.play_challenges(game_type,created_at desc);
create index if not exists play_challenge_attempts_challenge_idx
  on public.play_challenge_attempts(challenge_id,completed_at desc);
create index if not exists play_daily_attempts_board_idx
  on public.play_daily_attempts(challenge_day,game_type,official_score desc);

alter table public.play_challenges enable row level security;
alter table public.play_challenge_attempts enable row level security;
alter table public.play_daily_challenges enable row level security;
alter table public.play_daily_attempts enable row level security;

revoke all on public.play_challenges from anon,authenticated;
revoke all on public.play_challenge_attempts from anon,authenticated;
revoke all on public.play_daily_challenges from anon,authenticated;
revoke all on public.play_daily_attempts from anon,authenticated;

create or replace function public.play_random_code(p_length integer default 6)
returns text
language plpgsql
volatile
security definer
set search_path=public
as $$
declare
  v_alphabet constant text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_result text:='';
  v_length integer:=greatest(4,least(coalesce(p_length,6),10));
  v_index integer;
begin
  for v_index in 1..v_length loop
    v_result:=v_result || substr(v_alphabet,1+floor(random()*length(v_alphabet))::integer,1);
  end loop;
  return v_result;
end;
$$;

revoke all on function public.play_random_code(integer) from public,anon,authenticated;

create or replace function public.play_identity_snapshot(
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
  where code=upper(trim(coalesce(p_group_code,'')));

  if not found then
    return jsonb_build_object('ok',false,'error','Profile group not found.');
  end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);

  if not found then
    return jsonb_build_object('ok',false,'error','Profile access expired. Sign in with your Picks PIN.');
  end if;

  return jsonb_build_object(
    'ok',true,
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'member',jsonb_build_object('id',v_member.id,'display_name',v_member.display_name),
    'is_owner',v_group.owner_member_id=v_member.id
  );
end;
$$;

drop function if exists public.play_create_challenge(text,text,text,text,jsonb,jsonb,jsonb,integer);
create function public.play_create_challenge(
  p_game_type text,
  p_game_version text,
  p_group_code text,
  p_member_token text,
  p_setup jsonb,
  p_result jsonb,
  p_metadata jsonb default '{}'::jsonb,
  p_expires_days integer default 365
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
  v_member public.pick_group_members;
  v_code text;
  v_id uuid;
  v_try integer;
  v_days integer:=greatest(1,least(coalesce(p_expires_days,365),3650));
begin
  if v_game !~ '^[a-z0-9][a-z0-9-]{1,49}$' then raise exception 'Invalid Play game type.'; end if;
  if char_length(v_version) not between 1 and 80 then raise exception 'Invalid Play game version.'; end if;
  if jsonb_typeof(coalesce(p_setup,'{}'::jsonb)) not in ('object','array') then raise exception 'Challenge setup must be JSON.'; end if;
  if jsonb_typeof(coalesce(p_result,'{}'::jsonb)) not in ('object','array') then raise exception 'Challenge result must be JSON.'; end if;
  if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object' then raise exception 'Challenge metadata must be an object.'; end if;
  if pg_column_size(coalesce(p_setup,'{}'::jsonb))>65536 or pg_column_size(coalesce(p_result,'{}'::jsonb))>65536 then
    raise exception 'Challenge data is too large.';
  end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(coalesce(p_group_code,'')));
  if not found then raise exception 'Profile group not found.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);
  if not found then raise exception 'Profile access expired. Sign in with your Picks PIN.'; end if;

  for v_try in 1..25 loop
    v_code:=public.play_random_code(6);
    begin
      insert into public.play_challenges(
        code,game_type,game_version,creator_group_id,creator_member_id,
        setup,creator_result,metadata,expires_at
      ) values (
        v_code,v_game,v_version,v_group.id,v_member.id,
        coalesce(p_setup,'{}'::jsonb),coalesce(p_result,'{}'::jsonb),coalesce(p_metadata,'{}'::jsonb),
        now()+(v_days||' days')::interval
      ) returning id into v_id;
      exit;
    exception when unique_violation then
      v_id:=null;
    end;
  end loop;

  if v_id is null then raise exception 'Could not create a unique challenge code. Try again.'; end if;

  return jsonb_build_object(
    'ok',true,
    'code',v_code,
    'game_type',v_game,
    'game_version',v_version,
    'creator',jsonb_build_object('display_name',v_member.display_name),
    'created_at',now()
  );
end;
$$;

create or replace function public.play_get_challenge(p_challenge_code text)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_challenge public.play_challenges;
  v_creator public.pick_group_members;
  v_group public.pick_groups;
begin
  select * into v_challenge
  from public.play_challenges
  where code=upper(trim(coalesce(p_challenge_code,'')))
    and status='active'
    and expires_at>now();

  if not found then
    return jsonb_build_object('ok',false,'error','That challenge was not found or has expired.');
  end if;

  select * into v_creator from public.pick_group_members where id=v_challenge.creator_member_id;
  select * into v_group from public.pick_groups where id=v_challenge.creator_group_id;

  return jsonb_build_object(
    'ok',true,
    'challenge',jsonb_build_object(
      'code',v_challenge.code,
      'game_type',v_challenge.game_type,
      'game_version',v_challenge.game_version,
      'setup',v_challenge.setup,
      'metadata',v_challenge.metadata,
      'creator_name',v_creator.display_name,
      'creator_group_code',v_group.code,
      'attempt_count',v_challenge.attempt_count,
      'created_at',v_challenge.created_at,
      'expires_at',v_challenge.expires_at
    )
  );
end;
$$;

drop function if exists public.play_submit_challenge(text,text,text,jsonb,numeric,jsonb);
create function public.play_submit_challenge(
  p_challenge_code text,
  p_group_code text,
  p_member_token text,
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
  v_challenge public.play_challenges;
  v_creator public.pick_group_members;
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_attempt_count integer;
begin
  select * into v_challenge
  from public.play_challenges
  where code=upper(trim(coalesce(p_challenge_code,'')))
    and status='active'
    and expires_at>now();
  if not found then raise exception 'That challenge was not found or has expired.'; end if;

  if jsonb_typeof(coalesce(p_result,'{}'::jsonb)) not in ('object','array') then raise exception 'Challenge result must be JSON.'; end if;
  if jsonb_typeof(coalesce(p_metadata,'{}'::jsonb))<>'object' then raise exception 'Challenge metadata must be an object.'; end if;
  if pg_column_size(coalesce(p_result,'{}'::jsonb))>65536 then raise exception 'Challenge result is too large.'; end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(coalesce(p_group_code,'')));
  if not found then raise exception 'Profile group not found.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);
  if not found then raise exception 'Profile access expired. Sign in with your Picks PIN.'; end if;

  insert into public.play_challenge_attempts(
    challenge_id,responder_group_id,responder_member_id,result,score,metadata,completed_at
  ) values (
    v_challenge.id,v_group.id,v_member.id,coalesce(p_result,'{}'::jsonb),p_score,coalesce(p_metadata,'{}'::jsonb),now()
  )
  on conflict(challenge_id,responder_member_id) do update
  set result=excluded.result,
      score=excluded.score,
      metadata=excluded.metadata,
      completed_at=excluded.completed_at;

  select count(*) into v_attempt_count
  from public.play_challenge_attempts
  where challenge_id=v_challenge.id;

  update public.play_challenges
  set attempt_count=v_attempt_count
  where id=v_challenge.id;

  select * into v_creator from public.pick_group_members where id=v_challenge.creator_member_id;

  return jsonb_build_object(
    'ok',true,
    'challenge_code',v_challenge.code,
    'game_type',v_challenge.game_type,
    'game_version',v_challenge.game_version,
    'creator_name',v_creator.display_name,
    'responder_name',v_member.display_name,
    'setup',v_challenge.setup,
    'challenge_metadata',v_challenge.metadata,
    'creator_result',v_challenge.creator_result,
    'responder_result',coalesce(p_result,'{}'::jsonb),
    'responder_score',p_score,
    'response_metadata',coalesce(p_metadata,'{}'::jsonb),
    'attempt_count',v_attempt_count
  );
end;
$$;

-- Compatibility wrappers for clients that cached the original Keep/Cut-only code.
drop function if exists public.play_create_keep_cut_challenge(text,text,text,jsonb,jsonb);
create function public.play_create_keep_cut_challenge(
  p_group_code text,
  p_member_token text,
  p_pack_id text,
  p_lineup jsonb,
  p_result jsonb
)
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.play_create_challenge(
    'keep-cut','keep-cut-v1',p_group_code,p_member_token,
    jsonb_build_object('packId',coalesce(nullif(trim(p_pack_id),''),'ufc-careers'),'lineup',p_lineup),
    jsonb_build_object('decisions',p_result),
    '{}'::jsonb,365
  );
$$;

drop function if exists public.play_submit_keep_cut_challenge(text,text,text,jsonb);
create function public.play_submit_keep_cut_challenge(
  p_challenge_code text,
  p_group_code text,
  p_member_token text,
  p_result jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_response jsonb;
begin
  v_response:=public.play_submit_challenge(
    p_challenge_code,p_group_code,p_member_token,
    jsonb_build_object('decisions',p_result),null,'{}'::jsonb
  );
  return jsonb_build_object(
    'ok',v_response->'ok',
    'challenge_code',v_response->'challenge_code',
    'creator_name',v_response->'creator_name',
    'responder_name',v_response->'responder_name',
    'lineup',v_response->'setup'->'lineup',
    'creator_result',v_response->'creator_result'->'decisions',
    'responder_result',v_response->'responder_result'->'decisions'
  );
end;
$$;

-- Generic daily definition. The first caller creates the authoritative setup for that game/day.
drop function if exists public.play_daily_context(text);
drop function if exists public.play_daily_context(text,text,integer);
create function public.play_daily_context(
  p_game_type text,
  p_game_version text,
  p_max_score integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'')));
  v_version text:=trim(coalesce(p_game_version,'1'));
  v_max integer:=greatest(1,least(coalesce(p_max_score,5),1000));
  v_local timestamp:=timezone('America/Chicago',now());
  v_day date:=v_local::date;
  v_reset timestamptz:=((v_local::date+1)::timestamp at time zone 'America/Chicago');
  v_seed text:=encode(digest(v_game||'|'||v_day::text||'|'||v_version||'|daily-v2','sha256'),'hex');
  v_daily public.play_daily_challenges;
begin
  if v_game !~ '^[a-z0-9][a-z0-9-]{1,49}$' then raise exception 'Invalid daily game type.'; end if;
  if char_length(v_version) not between 1 and 80 then raise exception 'Invalid daily game version.'; end if;

  insert into public.play_daily_challenges(
    challenge_day,game_type,game_version,seed,setup,metadata,max_score
  ) values (
    v_day,v_game,v_version,v_seed,
    jsonb_build_object('seed',v_seed),
    jsonb_build_object('timezone','America/Chicago'),
    v_max
  )
  on conflict(challenge_day,game_type) do nothing;

  select * into v_daily
  from public.play_daily_challenges
  where challenge_day=v_day and game_type=v_game;

  return jsonb_build_object(
    'ok',true,
    'game_type',v_daily.game_type,
    'game_version',v_daily.game_version,
    'challenge_day',v_daily.challenge_day,
    'challenge_key',v_daily.game_type||':'||v_daily.challenge_day::text,
    'seed',v_daily.seed,
    'setup',v_daily.setup,
    'metadata',v_daily.metadata,
    'max_score',v_daily.max_score,
    'timezone','America/Chicago',
    'resets_at',v_reset
  );
end;
$$;

-- Compatibility overload used by older cached clients.
create function public.play_daily_context(p_game_type text default 'blind-resume')
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.play_daily_context(p_game_type,'blind-resume-v1',5);
$$;

drop function if exists public.play_submit_daily_attempt(text,text,text,integer,jsonb);
drop function if exists public.play_submit_daily_attempt(text,text,text,text,integer,jsonb,integer);
create function public.play_submit_daily_attempt(
  p_game_type text,
  p_game_version text,
  p_group_code text,
  p_member_token text,
  p_score integer,
  p_result jsonb,
  p_max_score integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'')));
  v_version text:=trim(coalesce(p_game_version,'1'));
  v_day date:=(timezone('America/Chicago',now()))::date;
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_daily public.play_daily_challenges;
  v_attempt public.play_daily_attempts;
  v_rank integer;
  v_total integer;
begin
  perform public.play_daily_context(v_game,v_version,p_max_score);

  select * into v_daily
  from public.play_daily_challenges
  where challenge_day=v_day and game_type=v_game;

  if v_daily.game_version<>v_version then
    raise exception 'Today''s daily challenge uses a different game version. Refresh the app.';
  end if;
  if p_score<0 or p_score>v_daily.max_score then
    raise exception 'Daily score must be between 0 and %.',v_daily.max_score;
  end if;
  if jsonb_typeof(coalesce(p_result,'{}'::jsonb)) not in ('object','array') then
    raise exception 'Daily result must be JSON.';
  end if;
  if pg_column_size(coalesce(p_result,'{}'::jsonb))>65536 then raise exception 'Daily result is too large.'; end if;

  select * into v_group
  from public.pick_groups
  where code=upper(trim(coalesce(p_group_code,'')));
  if not found then raise exception 'Profile group not found.'; end if;

  select * into v_member
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(coalesce(p_member_token,''),'sha256')
    and coalesce(is_active,true);
  if not found then raise exception 'Profile access expired. Sign in with your Picks PIN.'; end if;

  insert into public.play_daily_attempts(
    challenge_day,game_type,game_version,group_id,member_id,
    official_score,best_score,max_score,attempt_count,
    official_result,best_result,first_completed_at,latest_completed_at
  ) values (
    v_day,v_game,v_version,v_group.id,v_member.id,
    p_score,p_score,v_daily.max_score,1,
    coalesce(p_result,'{}'::jsonb),coalesce(p_result,'{}'::jsonb),now(),now()
  )
  on conflict(challenge_day,game_type,member_id) do update
  set best_score=greatest(public.play_daily_attempts.best_score,excluded.best_score),
      best_result=case when excluded.best_score>public.play_daily_attempts.best_score then excluded.best_result else public.play_daily_attempts.best_result end,
      max_score=excluded.max_score,
      game_version=excluded.game_version,
      attempt_count=public.play_daily_attempts.attempt_count+1,
      latest_completed_at=now()
  returning * into v_attempt;

  select 1+count(distinct official_score) into v_rank
  from public.play_daily_attempts
  where challenge_day=v_day and game_type=v_game and official_score>v_attempt.official_score;

  select count(*) into v_total
  from public.play_daily_attempts
  where challenge_day=v_day and game_type=v_game;

  return jsonb_build_object(
    'ok',true,
    'challenge_day',v_day,
    'game_type',v_game,
    'game_version',v_version,
    'max_score',v_attempt.max_score,
    'player',jsonb_build_object('display_name',v_member.display_name),
    'official_score',v_attempt.official_score,
    'best_score',v_attempt.best_score,
    'attempt_count',v_attempt.attempt_count,
    'rank',v_rank,
    'player_count',v_total,
    'first_completed_at',v_attempt.first_completed_at,
    'latest_completed_at',v_attempt.latest_completed_at
  );
end;
$$;

-- Compatibility overload used by older cached clients.
create function public.play_submit_daily_attempt(
  p_game_type text,
  p_group_code text,
  p_member_token text,
  p_score integer,
  p_result jsonb default '{}'::jsonb
)
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.play_submit_daily_attempt(
    p_game_type,'blind-resume-v1',p_group_code,p_member_token,p_score,p_result,5
  );
$$;

drop function if exists public.play_daily_leaderboard(text,date,integer);
create function public.play_daily_leaderboard(
  p_game_type text default 'blind-resume',
  p_challenge_day date default null,
  p_limit integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'blind-resume')));
  v_day date:=coalesce(p_challenge_day,(timezone('America/Chicago',now()))::date);
  v_limit integer:=greatest(1,least(coalesce(p_limit,50),100));
  v_rows jsonb;
  v_total integer;
  v_daily public.play_daily_challenges;
begin
  select * into v_daily
  from public.play_daily_challenges
  where challenge_day=v_day and game_type=v_game;

  with ranked as (
    select
      dense_rank() over(order by attempt.official_score desc) as rank,
      member.display_name,
      attempt.official_score,
      attempt.best_score,
      attempt.max_score,
      attempt.attempt_count,
      attempt.first_completed_at
    from public.play_daily_attempts attempt
    join public.pick_group_members member on member.id=attempt.member_id
    where attempt.challenge_day=v_day and attempt.game_type=v_game
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'rank',rank,
    'display_name',display_name,
    'official_score',official_score,
    'best_score',best_score,
    'max_score',max_score,
    'attempt_count',attempt_count
  ) order by rank,lower(display_name)),'[]'::jsonb)
  into v_rows
  from (select * from ranked order by rank,lower(display_name) limit v_limit) limited;

  select count(*) into v_total
  from public.play_daily_attempts
  where challenge_day=v_day and game_type=v_game;

  return jsonb_build_object(
    'ok',true,
    'challenge_day',v_day,
    'game_type',v_game,
    'game_version',v_daily.game_version,
    'max_score',coalesce(v_daily.max_score,5),
    'player_count',v_total,
    'rows',v_rows
  );
end;
$$;

grant execute on function public.play_identity_snapshot(text,text) to anon,authenticated;
grant execute on function public.play_create_challenge(text,text,text,text,jsonb,jsonb,jsonb,integer) to anon,authenticated;
grant execute on function public.play_get_challenge(text) to anon,authenticated;
grant execute on function public.play_submit_challenge(text,text,text,jsonb,numeric,jsonb) to anon,authenticated;
grant execute on function public.play_create_keep_cut_challenge(text,text,text,jsonb,jsonb) to anon,authenticated;
grant execute on function public.play_submit_keep_cut_challenge(text,text,text,jsonb) to anon,authenticated;
grant execute on function public.play_daily_context(text,text,integer) to anon,authenticated;
grant execute on function public.play_daily_context(text) to anon,authenticated;
grant execute on function public.play_submit_daily_attempt(text,text,text,text,integer,jsonb,integer) to anon,authenticated;
grant execute on function public.play_submit_daily_attempt(text,text,text,integer,jsonb) to anon,authenticated;
grant execute on function public.play_daily_leaderboard(text,date,integer) to anon,authenticated;