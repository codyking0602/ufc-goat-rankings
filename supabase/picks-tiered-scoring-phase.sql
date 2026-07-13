-- Tiered UFC Picks scoring from UFC Oklahoma City forward.
-- Past events keep their original 1-point scoring. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_events
  add column if not exists scoring_version text;

update public.pick_events
set scoring_version='legacy-v1'
where scoring_version is null
  and event_date < '2026-07-18 00:00:00-05'::timestamptz;

update public.pick_events
set scoring_version='tiered-v1'
where scoring_version is null;

alter table public.pick_events
  alter column scoring_version set default 'tiered-v1';

alter table public.pick_events
  alter column scoring_version set not null;

do $$
begin
  if not exists(
    select 1 from pg_constraint
    where conname='pick_events_scoring_version_check'
  ) then
    alter table public.pick_events
      add constraint pick_events_scoring_version_check
      check(scoring_version in ('legacy-v1','tiered-v1'));
  end if;
end $$;

create or replace function public.picks_tiered_lock_bonus(p_odds integer)
returns integer
language sql
immutable
as $$
  select case
    when coalesce(p_odds,0)>=400 then 7
    when coalesce(p_odds,0)>=350 then 6
    when coalesce(p_odds,0)>=300 then 5
    when coalesce(p_odds,0)>=250 then 4
    when coalesce(p_odds,0)>=200 then 3
    when coalesce(p_odds,0)>=150 then 2
    when coalesce(p_odds,0)>=100 then 1
    else 0
  end;
$$;

create or replace function public.picks_selected_odds(
  p_fighter_name text,
  p_red_name text,
  p_blue_name text,
  p_red_odds integer,
  p_blue_odds integer
)
returns integer
language sql
immutable
as $$
  select case
    when p_fighter_name=p_red_name then p_red_odds
    when p_fighter_name=p_blue_name then p_blue_odds
    else null
  end;
$$;

create or replace function public.picks_correct_pick_points(
  p_scoring_version text,
  p_legacy_points integer
)
returns integer
language sql
immutable
as $$
  select case
    when p_scoring_version='tiered-v1' then 4
    else greatest(coalesce(p_legacy_points,1),0)
  end;
$$;

create or replace function public.picks_lock_bonus_points(
  p_scoring_version text,
  p_is_underdog_lock boolean,
  p_selected_odds integer,
  p_legacy_bonus integer
)
returns integer
language sql
immutable
as $$
  select case
    when not coalesce(p_is_underdog_lock,false) then 0
    when p_scoring_version='tiered-v1' then public.picks_tiered_lock_bonus(p_selected_odds)
    else greatest(coalesce(p_legacy_bonus,1),0)
  end;
$$;

create or replace function public.picks_public_events()
returns jsonb
language sql
security definer
set search_path=public,extensions
as $$
  select coalesce(jsonb_agg(event_json order by (event_json->>'eventDate')::timestamptz),'[]'::jsonb)
  from (
    select jsonb_build_object(
      'id',e.id,
      'name',e.name,
      'subtitle',e.subtitle,
      'eventType',e.event_type,
      'eventDate',e.event_date,
      'location',e.location,
      'cardRule',e.card_rule,
      'status',e.status,
      'sourceNote',e.source_note,
      'scoringVersion',e.scoring_version,
      'correctPickPoints',case when e.scoring_version='tiered-v1' then 4 else 1 end,
      'fights',coalesce((
        select jsonb_agg(jsonb_build_object(
          'id',f.id,
          'order',f.bout_order,
          'cardSection',f.card_section,
          'weightClass',f.weight_class,
          'red',f.red_name,
          'blue',f.blue_name,
          'lockAt',f.lock_at,
          'winner',case when f.result_status='complete' then f.winner_name else null end,
          'resultStatus',f.result_status,
          'redOdds',f.red_odds,
          'blueOdds',f.blue_odds,
          'redLockBonus',case when e.scoring_version='tiered-v1' then public.picks_tiered_lock_bonus(f.red_odds) else 1 end,
          'blueLockBonus',case when e.scoring_version='tiered-v1' then public.picks_tiered_lock_bonus(f.blue_odds) else 1 end,
          'oddsSource',f.odds_source,
          'oddsUpdatedAt',f.odds_updated_at
        ) order by f.bout_order)
        from public.pick_fights f
        where f.event_id=e.id and f.result_status<>'cancelled'
      ),'[]'::jsonb)
    ) event_json
    from public.pick_events e
    where e.status in ('upcoming','live','complete')
  ) visible_events;
