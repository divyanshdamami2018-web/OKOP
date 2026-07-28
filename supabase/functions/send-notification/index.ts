// OKOP'S Push Notification Edge Function (Deno)
// Receives database changes and pushes to FCM

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ""
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""

serve(async (req) => {
  try {
    const { record } = await req.json()
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Fetch user tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_device_tokens')
      .select('token')
      .eq('user_id', record.receiver_id)

    if (tokenError || !tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No tokens found' }), { status: 200 })
    }

    // 2. Prepare payload for FCM
    // Note: You must add your GOOGLE_APPLICATION_CREDENTIALS to Supabase Secrets
    const payload = {
      notification: {
        title: record.title,
        body: record.body,
      },
      data: {
        type: record.type,
        id: record.id
      }
    }

    console.log(`Sending notification to ${tokens.length} devices...`)

    // Implementation of FCM fetch call would go here
    // ...

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
