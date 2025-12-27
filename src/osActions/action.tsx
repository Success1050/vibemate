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
      profile_image_url: "",
      languages: profileData.languages,
      // image_url: mediaGallery.mainImages,
      // videos_urls: mediaGallery.videoSource,
      show_location: privacy.showLocation,
      show_age: privacy.showAge,
      show_phone: privacy.showPhone,
    },
    { onConflict: "id" }
  );

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
      role
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
  };
  return { success: true, data: normalized };
};

export const upsertAvailability = async (
  dateTimeSlots: DateTimeSlot[],
  userSession: Session | null,
  role: string | null
) => {
  if (!userSession) return { success: false, error: "User not authenticated" };

  const { id: userId } = userSession.user;

  // 1️⃣ Get profile id
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

  for (const dateSlot of dateTimeSlots) {
    const { date, timeSlots } = dateSlot;

    // 2️⃣ Fetch existing row for this date
    const { data: existingRow, error: fetchError } = await supabase
      .from("availability_slots")
      .select("id, time_slots")
      .eq("profile_id", profile.id)
      .eq("available_date", date)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      continue;
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

      // 4️⃣ Update that row with merged array
      const { error: updateError } = await supabase
        .from("availability_slots")
        .update({ time_slots: merged })
        .eq("id", existingRow.id);

      if (updateError) console.error("Update failed:", updateError);
    } else {
      // 5️⃣ Insert new row for this date
      const { error: insertError } = await supabase
        .from("availability_slots")
        .insert({
          profile_id: profile.id,
          available_date: date,
          time_slots: timeSlots,
        });

      if (insertError) console.error("Insert failed:", insertError);
    }
  }

  return { success: true };
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
