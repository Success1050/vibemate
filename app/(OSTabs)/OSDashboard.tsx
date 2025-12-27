// ProviderDashboard.tsx
import { recentBookings } from "@/mockData";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { styles } from "@/styles/OSBooking";
import { EarningsData, OSBookingOrder } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProviderDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Mock data
  const providerInfo = {
    name: "Sarah Johnson",
    profileImage: require("@/assets/images/1.jpg"), // Replace with actual path
    rating: 4.8,
    reviewCount: 142,
    isVerified: true,
  };

  const earnings: EarningsData = {
    thisMonth: 15420,
    lastMonth: 12800,
    totalBookings: 48,
    pendingBookings: 3,
    completedBookings: 42,
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

  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9500";
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
      case "pending":
        return "time-outline";
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

  const renderBookingCard = ({ item }: { item: OSBookingOrder }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.clientInfo}>
          <Image source={item.clientImage} style={styles.clientImage} />
          <View style={styles.clientDetails}>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <Text style={styles.bookingDate}>
              {formatDate(item.date)} • {item.time}
            </Text>
            <Text style={styles.bookingLocation}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.bookingAmount}>
          <Text style={styles.amountText}>₦{item.amount}</Text>
          <Text style={styles.durationText}>{item.duration}hrs</Text>
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
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>

        {item.status === "pending" && (
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
              source={providerInfo.profileImage}
              style={styles.profileImage}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.providerName}>{providerInfo.name}</Text>
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
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={styles.statChange}>
                +
                {(
                  ((earnings.thisMonth - earnings.lastMonth) /
                    earnings.lastMonth) *
                  100
                ).toFixed(1)}
                % from last month
              </Text>
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
            <Text style={styles.quickStatNumber}>{providerInfo.rating}</Text>
            <Text style={styles.quickStatLabel}>Rating</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>
              {providerInfo.reviewCount}
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
            data={recentBookings}
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
