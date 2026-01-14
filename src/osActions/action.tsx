import { supabase } from "@/lib/supabase";
import {
  DateTimeSlot,
  MediaGallery,
  PrivacySettings,
  ProfileData,
} from "@/tsx-types";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export const saveOsProfile = async (
  profileData: ProfileData,
  mediaGallery: MediaGallery,
  privacy: PrivacySettings,
  userSession: Session | null,
  role: string | null
) => {
  if (!userSession) {
    return Alert.alert("Error", "User not authenticated.");
  }

  const { id: userId } = userSession.user;

  const { data: profileDataResult, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();

  if (profileError) {
    return console.log(profileError);
  }

  console.log("profileDataResult:", profileDataResult);

  const profileid = profileDataResult?.id;

  const { data, error } = await supabase.from("osprofile").upsert(
    {
      id: profileid,
      full_name: profileData.name,
      nickname: profileData.nickname,
      bio: profileData.description,
      age: profileData.age,
      date_of_birth: null,
      phone: profileData.phone,
      email: profileData.email,
      emergency_contact: profileData.emergencyContact,
      city: profileData.location,
      specific_address: profileData.specificAddress,
      country: profileData.country,
      profile_image_url: profileData.profile_img || "",
      languages: profileData.languages,
      image_url: mediaGallery.mainImages,
      videos_urls: mediaGallery.videoSource ? [mediaGallery.videoSource] : [],
      show_location: privacy.showLocation,
      show_age: privacy.showAge,
      show_phone: privacy.showPhone,
    },
    { onConflict: "id" }
  );

  // Also update global profile image
  if (profileData.profile_img) {
    await supabase.from("profiles").update({ profile_img: profileData.profile_img }).eq("id", profileid);
  }

  if (error) {
    console.log(error);

    return { success: false, error: error.message };
  }
  return { success: true, data: data };
};

export const getOsProfile = async (
  userSession: Session | null,
  role: string | null
) => {
  if (!userSession) {
    return Alert.alert("Error", "User not authenticated.");
  }

  const { id: userId } = userSession.user;
  const { data, error } = await supabase
    .from("osprofile")
    .select(
      `
    *,
    profiles!inner (
      id,
      user_id,
      role,
      profile_img
    )
  `
    )
    .eq("profiles.user_id", userId)
    .eq("profiles.role", role)
    .single();
  if (error) {
    console.log(error);

    return { success: false, error: error.message };
  }

  const normalized = {
    name: data.full_name || "",
    nickname: data.nickname || "",
    description: data.bio || "",
    age: data.age || "",
    phone: data.phone || "",
    email: data.email || "",
    emergencyContact: data.emergency_contact || "",
    location: data.city || "",
    specificAddress: data.specific_address || "",
    country: data.country || "",
    languages: data.languages || [],
    isVerified: data.is_verified || false,
    profile_img: data.profiles?.profile_img || data.profile_image_url || "",
  };

  // Extract media gallery if needed by caller, but generally we return ProfileData which doesn't have media gallery.
  // Wait, the caller expects ProfileData. MediaGallery is separate in the component state.
  // We should return media gallery data too if possible, OR the component handles it.
  // The component sets ProfileData from this return.
  // And it sets MediaGallery default state.
  // We need to return MediaGallery data too!

  const media = {
    mainImages: data.image_url || [],
    videoSource: data.videos_urls?.[0] || "",
  };

  return { success: true, data: normalized, media };
};

export const upsertAvailability = async (
  dateTimeSlots: DateTimeSlot[],
  userSession: Session | null,
  role: string | null
) => {
  try {
    if (!userSession) return { success: false, error: "User not authenticated" };

    if (!dateTimeSlots || dateTimeSlots.length === 0) {
      return { success: false, error: "No availability slots to save" };
    }

    // Filter out past dates to avoid constraint violation
    const today = new Date().toISOString().split("T")[0];
    const futureDateSlots = dateTimeSlots.filter(slot => slot.date >= today);

    if (futureDateSlots.length === 0) {
      return { success: false, error: "No future dates to save. Past dates cannot be saved." };
    }

    if (futureDateSlots.length < dateTimeSlots.length) {
      console.log(`Filtered out ${dateTimeSlots.length - futureDateSlots.length} past date(s)`);
    }

    const { id: userId } = userSession.user;

    // 1️⃣ Get profile id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", role)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return {
        success: false,
        error: profileError?.message || "Profile not found",
      };
    }

    console.log("Profile found:", profile.id);

    for (const dateSlot of futureDateSlots) {
      const { date, timeSlots } = dateSlot;

      console.log(`Processing date: ${date} with ${timeSlots.length} slots`);

      // 2️⃣ Fetch existing row for this date
      const { data: existingRow, error: fetchError } = await supabase
        .from("availability_slots")
        .select("id, time_slots")
        .eq("profile_id", profile.id)
        .eq("available_date", date)
        .maybeSingle();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        return { success: false, error: `Fetch error: ${fetchError.message}` };
      }

      if (existingRow) {
        // 3️⃣ Merge new time slots (avoid duplicates)
        const existing = existingRow.time_slots || [];
        const merged = [
          ...existing,
          ...timeSlots.filter(
            (slot) =>
              !existing.some(
                (ex: any) => ex.start === slot.start && ex.end === slot.end
              )
          ),
        ];

        console.log(`Updating existing row with ${merged.length} total slots`);

        // 4️⃣ Update that row with merged array
        const { error: updateError } = await supabase
          .from("availability_slots")
          .update({ time_slots: merged })
          .eq("id", existingRow.id);

        if (updateError) {
          console.error("Update failed:", updateError);
          return { success: false, error: `Update error: ${updateError.message}` };
        }
      } else {
        // 5️⃣ Insert new row for this date
        console.log(`Inserting new row with ${timeSlots.length} slots`);

        const { error: insertError } = await supabase
          .from("availability_slots")
          .insert({
            profile_id: profile.id,
            available_date: date,
            time_slots: timeSlots,
          });

        if (insertError) {
          console.error("Insert failed:", insertError);
          return { success: false, error: `Insert error: ${insertError.message}` };
        }
      }
    }

    console.log("All slots saved successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in upsertAvailability:", error);
    return { success: false, error: error?.message || "Unexpected error occurred" };
  }
};

