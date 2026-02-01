import { supabase } from "@/lib/supabase";
import { useApp } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface BookingItem {
    id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
    status: string;
    rejected: boolean | null;
    hotel: string;
    hotel_location: string;
    hotel_img: string;
    profiles: {
        username: string;
        profile_img: string;
    };
}

const BookingsScreen = () => {
    const { userSession } = useApp();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            if (!userSession?.user?.id) return;
            const { data, error } = await supabase
                .from("bookings")
                .select(`
    *,
    profiles:os_id (
      user_id,
      username,
      profile_img
    )
  `)
                .eq("booker_id", userSession.user.id)
                .order("created_at", { ascending: false });


            if (error) {
                console.error("Error fetching bookings:", error);
            } else {
                setBookings(data || []);

                console.log('data', data);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [userSession]);

    console.log('bookings', bookings);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const getStatusContent = (rejected: boolean | null, status: string) => {
        if (rejected === true) {
            return {
                label: "Rejected",
                color: "#EF4444",
                bg: "#FEE2E2",
                dotColor: "#B91C1C",
            };
        }
        if (status === "accepted" || rejected === false) {
            return {
                label: "Accepted",
                color: "#065F46",
                bg: "#D1FAE5",
                dotColor: "#059669",
            };
        }
        return {
            label: "Pending",
            color: "#92400E",
            bg: "#FEF3C7",
            dotColor: "#D97706",
        };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Bookings</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {bookings.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
                            <Text style={styles.emptyText}>No bookings yet</Text>
                        </View>
                    ) : (
                        bookings.map((item) => {
                            const statusStyle = getStatusContent(item.rejected, item.status);
                            const providerName = item?.profiles?.username || "Service Provider";
                            const providerImage = item?.profiles?.profile_img.trim().replace(/^["']|["']$/g, '').split(',')[0].trim().replace(/['"]+/g, '') || "https://via.placeholder.com/150";

                            return (
                                <View key={item.id} style={styles.card}>
                                    {/* Status Tag */}
                                    <View style={styles.statusContainer}>
                                        <View style={[styles.statusTag, { backgroundColor: statusStyle.bg }]}>
                                            <View style={[styles.statusDot, { backgroundColor: statusStyle.dotColor }]} />
                                            <Text style={[styles.statusText, { color: statusStyle.color }]}>
                                                {statusStyle.label}
                                            </Text>
                                        </View>
                                        <Text style={styles.dateText}>{formatDate(item.booking_date)}</Text>
                                    </View>

                                    {/* Provider Info */}
                                    <View style={styles.providerSection}>
                                        <Image source={{ uri: providerImage }} style={styles.providerImage} />
                                        <View style={styles.providerInfo}>
                                            <Text style={styles.providerName}>{providerName}</Text>
                                            {/* <Text style={styles.serviceText}>Standard Service</Text> */}
                                        </View>
                                        <Text style={styles.amount}>₦{item.total_amount.toLocaleString()}</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    {/* Hotel Info */}
                                    <View style={styles.detailsSection}>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="business" size={16} color="#6B7280" />
                                            <Text style={styles.detailText}>{item.hotel || "Hotel not selected"}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="location" size={16} color="#6B7280" />
                                            <Text style={styles.detailText} numberOfLines={1}>
                                                {item.hotel_location || "Location not specified"}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="time" size={16} color="#6B7280" />
                                            <Text style={styles.detailText}>
                                                {item.start_time} - {item.end_time}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
    },
    scrollContent: {
        padding: 20,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    statusTag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    dateText: {
        fontSize: 12,
        color: "#6B7280",
    },
    providerSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    providerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E5E7EB",
    },
    providerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    providerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    serviceText: {
        fontSize: 13,
        color: "#6B7280",
    },
    amount: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 12,
    },
    detailsSection: {
        gap: 8,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    detailText: {
        fontSize: 13,
        color: "#4B5563",
        flex: 1,
    },
});

export default BookingsScreen;
