// @ts-nocheck -- Deno Edge Runtime imports are resolved by Supabase during deployment.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json({ error: 'Authentication required' }, 401);

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anonKey || !serviceKey) return json({ error: 'Server configuration unavailable' }, 500);

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { user }, error: userError } = await caller.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);
  const { data: actor } = await admin.from('profiles').select('role,account_status').eq('id', user.id).maybeSingle();
  if (!actor || actor.role !== 'super_admin' || actor.account_status !== 'active') return json({ error: 'Super Admin authorization required' }, 403);

  const body = await req.json().catch(() => null) as { email?: string; fullName?: string; phone?: string; role?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const fullName = body?.fullName?.trim();
  const role = body?.role === 'ADMIN' ? 'admin' : body?.role === 'MODERATOR' ? 'moderator' : null;
  if (!email || !fullName || !role) return json({ error: 'Valid name, email, and Admin/Moderator role are required' }, 400);

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
  if (inviteError || !invited.user) return json({ error: inviteError?.message || 'Unable to invite staff user' }, 400);
  const { error: profileError } = await admin.from('profiles').upsert({
    id: invited.user.id, email, full_name: fullName, phone_normalized: body?.phone?.trim() || null,
    role, account_status: 'active', updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  if (profileError) return json({ error: profileError.message }, 500);

  await admin.from('audit_logs').insert({
    actor_id: user.id, actor_name: user.email || 'Super Admin', actor_role: 'super_admin', action: 'STAFF_PROVISIONED',
    target_type: 'user', target_id: invited.user.id, target_title: email, details: `Provisioned ${role} access through secure Auth invitation.`,
    metadata: { role, email }
  });
  return json({ success: true, userId: invited.user.id });
});
