import { getSupabase } from './supabase';
import { isSupabaseConfigured } from './supabaseConfig';

/**
 * Ensures a Supabase auth session exists. Uses anonymous sign-in so uploads
 * can be tied to a user id with RLS before email/password auth is wired up.
 */
export async function ensureSupabaseSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const supabase = getSupabase();
  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session) {
    return true;
  }

  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('[Supabase] Anonymous sign-in failed:', error.message);
    return false;
  }

  return true;
}
