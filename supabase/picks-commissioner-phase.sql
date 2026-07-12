-- Picks commissioner controls and season management.
-- Run after picks-event-manager-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_group_members
  add column if not exists is_active boolean not null default true,
  add column if not exists removed_at timestamptz;

alter table public.pick_groups
  add column if not exists owner_member_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname='pick_groups_owner_member_fk'
  ) then
    alter table public.pick_groups
      add constraint pick_groups_owner_member_fk
      foreign key(owner_member_id) references public.pick_group_members(id) on delete set null;
  end if;
end $$;

create table if not exists public.pick_group_seasons (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.pick_groups(id) on delete cascade,
  name text not null,
  starts_at timestamptz not null default now(),
  ended_at timestamptz,
  correct_points integer not null default 1 check(correct_points between 1 and 5),
  underdog_bonus integer not null default 1 check(underdog_bonus between 0 and 5),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists pick_group_seasons_one_active
  on public.pick_group_seasons(group_id) where is_active;

alter table public.pick_group_events
  add column if not exists season_id uuid references public.pick_group_seasons(id) on delete restrict;

create table if not exists public.pick_group_owner_transfers (
  group_id uuid primary key references public.pick_groups(id) on delete cascade,
  target_member_id uuid not null references public.pick_group_members(id) on delete cascade,
  claim_code_hash bytea not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.pick_group_seasons enable row level security;
alter table public.pick_group_owner_transfers enable row level security;
revoke all on public.pick_group_seasons,public.pick_group_owner_transfers from anon,authenticated;

insert into public.pick_group_seasons(group_id,name,starts_at,is_active)
select g.id,'Season 1',g.created_at,true
from public.pick_groups g
where not exists(select 1 from public.pick_group_seasons s where s.group_id=g.id)
on conflict do nothing;

update public.pick_group_events ge
set season_id=s.id
from public.pick_group_seasons s
where ge.season_id is null
  and s.group_id=ge.group_id
  and s.is_active;

update public.pick_groups g
set owner_member_id=first_member.id
from lateral (
  select gm.id
  from public.pick_group_members gm
  where gm.group_id=g.id and gm.is_active
  order by gm.created_at,gm.id
  limit 1
) first_member
where g.owner_member_id is null;

create or replace function public.picks_group_bootstrap_season()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  insert into public.pick_group_seasons(group_id,name,starts_at,is_active)
  values(new.id,'Season 1',coalesce(new.created_at,now()),true)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists picks_group_bootstrap_season_trigger on public.pick_groups;
create trigger picks_group_bootstrap_season_trigger
after insert on public.pick_groups
for each row execute function public.picks_group_bootstrap_season();

create or replace function public.picks_group_set_first_owner()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  update public.pick_groups
  set owner_member_id=new.id
  where id=new.group_id and owner_member_id is null;
  return new;
end;
$$;

drop trigger if exists picks_group_set_first_owner_trigger on public.pick_group_members;
create trigger picks_group_set_first_owner_trigger
after insert on public.pick_group_members
for each row execute function public.picks_group_set_first_owner();

create or replace function public.picks_group_event_assign_season()
returns trigger
language plpgsql
security definer
set search_path=public,extensions
as $$
begin
  if new.season_id is null then
    select s.id into new.season_id
    from public.pick_group_seasons s
    where s.group_id=new.group_id and s.is_active
    order by s.starts_at desc
    limit 1;
  end if;
  if new.season_id is null then raise exception 'This group does not have an active season.'; end if;
  return new;
end;
$$;

drop trigger if exists picks_group_event_assign_season_trigger on public.pick_group_events;
create trigger picks_group_event_assign_season_trigger
before insert or update of group_id,season_id on public.pick_group_events
for each row execute function public.picks_group_event_assign_season();

create or replace function public.picks_group_public(p_group_code text)
returns jsonb
language sql
security definer
set search_path=public,extensions
as $$
  select jsonb_build_object(
    'code',g.code,
    'name',g.name,
    'active_event_id',g.active_event_id,
    'active_room_code',r.code,
    'event_name',e.name,
    'event_subtitle',e.subtitle,
    'event_status',e.status,
    'member_count',(select count(*) from public.pick_group_members gm where gm.group_id=g.id and gm.is_active)
  )
  from public.pick_groups g
  left join public.pick_group_events ge on ge.group_id=g.id and ge.event_id=g.active_event_id
  left join public.pick_rooms r on r.id=ge.room_id
  left join public.pick_events e on e.id=g.active_event_id
  where g.code=upper(trim(p_group_code));
$$;

create or replace function public.picks_group_add_event(
  p_group_code text,
  p_admin_token text,
  p_event_id text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_room public.pick_rooms;
  v_season public.pick_group_seasons;
  v_code text;
  v_attempt integer:=0;
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can add an event.'; end if;

  select * into v_season from public.pick_group_seasons
  where group_id=v_group.id and is_active
  order by starts_at desc limit 1;
  if not found then raise exception 'Start a season before adding an event.'; end if;

  if not exists(select 1 from public.pick_events where id=p_event_id and status in ('upcoming','live')) then
    raise exception 'That event is not available for picks.';
  end if;

  select r.* into v_room
  from public.pick_group_events ge join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=p_event_id;

  if v_room.id is null then
    loop
      v_attempt:=v_attempt+1;
      v_code:=upper(substr(encode(gen_random_bytes(6),'hex'),1,6));
      exit when not exists(select 1 from public.pick_rooms where code=v_code)
        and not exists(select 1 from public.pick_groups where code=v_code);
      if v_attempt>10 then raise exception 'Could not create the event room.'; end if;
    end loop;

    insert into public.pick_rooms(code,event_id,name,admin_token_hash,group_id)
    values(v_code,p_event_id,v_group.name,v_group.admin_token_hash,v_group.id)
    returning * into v_room;

    insert into public.pick_group_events(group_id,event_id,room_id,season_id)
    values(v_group.id,p_event_id,v_room.id,v_season.id);

    insert into public.pick_room_members(room_id,display_name,member_token_hash,group_member_id)
    select v_room.id,gm.display_name,gm.member_token_hash,gm.id
    from public.pick_group_members gm
    where gm.group_id=v_group.id and gm.is_active;
  end if;

  update public.pick_groups set active_event_id=p_event_id where id=v_group.id;
  update public.pick_events set admin_room_id=v_room.id where id=p_event_id and admin_room_id is null;

  return jsonb_build_object('saved',true,'group_code',v_group.code,'room_code',v_room.code,'event_id',p_event_id,'season_id',v_season.id);
end;
$$;

create or replace function public.picks_room_snapshot(
  p_room_code text,
  p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_me public.pick_room_members;
  v_is_result_admin boolean:=false;
  v_correct_points integer:=1;
  v_underdog_bonus integer:=1;
begin
  select * into v_room from public.pick_rooms where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;

  select * into v_me from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the group.'; end if;

  select admin_room_id=v_room.id into v_is_result_admin
  from public.pick_events where id=v_room.event_id;

  select coalesce(s.correct_points,1),coalesce(s.underdog_bonus,1)
  into v_correct_points,v_underdog_bonus
  from public.pick_group_events ge
  left join public.pick_group_seasons s on s.id=ge.season_id
  where ge.room_id=v_room.id;

  return jsonb_build_object(
    'room',jsonb_build_object(
      'id',v_room.id,'code',v_room.code,'name',v_room.name,'event_id',v_room.event_id,
      'is_result_admin',v_is_result_admin
    ),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'my_picks',coalesce((
      select jsonb_agg(jsonb_build_object(
        'fight_id',s.fight_id,'fighter_name',s.fighter_name,'is_underdog_lock',s.is_underdog_lock
      )) from public.pick_selections s where s.member_id=v_me.id
    ),'[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,
        'display_name',m.display_name,
        'picks_made',(select count(*) from public.pick_selections s where s.member_id=m.id),
        'correct',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name),
        'upset_bonus',(select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name),
        'score',(
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and f.result_status='complete' and f.winner_name=s.fighter_name)*v_correct_points
          +
          (select count(*) from public.pick_selections s join public.pick_fights f on f.id=s.fight_id where s.member_id=m.id and s.is_underdog_lock and f.result_status='complete' and f.winner_name=s.fighter_name)*v_underdog_bonus
        ),
        'visible_picks',coalesce((
          select jsonb_agg(jsonb_build_object(
            'fight_id',s2.fight_id,'fighter_name',s2.fighter_name,'is_underdog_lock',s2.is_underdog_lock
          ))
          from public.pick_selections s2
          join public.pick_fights f2 on f2.id=s2.fight_id
          where s2.member_id=m.id and (m.id=v_me.id or now()>=f2.lock_at or f2.result_status<>'scheduled')
        ),'[]'::jsonb)
      ) order by m.created_at)
      from public.pick_room_members m where m.room_id=v_room.id
    ),'[]'::jsonb)
  );