export const getdateTimeSlots = async (
  userSession: Session | null,
  role: string | null
) => {
  if (!userSession) return { success: false, error: "User not authenticated" };

  const { id: userId } = userSession.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  if (profileError || !profile)
    return { success: false, error: profileError.message };

  const { data, error } = await supabase
    .from("availability_slots")
    .select("available_date, time_slots")
    .eq("profile_id", profile.id)
    .order("available_date", { ascending: true });

  if (error) return { success: false, error: error.message };

  return {
    success: true,
    data: data.map((item) => ({
      date: item.available_date,
      timeSlots: item.time_slots || [],
    })),
  };
};

export const removedateslot = async (
  userSession: Session | null,
  role: string | null,
  dateSlot: DateTimeSlot
) => {
  if (!userSession) return { success: false, error: "User not authenticated" };

  const { id: userId } = userSession!.user;

  // 1. Get profile_id for this role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  if (profileError || !profile) {
    console.log("Profile fetch error:", profileError);
    return { success: false, error: profileError?.message };
  }

  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("profile_id", profile.id)
    .eq("available_date", dateSlot.date);

  if (error) {
    console.log(error);
  }
};

export const removeTimeSlotFromDb = async (
  userSession: Session | null,
  role: string | null,
  date: string,
  start: string,
  end: string
) => {
  if (!userSession) return { success: false, error: "User not authenticated" };

  const { id: userId } = userSession.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  if (profileError || !profile)
    return {
      success: false,
      error: profileError?.message || "Profile not found",
    };

  const { data: existingRow, error: fetchError } = await supabase
    .from("availability_slots")
    .select("id, time_slots")
    .eq("profile_id", profile.id)
    .eq("available_date", date)
    .maybeSingle();

  if (fetchError || !existingRow)
    return { success: false, error: "No availability found for that date" };

  const filteredSlots = (existingRow.time_slots || []).filter(
    (slot: any) => !(slot.start === start && slot.end === end)
  );

  const { error: updateError } = await supabase
    .from("availability_slots")
    .update({ time_slots: filteredSlots })
    .eq("id", existingRow.id);

  if (updateError) return { success: false, error: updateError.message };

  return { success: true };
};

export const setPricingDb = async (
  userSession: Session | null,
  role: string | null,
  price: number
) => {
  if (!userSession) return { success: false, error: "User not authenticated" };
  const { id: userId } = userSession.user;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  if (profileError || !profile)
    return {
      success: false,
      error: profileError?.message || "Profile not found",
    };

  const { data: prices, error: priceError } = await supabase
    .from("pricing_settings")
    .upsert(
      { profile_id: profile.id, price_per_night: price },
      { onConflict: "profile_id" }
    )
    .select()
    .single();

  if (priceError) {
    console.log(priceError);

    return { success: false, message: priceError };
  }
  return { success: true, data: prices };
};

export const getAllBookings = async (
  userSession: Session | null,
  role: string | null
) => {
  const userId = userSession?.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .single();

  if (profileError || !profile)
    return {
      success: false,
      error: profileError?.message || "Profile not found",
    };
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
    *,
    booker_id(
        bookerprofile(nickname, bio, age, profile_image_url)
    )
  `
    )
    .eq("os_id", profile.id);

  if (error) {
    console.log("fetching booking error", error);
    return { success: false, error: error.message };
  }
  console.log("bookings details", data);
  console.log(
    "Booker full object:",
    data.map((item) => JSON.stringify(item.booker_id, null, 2))
  );

  return { success: true, data: data };
};
