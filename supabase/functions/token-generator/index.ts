
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { StreamVideoServerClient } from "npm:@stream-io/video-node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or restrict to your domain
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = new StreamVideoServerClient({
      apiKey: Deno.env.get("STREAM_API_KEY")!,
      apiSecret: Deno.env.get("STREAM_API_SECRET")!,
    });

    const token = client.createToken(userId);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});