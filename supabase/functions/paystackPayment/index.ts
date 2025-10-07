import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
  "Access-Control-Max-Age": "86400",
};

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("EXPO_SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("EXPO_SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Idempotency helper → prevent double crediting
async function hasTransactionBeenProcessed(reference: string) {
  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("id")
    .eq("description", reference)
    .maybeSingle();

  if (error) {
    console.error("Error checking transaction:", error.message);
    throw error;
  }

  return !!data;
}

serve(async (req: Request) => {

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload = await req.json();
const reference = payload?.reference || payload?.data?.reference;
const userId = payload?.user_id || payload?.data?.metadata?.user_id;
// pass user_id in Paystack metadata

    if (!reference || !userId) {
      console.error("Invalid webhook payload:", payload);
      return new Response("Bad Request", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 1. Verify transaction with Paystack
    const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference.trim()
        )}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const verifyJson = await verifyRes.json();
    if (!verifyJson.status || verifyJson.data.status !== "success") {
      console.error("Failed verification:", verifyJson);
      return new Response("Verification failed", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const amount = verifyJson.data.amount / 100; // Paystack sends amount in kobo

    // 2. Check idempotency (avoid double crediting)
    const alreadyProcessed = await hasTransactionBeenProcessed(reference);
    if (alreadyProcessed) {
      console.log(`Transaction ${reference} already processed`);
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 3. Credit wallet using RPC
    const { data, error } = await supabase.rpc("credit_wallet", {
      p_user_id: userId,
      p_amount: amount,
      p_description: reference,
    });

    if (error) {
      console.error("Error crediting wallet:", error.message);
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("Wallet credited:", data);

    // 4. Respond to Paystack
   return new Response(
  JSON.stringify({
    success: true,
    wallet: data, 
  }),
  {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  }
);
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
