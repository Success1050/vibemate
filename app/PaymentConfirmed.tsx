import ScreenWrapper from "@/src/components/ScreenWrapper";
import { hp } from "@/src/helpers/command";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BookingDetails {
  bookingId: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  duration: string;
}

interface TransactionReceipt {
  transactionId: string;
  paymentMethod: string;
  timestamp: string;
  status: string;
}

interface BookingConfirmationProps {
  booking?: BookingDetails;
  receipt?: TransactionReceipt;
  walletBalance?: number;
}

const BookingConfirmationScreen: React.FC<BookingConfirmationProps> = ({
  booking = {
    bookingId: "BK001234567",
    serviceName: "Premium Service",
    providerName: "Sarah Johnson",
    date: "2025-09-08",
    time: "7:00 PM",
    location: "123 Main Street, Downtown",
    amount: 150.0,
    duration: "2 hours",
  },
  receipt = {
    transactionId: "TXN789456123",
    paymentMethod: "Credit Card ****1234",
    timestamp: new Date().toISOString(),
    status: "Confirmed",
  },
  walletBalance = 245.5,
}) => {
  const [isArrived, setIsArrived] = useState(false);
  const [checkInAnimation] = useState(new Animated.Value(1));

  const handleChatPress = () => {
    Alert.alert("Chat", `Opening chat with ${booking.providerName}...`);
  };

  const handleCheckIn = () => {
    Animated.sequence([
      Animated.timing(checkInAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkInAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      "Confirm Arrival",
      "Please confirm that you have arrived at the location. This will release payment to the service provider.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setIsArrived(true);
            Alert.alert(
              "Success",
              "Payment has been released to the service provider!"
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.headerTitle}>Payment Confirmed!</Text>
          <Text style={styles.headerSubtitle}>Your booking is confirmed</Text>
        </View>

        {/* Booking Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID:</Text>
            <Text style={styles.detailValue}>{booking.bookingId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service:</Text>
            <Text style={styles.detailValue}>{booking.serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider:</Text>
            <Text style={styles.detailValue}>{booking.providerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{booking.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{booking.location}</Text>
          </View>
        </View>

        {/* Transaction Receipt Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Receipt</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>{receipt.transactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.amountValue}>${booking.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{receipt.paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>
              {formatTime(receipt.timestamp)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{receipt.status}</Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wallet Balance</Text>
          <View style={styles.walletBalance}>
            <Ionicons name="wallet" size={24} color="#6C63FF" />
            <Text style={styles.balanceAmount}>
              ${walletBalance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Check-in Button */}
          <Animated.View style={{ transform: [{ scale: checkInAnimation }] }}>
            <TouchableOpacity
              style={[
                styles.checkInButton,
                isArrived && styles.checkInButtonCompleted,
              ]}
              onPress={handleCheckIn}
              disabled={isArrived}
            >
              <View style={styles.checkInButtonContent}>
                {isArrived ? (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color="#FFFFFF"
                    />
                    <Text style={styles.checkInButtonText}>
                      Arrived & Confirmed
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="location" size={30} color="#FFFFFF" />
                    <Text style={styles.checkInButtonText}>
                      Service received
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Click "I've Arrived" when you reach the location to release payment
            to the service provider.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  successIcon: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F2F6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  amountValue: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    backgroundColor: "#D5EDDA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#155724",
    fontSize: 12,
    fontWeight: "600",
  },
  walletBalance: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    marginLeft: 10,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatButton: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  checkInButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkInButtonCompleted: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
  },
  checkInButtonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkInButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: hp(4),
  },
});

export default BookingConfirmationScreen;
