import { supabase } from "@/lib/supabase";

export const getGoldBal = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("gold_accounts")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return { success: false, error };
  return { success: true, data };
};
