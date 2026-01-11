import { supabase } from "@/lib/supabase";
import { fetchNearbyHotels, getPhotoUrl, GooglePlaceResult } from "@/src/helpers/hotelRecommendation";
import { useApp } from "@/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
  amenities: string[];
  distance: string;
}

const HotelSelectionScreen = () => {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { userSession } = useApp();
  const router = useRouter();

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        if (!userSession?.user?.id) return;

        // 1. Fetch user lat/lng from profile
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("latitude, longitude")
          .eq("user_id", userSession.user.id)
          .single();

        if (profileErr || !profile) {
          console.error("Error fetching profile location:", profileErr);
          Alert.alert("Error", "Could not fetch your location to find nearby hotels.");
          return;
        }

        if (!profile.latitude || !profile.longitude) {
          Alert.alert("Location Missing", "Please enable location in settings to find hotels.");
          setHotels([]);
          return;
        }

        // 2. Fetch nearby hotels from Google Places
        const places = await fetchNearbyHotels(profile.latitude, profile.longitude);

        // 3. Map Google Places to our Hotel interface
        const mappedHotels: Hotel[] = places.map((place: GooglePlaceResult) => ({
          id: place.place_id,
          name: place.name,
          image: getPhotoUrl(place.photos?.[0]?.photo_reference),
          rating: place.rating || 0,
          reviews: place.user_ratings_total || 0,
          price: 150, // Mock price as Google Places Nearby Search doesn't provide it
          location: place.vicinity || "Nearby location",
          amenities: ["wifi", "parking"], // Mock amenities
          distance: "Nearby",
        }));

        setHotels(mappedHotels);
      } catch (error) {
        console.error("Error in loadHotels:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [userSession]);

  const handleContinue = async () => {
    if (!selectedHotel || !bookingId) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from("bookings")
        .update({ hotel: selectedHotel.name })
        .eq("id", bookingId);

      if (error) {
        console.error("Error updating booking hotel:", error);
        Alert.alert("Error", "Failed to save your hotel selection.");
        return;
      }

      router.push("/PaymentConfirmed");
    } catch (error) {
      console.error("Unexpected error updating hotel:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: "#666" }}>Finding best hotels for you...</Text>
      </View>
    );
  }

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Your Hotel</Text>
        <Text style={styles.headerSubtitle}>
          Choose accommodation for your stay
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Hotel Cards */}
      <View style={styles.hotelsContainer}>
        {filteredHotels.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>No hotels found nearby.</Text>
        ) : (
          filteredHotels.map((hotel) => {
            const isSelected = selectedHotel?.id === hotel.id;
            return (
              <TouchableOpacity
                key={hotel.id}
                style={[styles.hotelCard, isSelected && styles.hotelCardSelected]}
                onPress={() => setSelectedHotel(hotel)}
                activeOpacity={0.7}
              >
                {/* Hotel Image */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: hotel.image }}
                    style={styles.hotelImage}
                  />
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {hotel.rating}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓ Selected</Text>
                    </View>
                  )}
                </View>

                {/* Hotel Info */}
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>

                  <View style={styles.locationRow}>
                    <Text style={styles.locationText}>{hotel.location}</Text>
                  </View>

                  <View style={styles.amenitiesRow}>
                    <Text style={styles.reviewText}>
                      ({hotel.reviews} reviews)
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceLabel}>Estimated Price</Text>
                      <Text style={styles.priceAmount}>₦{hotel.price.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        isSelected && styles.selectButtonSelected,
                      ]}
                      onPress={() => setSelectedHotel(hotel)}
                    >
                      <Text
                        style={[
                          styles.selectButtonText,
                          isSelected && styles.selectButtonTextSelected,
                        ]}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </View>

      {/* Continue Button */}
      {selectedHotel && (
        <View style={styles.continueContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.continueButtonText}>Confirm and Finish</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  hotelsContainer: {
    padding: 16,
  },
  hotelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  hotelCardSelected: {
    borderColor: "#4A90E2",
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  hotelImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  amenitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F0F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewText: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A90E2",
  },
  selectButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  selectButtonSelected: {
    backgroundColor: "#34C759",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  selectButtonTextSelected: {
    color: "#FFFFFF",
  },
  continueContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default HotelSelectionScreen;