$$;

create or replace function public.picks_set_underdog_lock(
  p_room_code text,
  p_member_token text,
  p_fight_id text,
  p_fighter_name text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_fight public.pick_fights;
  v_scoring_version text:='legacy-v1';
  v_legacy_bonus integer:=1;
  v_odds integer;
  v_bonus integer:=0;
begin
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;

  select * into v_member
  from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the group.'; end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;
  if not found or v_fight.result_status<>'scheduled' or now()>=v_fight.lock_at then
    raise exception 'That fight is locked.';
  end if;

  select e.scoring_version into v_scoring_version
  from public.pick_events e where e.id=v_room.event_id;
  v_scoring_version:=coalesce(v_scoring_version,'legacy-v1');

  select s.underdog_bonus into v_legacy_bonus
  from public.pick_group_events ge
  join public.pick_group_seasons s on s.id=ge.season_id
  where ge.room_id=v_room.id;
  v_legacy_bonus:=coalesce(v_legacy_bonus,1);

  if p_fighter_name=v_fight.red_name then v_odds:=v_fight.red_odds;
  elsif p_fighter_name=v_fight.blue_name then v_odds:=v_fight.blue_odds;
  else raise exception 'Invalid fighter selection.';
  end if;

  if public.picks_tiered_lock_bonus(v_odds)=0 then
    raise exception 'The Underdog Lock must be used on a betting underdog.';
  end if;

  if not exists(
    select 1 from public.pick_selections
    where member_id=v_member.id and fight_id=v_fight.id and fighter_name=p_fighter_name
  ) then
    raise exception 'Pick that fighter before setting the Underdog Lock.';
  end if;

  update public.pick_selections
  set is_underdog_lock=false
  where member_id=v_member.id;

  update public.pick_selections
  set is_underdog_lock=true
  where member_id=v_member.id
    and fight_id=v_fight.id
    and fighter_name=p_fighter_name;

  v_bonus:=public.picks_lock_bonus_points(v_scoring_version,true,v_odds,v_legacy_bonus);

  return jsonb_build_object(
    'saved',true,
    'fight_id',v_fight.id,
    'fighter_name',p_fighter_name,
    'is_underdog_lock',true,
    'lock_bonus_points',v_bonus
  );
end;
$$;

create or replace function public.picks_commissioner_set_member_pick(
  p_room_code text,
  p_admin_token text,
  p_member_id uuid,
  p_fight_id text,
  p_fighter_name text default null,
  p_is_underdog_lock boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_room public.pick_rooms;
  v_member public.pick_room_members;
  v_fight public.pick_fights;
  v_fighter text:=nullif(trim(coalesce(p_fighter_name,'')),'');
  v_scoring_version text:='legacy-v1';
  v_legacy_bonus integer:=1;
  v_odds integer;
  v_bonus integer:=0;
begin
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code))
    and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the commissioner can edit member picks.'; end if;

  select * into v_member
  from public.pick_room_members
  where id=p_member_id and room_id=v_room.id;
  if not found then raise exception 'Member not found in this event.'; end if;

  select * into v_fight
  from public.pick_fights
  where id=p_fight_id and event_id=v_room.event_id;
  if not found then raise exception 'Fight not found in this event.'; end if;

  if v_fighter is null then
    delete from public.pick_selections
    where member_id=v_member.id and fight_id=v_fight.id;
    return jsonb_build_object('saved',true,'removed',true,'member_id',v_member.id,'fight_id',v_fight.id);
  end if;

  if v_fighter not in (v_fight.red_name,v_fight.blue_name) then
    raise exception 'Invalid fighter selection.';
  end if;

  select e.scoring_version into v_scoring_version
  from public.pick_events e where e.id=v_room.event_id;
  v_scoring_version:=coalesce(v_scoring_version,'legacy-v1');

  select s.underdog_bonus into v_legacy_bonus
  from public.pick_group_events ge
  join public.pick_group_seasons s on s.id=ge.season_id
  where ge.room_id=v_room.id;
  v_legacy_bonus:=coalesce(v_legacy_bonus,1);

  v_odds:=public.picks_selected_odds(
    v_fighter,v_fight.red_name,v_fight.blue_name,v_fight.red_odds,v_fight.blue_odds
  );

  if coalesce(p_is_underdog_lock,false) then
    if public.picks_tiered_lock_bonus(v_odds)=0 then
      raise exception 'The Underdog Lock must be assigned to the betting underdog.';
    end if;
    update public.pick_selections
    set is_underdog_lock=false
    where member_id=v_member.id;
  end if;

  insert into public.pick_selections(member_id,fight_id,fighter_name,picked_at,is_underdog_lock)
  values(v_member.id,v_fight.id,v_fighter,now(),coalesce(p_is_underdog_lock,false))
  on conflict(member_id,fight_id) do update set
    fighter_name=excluded.fighter_name,
    picked_at=excluded.picked_at,
    is_underdog_lock=excluded.is_underdog_lock;

  v_bonus:=public.picks_lock_bonus_points(
    v_scoring_version,coalesce(p_is_underdog_lock,false),v_odds,v_legacy_bonus
  );

  return jsonb_build_object(
    'saved',true,
    'member_id',v_member.id,
    'fight_id',v_fight.id,
    'fighter_name',v_fighter,
    'is_underdog_lock',coalesce(p_is_underdog_lock,false),
    'lock_bonus_points',v_bonus
  );
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
  v_scoring_version text:='legacy-v1';
  v_correct_points integer:=1;
  v_bonus_points integer:=1;
