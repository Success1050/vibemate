import { getDurationInHours } from "@/hooks/timeToMinutes";
import { theme } from "@/src/constants/themes";
import { styles } from "@/styles/BookingDetails";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchSingleOs } from "@/src/bookersActions/action";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { AvailabilitySlot, OsProviders } from "@/tsx-types";

import { supabase } from "@/lib/supabase";
import { useApp } from "@/store";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

// Mock availability data - Replace with actual API call
const mockAvailabilitySlots = [
  {
    id: 1,
    profile_id: 1,
    available_date: "2025-10-15",
    time_slots: [
      {
        start: "09:00",
        end: "12:00",
        is_available: true,
        is_booked: false,
      },
      {
        start: "14:00",
        end: "17:00",
        is_available: true,
        is_booked: false,
      },
      {
        start: "18:00",
        end: "21:00",
        is_available: true,
        is_booked: false,
      },
    ],
    instant_booking: true,
  },
  {
    id: 2,
    profile_id: 1,
    available_date: "2025-10-16",
    time_slots: [
      {
        start: "10:00",
        end: "13:00",
        is_available: true,
        is_booked: false,
      },
      {
        start: "15:00",
        end: "18:00",
        is_available: true,
        is_booked: false,
      },
    ],
    instant_booking: false,
  },
  {
    id: 3,
    profile_id: 1,
    available_date: "2025-10-17",
    time_slots: [
      {
        start: "08:00",
        end: "11:00",
        is_available: true,
        is_booked: false,
      },
      {
        start: "13:00",
        end: "16:00",
        is_available: true,
        is_booked: false,
      },
      {
        start: "17:00",
        end: "20:00",
        is_available: true,
        is_booked: false,
      },
    ],
    instant_booking: true,
  },
];

interface SelectedSlot {
  date: string;
  timeSlot: {
    start: string;
    end: string;
  };
  slotId: number;
}

