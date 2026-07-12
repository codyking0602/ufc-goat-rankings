-- UFC Picks social and retention layer.
-- Adds optional avatars, season awards, streaks, activity, share-card data, and reminder preferences.
-- Run after supabase/picks-commissioner-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists avatar_key text not null default 'gloves',
  add column if not exists reminder_opt_in boolean not null default false;

do $$
begin
  if not exists(select 1 from pg_constraint where conname='pick_group_members_avatar_key_check') then
    alter table public.pick_group_members
      add constraint pick_group_members_avatar_key_check
      check(avatar_key in ('gloves','crown','belt','fire','lightning','wolf','eagle','lion','shark','skull','star','target'));
  end if;
end $$;

create table if not exists public.pick_group_activity (
  id bigint generated always as identity primary key,
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  event_id text references public.pick_events(id) on delete set null,
  actor_member_id uuid references public.pick_group_members(id) on delete set null,
  activity_type text not null,
  headline text not null,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists pick_group_activity_group_created_idx
  on public.pick_group_activity(group_id,created_at desc);

alter table public.pick_group_activity enable row level security;
revoke all on public.pick_group_activity from anon,authenticated;

create or replace function public.picks_social_log_member_join()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  insert into public.pick_group_activity(group_id,actor_member_id,activity_type,headline,detail)
  values(new.group_id,new.id,'member_joined',new.display_name||' joined the group','The permanent roster grew.');
  return new;
end;
$$;

drop trigger if exists picks_social_member_join_trigger on public.pick_group_members;
create trigger picks_social_member_join_trigger
after insert on public.pick_group_members
for each row execute function public.picks_social_log_member_join();

create or replace function public.picks_social_log_member_change()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  if old.is_active and not new.is_active then
    insert into public.pick_group_activity(group_id,actor_member_id,activity_type,headline,detail)
    values(new.group_id,new.id,'member_removed',new.display_name||' left the active roster','Past picks and results remain in history.');
  elsif not old.is_active and new.is_active then
    insert into public.pick_group_activity(group_id,actor_member_id,activity_type,headline,detail)
    values(new.group_id,new.id,'member_restored',new.display_name||' returned to the roster','The member is active again.');
  end if;
  return new;
end;
$$;

drop trigger if exists picks_social_member_change_trigger on public.pick_group_members;
create trigger picks_social_member_change_trigger
after update of is_active on public.pick_group_members
for each row execute function public.picks_social_log_member_change();

create or replace function public.picks_social_log_group_event()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_name text;
begin
  select name into v_name from public.pick_events where id=new.event_id;
  insert into public.pick_group_activity(group_id,event_id,activity_type,headline,detail)
  values(new.group_id,new.event_id,'event_added',coalesce(v_name,'UFC event')||' joined the season','Picks are ready for the permanent group.');
  return new;
end;
$$;

drop trigger if exists picks_social_group_event_trigger on public.pick_group_events;
create trigger picks_social_group_event_trigger
after insert on public.pick_group_events
for each row execute function public.picks_social_log_group_event();

create or replace function public.picks_social_log_event_status()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  if new.status is distinct from old.status then
    insert into public.pick_group_activity(group_id,event_id,activity_type,headline,detail)
    select ge.group_id,new.id,
      case new.status when 'live' then 'event_live' when 'complete' then 'event_complete' else 'event_status' end,
      case new.status when 'live' then new.name||' is live' when 'complete' then new.name||' is final' else new.name||' is now '||new.status end,
      case new.status when 'complete' then 'Final standings and awards are ready.' else coalesce(new.subtitle,'') end
    from public.pick_group_events ge where ge.event_id=new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists picks_social_event_status_trigger on public.pick_events;
create trigger picks_social_event_status_trigger
after update of status on public.pick_events
for each row execute function public.picks_social_log_event_status();

create or replace function public.picks_social_log_fight_result()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_headline text; v_detail text;
begin
  if (new.result_status is distinct from old.result_status or new.winner_name is distinct from old.winner_name)
     and new.result_status<>'scheduled' then
    v_headline:=case
      when new.result_status='complete' then coalesce(new.winner_name,'Winner')||' won'
      when new.result_status='draw' then 'Fight ended in a draw'
      when new.result_status='no-contest' then 'Fight ruled a no contest'
      when new.result_status='cancelled' then 'Fight cancelled'
      else 'Fight updated'
    end;
    v_detail:=new.red_name||' vs. '||new.blue_name;
    insert into public.pick_group_activity(group_id,event_id,activity_type,headline,detail)
    select ge.group_id,new.event_id,'fight_result',v_headline,v_detail
    from public.pick_group_events ge where ge.event_id=new.event_id;
  end if;
  return new;
end;
$$;

drop trigger if exists picks_social_fight_result_trigger on public.pick_fights;
create trigger picks_social_fight_result_trigger
after update of result_status,winner_name on public.pick_fights
for each row execute function public.picks_social_log_fight_result();

create or replace function public.picks_social_log_season_start()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  insert into public.pick_group_activity(group_id,activity_type,headline,detail)
  values(new.group_id,'season_started',new.name||' started',new.correct_points||' point(s) per correct pick · +'||new.underdog_bonus||' Underdog Lock');
  return new;
end;
$$;

drop trigger if exists picks_social_season_start_trigger on public.pick_group_seasons;
create trigger picks_social_season_start_trigger
after insert on public.pick_group_seasons
for each row execute function public.picks_social_log_season_start();

create or replace function public.picks_social_log_group_change()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_owner_name text;
begin
  if new.name is distinct from old.name then
    insert into public.pick_group_activity(group_id,activity_type,headline,detail)
    values(new.id,'group_renamed','Group renamed to '||new.name,'Permanent link and history were preserved.');
  end if;
  if new.owner_member_id is distinct from old.owner_member_id and new.owner_member_id is not null then
    select display_name into v_owner_name from public.pick_group_members where id=new.owner_member_id;
    insert into public.pick_group_activity(group_id,actor_member_id,activity_type,headline,detail)
    values(new.id,new.owner_member_id,'commissioner_changed',coalesce(v_owner_name,'New owner')||' is the commissioner','Group control was transferred.');
  end if;
  return new;
end;
$$;

drop trigger if exists picks_social_group_change_trigger on public.pick_groups;
create trigger picks_social_group_change_trigger
after update of name,owner_member_id on public.pick_groups
for each row execute function public.picks_social_log_group_change();

create or replace function public.picks_social_update_profile(
  p_group_code text,
  p_member_token text,
  p_avatar_key text,
  p_reminder_opt_in boolean
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_member public.pick_group_members;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;
  select * into v_member from public.pick_group_members
  where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then raise exception 'Group access expired.'; end if;
  if p_avatar_key not in ('gloves','crown','belt','fire','lightning','wolf','eagle','lion','shark','skull','star','target') then
    raise exception 'Choose a valid avatar.';
  end if;
  update public.pick_group_members
  set avatar_key=p_avatar_key,reminder_opt_in=coalesce(p_reminder_opt_in,false)
  where id=v_member.id;
  return jsonb_build_object('saved',true,'member_id',v_member.id,'avatar_key',p_avatar_key,'reminder_opt_in',coalesce(p_reminder_opt_in,false));
end;
$$;

create or replace function public.picks_social_snapshot(
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
  v_me public.pick_group_members;
  v_season public.pick_group_seasons;
  v_members jsonb;
  v_latest jsonb;
  v_activity jsonb;
  v_past_champions jsonb;
  v_upcoming jsonb;
  v_latest_event_id text;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;

  select * into v_me from public.pick_group_members
  where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then raise exception 'Group access expired. Rejoin the group.'; end if;

  select * into v_season from public.pick_group_seasons
  where group_id=v_group.id and is_active order by starts_at desc limit 1;
  if not found then raise exception 'Active season not found.'; end if;

  with season_events as (
    select ge.event_id,ge.room_id,e.event_date,e.status
    from public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    where ge.group_id=v_group.id and ge.season_id=v_season.id
  ), pick_rows as (
    select gm.id member_id,se.event_id,se.event_date,f.bout_order,
      (f.winner_name=sel.fighter_name) is_correct,
      sel.is_underdog_lock is_lock,
      case when sel.fighter_name=f.red_name then f.red_odds when sel.fighter_name=f.blue_name then f.blue_odds else null end selected_odds
    from public.pick_group_members gm
    join public.pick_room_members rm on rm.group_member_id=gm.id
    join season_events se on se.room_id=rm.room_id
    join public.pick_selections sel on sel.member_id=rm.id
    join public.pick_fights f on f.id=sel.fight_id and f.result_status='complete' and f.winner_name is not null
    where gm.group_id=v_group.id
  ), member_base as (
    select gm.id,gm.display_name,gm.avatar_key,gm.is_active,
      count(pr.member_id)::integer picks_made,
      count(*) filter(where pr.is_correct)::integer correct,
      count(*) filter(where pr.is_lock)::integer lock_attempts,
      count(*) filter(where pr.is_lock and pr.is_correct)::integer lock_hits,
      count(*) filter(where pr.is_correct and coalesce(pr.selected_odds,0)>0)::integer upset_hits,
      max(pr.selected_odds) filter(where pr.is_correct and coalesce(pr.selected_odds,0)>0)::integer biggest_upset_odds
    from public.pick_group_members gm
    left join pick_rows pr on pr.member_id=gm.id
    where gm.group_id=v_group.id
    group by gm.id,gm.display_name,gm.avatar_key,gm.is_active
  ), event_scores as (
    select member_id,event_id,
      count(*) filter(where is_correct)::integer correct,
      count(*) filter(where is_correct and is_lock)::integer lock_hits
    from pick_rows group by member_id,event_id
  ), event_maxes as (
    select event_id,max(correct*v_season.correct_points+lock_hits*v_season.underdog_bonus)::integer max_score
    from event_scores group by event_id
  ), event_wins as (
    select es.member_id,count(*)::integer event_wins
    from event_scores es join event_maxes em on em.event_id=es.event_id
    where em.max_score>0 and es.correct*v_season.correct_points+es.lock_hits*v_season.underdog_bonus=em.max_score
    group by es.member_id
  ), sequenced as (
    select pr.*,
      sum(case when pr.is_correct then 0 else 1 end) over(partition by pr.member_id order by pr.event_date,pr.bout_order,pr.event_id) streak_group,
      row_number() over(partition by pr.member_id order by pr.event_date desc,pr.bout_order desc,pr.event_id desc) reverse_position
    from pick_rows pr
  ), best_streaks as (
    select member_id,max(streak_count)::integer best_streak
    from (
      select member_id,streak_group,count(*)::integer streak_count
      from sequenced where is_correct group by member_id,streak_group
    ) x group by member_id
  ), current_streaks as (
    select member_id,
      case when min(reverse_position) filter(where not is_correct) is null then count(*)
           else greatest(min(reverse_position) filter(where not is_correct)-1,0) end::integer current_streak
    from sequenced group by member_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',mb.id,'display_name',mb.display_name,'avatar_key',mb.avatar_key,'is_active',mb.is_active,
    'picks_made',mb.picks_made,'correct',mb.correct,
    'points',mb.correct*v_season.correct_points+mb.lock_hits*v_season.underdog_bonus,
    'accuracy',case when mb.picks_made>0 then round(100.0*mb.correct/mb.picks_made)::integer else 0 end,
    'lock_attempts',mb.lock_attempts,'lock_hits',mb.lock_hits,
    'lock_pct',case when mb.lock_attempts>0 then round(100.0*mb.lock_hits/mb.lock_attempts)::integer else 0 end,
    'upset_hits',mb.upset_hits,'biggest_upset_odds',mb.biggest_upset_odds,
    'event_wins',coalesce(ew.event_wins,0),'current_streak',coalesce(cs.current_streak,0),'best_streak',coalesce(bs.best_streak,0)
  ) order by (mb.correct*v_season.correct_points+mb.lock_hits*v_season.underdog_bonus) desc,coalesce(ew.event_wins,0) desc,mb.correct desc,mb.display_name),'[]'::jsonb)
  into v_members
  from member_base mb
  left join event_wins ew on ew.member_id=mb.id
  left join current_streaks cs on cs.member_id=mb.id
  left join best_streaks bs on bs.member_id=mb.id
  where mb.is_active or mb.picks_made>0;

  select ge.event_id into v_latest_event_id
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  where ge.group_id=v_group.id and ge.season_id=v_season.id and e.status='complete'
  order by e.event_date desc limit 1;

  if v_latest_event_id is not null then
    with event_scores as (
      select gm.id,gm.display_name,gm.avatar_key,
        count(*) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name)::integer correct,
        count(*) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name and sel.is_underdog_lock)::integer lock_hits,
        count(*) filter(where f.result_status='complete')::integer picks_made
      from public.pick_group_members gm
      join public.pick_room_members rm on rm.group_member_id=gm.id
      join public.pick_group_events ge on ge.room_id=rm.room_id and ge.event_id=v_latest_event_id
      left join public.pick_selections sel on sel.member_id=rm.id
      left join public.pick_fights f on f.id=sel.fight_id
      where gm.group_id=v_group.id
      group by gm.id,gm.display_name,gm.avatar_key
    ), scored as (
      select *,correct*v_season.correct_points+lock_hits*v_season.underdog_bonus score from event_scores
    ), max_score as (select max(score) value from scored)
    select jsonb_build_object(
      'event_id',e.id,'name',e.name,'subtitle',e.subtitle,'event_date',e.event_date,
      'top_score',coalesce((select value from max_score),0),
      'champions',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'display_name',s.display_name,'avatar_key',s.avatar_key,'score',s.score,'correct',s.correct,'picks_made',s.picks_made))
        from scored s,max_score m where s.score=m.value and m.value>0),'[]'::jsonb),
      'players',(select count(*) from scored where picks_made>0)
    ) into v_latest
    from public.pick_events e where e.id=v_latest_event_id;
  else
    v_latest:='null'::jsonb;
  end if;

  with past_scores as (
    select s.id season_id,s.name,s.ended_at,gm.id member_id,gm.display_name,gm.avatar_key,
      count(*) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name)*s.correct_points
      +count(*) filter(where f.result_status='complete' and f.winner_name=sel.fighter_name and sel.is_underdog_lock)*s.underdog_bonus points
    from public.pick_group_seasons s
    join public.pick_group_events ge on ge.season_id=s.id
    join public.pick_group_members gm on gm.group_id=s.group_id
    left join public.pick_room_members rm on rm.room_id=ge.room_id and rm.group_member_id=gm.id
    left join public.pick_selections sel on sel.member_id=rm.id
    left join public.pick_fights f on f.id=sel.fight_id
    where s.group_id=v_group.id and not s.is_active
    group by s.id,s.name,s.ended_at,s.correct_points,s.underdog_bonus,gm.id,gm.display_name,gm.avatar_key
  ), past_max as (
    select season_id,max(points) max_points from past_scores group by season_id
  ), winner_groups as (
    select ps.season_id,max(ps.name) name,max(ps.ended_at) ended_at,pm.max_points,
      jsonb_agg(jsonb_build_object('id',ps.member_id,'display_name',ps.display_name,'avatar_key',ps.avatar_key,'points',ps.points) order by ps.display_name) champions
    from past_scores ps join past_max pm on pm.season_id=ps.season_id
    where ps.points=pm.max_points and pm.max_points>0
    group by ps.season_id,pm.max_points
  )
  select coalesce(jsonb_agg(jsonb_build_object('season_id',season_id,'name',name,'ended_at',ended_at,'top_score',max_points,'champions',champions) order by ended_at desc),'[]'::jsonb)
  into v_past_champions from winner_groups;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',a.id,'type',a.activity_type,'headline',a.headline,'detail',a.detail,'created_at',a.created_at,
    'event_id',a.event_id,'event_name',e.name,
    'actor_id',a.actor_member_id,'actor_name',gm.display_name,'actor_avatar',gm.avatar_key
  ) order by a.created_at desc),'[]'::jsonb)
  into v_activity
  from (
    select * from public.pick_group_activity where group_id=v_group.id order by created_at desc limit 12
  ) a
  left join public.pick_events e on e.id=a.event_id
  left join public.pick_group_members gm on gm.id=a.actor_member_id;

  select jsonb_build_object(
    'event_id',e.id,'name',e.name,'subtitle',e.subtitle,'event_date',e.event_date,'status',e.status,'room_code',r.code
  ) into v_upcoming
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.season_id=v_season.id and e.status in ('upcoming','live')
  order by case when e.id=v_group.active_event_id then 0 else 1 end,e.event_date limit 1;

  return jsonb_build_object(
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'season',jsonb_build_object('id',v_season.id,'name',v_season.name,'starts_at',v_season.starts_at,'correct_points',v_season.correct_points,'underdog_bonus',v_season.underdog_bonus),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name,'avatar_key',v_me.avatar_key,'reminder_opt_in',v_me.reminder_opt_in),
    'members',v_members,
    'latest_completed_event',v_latest,
    'past_champions',v_past_champions,
    'activity',v_activity,
    'upcoming_event',case when v_upcoming is null then 'null'::jsonb else v_upcoming end
  );
end;
$$;

grant execute on function public.picks_social_update_profile(text,text,text,boolean) to anon,authenticated;
grant execute on function public.picks_social_snapshot(text,text) to anon,authenticated;

-- Give existing groups one clean starting activity without replaying old fights.
insert into public.pick_group_activity(group_id,activity_type,headline,detail,created_at)
select g.id,'social_launched','Social Hub unlocked','Awards, streaks, avatars, and group activity are now live.',now()
from public.pick_groups g
where not exists(
  select 1 from public.pick_group_activity a where a.group_id=g.id and a.activity_type='social_launched'
);
