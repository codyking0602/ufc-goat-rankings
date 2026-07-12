-- UFC Picks Phase 11: no-subscription card and odds automation.
-- Paste a card or odds sheet, preview changes in the app, then apply one transaction.
-- Run after supabase/picks-social-retention-phase.sql. Safe to rerun.

create extension if not exists pgcrypto;

alter table public.pick_events
  add column if not exists last_card_import_at timestamptz,
  add column if not exists last_card_import_source text,
  add column if not exists last_card_import_hash text,
  add column if not exists last_odds_import_at timestamptz,
  add column if not exists last_odds_import_source text,
  add column if not exists card_import_revision integer not null default 0;

alter table public.pick_fights
  add column if not exists red_odds integer,
  add column if not exists blue_odds integer,
  add column if not exists odds_source text,
  add column if not exists odds_updated_at timestamptz,
  add column if not exists import_status text not null default 'manual',
  add column if not exists import_seen_at timestamptz;

do $$
begin
  if not exists(select 1 from pg_constraint where conname='pick_fights_import_status_check') then
    alter table public.pick_fights
      add constraint pick_fights_import_status_check
      check(import_status in ('manual','current','missing','removed'));
  end if;
end $$;

create or replace function public.picks_automation_pair_key(p_a text,p_b text)
returns text
language sql
immutable
as $$
  select least(
    regexp_replace(lower(trim(coalesce(p_a,''))),'[^a-z0-9]+','','g'),
    regexp_replace(lower(trim(coalesce(p_b,''))),'[^a-z0-9]+','','g')
  ) || '::' || greatest(
    regexp_replace(lower(trim(coalesce(p_a,''))),'[^a-z0-9]+','','g'),
    regexp_replace(lower(trim(coalesce(p_b,''))),'[^a-z0-9]+','','g')
  );
$$;

