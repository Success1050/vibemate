import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { Star, MapPin, Coffee, Wifi, Car } from "lucide-react";

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
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const hotels: Hotel[] = [
    {
      id: "1",
      name: "Grand Luxury Hotel & Spa",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      rating: 4.8,
      reviews: 342,
      price: 189,
      location: "Downtown, 2.3 km from venue",
      amenities: ["wifi", "breakfast", "parking"],
      distance: "2.3 km",
    },
    {
      id: "2",
      name: "Riverside Boutique Hotel",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      rating: 4.6,
      reviews: 218,
      price: 145,
      location: "Waterfront, 3.1 km from venue",
      amenities: ["wifi", "breakfast"],
      distance: "3.1 km",
    },
    {
      id: "3",
      name: "Modern City Suites",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      rating: 4.7,
      reviews: 456,
      price: 165,
      location: "City Center, 1.8 km from venue",
      amenities: ["wifi", "parking"],
      distance: "1.8 km",
    },
    {
      id: "4",
      name: "Serene Garden Resort",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      rating: 4.9,
      reviews: 523,
      price: 225,
      location: "Garden District, 4.2 km from venue",
      amenities: ["wifi", "breakfast", "parking"],
      distance: "4.2 km",
    },
  ];

  //   const amenityIcons = {
  //     wifi: Wifi,
  //     breakfast: Coffee,
  //     parking: Car,
  //   };

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
        {hotels.map((hotel) => {
          const isSelected = selectedHotel === hotel.id;
          return (
            <TouchableOpacity
              key={hotel.id}
              style={[styles.hotelCard, isSelected && styles.hotelCardSelected]}
              onPress={() => setSelectedHotel(hotel.id)}
              activeOpacity={0.7}
            >
              {/* Hotel Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: hotel.image }}
                  style={styles.hotelImage}
                />
                <View style={styles.ratingBadge}>
                  {/* <Star size={14} color="#FFD700" fill="#FFD700" /> */}
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
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
                  {/* <MapPin size={14} color="#666" /> */}
                  <Text style={styles.locationText}>{hotel.location}</Text>
                </View>

                <View style={styles.amenitiesRow}>
                  {hotel.amenities.map((amenity) => {
                    // const Icon =
                    //   amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <View key={amenity} style={styles.amenityIcon}>
                        {/* <Icon size={16} color="#4A90E2" /> */}
                      </View>
                    );
                  })}
                  <Text style={styles.reviewText}>
                    ({hotel.reviews} reviews)
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>Per night</Text>
                    <Text style={styles.priceAmount}>${hotel.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      isSelected && styles.selectButtonSelected,
                    ]}
                    onPress={() => setSelectedHotel(hotel.id)}
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
          );
        })}
      </View>

      {/* Continue Button */}
      {selectedHotel && (
        <View style={styles.continueContainer}>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
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