end;
$$;

create or replace function public.picks_group_snapshot(
  p_group_code text,
  p_member_token text,
  p_admin_token text default null
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
  v_active_room public.pick_rooms;
  v_members jsonb;
  v_events jsonb;
  v_available jsonb;
  v_past_seasons jsonb;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;

  select * into v_me from public.pick_group_members
  where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then raise exception 'Group access expired. Rejoin the group.'; end if;

  select * into v_season from public.pick_group_seasons
  where group_id=v_group.id and is_active
  order by starts_at desc limit 1;
  if not found then raise exception 'This group does not have an active season.'; end if;

  select r.* into v_active_room
  from public.pick_group_events ge join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=v_group.active_event_id and ge.season_id=v_season.id;

  with member_event_scores as (
    select
      gm.id group_member_id,
      gm.display_name,
      gm.is_active,
      ge.event_id,
      e.status event_status,
      count(s.fight_id)::integer picks_made,
      count(s.fight_id) filter(where f.result_status='complete' and f.winner_name=s.fighter_name)::integer correct,
      count(s.fight_id) filter(where f.result_status='complete' and f.winner_name=s.fighter_name and s.is_underdog_lock)::integer bonus
    from public.pick_group_members gm
    cross join public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    left join public.pick_room_members rm on rm.room_id=ge.room_id and rm.group_member_id=gm.id
    left join public.pick_selections s on s.member_id=rm.id
    left join public.pick_fights f on f.id=s.fight_id
    where gm.group_id=v_group.id and ge.group_id=v_group.id and ge.season_id=v_season.id
    group by gm.id,gm.display_name,gm.is_active,ge.event_id,e.status
  ), event_maxes as (
    select event_id,max(correct*v_season.correct_points+bonus*v_season.underdog_bonus) max_score
    from member_event_scores where event_status='complete' group by event_id
  ), member_totals as (
    select
      mes.group_member_id,
      max(mes.display_name) display_name,
      bool_or(mes.is_active) is_active,
      sum(mes.picks_made)::integer picks_made,
      sum(mes.correct)::integer correct,
      sum(mes.bonus)::integer lock_bonus,
      sum(mes.correct*v_season.correct_points+mes.bonus*v_season.underdog_bonus)::integer points,
      count(*) filter(where mes.picks_made>0)::integer events_played,
      count(*) filter(where mes.event_status='complete' and mes.picks_made>0 and em.max_score>0 and mes.correct*v_season.correct_points+mes.bonus*v_season.underdog_bonus=em.max_score)::integer event_wins
    from member_event_scores mes
    left join event_maxes em on em.event_id=mes.event_id
    group by mes.group_member_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',mt.group_member_id,'display_name',mt.display_name,'is_active',mt.is_active,
    'picks_made',mt.picks_made,'correct',mt.correct,'lock_bonus',mt.lock_bonus,
    'points',mt.points,'events_played',mt.events_played,'event_wins',mt.event_wins,
    'accuracy',case when mt.picks_made>0 then round(100.0*mt.correct/mt.picks_made)::integer else 0 end
  ) order by mt.points desc,mt.event_wins desc,mt.correct desc,mt.display_name),'[]'::jsonb)
  into v_members
  from member_totals mt
  where mt.is_active or mt.picks_made>0;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_id',e.id,'room_code',r.code,'name',e.name,'subtitle',e.subtitle,
    'event_date',e.event_date,'status',e.status,'is_active',e.id=v_group.active_event_id
  ) order by e.event_date desc),'[]'::jsonb)
  into v_events
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.season_id=v_season.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,'name',e.name,'subtitle',e.subtitle,'event_date',e.event_date,'status',e.status
  ) order by e.event_date),'[]'::jsonb)
  into v_available
  from public.pick_events e
  where e.status in ('upcoming','live')
    and not exists(select 1 from public.pick_group_events ge where ge.group_id=v_group.id and ge.event_id=e.id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',s.id,'name',s.name,'starts_at',s.starts_at,'ended_at',s.ended_at,
    'correct_points',s.correct_points,'underdog_bonus',s.underdog_bonus
  ) order by s.starts_at desc),'[]'::jsonb)
  into v_past_seasons
  from public.pick_group_seasons s
  where s.group_id=v_group.id and not s.is_active;

  return jsonb_build_object(
    'group',jsonb_build_object(
      'id',v_group.id,'code',v_group.code,'name',v_group.name,'active_event_id',v_group.active_event_id,
      'is_admin',coalesce(v_group.admin_token_hash=digest(p_admin_token,'sha256'),false),
      'owner_member_id',v_group.owner_member_id
    ),
    'season',jsonb_build_object(
      'id',v_season.id,'name',v_season.name,'starts_at',v_season.starts_at,
      'correct_points',v_season.correct_points,'underdog_bonus',v_season.underdog_bonus
    ),
    'past_seasons',v_past_seasons,
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'active_room',case when v_active_room.id is null then null else jsonb_build_object('code',v_active_room.code,'event_id',v_active_room.event_id) end,
    'members',v_members,'events',v_events,'available_events',v_available
  );
