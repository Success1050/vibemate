import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { getAllBookings } from "@/src/osActions/action";
import { useApp } from "@/store";
import { styles } from "@/styles/OSBooking";
import { EarningsData } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BookingItem = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  night_rate: number;
  total_amount: number;
  status: string;
  created_at: string;
  booker: {
    name: string;
    avatar: string;
  };
  hotel: {
    name: string;
    location: string;
    img: string;
  };
};

const ProviderDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const { userSession, role } = useApp();
  const router = useRouter();

  // State for metrics
  const [walletBalance, setWalletBalance] = useState(0);
  const [rating, setRating] = useState(0);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);
  const [completedBookingsCount, setCompletedBookingsCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [providerName, setProviderName] = useState("Provider");
  const [providerImage, setProviderImage] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    const fetchData = async () => {
      if (!userSession?.user?.id) return;

      // 1. Fetch Wallet Balance
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userSession.user.id)
        .single();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
        return;
      }
      setWalletBalance(walletData.balance || 0);


      console.log('the wallet data', walletBalance);


      // 2. Fetch Profile Rating and Info
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*, osprofile(*)")
        .eq("user_id", userSession.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // console.log('the profile data', profileData);

      if (profileData) {
        const userProfile = Array.isArray(profileData.osprofile) ? profileData.osprofile[0] : profileData.osprofile;
        setRating(profileData.rating || 0);

        // Image selection logic
        let validImage = "https://via.placeholder.com/150";

        if (userProfile && Array.isArray(userProfile.image_url) && userProfile.image_url.length > 0) {
          validImage = userProfile.image_url[0];
        } else if (profileData.profile_img) {
          // Attempt to clean dirty string if it exists
          const cleaned = profileData.profile_img.trim().replace(/^["']|["']$/g, '').split(',')[0].trim().replace(/['"]+/g, '');
          if (cleaned.startsWith('http')) {
            validImage = cleaned;
          }
        }

        setProviderImage(validImage);

        if (userProfile) {
          setProviderName(userProfile.nickname || "Provider");
        }
      }

      // console.log('the provider image', providerImage);

      // 3. Fetch Bookings
      const res = await getAllBookings(userSession, role);
      if (res && res.success) {
        const allBookings = res.data || [];
        setTotalBookingsCount(allBookings.length);
        setCompletedBookingsCount(allBookings.filter((b: any) => b.status === "completed").length);
        setPendingBookingsCount(allBookings.filter((b: any) => b.status === "pending_payment" || b.status === "payment_held").length);

        const normalized: BookingItem[] = allBookings.slice(0, 5).map((item: any) => {
          const booker = item.booker_id?.bookerprofile || {};
          return {
            id: item.id,
            booking_date: item.booking_date,
            start_time: item.start_time,
            end_time: item.end_time,
            night_rate: item.night_rate,
            total_amount: item.total_amount,
            status: item.status,
            created_at: item.created_at,
            booker: {
              name: booker.nickname || "User",
              avatar: booker.profile_image_url || "https://via.placeholder.com/150",
            },
            hotel: {
              name: item.hotel || "Not selected",
              location: item.hotel_location || "Not specified",
              img: item.hotel_img || "Not specified",
            },
          };
        });
        setBookings(normalized);
      }
    };
    fetchData();
  }, [userSession]);

  const earnings: EarningsData = {
    thisMonth: walletBalance, // Using wallet balance as "This Month" for now, or fetch transactions
    lastMonth: 0,
    totalBookings: totalBookingsCount,
    pendingBookings: pendingBookingsCount,
    completedBookings: completedBookingsCount,
  };

  const handleBookingAction = (
    bookingId: string,
    action: "accept" | "decline"
  ) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${action} this booking?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Success", `Booking ${action}ed successfully!`);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "#FF9500";
      case "payment_held":
      case "accepted":
        return "#007AFF";
      case "completed":
        return "#34C759";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "time-outline";
      case "payment_held":
      case "accepted":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-circle";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderBookingCard = ({ item }: { item: BookingItem }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.clientInfo}>
          <Image source={{ uri: item.hotel.img }} style={styles.clientImage} />
          <View style={styles.clientDetails}>
            <Text style={styles.clientName}>{item.booker.name}</Text>
            <Text style={styles.bookingDate}>
              {formatDate(item.booking_date)} • {item.start_time} - {item.end_time}
            </Text>
            <Text style={styles.bookingLocation}>
              {item.hotel.name} • {item.hotel.location}
            </Text>
          </View>
        </View>
        <View style={styles.bookingAmount}>
          <Text style={styles.amountText}>₦{item.total_amount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>

        {item.status === "payment_held" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={() => handleBookingAction(item.id, "decline")}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleBookingAction(item.id, "accept")}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Link href="/OSBookingmanage">{/* <Text>Bookings</Text> */}</Link>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: providerImage }}
              style={styles.profileImage}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.providerName}>{providerName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={() => router.push("/osWithdrawal")}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="wallet-outline" size={24} color="#34C759" />
                <Text style={styles.statValue}>
                  ₦{earnings.thisMonth.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.statLabel}>Wallet Balance</Text>
              {/* Removed percentage change since wallet is a balance, not monthly earnings */}
            </View>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{earnings.totalBookings}</Text>
            </View>
            <Text style={styles.statLabel}>Total Bookings</Text>
            <Text style={styles.statSubValue}>
              {earnings.completedBookings} completed
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>
              {earnings.pendingBookings}
            </Text>
            <Text style={styles.quickStatLabel}>Pending</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{rating ? rating.toFixed(1) : "0.0"}</Text>
            <Text style={styles.quickStatLabel}>Rating</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>
              {/* Review count needs a fetch or join, simplified to static/placeholder if not available easily */}
              {/* {providerInfo.reviewCount} */}
              --
            </Text>
            <Text style={styles.quickStatLabel}>Reviews</Text>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => router.push("/allOsBookings")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={() => router.push("/(OSTabs)/OSBookingmanage")}
              style={styles.quickActionButton}
            >
              <Ionicons name="calendar" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Set Availability</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(OSTabs)/OSBookingmanage")}
              style={styles.quickActionButton}
            >
              <Ionicons name="pricetag" size={24} color="#FF9500" />
              <Text style={styles.quickActionText}>Update Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(OSTabs)/OSProfile")}
              style={styles.quickActionButton}
            >
              <Ionicons name="person" size={24} color="#34C759" />
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="stats-chart" size={24} color="#AF52DE" />
              <Text style={styles.quickActionText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProviderDashboard;