const BookingDetails = () => {
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const router = useRouter();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const [osDetails, setOsdetails] = useState<OsProviders | null>(null);
  const { userSession, role } = useApp();

  useEffect(() => {
    const getOsDetails = async () => {
      const res = await fetchSingleOs(Number(id));
      if (res && res.success) {
        console.log("the specif os", res.data);
        const rawProfile = Array.isArray(res?.data?.osprofile)
          ? res?.data?.osprofile[0]
          : res?.data?.osprofile;
        const rawPricing = Array.isArray(res?.data?.pricing_settings)
          ? res?.data?.pricing_settings[0]
          : res?.data?.pricing_settings;

        const formattedData: OsProviders = {
          id: Number(res?.data?.id ?? 0),
          user_id: (res?.data?.user_id || "") as string,
          email: (res?.data?.email || "") as string,
          role: (res?.data?.role || "") as string,
          osprofile: {
            bio: (rawProfile?.bio || "") as string,
            featured: (rawProfile?.featured || false) as boolean,
            full_name: (rawProfile?.full_name || "") as string,
            image_url: (rawProfile?.image_url || []) as string[],
            is_available: (rawProfile?.is_available || false) as boolean,
            nickname: (rawProfile?.nickname || "") as string,
            videos_urls: (rawProfile?.videos_urls || []) as string[],
          },
          pricing_settings: {
            price_per_night: Number(rawPricing?.price_per_night || 0),
          },
          availability_slots:
            (res?.data?.availability_slots as unknown as AvailabilitySlot[]) ||
            [],
        };
        console.log("images of os", formattedData.osprofile.image_url);

        setOsdetails(formattedData);
      }
    };
    getOsDetails();
  }, [id]);

  const player = useVideoPlayer(
    osDetails?.osprofile?.videos_urls?.[0] ?? "",
    (player) => {
      player.loop = true;
    }
  );

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  if (!osDetails) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.activetabbarcolor,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading her beauty...
        </Text>
      </View>
    );
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculatePrice = (startTime: string, endTime: string) => {
    const duration = getDurationInHours(startTime, endTime);
    return osDetails.pricing_settings.price_per_night * duration;
  };

  const handleSlotSelection = (slotId: number, date: string, timeSlot: any) => {
    setSelectedSlot({
      slotId,
      date,
      timeSlot,
    });
  };

  const totalPrice = selectedSlot
    ? calculatePrice(selectedSlot.timeSlot.start, selectedSlot.timeSlot.end)
    : 0;


  const userId = userSession?.user?.id;

  const bookingFunc = async () => {
    if (!selectedSlot || !osDetails) {
      Alert.alert("Error", "Please select a slot before booking.");
      return;
    }

    if (!userId) {
      Alert.alert("Not logged in", "Please log in to book.");
      return;
    }

    const bookerId = userId;
    const osId = osDetails.id;
    const { start, end } = selectedSlot.timeSlot;
    const bookingDate = selectedSlot.date;

    const duration = getDurationInHours(start, end);
    const hourlyRate = osDetails.pricing_settings.price_per_night;
    const totalAmount = hourlyRate * duration;

    // 1️⃣ Ask user for confirmation
    Alert.alert(
      "Confirm Booking",
      `Book ${osDetails.osprofile.nickname} for ${formatDisplayDate(
        bookingDate
      )} (${start} - ${end})?\n\nThis will deduct ₦${totalAmount.toLocaleString()} from your wallet.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Proceed",
          onPress: async () => {
            try {
              setisLoading(true);

              // 2️⃣ Deduct from wallet via Supabase function
              const { data: walletRes, error: walletErr } = await supabase.rpc(
                "debit_wallet",
                {
                  p_user_id: bookerId,
                  p_amount: totalAmount,
                  p_description: `Booking ${
                    osDetails.osprofile.nickname
                  } for ${formatDisplayDate(bookingDate)}`,
                }
              );

              if (walletErr) {
                console.error("Wallet debit error:", walletErr);
                Alert.alert(
                  "Payment Failed",
                  walletErr.message || "Insufficient balance."
                );
                return;
              }

              console.log("Wallet debited:", walletRes);

              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .eq("user_id", bookerId)
                .eq("role", role)
                .single();

              if (profileError || !profile)
                return {
                  success: false,
                  error: profileError?.message || "Profile not found",
                };
              // 3️⃣ Create booking record
              const { data: bookingData, error: bookingError } = await supabase
                .from("bookings")
                .insert([
                  {
                    booker_id: profile.id,
                    os_id: osId,
                    booking_date: bookingDate,
                    start_time: start,
                    end_time: end,
                    night_rate: hourlyRate,
                    total_amount: totalAmount,
                    status: "pending_payment",
                  },
                ])
                .select();

              if (bookingError) {
                console.error("Error inserting booking:", bookingError);
                Alert.alert(
                  "Booking Failed",
                  "Something went wrong. Try again."
                );
                return;
              }

              if (!bookingError && bookingData && bookingData.length > 0) {
                const paymentRef = `ESCROW-${Date.now()}-${Math.floor(
                  Math.random() * 10000
                )}`;

                const { error: escrowError } = await supabase
                  .from("escrow_payments")
                  .insert([
                    {
                      booking_id: bookingData[0].id,
                      booker_id: bookerId,
                      os_id: osId,
                      amount: totalAmount,
                      status: "held",
                      payment_ref: paymentRef,
                    },
                  ]);

                if (escrowError) {
                  console.log("Error inserting into escrow:", escrowError);
                  return;
                } else {
                  console.log("Escrow payment recorded successfully");
                }
              }

              // ✅ Success
              Alert.alert(
                "Booking Successful 🎉",
                `You booked ${
                  osDetails.osprofile.nickname
                } for ${formatDisplayDate(
                  bookingDate
                )} (${start} - ${end}). ₦${totalAmount.toLocaleString()} was deducted.`,
                [
                  {
                    text: "OK",
                    onPress: () => router.push("/hotelSelectionScreen"),
                  },
                ]
              );
            } catch (err) {
              console.error("Unexpected error:", err);
              Alert.alert("Error", "Something went wrong.");
            } finally {
              setisLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.activetabbarcolor}
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <FlatList
          data={osDetails?.osprofile.image_url}
          renderItem={({ item, index }) => (
            <View style={styles.mainImageContainer}>
              <Image source={{ uri: item }} style={styles.mainImage} />
              <View style={styles.imageOverlay}>
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {index + 1} / {osDetails.osprofile.image_url.length}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />

        {/* Video Section */}
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            allowsFullscreen
            player={player}
            allowsPictureInPicture
          />
          <TouchableOpacity
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={
                osDetails?.osprofile.image_url[0]
                  ? { uri: osDetails.osprofile.image_url[0] }
                  : undefined
              }
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>
                  {osDetails?.osprofile.nickname}
                </Text>
                {osDetails.osprofile.is_available && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#00D4AA"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.profileSubtitle}>
                {osDetails?.osprofile.bio}
              </Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  {/* <Text style={styles.statText}>
                    {user.profile.rating} ({user.profile.reviewCount} reviews)
                  </Text> */}
                </View>
                {/* {user.profile.isSuperhost && (
                  <>
                    <Text style={styles.statDivider}>•</Text>
                    <Text style={styles.statText}>Superhost</Text>
                  </>
                )} */}
              </View>
            </View>
          </View>

          <Text style={styles.description}>{osDetails.osprofile.bio}</Text>
        </View>

        {/* Reviews & Verification */}
        {/* <View style={styles.reviewsSection}>
          {user.verification.identityVerified && (
            <View style={styles.reviewItem}>
              <Ionicons name="shield-checkmark" size={20} color="#00D4AA" />
              <Text style={styles.reviewText}>Identity verified</Text>
          {osDetails.availability_slots.map((slot: AvailabilitySlot) => (
          )}
        </View> */}

        {/* Available Time Slots Section */}
        <View style={availabilityStyles.availabilitySection}>
          <Text style={availabilityStyles.sectionTitle}>
            Available Time Slots
          </Text>
          <Text style={availabilityStyles.sectionSubtitle}>
            Select a date and time that works for you
          </Text>

          {osDetails?.availability_slots?.map((slot, index) => (
            <View
              key={`${slot.id ?? "slot"}-${index}`}
              style={availabilityStyles.dateCard}
            >
              {/* Date Header */}
              <View style={availabilityStyles.dateHeader}>
                <View style={availabilityStyles.dateHeaderLeft}>
                  <Ionicons name="calendar" size={20} color="#FF385C" />
                  <Text style={availabilityStyles.dateText}>
                    {formatDisplayDate(slot.available_date ?? "")}
                  </Text>
                </View>
                {/* {slot.instant_booking && (
                  <View style={availabilityStyles.instantBadge}>
                    <Ionicons name="flash" size={14} color="#FF385C" />
                    <Text style={availabilityStyles.instantText}>Instant</Text>
                  </View>
                )} */}
              </View>

              {/* Time Slots */}
              <View style={availabilityStyles.timeSlotsContainer}>
                {slot?.time_slots?.map((timeSlot, index) => {
                  const isSelected =
                    selectedSlot?.slotId === slot.id &&
                    selectedSlot?.timeSlot.start === timeSlot.start;
                  const price = calculatePrice(
                    timeSlot.start ?? "",
                    timeSlot.end ?? ""
                  );
                  const duration = getDurationInHours(
                    timeSlot.start ?? "",
                    timeSlot.end ?? ""
                  );

                  return (
                    <TouchableOpacity
                      key={`${index}-${timeSlot.start ?? "start"}`}
                      style={[
                        availabilityStyles.timeSlotCard,
                        isSelected && availabilityStyles.timeSlotCardSelected,
                        timeSlot.is_booked &&
                          availabilityStyles.timeSlotCardDisabled,
                      ]}
                      onPress={() =>
                        !timeSlot.is_booked &&
                        handleSlotSelection(
                          slot.id!,
                          slot.available_date ?? "",
                          timeSlot
                        )
                      }
                      disabled={timeSlot.is_booked}
                      activeOpacity={0.7}
                    >
                      {/* Checkbox */}
                      <View
                        style={[
                          availabilityStyles.checkbox,
                          isSelected && availabilityStyles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>

                      {/* Time Info */}
                      <View style={availabilityStyles.timeSlotInfo}>
                        <View style={availabilityStyles.timeRow}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color={isSelected ? "#FF385C" : "#666"}
                          />
                          <Text
                            style={[
                              availabilityStyles.timeText,
                              isSelected && availabilityStyles.timeTextSelected,
                            ]}
                          >
                            {timeSlot.start} - {timeSlot.end}
                          </Text>
                          <Text style={availabilityStyles.durationText}>
                            ({duration} {duration === 1 ? "hr" : "hrs"})
                          </Text>
                        </View>

                        {/* Price */}
                        <View style={availabilityStyles.priceRow}>
                          <Text
                            style={[
                              availabilityStyles.priceText,
                              isSelected &&
                                availabilityStyles.priceTextSelected,
                            ]}
                          >
                            ₦{price.toLocaleString()}
                          </Text>
                          <Text style={availabilityStyles.priceSubtext}>
                            (₦{osDetails.pricing_settings.price_per_night}
                            /night)
                          </Text>
                        </View>
                      </View>

                      {/* Status Badge */}
                      {timeSlot.is_booked && (
                        <View style={availabilityStyles.bookedBadge}>
                          <Text style={availabilityStyles.bookedText}>
                            Booked
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Price Preview */}
        {selectedSlot && (
          <>
            <View style={styles.priceSection}>
              <Text style={styles.sectionTitle}>Price Details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  Cost for{" "}
                  {getDurationInHours(
                    selectedSlot.timeSlot.start,
                    selectedSlot.timeSlot.end
                  )}{" "}
                  hrs ( ₦{osDetails.pricing_settings.price_per_night} ×{" "}
                  {getDurationInHours(
                    selectedSlot.timeSlot.start,
                    selectedSlot.timeSlot.end
                  )}
                  )
                </Text>
                <Text style={styles.priceValue}>₦{totalPrice}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service fee</Text>
                <Text style={styles.priceValue}>₦ 1000</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₦{totalPrice + 1000}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={bookingFunc}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Book me"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer Notice */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By booking, you agree to our Terms of Service and Privacy Policy.
            Cancellation policy applies.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

// Availability Styles
const availabilityStyles = {
  availabilitySection: {
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#222",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  dateCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dateHeaderLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#222",
  },
  instantBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  instantText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FF385C",
  },
  timeSlotsContainer: {
    gap: 10,
  },
  timeSlotCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E8E8E8",
  },
  timeSlotCardSelected: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF385C",
  },
  timeSlotCardDisabled: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    marginRight: 12,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  checkboxSelected: {
    backgroundColor: "#FF385C",
    borderColor: "#FF385C",
  },
  timeSlotInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#333",
  },
  timeTextSelected: {
    color: "#FF385C",
  },
  durationText: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#222",
  },
  priceTextSelected: {
    color: "#FF385C",
  },
  priceSubtext: {
    fontSize: 12,
    color: "#999",
  },
  bookedBadge: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookedText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FF385C",
  },
};

export default BookingDetails;
