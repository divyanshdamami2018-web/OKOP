import { createClient } from "npm:@supabase/supabase-js@2"

// --- Helper Functions for FCM HTTP v1 OAuth 2.0 Token Generation ---

/**
 * Converts a string into a base64url encoded string.
 */
function base64url(source: ArrayBuffer | string): string {
  const bytes = typeof source === "string" ? new TextEncoder().encode(source) : new Uint8Array(source)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

/**
 * Generates an OAuth 2.0 Access Token using Google Service Account Credentials.
 */
async function getFcmAccessToken(serviceAccount: Record<string, any>): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedClaimSet = base64url(JSON.stringify(claimSet))
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`

  // Clean PEM key and convert to ArrayBuffer
  const pemHeader = "-----BEGIN PRIVATE KEY-----"
  const pemFooter = "-----END PRIVATE KEY-----"
  const pemContents = serviceAccount.private_key
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "")
  
  const binaryDerString = atob(pemContents)
  const binaryDer = new Uint8Array(binaryDerString.length)
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i)
  }

  // Import Crypto Key
  const cryptoKey = await crypto.subcrypto.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  // Sign JWT
  const signatureBuffer = await crypto.subcrypto.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  )

  const jwt = `${signatureInput}.${base64url(signatureBuffer)}`

  // Exchange JWT for Access Token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  const tokenData = await tokenResponse.json()
  if (!tokenResponse.ok) {
    throw new Error(`Failed to obtain Google access token: ${JSON.stringify(tokenData)}`)
  }

  return tokenData.access_token
}

// --- Main HTTP Server Handler ---

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT") ?? ""

    if (!serviceAccountJson) {
      return new Response(JSON.stringify({ error: "FIREBASE_SERVICE_ACCOUNT environment variable is not set." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const serviceAccount = JSON.parse(serviceAccountJson)
    const body = await req.json()
    
    // Support payloads sent directly or wrapped inside Supabase DB Webhook triggers
    const record = body.record ?? body

    if (!record || !record.receiver_id) {
      return new Response(JSON.stringify({ error: "Missing required record data or receiver_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Fetch user device tokens
    const { data: userTokens, error: tokenError } = await supabase
      .from("user_device_tokens")
      .select("token")
      .eq("user_id", record.receiver_id)

    if (tokenError) {
      throw new Error(`Database error fetching tokens: ${tokenError.message}`)
    }

    if (!userTokens || userTokens.length === 0) {
      return new Response(JSON.stringify({ message: "No active device tokens found for user." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 2. Generate FCM OAuth2 Access Token
    const accessToken = await getFcmAccessToken(serviceAccount)
    const projectId = serviceAccount.project_id
    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`

    // 3. Dispatch Push Notifications to all device tokens
    const staleTokens: string[] = []
    
    const sendPromises = userTokens.map(async ({ token }) => {
      const fcmPayload = {
        message: {
          token: token,
          notification: {
            title: record.title ?? "Notification",
            body: record.body ?? "",
          },
          data: {
            type: String(record.type ?? "default"),
            id: String(record.id ?? ""),
          },
        },
      }

      const res = await fetch(fcmEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fcmPayload),
      })

      const resData = await res.json()

      // Detect expired or unregistered tokens for automated cleanup
      if (!res.ok) {
        if (
          res.status === 404 || 
          resData?.error?.details?.some((d: any) => d.errorCode === "UNREGISTERED")
        ) {
          staleTokens.push(token)
        }
        console.error(`FCM send error for token [${token.slice(0, 10)}...]:`, resData)
      }

      return res.ok
    })

    const results = await Promise.allSettled(sendPromises)
    const successCount = results.filter((r) => r.status === "fulfilled" && r.value === true).length

    // 4. Automatically purge unmounted / stale device tokens from DB
    if (staleTokens.length > 0) {
      console.log(`Cleaning up ${staleTokens.length} stale device tokens...`)
      await supabase
        .from("user_device_tokens")
        .delete()
        .in("token", staleTokens)
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: userTokens.length,
        cleanedTokens: staleTokens.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("Function Handler Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})