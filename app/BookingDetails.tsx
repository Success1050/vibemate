import { getDurationInHours } from "@/hooks/timeToMinutes";
// import { useVideoPlayerState } from "@/hooks/VideoPlayer";
import CalendarPicker from "@/src/components/Calender";
import { theme } from "@/src/constants/themes";
import { styles } from "@/styles/BookingDetails";
import { TimeSlot } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState } from "react";
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

import { userData } from "@/mockData"; // 👈 import your data
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

const BookingDetails = () => {
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<TimeSlot | undefined>(
    undefined
  );

  const router = useRouter();

  const [isLoading, setisLoading] = useState<boolean>(false);

  const { id } = useLocalSearchParams();

  if (!id) {
    return <Text>No user ID provided</Text>;
  }

  const user = userData.find((u) => u.id === Number(id));

  if (!user) {
    return <Text>User not found</Text>;
  }

  const player = useVideoPlayer(user.media.videoSource, (player) => {
    player.loop = true;
    // player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleDateTimeSelect = (date: string, time: TimeSlot) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const totalPrice =
    selectedTime && selectedDate
      ? user.pricing.pricePerHour *
        getDurationInHours(selectedTime.start, selectedTime.end)
      : 0;

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const osId = 2;

  const bookingFunc = async (Os: number, userId: number) => {
    try {
      setisLoading(true);
      Alert.alert(
        "Booking Confirmation",
        `You have successfully booked ${
          user.profile.name
        } for ${formatDisplayDate(selectedDate)} at ${selectedTime?.start} - ${
          selectedTime?.end
        }`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      setisLoading(false);
      router.push("/");
    } catch (error) {
    } finally {
      setisLoading(false);
    }
    return;
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
          data={user.media.mainImages}
          renderItem={({ item, index }) => (
            <View style={styles.mainImageContainer}>
              <Image source={item} style={styles.mainImage} />
              <View style={styles.imageOverlay}>
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {index + 1} / {user.media.mainImages.length}
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
              source={user.profile.profileImage}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>{user.profile.name}</Text>
                {user.profile.isVerified && (
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
                {user.profile.subtitle}
              </Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>
                    {user.profile.rating} ({user.profile.reviewCount} reviews)
                  </Text>
                </View>
                {user.profile.isSuperhost && (
                  <>
                    <Text style={styles.statDivider}>•</Text>
                    <Text style={styles.statText}>Superhost</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          <Text style={styles.description}>{user.profile.description}</Text>
        </View>

        {/* Reviews & Verification */}
        <View style={styles.reviewsSection}>
          {user.verification.identityVerified && (
            <View style={styles.reviewItem}>
              <Ionicons name="shield-checkmark" size={20} color="#00D4AA" />
              <Text style={styles.reviewText}>Identity verified</Text>
            </View>
          )}
        </View>

        {/* Booking Options */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Availability Details</Text>

          {/* Price per Hour */}
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.optionLabel}>Cost per Hour</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>
                ₦{user.pricing.pricePerHour}/hr
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Duration */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowCalendar(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.optionLabel}>Duration</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>
                {selectedDate && selectedTime
                  ? `${formatDisplayDate(selectedDate)} • ${
                      selectedTime.start
                    } - ${selectedTime.end}`
                  : "Select date & time"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Preview */}
        {selectedDate && selectedTime && (
          <>
            <View style={styles.priceSection}>
              <Text style={styles.sectionTitle}>Price Details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  Cost for{" "}
                  {getDurationInHours(selectedTime.start, selectedTime.end)} hrs
                  ( ₦{user.pricing.pricePerHour} ×{" "}
                  {getDurationInHours(selectedTime.start, selectedTime.end)})
                </Text>
                <Text style={styles.priceValue}>
                  ₦
                  {getDurationInHours(selectedTime.start, selectedTime.end) *
                    user.pricing.pricePerHour}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service fee</Text>
                <Text style={styles.priceValue}>
                  ₦{user.pricing.serviceFee}
                </Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ₦{totalPrice + user.pricing.serviceFee}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  bookingFunc(user.id, osId);
                }}
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

        {/* Action Buttons */}

        {/* Footer Notice */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By booking, you agree to our Terms of Service and Privacy Policy.
            Cancellation policy applies.
          </Text>
        </View>

        {/* Calendar Modal */}
        <CalendarPicker
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          onDateTimeSelect={handleDateTimeSelect}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default BookingDetails;
