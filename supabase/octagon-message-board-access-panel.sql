-- Cody-only access roster for The Octagon private beta.
-- Applied after octagon-message-board-rpc.sql. Safe to rerun.

create or replace function public.octagon_admin_access_roster(
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

  if not v_ctx.is_admin then
    return jsonb_build_object('ok',false,'error','Only Cody can manage Octagon Beta access.');
  end if;

  return jsonb_build_object(
    'ok',true,
    'members',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',gm.id,
          'display_name',gm.display_name,
          'fighter_avatar_slug',gm.fighter_avatar_slug,
          'is_admin',coalesce(gm.is_app_admin,false) or g.owner_member_id=gm.id,
          'can_access',coalesce(oa.can_access,false)
        )
        order by
          (coalesce(gm.is_app_admin,false) or g.owner_member_id=gm.id) desc,
          lower(trim(gm.display_name))
      )
      from public.pick_group_members gm
      join public.pick_groups g on g.id=gm.group_id
      left join public.octagon_access oa
        on oa.member_id=gm.id
       and oa.group_id=gm.group_id
      where gm.group_id=v_ctx.group_id
        and coalesce(gm.is_active,true)
    ),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.octagon_admin_access_roster(text) from public;
grant execute on function public.octagon_admin_access_roster(text) to anon,authenticated;

comment on function public.octagon_admin_access_roster(text) is 'Returns the GOAT26 Octagon Beta access roster only when the caller is Cody/admin.';

-- Fail deployment if the public RPC contract is not secure and callable.
do $$
declare
  v_proc oid:=to_regprocedure('public.octagon_admin_access_roster(text)');
begin
  if v_proc is null then
    raise exception 'octagon_admin_access_roster was not created';
  end if;

  if not (select p.prosecdef from pg_proc p where p.oid=v_proc) then
    raise exception 'octagon_admin_access_roster must use SECURITY DEFINER';
  end if;

  if not has_function_privilege('anon','public.octagon_admin_access_roster(text)','EXECUTE') then
    raise exception 'anon cannot execute octagon_admin_access_roster';
  end if;
end;
$$;
