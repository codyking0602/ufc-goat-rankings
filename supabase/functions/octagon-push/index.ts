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

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ ok: false, error: 'POST required.' }, 405);

  try {
    const payload = await request.json().catch(() => ({}));
    const memberToken = String(payload?.member_token || '').trim();
    const messageId = String(payload?.message_id || '').trim();
    if (!memberToken || !messageId) {
      return json({ ok: false, error: 'A member token and message ID are required.' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ ok: false, error: 'Push service configuration is unavailable.' }, 500);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: context, error: contextError } = await admin.rpc('octagon_push_delivery_context', {
      p_member_token: memberToken,
      p_message_id: messageId,
    });

    if (contextError) throw contextError;
    if (!context?.ok) return json({ ok: false, error: context?.error || 'Push delivery was not authorized.' }, 403);

    const vapid = context.vapid || {};
    webpush.setVapidDetails(String(vapid.subject), String(vapid.public_key), String(vapid.private_key));

    const senderName = String(context.sender?.display_name || 'A GOAT26 member');
    const kind = context.kind === 'reply' ? 'reply' : 'post';
    const subscriptions = Array.isArray(context.subscriptions) ? context.subscriptions : [];
    const notification = JSON.stringify({
      title: 'The War Room',
      body: kind === 'reply' ? `${senderName} replied in The War Room.` : `${senderName} posted in The War Room.`,
      tag: `war-room-${messageId}`,
      url: './?open=octagon',
    });

    let delivered = 0;
    let failed = 0;

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification({
          endpoint: String(subscription.endpoint),
          keys: {
            p256dh: String(subscription.p256dh),
            auth: String(subscription.auth),
          },
        }, notification, { TTL: 60 * 60 * 12, urgency: 'normal' });

        delivered += 1;
        await admin.from('octagon_push_subscriptions').update({
          last_success_at: new Date().toISOString(),
          failure_count: 0,
          updated_at: new Date().toISOString(),
        }).eq('id', subscription.id);
      } catch (error) {
        failed += 1;
        const statusCode = Number((error as { statusCode?: number })?.statusCode || 0);
        await admin.from('octagon_push_subscriptions').update({
          is_active: ![404, 410].includes(statusCode),
          last_failure_at: new Date().toISOString(),
          failure_count: Number((subscription as { failure_count?: number })?.failure_count || 0) + 1,
          updated_at: new Date().toISOString(),
        }).eq('id', subscription.id);
      }
    }

    return json({
      ok: true,
      attempted: subscriptions.length,
      delivered,
      failed,
    });
  } catch (error) {
    console.error('octagon-push failed', error);
    return json({ ok: false, error: 'The push notification could not be sent.' }, 500);
  }
});
