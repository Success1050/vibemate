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
    availability_slots(available_date, time_slots)
  `
    )
    .eq("role", "os")
    .eq("id", osId)
    .single();

  if (error) {
    console.log("Error fetching OS profiles:", error);
    return { success: false, error: error.message };
  }
  console.log("the  available slots", data.availability_slots);

  return { success: true, data };
};
