-- UFC Play shared identity, friend challenges, and daily leaderboard.
-- Run after supabase/picks-member-pin-phase.sql.
-- Safe to rerun.

create extension if not exists pgcrypto;

create table if not exists public.play_challenges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  game_type text not null,
  creator_group_id uuid not null references public.pick_groups(id) on delete cascade,
  creator_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  pack_id text not null default 'ufc-careers',
  lineup jsonb not null,
  creator_result jsonb not null,
  attempt_count integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '365 days'),
  constraint play_challenges_code_format check (code ~ '^[A-Z2-9]{6}$'),
  constraint play_challenges_game_type check (game_type in ('keep-cut')),
  constraint play_challenges_lineup_array check (jsonb_typeof(lineup)='array'),
  constraint play_challenges_result_array check (jsonb_typeof(creator_result)='array')
);

create table if not exists public.play_challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.play_challenges(id) on delete cascade,
  responder_group_id uuid not null references public.pick_groups(id) on delete cascade,
  responder_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  result jsonb not null,
  completed_at timestamptz not null default now(),
  constraint play_challenge_attempts_result_array check (jsonb_typeof(result)='array'),
  constraint play_challenge_attempts_one_per_player unique (challenge_id,responder_member_id)
);

create table if not exists public.play_daily_attempts (
  challenge_day date not null,
  game_type text not null,
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  member_id uuid not null references public.pick_group_members(id) on delete cascade,
  official_score integer not null,
  best_score integer not null,
  attempt_count integer not null default 1,
  official_result jsonb not null default '{}'::jsonb,
  best_result jsonb not null default '{}'::jsonb,
  first_completed_at timestamptz not null default now(),
  latest_completed_at timestamptz not null default now(),
  primary key (challenge_day,game_type,member_id),
  constraint play_daily_attempts_game_type check (game_type in ('blind-resume')),
  constraint play_daily_attempts_score_range check (
    official_score between 0 and 5 and best_score between 0 and 5
  ),
  constraint play_daily_attempts_count_positive check (attempt_count >= 1)
);

create index if not exists play_challenges_creator_idx
  on public.play_challenges(creator_member_id,created_at desc);
create index if not exists play_challenge_attempts_challenge_idx
  on public.play_challenge_attempts(challenge_id,completed_at desc);
create index if not exists play_daily_attempts_board_idx
  on public.play_daily_attempts(challenge_day,game_type,official_score desc);

alter table public.play_challenges enable row level security;
alter table public.play_challenge_attempts enable row level security;
alter table public.play_daily_attempts enable row level security;

revoke all on public.play_challenges from anon,authenticated;
revoke all on public.play_challenge_attempts from anon,authenticated;
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

create or replace function public.play_create_keep_cut_challenge(
  p_group_code text,
  p_member_token text,
  p_pack_id text,
  p_lineup jsonb,
  p_result jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_code text;
  v_id uuid;
  v_try integer;
begin
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

  if jsonb_typeof(p_lineup)<>'array' or jsonb_array_length(p_lineup)<>8 then
    raise exception 'A Keep 4, Cut 4 challenge needs exactly eight fighters.';
  end if;

  if (select count(distinct value) from jsonb_array_elements_text(p_lineup))<>8 then
    raise exception 'Challenge fighters must be unique.';
  end if;

  if jsonb_typeof(p_result)<>'array' or jsonb_array_length(p_result)<>8 then
    raise exception 'Challenge decisions are incomplete.';
  end if;

  if exists(select 1 from jsonb_array_elements_text(p_result) value where value not in ('K','C')) then
    raise exception 'Challenge decisions must be Keep or Cut.';
  end if;

  if (select count(*) from jsonb_array_elements_text(p_result) value where value='K')<>4
     or (select count(*) from jsonb_array_elements_text(p_result) value where value='C')<>4 then
    raise exception 'A challenge must contain four keeps and four cuts.';
  end if;

  for v_try in 1..25 loop
    v_code:=public.play_random_code(6);
    begin
      insert into public.play_challenges(
        code,game_type,creator_group_id,creator_member_id,pack_id,lineup,creator_result
      ) values (
        v_code,'keep-cut',v_group.id,v_member.id,coalesce(nullif(trim(p_pack_id),''),'ufc-careers'),p_lineup,p_result
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
    'game_type','keep-cut',
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
      'pack_id',v_challenge.pack_id,
      'lineup',v_challenge.lineup,
      'creator_name',v_creator.display_name,
      'creator_group_code',v_group.code,
      'created_at',v_challenge.created_at
    )
  );
end;
$$;