end;
$$;

create or replace function public.picks_commissioner_snapshot(
  p_group_code text,
  p_admin_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can open these controls.'; end if;

  return jsonb_build_object(
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name,'owner_member_id',v_group.owner_member_id),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',gm.id,'display_name',gm.display_name,'is_active',gm.is_active,
        'is_owner',gm.id=v_group.owner_member_id,'created_at',gm.created_at,'removed_at',gm.removed_at
      ) order by gm.is_active desc,gm.created_at)
      from public.pick_group_members gm where gm.group_id=v_group.id
    ),'[]'::jsonb),
    'seasons',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',s.id,'name',s.name,'starts_at',s.starts_at,'ended_at',s.ended_at,
        'correct_points',s.correct_points,'underdog_bonus',s.underdog_bonus,'is_active',s.is_active,
        'event_count',(select count(*) from public.pick_group_events ge where ge.season_id=s.id)
      ) order by s.starts_at desc)
      from public.pick_group_seasons s where s.group_id=v_group.id
    ),'[]'::jsonb),
    'events',coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_id',e.id,'name',e.name,'subtitle',e.subtitle,'status',e.status,'event_date',e.event_date,
        'room_code',r.code,'season_id',ge.season_id,
        'fights',coalesce((select jsonb_agg(jsonb_build_object(
          'id',f.id,'order',f.bout_order,'red',f.red_name,'blue',f.blue_name,
          'red_odds',f.red_odds,'blue_odds',f.blue_odds,'result_status',f.result_status,'winner',f.winner_name
        ) order by f.bout_order) from public.pick_fights f where f.event_id=e.id),'[]'::jsonb)
      ) order by e.event_date desc)
      from public.pick_group_events ge
      join public.pick_events e on e.id=ge.event_id
      join public.pick_rooms r on r.id=ge.room_id
      where ge.group_id=v_group.id
    ),'[]'::jsonb),
    'pending_transfer',(
      select jsonb_build_object('target_member_id',t.target_member_id,'target_name',gm.display_name,'expires_at',t.expires_at)
      from public.pick_group_owner_transfers t
      join public.pick_group_members gm on gm.id=t.target_member_id
      where t.group_id=v_group.id and t.expires_at>now()
    )
  );
