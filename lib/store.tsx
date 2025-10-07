import { useRouter } from "expo-router";
import { supabase } from "./supabase";

export const gerCurrentUser = async () => {
  const router = useRouter();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return console.log(error);
  }
  if (!user) {
    router.replace("/welcome");
  } else {
    return;
  }
  return { user };
};
