import { supabase } from '../lib/supabaseClient';

export interface SampleDataRecord {
  id: number;
  title: string;
  description: string;
}

interface EdgeFunctionResponse {
  data: SampleDataRecord[];
  error?: string;
}

/**
 * Fetch sample data from the protected Supabase Edge Function.
 * Sends the user's JWT as a Bearer token for authentication.
 */
export async function fetchSampleData(accessToken: string): Promise<EdgeFunctionResponse> {
  const { data, error } = await supabase.functions.invoke('get-data', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch data from Edge Function');
  }

  return data as EdgeFunctionResponse;
}

/**
 * Sign in with Google OAuth via Supabase Auth.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current session access token.
 */
export async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
