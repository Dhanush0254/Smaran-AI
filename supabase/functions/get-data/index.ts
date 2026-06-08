// supabase/functions/get-data/index.ts
// Supabase Edge Function — Protected endpoint to fetch sample_data

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight — must return 200
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    // 1. Extract Authorization header
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return jsonResponse({
        error: 'Unauthorized: Missing Authorization header',
        data: [],
      }, 401)
    }

    // 2. Create Supabase client with the user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // 3. Verify the JWT token by getting the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return jsonResponse({
        error: 'Unauthorized: Invalid or expired token',
        data: [],
      }, 401)
    }

    // 4. Fetch data from sample_data table
    const { data, error: dbError } = await supabase
      .from('sample_data')
      .select('*')
      .order('id', { ascending: true })

    if (dbError) {
      return jsonResponse({
        error: `Database error: ${dbError.message}`,
        data: [],
      }, 500)
    }

    // 5. Return successful response
    return jsonResponse({
      data: data ?? [],
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (err) {
    return jsonResponse({
      error: `Internal server error: ${(err as Error).message}`,
      data: [],
    }, 500)
  }
})
