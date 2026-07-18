import { createClient } from 'npm:@supabase/supabase-js@2.49.8';
import webpush from 'npm:web-push@3.6.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

const text = (value: unknown) => String(value ?? '').trim();

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ ok: false, error: 'POST required.' }, 405);

  try {
    const payload = await request.json().catch(() => ({}));

    // Older cached clients may still kick the former browser-owned War Room sender.
    // The database trigger and cron worker now own delivery, so acknowledge without
    // sending a second notification.
    if (!payload?.internal_token && (payload?.member_token || payload?.message_id)) {
      return json({ ok: true, queued: true, delivery: 'server-owned' }, 202);
    }

    const internalToken = text(payload?.internal_token);
    if (!internalToken) return json({ ok: false, error: 'Notification worker token required.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ ok: false, error: 'Push service configuration is unavailable.' }, 500);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: claimed, error: claimError } = await admin.rpc('app_notification_claim_batch', {
      p_internal_token: internalToken,
      p_limit: 75,
    });
    if (claimError) throw claimError;
    if (!claimed?.ok) return json({ ok: false, error: claimed?.error || 'Notification claim failed.' }, 403);

    const { data: config, error: configError } = await admin
      .from('octagon_push_config')
      .select('public_key,private_key,subject')
      .eq('singleton', true)
      .maybeSingle();
    if (configError) throw configError;
    if (!config?.public_key || !config?.private_key || !config?.subject) {
      return json({ ok: false, error: 'VAPID push configuration is unavailable.' }, 500);
    }

    webpush.setVapidDetails(
      text(config.subject),
      text(config.public_key),
      text(config.private_key),
    );

    const rows = Array.isArray(claimed.rows) ? claimed.rows : [];
    let notifications = 0;
    let delivered = 0;
    let failed = 0;
    let skipped = 0;

    for (const row of rows) {
      const notificationId = text(row?.id);
      const recipientId = text(row?.recipient_member_id);
      const notification = row?.payload && typeof row.payload === 'object' ? row.payload : {};
      if (!notificationId || !recipientId) continue;

      const { data: subscriptions, error: subscriptionsError } = await admin
        .from('octagon_push_subscriptions')
        .select('id,endpoint,p256dh,auth,failure_count')
        .eq('member_id', recipientId)
        .eq('is_active', true);

      let rowDelivered = 0;
      let rowFailed = 0;
      const errors: string[] = [];

      if (subscriptionsError) {
        rowFailed = 1;
        errors.push(text(subscriptionsError.message));
      } else if (!subscriptions?.length) {
        skipped += 1;
      } else {
        const body = JSON.stringify({
          title: text(notification.title) || 'Octagon HQ',
          body: text(notification.body) || 'New Octagon HQ activity.',
          tag: text(notification.tag) || `octagon-hq-${notificationId}`,
          url: text(notification.url) || './#home',
        });

        for (const subscription of subscriptions) {
          try {
            await webpush.sendNotification({
              endpoint: text(subscription.endpoint),
              keys: {
                p256dh: text(subscription.p256dh),
                auth: text(subscription.auth),
              },
            }, body, { TTL: 60 * 60 * 24, urgency: row.kind === 'picks-reminder' ? 'high' : 'normal' });

            rowDelivered += 1;
            await admin.from('octagon_push_subscriptions').update({
              last_success_at: new Date().toISOString(),
              failure_count: 0,
              updated_at: new Date().toISOString(),
            }).eq('id', subscription.id);
          } catch (error) {
            rowFailed += 1;
            const statusCode = Number((error as { statusCode?: number })?.statusCode || 0);
            errors.push(text((error as Error)?.message || `Push failed with ${statusCode || 'unknown status'}.`));
            await admin.from('octagon_push_subscriptions').update({
              is_active: ![404, 410].includes(statusCode),
              last_failure_at: new Date().toISOString(),
              failure_count: Number(subscription.failure_count || 0) + 1,
              updated_at: new Date().toISOString(),
            }).eq('id', subscription.id);
          }
        }
      }

      const { error: finishError } = await admin.rpc('app_notification_finish', {
        p_internal_token: internalToken,
        p_notification_id: notificationId,
        p_delivered: rowDelivered,
        p_failed: rowFailed,
        p_error: errors.join(' | ').slice(0, 1000) || null,
      });
      if (finishError) console.error('Could not finish notification row', notificationId, finishError);

      notifications += 1;
      delivered += rowDelivered;
      failed += rowFailed;
    }

    return json({
      ok: true,
      notifications,
      delivered,
      failed,
      skipped,
    });
  } catch (error) {
    console.error('octagon-push worker failed', error);
    return json({ ok: false, error: text((error as Error)?.message) || 'Push notifications could not be processed.' }, 500);
  }
});
