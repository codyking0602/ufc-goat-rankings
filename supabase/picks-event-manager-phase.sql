-- Private Picks Event Manager.
-- Lets the permanent-group owner create UFC events, build the card, set odds/lock times,
-- publish the event, and carry the same group members into it.
-- Run after supabase/picks-persistent-groups-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_events
  add column if not exists manager_group_id uuid references public.pick_groups(id) on delete set null;

-- Give the existing results-admin group ownership of its first event.
update public.pick_events e
set manager_group_id=r.group_id
from public.pick_rooms r
where e.manager_group_id is null
  and e.admin_room_id=r.id
  and r.group_id is not null;

create or replace function public.picks_admin_event_manager_snapshot(
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
  v_events jsonb;
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');

  if not found then raise exception 'Only the group owner can manage UFC events.'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,
    'name',e.name,
    'subtitle',e.subtitle,
    'event_type',e.event_type,
    'event_date',e.event_date,
    'location',e.location,
    'card_rule',e.card_rule,
    'status',e.status,
    'room_code',r.code,
    'is_active',e.id=v_group.active_event_id,
    'fights',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',f.id,
        'order',f.bout_order,
        'card_section',f.card_section,
        'weight_class',f.weight_class,
        'red',f.red_name,
        'blue',f.blue_name,
        'lock_at',f.lock_at,
        'red_odds',f.red_odds,
        'blue_odds',f.blue_odds,
        'result_status',f.result_status,
        'winner',f.winner_name
      ) order by f.bout_order)
      from public.pick_fights f where f.event_id=e.id
    ),'[]'::jsonb)
  ) order by e.event_date desc),'[]'::jsonb)
  into v_events
  from public.pick_events e
  left join public.pick_group_events ge on ge.group_id=v_group.id and ge.event_id=e.id
  left join public.pick_rooms r on r.id=ge.room_id
  where e.manager_group_id=v_group.id
     or ge.group_id=v_group.id;

  return jsonb_build_object(
    'group',jsonb_build_object('id',v_group.id,'code',v_group.code,'name',v_group.name),
    'events',v_events
  );
end;
$$;