create or replace function public.play_submit_keep_cut_challenge(
  p_challenge_code text,
  p_group_code text,
  p_member_token text,
  p_result jsonb
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
  v_matches integer;
begin
  select * into v_challenge
  from public.play_challenges
  where code=upper(trim(coalesce(p_challenge_code,'')))
    and game_type='keep-cut'
    and expires_at>now();

  if not found then raise exception 'That challenge was not found or has expired.'; end if;

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

  if jsonb_typeof(p_result)<>'array' or jsonb_array_length(p_result)<>8 then
    raise exception 'Your challenge decisions are incomplete.';
  end if;

  if exists(select 1 from jsonb_array_elements_text(p_result) value where value not in ('K','C')) then
    raise exception 'Challenge decisions must be Keep or Cut.';
  end if;

  if (select count(*) from jsonb_array_elements_text(p_result) value where value='K')<>4
     or (select count(*) from jsonb_array_elements_text(p_result) value where value='C')<>4 then
    raise exception 'Your result must contain four keeps and four cuts.';
  end if;

  insert into public.play_challenge_attempts(
    challenge_id,responder_group_id,responder_member_id,result,completed_at
  ) values (
    v_challenge.id,v_group.id,v_member.id,p_result,now()
  )
  on conflict(challenge_id,responder_member_id) do update
  set result=excluded.result,completed_at=excluded.completed_at;

  update public.play_challenges
  set attempt_count=(select count(*) from public.play_challenge_attempts where challenge_id=v_challenge.id)
  where id=v_challenge.id;

  select count(*) into v_matches
  from generate_series(0,7) index_value
  where v_challenge.creator_result->>index_value=p_result->>index_value;

  select * into v_creator from public.pick_group_members where id=v_challenge.creator_member_id;

  return jsonb_build_object(
    'ok',true,
    'challenge_code',v_challenge.code,
    'creator_name',v_creator.display_name,
    'responder_name',v_member.display_name,
    'lineup',v_challenge.lineup,
    'creator_result',v_challenge.creator_result,
    'responder_result',p_result,
    'matching_calls',v_matches,
    'different_calls',8-v_matches
  );
end;
$$;

create or replace function public.play_daily_context(p_game_type text default 'blind-resume')
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'blind-resume')));
  v_local timestamp:=timezone('America/Chicago',now());
  v_day date:=v_local::date;
  v_reset timestamptz:=((v_local::date+1)::timestamp at time zone 'America/Chicago');
  v_seed text;
begin
  if v_game<>'blind-resume' then raise exception 'Unsupported daily game.'; end if;
  v_seed:=encode(digest(v_game||'|'||v_day::text||'|daily-v1','sha256'),'hex');
  return jsonb_build_object(
    'ok',true,
    'game_type',v_game,
    'challenge_day',v_day,
    'challenge_key',v_game||':'||v_day::text,
    'seed',v_seed,
    'timezone','America/Chicago',
    'resets_at',v_reset
  );
end;
$$;

create or replace function public.play_submit_daily_attempt(
  p_game_type text,
  p_group_code text,
  p_member_token text,
  p_score integer,
  p_result jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_game text:=lower(trim(coalesce(p_game_type,'')));
  v_day date:=(timezone('America/Chicago',now()))::date;
  v_group public.pick_groups;
  v_member public.pick_group_members;
  v_attempt public.play_daily_attempts;
  v_rank integer;
  v_total integer;
begin
  if v_game<>'blind-resume' then raise exception 'Unsupported daily game.'; end if;
  if p_score<0 or p_score>5 then raise exception 'Daily score must be between 0 and 5.'; end if;

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
    challenge_day,game_type,group_id,member_id,official_score,best_score,attempt_count,
    official_result,best_result,first_completed_at,latest_completed_at
  ) values (
    v_day,v_game,v_group.id,v_member.id,p_score,p_score,1,
    coalesce(p_result,'{}'::jsonb),coalesce(p_result,'{}'::jsonb),now(),now()
  )
  on conflict(challenge_day,game_type,member_id) do update
  set best_score=greatest(public.play_daily_attempts.best_score,excluded.best_score),
      best_result=case when excluded.best_score>public.play_daily_attempts.best_score then excluded.best_result else public.play_daily_attempts.best_result end,
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

create or replace function public.play_daily_leaderboard(
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
begin
  if v_game<>'blind-resume' then raise exception 'Unsupported daily game.'; end if;

  with ranked as (
    select
      dense_rank() over(order by attempt.official_score desc) as rank,
      member.display_name,
      attempt.official_score,
      attempt.best_score,
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
    'player_count',v_total,
    'rows',v_rows
  );
end;
$$;

grant execute on function public.play_identity_snapshot(text,text) to anon,authenticated;
grant execute on function public.play_create_keep_cut_challenge(text,text,text,jsonb,jsonb) to anon,authenticated;
grant execute on function public.play_get_challenge(text) to anon,authenticated;
grant execute on function public.play_submit_keep_cut_challenge(text,text,text,jsonb) to anon,authenticated;
grant execute on function public.play_daily_context(text) to anon,authenticated;
grant execute on function public.play_submit_daily_attempt(text,text,text,integer,jsonb) to anon,authenticated;
grant execute on function public.play_daily_leaderboard(text,date,integer) to anon,authenticated;
