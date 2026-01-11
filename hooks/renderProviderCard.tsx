import { ProviderCard } from "@/tsx-types";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Crown } from "lucide-react-native";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const getStatusColor = (status: boolean) => {
  switch (status) {
    case true:
      return "#10B981";
    case false:
      return "#F59E0B";
    default:
      return "#94A3B8";
  }
};

const getStatusText = (status: boolean) => {
  switch (status) {
    case true:
      return "Available";
    case false:
      return "unavailable";
    default:
      return "Unknown";
  }
};

export const renderProviderCard = useCallback(
  (provider: ProviderCard, isHorizontal = false): React.ReactElement => (
    <View style={[styles.card, isHorizontal && styles.horizontalCard]}>
      <Image
        source={provider.image}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(provider.is_available) },
        ]}
      >
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          {getStatusText(provider.is_available)}
        </Text>
      </View>
      {provider.featured && (
        <View style={styles.featuredBadge}>
          <Crown size={12} color="#fff" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{provider.name}</Text>
        <Text style={styles.cardDescription}>{provider.bio}</Text>
        <View style={styles.cardFooter}>
          {/* <View style={styles.rating}>
            <Star size={14} color="#FBBF24" />
            <Text style={styles.ratingText}>{provider.rating}</Text>
          </View> */}
          <Text style={styles.price}>${provider.price_per_night}/night</Text>
        </View>
        <Link
          href={{ pathname: "/BookingDetails", params: { id: provider.id } }}
          asChild
        >
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Session</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  ),
  []
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    flex: 1,
  },
  horizontalCard: { width: 200, marginRight: 12 },
  cardImage: { width: "100%", height: 180 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  cardDescription: { fontSize: 12, color: "#64748B", marginBottom: 6 },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#EDE9FE",
    color: "#7C3AED",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, marginLeft: 2 },
  price: { fontSize: 14, fontWeight: "bold", color: "#7C3AED" },
  bookButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: { color: "#fff", fontWeight: "bold" },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  statusText: { color: "#fff", fontSize: 10 },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBBF24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  featuredText: { fontSize: 10, color: "#fff", marginLeft: 4 },
});
