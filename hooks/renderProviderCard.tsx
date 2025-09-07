import { ServiceProvider } from "@/tsx-types";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Crown, Star } from "lucide-react-native";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "#10B981";
    case "busy":
      return "#F59E0B";
    case "offline":
      return "#94A3B8";
    default:
      return "#94A3B8";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available";
    case "busy":
      return "Busy";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
};

export const renderProviderCard = useCallback(
  (provider: ServiceProvider, isHorizontal = false): React.ReactElement => (
    <View style={[styles.card, isHorizontal && styles.horizontalCard]}>
      <Image source={provider.image} style={styles.cardImage} />
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(provider.availability) },
        ]}
      >
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          {getStatusText(provider.availability)}
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
        <Text style={styles.cardDescription}>{provider.description}</Text>
        <View style={styles.tagsContainer}>
          {provider.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.rating}>
            <Star size={14} color="#FBBF24" />
            <Text style={styles.ratingText}>{provider.rating}</Text>
          </View>
          <Text style={styles.price}>${provider.price}/hr</Text>
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
  cardImage: { width: "100%", height: 120 },
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
