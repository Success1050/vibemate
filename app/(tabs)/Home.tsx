import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { featuredProviders } from "@/hooks/FeaturedProviders";
import { renderGridItem } from "@/hooks/renderGridItem";
import { renderProviderCard } from "@/hooks/renderProviderCard";
import { providers } from "@/mockData";
import Button from "@/src/components/Button";
import { theme } from "@/src/constants/themes";
import { Link, useRouter } from "expo-router";
import { Bell, Filter, Search, Sparkles } from "lucide-react-native";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [likedProviders, setLikedProviders] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState("all");

  const router = useRouter();

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedProviders);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedProviders(newLiked);
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        provider.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesGender =
        selectedGender === "all" || provider.gender === selectedGender;
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && provider.price < 80) ||
        (priceRange === "medium" &&
          provider.price >= 80 &&
          provider.price < 100) ||
        (priceRange === "high" && provider.price >= 100);

      const matchesActiveFilter =
        activeFilter === "all" ||
        (activeFilter === "available" &&
          provider.availability === "available") ||
        (activeFilter === "top-rated" && provider.rating >= 4.8) ||
        (activeFilter === "nearby" && parseFloat(provider.distance) < 2);

      return (
        matchesSearch && matchesGender && matchesPrice && matchesActiveFilter
      );
    });
  }, [searchQuery, selectedGender, priceRange, activeFilter]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProviders}
        renderItem={renderGridItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{ paddingBottom: 100 }}

        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.logo}>
                  <Sparkles size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.title}>ServiceHub</Text>
                  <Text style={styles.subtitle}>Find your perfect match</Text>
                </View>
              </View>
              <Link href={"/Notifications"}>
                <Bell size={24} color="#334155" />
              </Link>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search services, providers, or skills..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showFilters && styles.filterButtonActive,
                ]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} color={showFilters ? "#fff" : "#94A3B8"} />
              </TouchableOpacity>
            </View>

            {/* Featured Providers */}
            {!searchQuery.trim() && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={styles.sectionTitle}>Featured Providers</Text>

                  <TouchableOpacity
                    onPress={() => router.push("/topProviders")}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: theme.colors.activetabbarcolor, fontSize: 16 },
                      ]}
                    >
                      See top providers
                    </Text>
                  </TouchableOpacity>
                </View>

                {featuredProviders.map((provider) => (
                  <View key={provider.id} style={{ marginBottom: 12 }}>
                    {renderProviderCard(provider, false)}
                  </View>
                ))}
              </>
            )}

            {/* Section Title */}
            <Text style={styles.sectionTitle}>
              {searchQuery.trim()
                ? `Search Results (${filteredProviders.length})`
                : `All Providers (${filteredProviders.length})`}
            </Text>

            {/* No Results */}
            {searchQuery.trim() && filteredProviders.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No providers found for "{searchQuery}"
                </Text>
                <Text style={styles.noResultsSubText}>
                  Try adjusting your search terms
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <Button
            // buttonStyle={{ marginBottom: 120 }}
            title="See all"
            onpress={() => router.push("/providers")}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9", padding: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#4F46E5" },
  subtitle: { fontSize: 12, color: "#64748B" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, height: 40 },
  filterButton: { padding: 6, borderRadius: 12, backgroundColor: "#E0E7FF" },
  filterButtonActive: { backgroundColor: "#7C3AED" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  noResultsContainer: { alignItems: "center", paddingVertical: 40 },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 4,
  },
  noResultsSubText: { fontSize: 14, color: "#94A3B8" },
});

export default HomePage;
