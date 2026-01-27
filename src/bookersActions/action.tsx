import { supabase } from "@/lib/supabase";

export const fetchOs = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    user_id,
    email,
    online_status,
    role,
    osprofile(
    is_available,
    full_name,
    nickname,
    featured,
      bio,
      image_url
    ),
    pricing_settings(price_per_night)
  `
    )
    .eq("role", "os");

  if (error) {
    console.log("Error fetching OS profiles:", error);
    return { success: false, error: error.message };
  }
  console.log("fetched data", data);

  return { success: true, data };
};

export const fetchSingleOs = async (osId: number) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    user_id,
    email,
    role,
    osprofile(
    is_available,
    full_name,
    videos_urls,
    nickname,
    featured,
      bio,
      image_url
    ),
    pricing_settings(price_per_night),
    availability_slots(id, available_date, time_slots)
  `
    )
    .eq("role", "os")
    .eq("id", osId)
    .single();

  if (error) {
    console.log("Error fetching OS profiles:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const fetchOsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    user_id,
    email,
    role,
    osprofile(
    is_available,
    full_name,
    videos_urls,
    nickname,
    featured,
      bio,
      image_url
    ),
    pricing_settings(price_per_night)
  `
    )
    .eq("role", "os")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log("Error fetching OS profile by userId:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