create or replace function public.picks_automation_snapshot(
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
  where id=public.picks_group_require_admin(p_group_code,p_admin_token);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',e.id,
    'name',e.name,
    'subtitle',e.subtitle,
    'event_type',e.event_type,
    'event_date',e.event_date,
    'location',e.location,
    'status',e.status,
    'room_code',r.code,
    'last_card_import_at',e.last_card_import_at,
    'last_card_import_source',e.last_card_import_source,
    'last_card_import_hash',e.last_card_import_hash,
    'last_odds_import_at',e.last_odds_import_at,
    'last_odds_import_source',e.last_odds_import_source,
    'card_import_revision',e.card_import_revision,
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
        'winner',f.winner_name,
        'import_status',f.import_status,
        'import_seen_at',f.import_seen_at,
        'selection_count',(select count(*) from public.pick_selections s where s.fight_id=f.id)
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

create or replace function public.picks_automation_apply_card(
  p_group_code text,
  p_admin_token text,
  p_event_id text,
  p_fights jsonb,
  p_remove_missing boolean default false,
  p_source_label text default 'Manual card paste',
  p_update_headline boolean default true,
  p_expected_revision integer default null
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
  v_item jsonb;
  v_existing public.pick_fights;
  v_existing_id text;
  v_order integer;
  v_section text;
  v_weight text;
  v_red text;
  v_blue text;
  v_lock_at timestamptz;
  v_red_odds integer;
  v_blue_odds integer;
  v_pair_key text;
  v_pair_keys text[]:=array[]::text[];
  v_orders integer[]:=array[]::integer[];
  v_incoming_ids text[]:=array[]::text[];
  v_id text;
  v_base text;
  v_suffix integer;
  v_max_order integer:=0;
  v_added integer:=0;
  v_updated integer:=0;
  v_replaced integer:=0;
  v_missing integer:=0;
  v_deleted integer:=0;
  v_cancelled integer:=0;
  v_has_picks boolean;
  v_changed boolean;
  v_now timestamptz:=now();
  v_hash text;
  v_main_event text;
begin
  select * into v_group
  from public.pick_groups
  where id=public.picks_group_require_admin(p_group_code,p_admin_token);

  select * into v_event
  from public.pick_events e
  where e.id=p_event_id
    and (e.manager_group_id=v_group.id or exists(
      select 1 from public.pick_group_events ge where ge.group_id=v_group.id and ge.event_id=e.id
    ));
  if not found then raise exception 'Event not found in this group.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'Only draft or upcoming events can be card-synced.'; end if;
  if p_expected_revision is not null and p_expected_revision<>v_event.card_import_revision then
    raise exception 'The card changed on another device. Refresh and preview again.';
  end if;
  if jsonb_typeof(p_fights)<>'array' or jsonb_array_length(p_fights) not between 1 and 40 then
    raise exception 'Import between 1 and 40 fights.';
  end if;

  for v_item in select value from jsonb_array_elements(p_fights)
  loop
    begin
      v_order:=(v_item->>'order')::integer;
      v_lock_at:=(v_item->>'lock_at')::timestamptz;
      v_red_odds:=case when v_item ? 'red_odds' and v_item->>'red_odds' is not null then (v_item->>'red_odds')::integer else null end;
      v_blue_odds:=case when v_item ? 'blue_odds' and v_item->>'blue_odds' is not null then (v_item->>'blue_odds')::integer else null end;
    exception when others then
      raise exception 'One imported row has an invalid order, lock time, or odds value.';
    end;
    v_section:=trim(coalesce(v_item->>'card_section',''));
    v_weight:=trim(coalesce(v_item->>'weight_class',''));
    v_red:=trim(coalesce(v_item->>'red_name',''));
    v_blue:=trim(coalesce(v_item->>'blue_name',''));
    if v_order<1 then raise exception 'Bout order must be at least 1.'; end if;
    if v_order=any(v_orders) then raise exception 'Bout order % appears more than once.',v_order; end if;
    if char_length(v_section)<2 then raise exception 'Every fight needs a card section.'; end if;
    if char_length(v_weight)<2 then raise exception 'Every fight needs a weight class.'; end if;
    if char_length(v_red)<2 or char_length(v_blue)<2 then raise exception 'Every fight needs two fighter names.'; end if;
    if lower(v_red)=lower(v_blue) then raise exception 'A fighter cannot face themselves.'; end if;
    if v_lock_at is null then raise exception 'Every fight needs a lock time.'; end if;
    if coalesce(v_red_odds,1)=0 or coalesce(v_blue_odds,1)=0 then raise exception 'American odds cannot be zero.'; end if;
    v_pair_key:=public.picks_automation_pair_key(v_red,v_blue);
    if v_pair_key=any(v_pair_keys) then raise exception 'The same matchup appears more than once.'; end if;
    v_orders:=array_append(v_orders,v_order);
    v_pair_keys:=array_append(v_pair_keys,v_pair_key);
    v_max_order:=greatest(v_max_order,v_order);
  end loop;

  update public.pick_fights
  set bout_order=-10000-bout_order,
      import_status=case when result_status='scheduled' then 'missing' else import_status end
  where event_id=v_event.id;

  for v_item in select value from jsonb_array_elements(p_fights)
  loop
    v_order:=(v_item->>'order')::integer;
    v_section:=trim(v_item->>'card_section');
    v_weight:=trim(v_item->>'weight_class');
    v_red:=trim(v_item->>'red_name');
    v_blue:=trim(v_item->>'blue_name');
    v_lock_at:=(v_item->>'lock_at')::timestamptz;
    v_red_odds:=case when v_item ? 'red_odds' and v_item->>'red_odds' is not null then (v_item->>'red_odds')::integer else null end;
    v_blue_odds:=case when v_item ? 'blue_odds' and v_item->>'blue_odds' is not null then (v_item->>'blue_odds')::integer else null end;
    v_existing_id:=nullif(trim(coalesce(v_item->>'existing_id','')),'');

    if v_existing_id is null then
      select f.id into v_existing_id
      from public.pick_fights f
      where f.event_id=v_event.id
        and public.picks_automation_pair_key(f.red_name,f.blue_name)=public.picks_automation_pair_key(v_red,v_blue)
        and not (f.id=any(v_incoming_ids))
      order by f.id
      limit 1;
    end if;

    if v_existing_id is not null then
      select * into v_existing from public.pick_fights
      where id=v_existing_id and event_id=v_event.id;
      if not found then raise exception 'A matched fight no longer exists. Refresh and preview again.'; end if;
      select exists(select 1 from public.pick_selections s where s.fight_id=v_existing.id) into v_has_picks;
      if v_has_picks and public.picks_automation_pair_key(v_existing.red_name,v_existing.blue_name)<>public.picks_automation_pair_key(v_red,v_blue) then
        raise exception '% vs. % already has submitted picks and cannot be replaced.',v_existing.red_name,v_existing.blue_name;
      end if;
      v_changed:=
        v_existing.bout_order<>(-10000-v_order)
        or v_existing.card_section is distinct from v_section
        or v_existing.weight_class is distinct from v_weight
        or v_existing.red_name is distinct from v_red
        or v_existing.blue_name is distinct from v_blue
        or v_existing.lock_at is distinct from v_lock_at
        or v_existing.red_odds is distinct from v_red_odds
        or v_existing.blue_odds is distinct from v_blue_odds;
      if public.picks_automation_pair_key(v_existing.red_name,v_existing.blue_name)<>public.picks_automation_pair_key(v_red,v_blue) then
        v_replaced:=v_replaced+1;
      end if;
      update public.pick_fights
      set bout_order=v_order,
          card_section=v_section,
          weight_class=v_weight,
          red_name=v_red,
          blue_name=v_blue,
          lock_at=v_lock_at,
          red_odds=v_red_odds,
          blue_odds=v_blue_odds,
          odds_source=case when v_red_odds is not null or v_blue_odds is not null then left(coalesce(nullif(trim(p_source_label),''),'Card import'),100) else odds_source end,
          odds_updated_at=case when v_red_odds is not null or v_blue_odds is not null then v_now else odds_updated_at end,
          import_status='current',
          import_seen_at=v_now
      where id=v_existing.id;
      v_id:=v_existing.id;
      if v_changed then v_updated:=v_updated+1; end if;
    else
      v_base:=trim(both '-' from regexp_replace(lower(v_red||'-'||v_blue),'[^a-z0-9]+','-','g'));
      if v_base='' then v_base:='fight'; end if;
      v_suffix:=1;
      v_id:=left(v_event.id,56)||'-'||left(v_base,58);
      while exists(select 1 from public.pick_fights where id=v_id) loop
        v_suffix:=v_suffix+1;
        v_id:=left(v_event.id,50)||'-'||left(v_base,50)||'-'||v_suffix;
      end loop;
      insert into public.pick_fights(
        id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,
        winner_name,result_status,red_odds,blue_odds,odds_source,odds_updated_at,import_status,import_seen_at
      ) values(
        v_id,v_event.id,v_order,v_section,v_weight,v_red,v_blue,v_lock_at,
        null,'scheduled',v_red_odds,v_blue_odds,
        case when v_red_odds is not null or v_blue_odds is not null then left(coalesce(nullif(trim(p_source_label),''),'Card import'),100) else null end,
        case when v_red_odds is not null or v_blue_odds is not null then v_now else null end,
        'current',v_now
      );
      v_added:=v_added+1;
    end if;
    v_incoming_ids:=array_append(v_incoming_ids,v_id);
  end loop;

  select count(*) into v_missing
  from public.pick_fights f
  where f.event_id=v_event.id and not (f.id=any(v_incoming_ids));

  if coalesce(p_remove_missing,false) then
    delete from public.pick_fights f
    where f.event_id=v_event.id
      and not (f.id=any(v_incoming_ids))
      and not exists(select 1 from public.pick_selections s where s.fight_id=f.id);
    get diagnostics v_deleted=row_count;

    update public.pick_fights f
    set result_status='cancelled',winner_name=null,import_status='removed',import_seen_at=v_now
    where f.event_id=v_event.id
      and not (f.id=any(v_incoming_ids))
      and exists(select 1 from public.pick_selections s where s.fight_id=f.id)
      and f.result_status='scheduled';
    get diagnostics v_cancelled=row_count;
  end if;

  with remaining as (
    select f.id,row_number() over(order by f.bout_order desc,f.id) rn
    from public.pick_fights f
    where f.event_id=v_event.id and not (f.id=any(v_incoming_ids))
  )
  update public.pick_fights f
  set bout_order=v_max_order+r.rn
  from remaining r
  where f.id=r.id;

  if coalesce(p_update_headline,true) then
    select f.red_name||' vs. '||f.blue_name into v_main_event
    from public.pick_fights f
    where f.event_id=v_event.id and f.id=any(v_incoming_ids)
    order by f.bout_order desc limit 1;
  end if;

  v_hash:=encode(digest(p_fights::text,'sha256'),'hex');
  update public.pick_events
  set subtitle=case when coalesce(p_update_headline,true) and v_main_event is not null then v_main_event else subtitle end,
      source_note=left(coalesce(nullif(trim(p_source_label),''),'Manual card paste'),200),
      last_card_import_at=v_now,
      last_card_import_source=left(coalesce(nullif(trim(p_source_label),''),'Manual card paste'),100),
      last_card_import_hash=v_hash,
      card_import_revision=card_import_revision+1
  where id=v_event.id;

  if to_regclass('public.pick_group_activity') is not null then
    insert into public.pick_group_activity(group_id,event_id,activity_type,headline,detail)
    values(
      v_group.id,v_event.id,'card_imported',v_event.name||' card synced',
      v_added||' added · '||v_updated||' updated · '||v_missing||' missing'
    );
  end if;

  return jsonb_build_object(
    'saved',true,
    'event_id',v_event.id,
    'added',v_added,
    'updated',v_updated,
    'replaced',v_replaced,
    'missing',v_missing,
    'deleted',v_deleted,
    'cancelled',v_cancelled,
    'revision',v_event.card_import_revision+1,
    'hash',v_hash
  );
end;
$$;

create or replace function public.picks_automation_apply_odds(
  p_group_code text,
  p_admin_token text,
  p_event_id text,
  p_odds jsonb,
  p_source_label text default 'Bulk odds paste'
)
returns jsonb
language plpgsql
security definer
set search_path=public,extensions
as $$
declare
  v_group public.pick_groups;
  v_event public.pick_events;
  v_item jsonb;
  v_fight_id text;
  v_red_odds integer;
  v_blue_odds integer;
  v_updated integer:=0;
  v_now timestamptz:=now();
begin
  select * into v_group
  from public.pick_groups
  where id=public.picks_group_require_admin(p_group_code,p_admin_token);

  select * into v_event
  from public.pick_events e
  where e.id=p_event_id
    and (e.manager_group_id=v_group.id or exists(
      select 1 from public.pick_group_events ge where ge.group_id=v_group.id and ge.event_id=e.id
    ));
  if not found then raise exception 'Event not found in this group.'; end if;
  if v_event.status not in ('hidden','upcoming') then raise exception 'Bulk odds can only update draft or upcoming events.'; end if;
  if jsonb_typeof(p_odds)<>'array' or jsonb_array_length(p_odds) not between 1 and 40 then
    raise exception 'No matched odds were submitted.';
  end if;

  for v_item in select value from jsonb_array_elements(p_odds)
  loop
    v_fight_id:=trim(coalesce(v_item->>'fight_id',''));
    begin
      v_red_odds:=case when v_item ? 'red_odds' and v_item->>'red_odds' is not null then (v_item->>'red_odds')::integer else null end;
      v_blue_odds:=case when v_item ? 'blue_odds' and v_item->>'blue_odds' is not null then (v_item->>'blue_odds')::integer else null end;
    exception when others then
      raise exception 'One odds row is invalid.';
    end;
    if coalesce(v_red_odds,1)=0 or coalesce(v_blue_odds,1)=0 then raise exception 'American odds cannot be zero.'; end if;
    if not exists(select 1 from public.pick_fights f where f.id=v_fight_id and f.event_id=v_event.id) then
      raise exception 'A matched fight no longer exists. Refresh and match again.';
    end if;
    update public.pick_fights
    set red_odds=coalesce(v_red_odds,red_odds),
        blue_odds=coalesce(v_blue_odds,blue_odds),
        odds_source=left(coalesce(nullif(trim(p_source_label),''),'Bulk odds paste'),100),
        odds_updated_at=v_now
    where id=v_fight_id and event_id=v_event.id;
    v_updated:=v_updated+1;
  end loop;

  update public.pick_events
  set last_odds_import_at=v_now,
      last_odds_import_source=left(coalesce(nullif(trim(p_source_label),''),'Bulk odds paste'),100)
  where id=v_event.id;

  if to_regclass('public.pick_group_activity') is not null then
    insert into public.pick_group_activity(group_id,event_id,activity_type,headline,detail)
    values(v_group.id,v_event.id,'odds_imported',v_event.name||' odds updated',v_updated||' matchup(s) matched by fighter names');
  end if;

  return jsonb_build_object('saved',true,'event_id',v_event.id,'updated',v_updated,'updated_at',v_now);
end;
$$;

grant execute on function public.picks_automation_pair_key(text,text) to anon,authenticated;
grant execute on function public.picks_automation_snapshot(text,text) to anon,authenticated;
grant execute on function public.picks_automation_apply_card(text,text,text,jsonb,boolean,text,boolean,integer) to anon,authenticated;
grant execute on function public.picks_automation_apply_odds(text,text,text,jsonb,text) to anon,authenticated;
