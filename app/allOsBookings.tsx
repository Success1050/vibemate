import { getAllBookings } from "@/src/osActions/action";
import { useApp } from "@/store";
type BookingItem = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  night_rate: number;
  total_amount: number;
  status: string;
  created_at: string;
  os_id?: string;
  booker_id?: any;
  booker: {
    name: string;
    avatar: string;
  };
  hotel: {
    name: string;
    image: string;
    location: string;
  };
};

// import { BookingItem } from "@/tsx-types";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Check, X, Clock, MapPin, Calendar, Users } from "lucide-react";

const BookingsScreen = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const { userSession, role } = useApp();
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchAllBookings = async () => {
    try {
      const res = await getAllBookings(userSession, role);
      if (res && res.success) {
        const normalized: BookingItem[] = (res.data || []).map((item) => {
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
            os_id: item.os_id,
            booker_id: item.booker_id,
            booker: {
              name: booker.nickname,
              avatar:
                booker.profile_image_url || "https://via.placeholder.com/150",
            },
            hotel: {
              name: `Hotel #${item.os_id}`,
              image: "https://via.placeholder.com/300x200",
              location: "Not specified",
            },
          };
        });

        setBookings(normalized);
      }
    } catch (error) {
      console.log("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const onRefresh = async () => {
    setRefresh(true);
    await fetchAllBookings();
    setRefresh(false);
  };

  const handleAccept = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "accepted" } : booking
      )
    );
    // Add your API call here to update the booking status
    console.log("Accepted booking:", bookingId);
  };

  const handleReject = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
    // Add your API call here to update the booking status
    console.log("Rejected booking:", bookingId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "#F59E0B";
      case "payment_held":
        return "#3B82F6";
      case "accepted":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {bookings.filter((b) => b.status === "payment_held").length} pending
          approvals
        </Text>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(booking.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(booking.status) },
                ]}
              >
                {getStatusText(booking.status)}
              </Text>
            </View>

            {/* Booker Information */}
            <View style={styles.bookerSection}>
              <Image
                source={{ uri: booking.booker.avatar }}
                style={styles.avatar}
              />
              <View style={styles.bookerInfo}>
                <Text style={styles.bookerLabel}>Booked by</Text>
                <Text style={styles.bookerName}>{booking.booker.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            {/* Hotel Information */}
            <View style={styles.hotelSection}>
              <Image
                source={{ uri: booking.hotel.image }}
                style={styles.hotelImage}
              />
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>{booking.hotel.name}</Text>
                <View style={styles.locationRow}>
                  {/* <MapPin size={14} color="#6B7280" /> */}
                  <Text style={styles.locationText}>
                    {booking.hotel.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Booking Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  {/* <Calendar size={16} color="#6B7280" /> */}
                  <Text style={styles.detailText}>
                    {formatDate(booking.booking_date)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  {/* <Clock size={16} color="#6B7280" /> */}
                  <Text style={styles.detailText}>
                    {booking.start_time} - {booking.end_time}
                  </Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Amount</Text>
                <Text style={styles.priceValue}>
                  ${booking.total_amount.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {(booking.status === "pending_payment" ||
              booking.status === "payment_held") && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(booking.id)}
                >
                  {/* <X size={20} color="#EF4444" /> */}
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(booking.id)}
                >
                  {/* <Check size={20} color="#FFFFFF" /> */}
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#1F2937",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  hotelSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  hotelInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  bookerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  bookerInfo: {
    marginLeft: 12,
  },
  bookerLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  bookerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 6,
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
});

export default BookingsScreen;