begin
  select * into v_room
  from public.pick_rooms
  where code=upper(trim(p_room_code));
  if not found then raise exception 'Room not found.'; end if;

  select * into v_me
  from public.pick_room_members
  where room_id=v_room.id and member_token_hash=digest(p_member_token,'sha256');
  if not found then raise exception 'Room access expired. Rejoin the group.'; end if;

  select e.admin_room_id=v_room.id,e.scoring_version
  into v_is_result_admin,v_scoring_version
  from public.pick_events e
  where e.id=v_room.event_id;
  v_scoring_version:=coalesce(v_scoring_version,'legacy-v1');

  select s.correct_points,s.underdog_bonus
  into v_correct_points,v_bonus_points
  from public.pick_group_events ge
  join public.pick_group_seasons s on s.id=ge.season_id
  where ge.room_id=v_room.id;
  v_correct_points:=coalesce(v_correct_points,1);
  v_bonus_points:=coalesce(v_bonus_points,1);

  return jsonb_build_object(
    'room',jsonb_build_object(
      'id',v_room.id,
      'code',v_room.code,
      'name',v_room.name,
      'event_id',v_room.event_id,
      'is_result_admin',v_is_result_admin,
      'scoring_version',v_scoring_version
    ),
    'scoring',jsonb_build_object(
      'version',v_scoring_version,
      'correct_pick_points',public.picks_correct_pick_points(v_scoring_version,v_correct_points),
      'lock_bonus_min',case when v_scoring_version='tiered-v1' then 1 else v_bonus_points end,
      'lock_bonus_max',case when v_scoring_version='tiered-v1' then 7 else v_bonus_points end
    ),
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'my_picks',coalesce((
      select jsonb_agg(jsonb_build_object(
        'fight_id',s.fight_id,
        'fighter_name',s.fighter_name,
        'is_underdog_lock',s.is_underdog_lock,
        'lock_bonus_points',public.picks_lock_bonus_points(
          v_scoring_version,
          s.is_underdog_lock,
          public.picks_selected_odds(s.fighter_name,f.red_name,f.blue_name,f.red_odds,f.blue_odds),
          v_bonus_points
        )
      ))
      from public.pick_selections s
      join public.pick_fights f on f.id=s.fight_id
      where s.member_id=v_me.id
    ),'[]'::jsonb),
    'members',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',m.id,
        'display_name',m.display_name,
        'picks_made',(
          select count(*) from public.pick_selections s where s.member_id=m.id
        ),
        'correct',(
          select count(*)
          from public.pick_selections s
          join public.pick_fights f on f.id=s.fight_id
          where s.member_id=m.id
            and f.result_status='complete'
            and f.winner_name=s.fighter_name
        ),
        'upset_bonus',coalesce((
          select sum(public.picks_lock_bonus_points(
            v_scoring_version,
            s.is_underdog_lock,
            public.picks_selected_odds(s.fighter_name,f.red_name,f.blue_name,f.red_odds,f.blue_odds),
            v_bonus_points
          ))::integer
          from public.pick_selections s
          join public.pick_fights f on f.id=s.fight_id
          where s.member_id=m.id
            and f.result_status='complete'
            and f.winner_name=s.fighter_name
        ),0),
        'score',coalesce((
          select sum(
            public.picks_correct_pick_points(v_scoring_version,v_correct_points)
            +public.picks_lock_bonus_points(
              v_scoring_version,
              s.is_underdog_lock,
              public.picks_selected_odds(s.fighter_name,f.red_name,f.blue_name,f.red_odds,f.blue_odds),
              v_bonus_points
            )
          )::integer
          from public.pick_selections s
          join public.pick_fights f on f.id=s.fight_id
          where s.member_id=m.id
            and f.result_status='complete'
            and f.winner_name=s.fighter_name
        ),0),
        'visible_picks',coalesce((
          select jsonb_agg(jsonb_build_object(
            'fight_id',s2.fight_id,
            'fighter_name',s2.fighter_name,
            'is_underdog_lock',s2.is_underdog_lock,
            'lock_bonus_points',public.picks_lock_bonus_points(
              v_scoring_version,
              s2.is_underdog_lock,
              public.picks_selected_odds(s2.fighter_name,f2.red_name,f2.blue_name,f2.red_odds,f2.blue_odds),
              v_bonus_points
            )
          ))
          from public.pick_selections s2
          join public.pick_fights f2 on f2.id=s2.fight_id
          where s2.member_id=m.id
            and (m.id=v_me.id or now()>=f2.lock_at or f2.result_status<>'scheduled')
        ),'[]'::jsonb)
      ) order by m.created_at)
      from public.pick_room_members m
      where m.room_id=v_room.id
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
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code));
  if not found then raise exception 'Group not found.'; end if;

  select * into v_me
  from public.pick_group_members
  where group_id=v_group.id
    and member_token_hash=digest(p_member_token,'sha256')
    and is_active;
  if not found then raise exception 'Group access expired. Rejoin the group.'; end if;

  select * into v_season
  from public.pick_group_seasons
  where group_id=v_group.id and is_active
  order by starts_at desc limit 1;
  if not found then raise exception 'This group does not have an active season.'; end if;

  select r.* into v_active_room
  from public.pick_group_events ge
  join public.pick_rooms r on r.id=ge.room_id
  join public.pick_events e on e.id=ge.event_id
  where ge.group_id=v_group.id
    and ge.event_id=v_group.active_event_id
    and ge.season_id=v_season.id
    and e.status in ('upcoming','live');

  with season_events as (
    select
      ge.event_id,
      ge.room_id,
      e.status event_status,
      e.scoring_version
    from public.pick_group_events ge
    join public.pick_events e on e.id=ge.event_id
    where ge.group_id=v_group.id
      and ge.season_id=v_season.id
  ), member_event_scores as (
    select
      gm.id group_member_id,
      gm.display_name,
      gm.is_active,
      se.event_id,
      se.event_status,
      se.scoring_version,
      count(sel.fight_id) filter(
        where f.result_status='complete' and f.winner_name is not null
      )::integer picks_made,
      count(sel.fight_id) filter(
        where f.result_status='complete' and f.winner_name=sel.fighter_name
      )::integer correct,
      coalesce(sum(
        public.picks_lock_bonus_points(
          se.scoring_version,
          sel.is_underdog_lock,
          public.picks_selected_odds(sel.fighter_name,f.red_name,f.blue_name,f.red_odds,f.blue_odds),
          v_season.underdog_bonus
        )
      ) filter(
        where f.result_status='complete' and f.winner_name=sel.fighter_name
      ),0)::integer lock_bonus,
      coalesce(sum(
        public.picks_correct_pick_points(se.scoring_version,v_season.correct_points)
        +public.picks_lock_bonus_points(
          se.scoring_version,
          sel.is_underdog_lock,
          public.picks_selected_odds(sel.fighter_name,f.red_name,f.blue_name,f.red_odds,f.blue_odds),
          v_season.underdog_bonus
        )
      ) filter(
        where f.result_status='complete' and f.winner_name=sel.fighter_name
      ),0)::integer points
    from public.pick_group_members gm
    left join season_events se on true
    left join public.pick_room_members rm
      on rm.room_id=se.room_id and rm.group_member_id=gm.id
    left join public.pick_selections sel on sel.member_id=rm.id
    left join public.pick_fights f on f.id=sel.fight_id
    where gm.group_id=v_group.id
    group by
      gm.id,gm.display_name,gm.is_active,
      se.event_id,se.event_status,se.scoring_version
  ), event_maxes as (
    select event_id,max(points) max_score
    from member_event_scores
    where event_id is not null and event_status='complete'
    group by event_id
  ), member_totals as (
    select
      mes.group_member_id,
      max(mes.display_name) display_name,
      bool_or(mes.is_active) is_active,
      sum(mes.picks_made)::integer picks_made,
      sum(mes.correct)::integer correct,
      sum(mes.lock_bonus)::integer lock_bonus,
      sum(mes.points)::integer points,
      count(*) filter(
        where mes.event_id is not null and mes.picks_made>0
      )::integer events_played,
      count(*) filter(
        where mes.event_status='complete'
          and mes.picks_made>0
          and em.max_score>0
          and mes.points=em.max_score
      )::integer event_wins
    from member_event_scores mes
    left join event_maxes em on em.event_id=mes.event_id
    group by mes.group_member_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',mt.group_member_id,
    'display_name',mt.display_name,
    'is_active',mt.is_active,
    'picks_made',mt.picks_made,
    'correct',mt.correct,
    'lock_bonus',mt.lock_bonus,
    'points',mt.points,
    'events_played',mt.events_played,
    'event_wins',mt.event_wins,
    'accuracy',case when mt.picks_made>0 then round(100.0*mt.correct/mt.picks_made)::integer else 0 end
  ) order by mt.points desc,mt.event_wins desc,mt.correct desc,mt.display_name),'[]'::jsonb)
  into v_members
  from member_totals mt
  where mt.is_active or mt.picks_made>0;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_id',e.id,
    'room_code',r.code,
    'name',e.name,
    'subtitle',e.subtitle,
    'event_date',e.event_date,
    'status',e.status,
    'scoring_version',e.scoring_version,
    'is_active',(e.id=v_group.active_event_id and e.status in ('upcoming','live'))
  ) order by e.event_date desc),'[]'::jsonb)
  into v_events
  from public.pick_group_events ge
  join public.pick_events e on e.id=ge.event_id
  join public.pick_rooms r on r.id=ge.room_id
  where ge.group_id=v_group.id
    and ge.season_id=v_season.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,
    'name',e.name,
    'subtitle',e.subtitle,
    'event_date',e.event_date,
    'status',e.status,
    'scoring_version',e.scoring_version
  ) order by e.event_date),'[]'::jsonb)
  into v_available
  from public.pick_events e
  where e.status in ('upcoming','live')
    and not exists(
      select 1 from public.pick_group_events ge
      where ge.group_id=v_group.id and ge.event_id=e.id
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',s.id,
    'name',s.name,
    'starts_at',s.starts_at,
    'ended_at',s.ended_at,
    'correct_points',s.correct_points,
    'underdog_bonus',s.underdog_bonus
  ) order by s.starts_at desc),'[]'::jsonb)
  into v_past_seasons
  from public.pick_group_seasons s
  where s.group_id=v_group.id and not s.is_active;

  return jsonb_build_object(
    'group',jsonb_build_object(
      'id',v_group.id,
      'code',v_group.code,
      'name',v_group.name,
      'active_event_id',v_group.active_event_id,
      'is_admin',coalesce(v_group.admin_token_hash=digest(p_admin_token,'sha256'),false),
      'owner_member_id',v_group.owner_member_id
    ),
    'season',jsonb_build_object(
      'id',v_season.id,
      'name',v_season.name,
      'starts_at',v_season.starts_at,
      'scoring_version','event-based-v1',
      'correct_points',4,
      'underdog_bonus',null,
      'legacy_correct_points',v_season.correct_points,
      'legacy_underdog_bonus',v_season.underdog_bonus
    ),
    'past_seasons',v_past_seasons,
    'me',jsonb_build_object('id',v_me.id,'display_name',v_me.display_name),
    'active_room',case when v_active_room.id is null then null else jsonb_build_object(
      'code',v_active_room.code,
      'event_id',v_active_room.event_id
    ) end,
    'members',v_members,
    'events',v_events,
    'available_events',v_available
  );
end;
$$;

grant execute on function public.picks_tiered_lock_bonus(integer) to anon,authenticated;
grant execute on function public.picks_public_events() to anon,authenticated;
grant execute on function public.picks_set_underdog_lock(text,text,text,text) to anon,authenticated;
grant execute on function public.picks_commissioner_set_member_pick(text,text,uuid,text,text,boolean) to anon,authenticated;
grant execute on function public.picks_room_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_group_snapshot(text,text,text) to anon,authenticated;
