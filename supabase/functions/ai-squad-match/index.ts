// OKOP'S AI Buddy Matching Edge Function
// Uses student profiles and interests to find the perfect squad

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ""
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""

serve(async (req) => {
  const { user_id } = await req.json()
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Fetch current student's interests
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('interests, college')
    .eq('id', user_id)
    .single()

  // 2. Query other students in the same college with overlapping interests
  // This can be expanded with Vector Search (Supabase Vector) for better results
  const { data: matches } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, interests')
    .neq('id', user_id)
    .eq('college', myProfile.college)
    .overlaps('interests', myProfile.interests)
    .limit(3)

  return new Response(JSON.stringify({ matches }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  })
})