end;
$$;

create or replace function public.picks_commissioner_rename_group(
  p_group_code text,p_admin_token text,p_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can rename the group.'; end if;
  if char_length(trim(coalesce(p_name,''))) not between 2 and 50 then raise exception 'Enter a group name between 2 and 50 characters.'; end if;
  update public.pick_groups set name=trim(p_name) where id=v_group.id;
  update public.pick_rooms set name=trim(p_name) where group_id=v_group.id;
  return jsonb_build_object('saved',true,'name',trim(p_name));
end;
$$;

create or replace function public.picks_commissioner_remove_member(
  p_group_code text,p_admin_token text,p_member_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_member public.pick_group_members; v_hash bytea;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can remove members.'; end if;
  select * into v_member from public.pick_group_members where id=p_member_id and group_id=v_group.id;
  if not found then raise exception 'Member not found.'; end if;
  if v_member.id=v_group.owner_member_id then raise exception 'Transfer ownership before removing the commissioner.'; end if;
  if not v_member.is_active then raise exception 'That member is already inactive.'; end if;
  v_hash:=digest(encode(gen_random_bytes(24),'hex'),'sha256');
  update public.pick_group_members set is_active=false,removed_at=now(),member_token_hash=v_hash where id=v_member.id;
  update public.pick_room_members set member_token_hash=v_hash where group_member_id=v_member.id;
  return jsonb_build_object('removed',true,'member_id',v_member.id,'display_name',v_member.display_name);
end;
$$;

create or replace function public.picks_commissioner_begin_transfer(
  p_group_code text,p_admin_token text,p_target_member_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_target public.pick_group_members; v_code text; v_expires timestamptz:=now()+interval '30 minutes';
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can transfer ownership.'; end if;
  select * into v_target from public.pick_group_members where id=p_target_member_id and group_id=v_group.id and is_active;
  if not found then raise exception 'Choose an active group member.'; end if;
  if v_target.id=v_group.owner_member_id then raise exception 'That member is already the commissioner.'; end if;
  v_code:=upper(substr(encode(gen_random_bytes(8),'hex'),1,8));
  insert into public.pick_group_owner_transfers(group_id,target_member_id,claim_code_hash,expires_at)
  values(v_group.id,v_target.id,digest(v_code,'sha256'),v_expires)
  on conflict(group_id) do update set target_member_id=excluded.target_member_id,claim_code_hash=excluded.claim_code_hash,expires_at=excluded.expires_at,created_at=now();
  return jsonb_build_object('started',true,'claim_code',v_code,'target_member_id',v_target.id,'target_name',v_target.display_name,'expires_at',v_expires);
end;
$$;

create or replace function public.picks_commissioner_transfer_status(
  p_group_code text,p_member_token text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_member public.pick_group_members; v_transfer public.pick_group_owner_transfers;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then return jsonb_build_object('pending',false); end if;
  select * into v_member from public.pick_group_members where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then return jsonb_build_object('pending',false); end if;
  select * into v_transfer from public.pick_group_owner_transfers where group_id=v_group.id and target_member_id=v_member.id and expires_at>now();
  return jsonb_build_object('pending',found,'expires_at',case when found then v_transfer.expires_at else null end);
end;
$$;

create or replace function public.picks_claim_group_ownership(
  p_group_code text,p_member_token text,p_claim_code text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_member public.pick_group_members; v_transfer public.pick_group_owner_transfers; v_admin_token text:=encode(gen_random_bytes(24),'hex'); v_hash bytea;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;
  select * into v_member from public.pick_group_members where group_id=v_group.id and member_token_hash=digest(p_member_token,'sha256') and is_active;
  if not found then raise exception 'Group access expired.'; end if;
  select * into v_transfer from public.pick_group_owner_transfers
  where group_id=v_group.id and target_member_id=v_member.id and expires_at>now()
    and claim_code_hash=digest(upper(trim(p_claim_code)),'sha256');
  if not found then raise exception 'That transfer code is invalid or expired.'; end if;
  v_hash:=digest(v_admin_token,'sha256');
  update public.pick_groups set owner_member_id=v_member.id,admin_token_hash=v_hash where id=v_group.id;
  update public.pick_rooms set admin_token_hash=v_hash where group_id=v_group.id;
  delete from public.pick_group_owner_transfers where group_id=v_group.id;
  return jsonb_build_object(
    'claimed',true,'group_code',v_group.code,'admin_token',v_admin_token,
    'room_codes',coalesce((select jsonb_agg(r.code) from public.pick_rooms r where r.group_id=v_group.id),'[]'::jsonb)
  );
end;
$$;

create or replace function public.picks_commissioner_update_season(
  p_group_code text,p_admin_token text,p_season_name text,p_correct_points integer,p_underdog_bonus integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_season public.pick_group_seasons;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can change season settings.'; end if;
  select * into v_season from public.pick_group_seasons where group_id=v_group.id and is_active;
  if not found then raise exception 'Active season not found.'; end if;
  if exists(
    select 1 from public.pick_selections s
    join public.pick_room_members rm on rm.id=s.member_id
    join public.pick_group_events ge on ge.room_id=rm.room_id
    where ge.season_id=v_season.id
  ) then raise exception 'Scoring is locked after the first pick. Start a new season to change it.'; end if;
  if char_length(trim(coalesce(p_season_name,''))) not between 2 and 40 then raise exception 'Enter a season name between 2 and 40 characters.'; end if;
  if p_correct_points not between 1 and 5 or p_underdog_bonus not between 0 and 5 then raise exception 'Scoring values are outside the allowed range.'; end if;
  update public.pick_group_seasons set name=trim(p_season_name),correct_points=p_correct_points,underdog_bonus=p_underdog_bonus where id=v_season.id;
  return jsonb_build_object('saved',true,'season_id',v_season.id);
end;
$$;

create or replace function public.picks_commissioner_start_season(
  p_group_code text,p_admin_token text,p_name text,p_correct_points integer,p_underdog_bonus integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_season public.pick_group_seasons;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can start a season.'; end if;
  if char_length(trim(coalesce(p_name,''))) not between 2 and 40 then raise exception 'Enter a season name between 2 and 40 characters.'; end if;
  if p_correct_points not between 1 and 5 or p_underdog_bonus not between 0 and 5 then raise exception 'Scoring values are outside the allowed range.'; end if;
  update public.pick_group_seasons set is_active=false,ended_at=now() where group_id=v_group.id and is_active;
  insert into public.pick_group_seasons(group_id,name,correct_points,underdog_bonus,is_active)
  values(v_group.id,trim(p_name),p_correct_points,p_underdog_bonus,true)
  returning * into v_season;
  update public.pick_groups set active_event_id=null where id=v_group.id;
  return jsonb_build_object('started',true,'season_id',v_season.id,'name',v_season.name);
end;
$$;

create or replace function public.picks_commissioner_reopen_event(
  p_group_code text,p_admin_token text,p_event_id text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_event public.pick_events; v_room public.pick_rooms; v_season public.pick_group_seasons;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can reopen an event.'; end if;
  select e.*,r.id,r.code into v_event,v_room
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id and ge.event_id=p_event_id;
  if not found then raise exception 'Event not found in this group.'; end if;
  if v_event.status<>'complete' then raise exception 'Only a completed event can be reopened.'; end if;
  update public.pick_events set status='live' where id=v_event.id;
  select s.* into v_season from public.pick_group_events ge join public.pick_group_seasons s on s.id=ge.season_id where ge.group_id=v_group.id and ge.event_id=v_event.id;
  if v_season.is_active then update public.pick_groups set active_event_id=v_event.id where id=v_group.id; end if;
  return jsonb_build_object('reopened',true,'event_id',v_event.id,'room_code',v_room.code);
end;
$$;

create or replace function public.picks_commissioner_update_odds(
  p_group_code text,p_admin_token text,p_fight_id text,p_red_odds integer,p_blue_odds integer
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare v_group public.pick_groups; v_fight public.pick_fights;
begin
  select * into v_group from public.pick_groups where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can correct odds.'; end if;
  select f.* into v_fight
  from public.pick_fights f
  join public.pick_group_events ge on ge.event_id=f.event_id
  where f.id=p_fight_id and ge.group_id=v_group.id;
  if not found then raise exception 'Fight not found in this group.'; end if;
  update public.pick_fights
  set red_odds=p_red_odds,blue_odds=p_blue_odds,odds_source='Commissioner correction',odds_updated_at=now()
  where id=v_fight.id;
  return jsonb_build_object('saved',true,'fight_id',v_fight.id);
end;
$$;

grant execute on function public.picks_group_public(text) to anon,authenticated;
grant execute on function public.picks_group_add_event(text,text,text) to anon,authenticated;
grant execute on function public.picks_room_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_group_snapshot(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_rename_group(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_remove_member(text,text,uuid) to anon,authenticated;
grant execute on function public.picks_commissioner_begin_transfer(text,text,uuid) to anon,authenticated;
grant execute on function public.picks_commissioner_transfer_status(text,text) to anon,authenticated;
grant execute on function public.picks_claim_group_ownership(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_update_season(text,text,text,integer,integer) to anon,authenticated;
grant execute on function public.picks_commissioner_start_season(text,text,text,integer,integer) to anon,authenticated;
grant execute on function public.picks_commissioner_reopen_event(text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_update_odds(text,text,text,integer,integer) to anon,authenticated;
