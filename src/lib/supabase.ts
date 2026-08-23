import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (name: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return String(import.meta.env[name]);
  }
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return String(process.env[name]);
  }
  return '';
};

const rawUrl = getEnvVar('VITE_SUPABASE_URL').trim();
const rawKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY').trim();

// Ensure the runtime Supabase URL targets project mqezjpajegxmllwclrce
export const supabaseUrl = (!rawUrl || rawUrl.includes('zcfsivizjnbgobtttodz'))
  ? 'https://mqezjpajegxmllwclrce.supabase.co'
  : rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

// Detect if key is missing, a placeholder, or the stale key from deleted project zcfsivizjnbgobtttodz
const isStaleOldKey = rawKey.includes('fHjlfQoY4W1HhZhdTIPR0w') || rawKey.includes('zcfsivizjnbgobtttodz');
export const isSupabaseConfigured = Boolean(
  rawKey &&
  !isStaleOldKey &&
  !rawKey.includes('unconfigured') &&
  !rawKey.includes('placeholder') &&
  !rawKey.includes('YOUR_KEY') &&
  rawKey.length > 20
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Supabase Configuration] VITE_SUPABASE_PUBLISHABLE_KEY for project "mqezjpajegxmllwclrce" is missing or invalid in environment.\n' +
    'Please set VITE_SUPABASE_PUBLISHABLE_KEY in environment variables.'
  );
}

// Exactly ONE Supabase client instance in the entire application
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  isSupabaseConfigured ? rawKey : 'unconfigured-publishable-key'
);

export async function checkSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase publishable key is missing, unconfigured, or invalid for project mqezjpajegxmllwclrce.'
    };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return {
        success: false,
        message: `Supabase authentication error: ${error.message}`
      };
    }
    return {
      success: true,
      message: 'Supabase connection verified successfully.'
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
    return {
      success: false,
      message: `Failed to connect to Supabase endpoint: ${errorMessage}`
    };
  }
}

