import { supabase } from "@/lib/supabase";

export const getGoldBal = async (userId: string) => {
  const { data, error } = await supabase
    .from("gold_accounts")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
};
