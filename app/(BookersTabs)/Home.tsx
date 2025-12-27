import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { renderGridItem } from "@/hooks/renderGridItem";
import { renderProviderCard } from "@/hooks/renderProviderCard";
import { fetchOs } from "@/src/bookersActions/action";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { ProviderCard } from "@/tsx-types";
import { Link, useRouter } from "expo-router";
import { Bell, Filter, Search, Sparkles } from "lucide-react-native";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGender, setSelectedGender] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [likedProviders, setLikedProviders] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [osProviders, setOsProviders] = useState<ProviderCard[]>([]);

  const router = useRouter();

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedProviders);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedProviders(newLiked);
  };

  const fetchOsProviders = async () => {
    try {
      setLoading(true);
      const res = await fetchOs();
      if (res && res.success) {
        const flattened = (res.data || []).map((item) => {
          const os = item.osprofile as any;
          const pricing = item.pricing_settings as any;

          const images = os?.image_url || [];
          const firstImage =
            Array.isArray(images) && images.length > 0
              ? { uri: images[0] }
              : null;

          return {
            id: item.id,
            name: os?.nickname ?? "Unnamed",
            bio: os?.bio?.split(".")[0] ?? "",
            image: firstImage,
            is_available: os?.is_available ?? false,
            featured: os?.featured ?? false,
            price_per_night: pricing?.price_per_night ?? 0,
          };
        });

        // console.log("Flattened:", osProviders);
        setOsProviders([...flattened]);
      }

      console.log(res.error);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOsProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    return osProviders.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && provider.price_per_night < 80) ||
        (priceRange === "medium" &&
          provider.price_per_night >= 80 &&
          provider.price_per_night < 100) ||
        (priceRange === "high" && provider.price_per_night >= 100);

      const matchesActiveFilter =
        activeFilter === "all" ||
        (activeFilter === "available" && provider.is_available === true);

      return matchesSearch && matchesPrice && matchesActiveFilter;
    });
  }, [searchQuery, selectedGender, priceRange, activeFilter, osProviders]);

  return (
    <ScreenWrapper bg="dark">
      <View style={styles.container}>
        <FlatList
          data={filteredProviders}
          renderItem={renderGridItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchOsProviders();
          }}
          keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{ paddingBo\ttom: 100 }}

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
                <Search
                  size={20}
                  color="#0b0b0cff"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  placeholder="beautiful Os, and companions..."
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
                          {
                            color: theme.colors.activetabbarcolor,
                            fontSize: 16,
                          },
                        ]}
                      >
                        See top providers
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {osProviders
                    .filter((p) => p.featured)
                    .map((provider) => (
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
        />
      </View>
    </ScreenWrapper>
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
