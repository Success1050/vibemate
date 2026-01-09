import { Session } from "@supabase/supabase-js";

export const verifyAndCreditWallet = async (
  reference: string,
  userSession: Session | null,
  amount: number,
  goldAmount?: number
) => {
  try {
    const userId = userSession?.user?.id;

    if (!userId) {
      console.error("❌ No user ID found. User not logged in.");
      return { success: false, error: "User not authenticated" };
    }

    if (!reference || !amount) {
      console.error("❌ Missing reference or amount.");
      return { success: false, error: "Missing reference or amount" };
    }

    console.log("🔍 Verifying payment with amount:", amount);

    const res = await fetch("https://vibemate-backend.onrender.com/verify-paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        userId,
        amount,
        goldAmount,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ Server rejected request:", data?.error);
      return { success: false, error: data?.error };
    }

    if (data.success) {
      console.log(
        `✅ ${data.type === "gold" ? "Gold credited" : "Wallet funded"
        } successfully!`
      );
      return { success: true, type: data.type };
    } else {
      console.warn("⚠️ Verification failed:", data.error);
      return { success: false, error: data.error };
    }
  } catch (err: any) {
    console.error("💥 Error verifying payment:", err.message);
    return { success: false, error: "Network or server error" };
  }
};