create or replace function public.picks_admin_create_event(
  p_group_code text,
  p_admin_token text,
  p_name text,
  p_subtitle text,
  p_event_type text,
  p_event_date timestamptz,
  p_location text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_base text;
  v_id text;
  v_suffix integer:=1;
  v_card_rule text;
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can create an event.'; end if;

  if char_length(trim(coalesce(p_name,''))) not between 3 and 80 then
    raise exception 'Enter an event name between 3 and 80 characters.';
  end if;
  if p_event_type not in ('numbered','fight-night') then raise exception 'Choose numbered event or Fight Night.'; end if;
  if p_event_date is null then raise exception 'Enter the event date and time.'; end if;

  v_base:=trim(both '-' from regexp_replace(lower(trim(p_name)),'[^a-z0-9]+','-','g'));
  if v_base='' then v_base:='ufc-event'; end if;
  v_id:=left(v_base,54)||'-'||to_char(p_event_date at time zone 'UTC','YYYY-MM-DD');
  while exists(select 1 from public.pick_events where id=v_id) loop
    v_suffix:=v_suffix+1;
    v_id:=left(v_base,50)||'-'||to_char(p_event_date at time zone 'UTC','YYYY-MM-DD')||'-'||v_suffix;
  end loop;

  v_card_rule:=case when p_event_type='numbered' then 'Full card' else 'Main card only' end;

  insert into public.pick_events(
    id,name,subtitle,event_type,event_date,location,card_rule,status,source_note,manager_group_id
  ) values(
    v_id,trim(p_name),nullif(trim(coalesce(p_subtitle,'')),''),p_event_type,p_event_date,
    nullif(trim(coalesce(p_location,'')),''),v_card_rule,'hidden','Created in Picks Event Manager',v_group.id
  );

  return jsonb_build_object('saved',true,'event_id',v_id,'status','hidden');
end;
$$;

create or replace function public.picks_admin_update_event(
  p_group_code text,
  p_admin_token text,
  p_event_id text,
  p_name text,
  p_subtitle text,
  p_event_type text,
  p_event_date timestamptz,
  p_location text default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
  v_card_rule text;
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can edit an event.'; end if;

  select * into v_event from public.pick_events
  where id=p_event_id and manager_group_id=v_group.id;
  if not found then raise exception 'Event not found in your manager.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'Live or completed events cannot be edited here.'; end if;
  if char_length(trim(coalesce(p_name,''))) not between 3 and 80 then raise exception 'Enter a valid event name.'; end if;
  if p_event_type not in ('numbered','fight-night') then raise exception 'Choose numbered event or Fight Night.'; end if;
  if p_event_date is null then raise exception 'Enter the event date and time.'; end if;

  v_card_rule:=case when p_event_type='numbered' then 'Full card' else 'Main card only' end;
  update public.pick_events
  set name=trim(p_name),
      subtitle=nullif(trim(coalesce(p_subtitle,'')),''),
      event_type=p_event_type,
      event_date=p_event_date,
      location=nullif(trim(coalesce(p_location,'')),''),
      card_rule=v_card_rule
  where id=v_event.id;

  return jsonb_build_object('saved',true,'event_id',v_event.id);
end;
$$;

create or replace function public.picks_admin_upsert_fight(
  p_group_code text,
  p_admin_token text,
  p_event_id text,
  p_fight_id text,
  p_bout_order integer,
  p_card_section text,
  p_weight_class text,
  p_red_name text,
  p_blue_name text,
  p_lock_at timestamptz,
  p_red_odds integer default null,
  p_blue_odds integer default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
  v_fight_id text;
  v_base text;
  v_suffix integer:=1;
begin
  select * into v_group
  from public.pick_groups
  where code=upper(trim(p_group_code))
    and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can manage fights.'; end if;

  select * into v_event from public.pick_events
  where id=p_event_id and manager_group_id=v_group.id;
  if not found then raise exception 'Event not found in your manager.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'Live or completed cards cannot be edited.'; end if;
  if coalesce(p_bout_order,0)<1 then raise exception 'Bout order must be at least 1.'; end if;
  if char_length(trim(coalesce(p_card_section,'')))<2 then raise exception 'Choose a card section.'; end if;
  if char_length(trim(coalesce(p_weight_class,'')))<2 then raise exception 'Enter the weight class.'; end if;
  if char_length(trim(coalesce(p_red_name,'')))<2 or char_length(trim(coalesce(p_blue_name,'')))<2 then raise exception 'Enter both fighter names.'; end if;
  if lower(trim(p_red_name))=lower(trim(p_blue_name)) then raise exception 'The two fighters must be different.'; end if;
  if p_lock_at is null then raise exception 'Enter the fight lock time.'; end if;

  if nullif(trim(coalesce(p_fight_id,'')),'') is null then
    v_base:=trim(both '-' from regexp_replace(lower(trim(p_red_name)||'-'||trim(p_blue_name)),'[^a-z0-9]+','-','g'));
    v_fight_id:=left(p_event_id,58)||'-'||left(v_base,52);
    while exists(select 1 from public.pick_fights where id=v_fight_id) loop
      v_suffix:=v_suffix+1;
      v_fight_id:=left(p_event_id,54)||'-'||left(v_base,46)||'-'||v_suffix;
    end loop;

    insert into public.pick_fights(
      id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,
      winner_name,result_status,red_odds,blue_odds,odds_source,odds_updated_at
    ) values(
      v_fight_id,v_event.id,p_bout_order,trim(p_card_section),trim(p_weight_class),trim(p_red_name),trim(p_blue_name),p_lock_at,
      null,'scheduled',p_red_odds,p_blue_odds,'Event Manager',now()
    );
  else
    v_fight_id:=trim(p_fight_id);
    if not exists(select 1 from public.pick_fights where id=v_fight_id and event_id=v_event.id) then
      raise exception 'Fight not found on this event.';
    end if;
    if exists(select 1 from public.pick_selections where fight_id=v_fight_id) then
      raise exception 'This fight already has picks and cannot be edited.';
    end if;

    update public.pick_fights
    set bout_order=p_bout_order,
        card_section=trim(p_card_section),
        weight_class=trim(p_weight_class),
        red_name=trim(p_red_name),
        blue_name=trim(p_blue_name),
        lock_at=p_lock_at,
        red_odds=p_red_odds,
        blue_odds=p_blue_odds,
        odds_source='Event Manager',
        odds_updated_at=now()
    where id=v_fight_id;
  end if;

  return jsonb_build_object('saved',true,'event_id',v_event.id,'fight_id',v_fight_id);
end;
$$;

create or replace function public.picks_admin_delete_fight(
  p_group_code text,
  p_admin_token text,
  p_event_id text,
  p_fight_id text
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can delete fights.'; end if;

  select * into v_event from public.pick_events where id=p_event_id and manager_group_id=v_group.id;
  if not found then raise exception 'Event not found in your manager.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'Live or completed cards cannot be edited.'; end if;
  if exists(select 1 from public.pick_selections where fight_id=p_fight_id) then raise exception 'This fight already has picks and cannot be deleted.'; end if;

  delete from public.pick_fights where id=p_fight_id and event_id=v_event.id;
  if not found then raise exception 'Fight not found.'; end if;
  return jsonb_build_object('deleted',true,'fight_id',p_fight_id);
end;
$$;

create or replace function public.picks_admin_delete_draft_event(
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
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can delete a draft.'; end if;

  delete from public.pick_events
  where id=p_event_id and manager_group_id=v_group.id and status='hidden';
  if not found then raise exception 'Only an unpublished draft can be deleted.'; end if;
  return jsonb_build_object('deleted',true,'event_id',p_event_id);
end;
$$;

create or replace function public.picks_admin_publish_event(
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
  v_event public.pick_events;
  v_link jsonb;
begin
  select * into v_group from public.pick_groups
  where code=upper(trim(p_group_code)) and admin_token_hash=digest(p_admin_token,'sha256');
  if not found then raise exception 'Only the group owner can publish an event.'; end if;

  select * into v_event from public.pick_events where id=p_event_id and manager_group_id=v_group.id;
  if not found then raise exception 'Event not found in your manager.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'This event cannot be published.'; end if;
  if not exists(select 1 from public.pick_fights where event_id=v_event.id) then raise exception 'Add at least one fight before publishing.'; end if;

  update public.pick_events set status='upcoming' where id=v_event.id;
  select public.picks_group_add_event(v_group.code,p_admin_token,v_event.id) into v_link;

  return v_link || jsonb_build_object('published',true,'event_id',v_event.id);
end;
$$;

grant execute on function public.picks_admin_event_manager_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_admin_create_event(text,text,text,text,text,timestamptz,text) to anon,authenticated;
grant execute on function public.picks_admin_update_event(text,text,text,text,text,text,timestamptz,text) to anon,authenticated;
grant execute on function public.picks_admin_upsert_fight(text,text,text,text,integer,text,text,text,text,timestamptz,integer,integer) to anon,authenticated;
grant execute on function public.picks_admin_delete_fight(text,text,text,text) to anon,authenticated;
grant execute on function public.picks_admin_delete_draft_event(text,text,text) to anon,authenticated;
grant execute on function public.picks_admin_publish_event(text,text,text) to anon,authenticated;
