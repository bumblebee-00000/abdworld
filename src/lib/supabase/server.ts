import { createClient } from '@supabase/supabase-js';

export function isSupabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return (
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your_supabase') &&
    serviceRoleKey.length > 20 &&
    !serviceRoleKey.includes('your_supabase')
  );
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
