import { useApp } from "@/store";

export const verifyAndCreditWallet = async (
  reference: string,
  amount: number
) => {
  const { userSession } = useApp();
  try {
    const userId = userSession?.user?.id;

    const res = await fetch("http://172.29.200.101:3000/verify-paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        userId,
        amount,
      }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("✅ Wallet credited successfully!");
    } else {
      console.warn("⚠️ Verification failed:", data.error);
    }
  } catch (err) {
    console.error("💥 Error verifying payment:", err);
  }
};
