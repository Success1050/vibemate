// supabase/functions/cron-process-calls/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("EXPO_SUPABASE_URL")!,
    Deno.env.get("EXPO_SUPABASE_SERVICE_ROLE_KEY")! // needs service role
  );

  // Run the SQL function that deducts gold for all active calls
  const { error } = await supabase.rpc("process_active_calls");

  if (error) {
    console.error("Call billing error:", error);
    return new Response(
      JSON.stringify({ success: false, error }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
