import { supabase } from "@/lib/supabase";
import { fetchOsByUserId } from "@/src/bookersActions/action";
import Backbutton from "@/src/components/Backbutton";
import { useApp } from "@/store";
import { OsProviders } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const videocallDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [osDetails, setOsDetails] = useState<OsProviders | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { userSession } = useApp();

  useEffect(() => {
    const getOsDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await fetchOsByUserId(id as string);
        if (res && res.success) {
          const rawProfile = Array.isArray(res?.data?.osprofile)
            ? res?.data?.osprofile[0]
            : res?.data?.osprofile;

          const rawPricing = Array.isArray(res?.data?.pricing_settings)
            ? res?.data?.pricing_settings[0]
            : res?.data?.pricing_settings;

          const formattedData: OsProviders = {
            id: res?.data?.id,
            user_id: res?.data?.user_id,
            email: res?.data?.email,
            role: res?.data?.role,
            osprofile: {
              bio: rawProfile?.bio || "",
              featured: rawProfile?.featured || false,
              full_name: rawProfile?.full_name || "",
              image_url: rawProfile?.image_url || [],
              is_available: rawProfile?.is_available || false,
              nickname: rawProfile?.nickname || "",
              videos_urls: rawProfile?.videos_urls || [],
            },
            pricing_settings: {
              price_per_night: rawPricing?.price_per_night || 0,
            },
            availability_slots: [],
          };
          setOsDetails(formattedData);
        }
      } catch (error) {
        console.error("Error fetching OS details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getOsDetails();
  }, [id]);

  const videoUrl = osDetails?.osprofile?.videos_urls?.[0];
  const player = useVideoPlayer(videoUrl || "", (player) => {
    if (videoUrl) {
      player.loop = true;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!osDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = osDetails.osprofile.image_url || [];
  const videos = osDetails.osprofile.videos_urls || [];

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Profile Section */}
        <ImageBackground
          source={{
            uri: images[activeImageIndex] || "https://via.placeholder.com/400x600",
          }}
          style={styles.mainBackground}
          imageStyle={styles.mainBackgroundImage}
        >
          {/* Header with back button */}
          <View style={styles.header}>
            <Backbutton router={router} size={24} color="white" />
          </View>

          {/* Profile Info Overlay */}
          <View style={styles.profileOverlay}>
            <View style={styles.profileDetailsRow}>
              <View style={styles.profileDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>{osDetails.osprofile.nickname}</Text>
                  {osDetails.osprofile.is_available && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginLeft: 8 }} />
                  )}
                </View>
                <Text style={styles.profileRate}>💎 {osDetails.pricing_settings.price_per_night}/min</Text>
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{osDetails.osprofile.bio || "No bio available"}</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Gallery Section */}
        {images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.thumbnailCard, activeImageIndex === index && styles.activeThumbnail]}
                  onPress={() => setActiveImageIndex(index)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Videos</Text>
              <Ionicons name="videocam" size={20} color="#8B5CF6" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {videos.map((video, index) => (
                <VideoItem key={index} url={video} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Video Call Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.videoCallButton}
          onPress={async () => {
            if (!osDetails || !userSession?.user?.id) return;

            try {
              const channelName = `call_${Date.now()}`;

              router.push({
                pathname: "/videocallscreen",
                params: { callId: channelName },
              });

              await supabase
                .from("video_calls")
                .insert([
                  {
                    caller_id: userSession.user.id,
                    callee_id: osDetails.user_id,
                    status: "pending",
                    agora_channel_name: channelName,
                  },
                ]);
            } catch (e) {
              console.error("Error starting call:", e);
            }
          }}
        >
          <Ionicons name="videocam" size={28} color="white" />
          <Text style={styles.videoCallButtonText}>Start Video Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VideoItem = ({ url }: { url: string }) => {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <View style={styles.videoCard}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
      />
      {!isPlaying && (
        <TouchableOpacity
          style={styles.videoPlayOverlay}
          onPress={() => {
            player.play();
          }}
        >
          <Ionicons name="play" size={40} color="white" />
        </TouchableOpacity>
      )}
      {isPlaying && (
        <TouchableOpacity
          style={styles.videoPlayOverlay}
          onPress={() => {
            player.pause();
          }}
        >
          <View style={styles.pauseIconContainer}>
            <Ionicons name="pause" size={30} color="white" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  mainBackground: {
    height: height * 0.55,
    justifyContent: "space-between",
  },
  mainBackgroundImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileOverlay: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileRate: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    marginTop: 4,
  },
  bioContainer: {
    marginTop: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 15,
  },
  bioText: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D1D1F",
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  thumbnailCard: {
    width: 80,
    height: 110,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#8B5CF6",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  videoCard: {
    width: 200,
    height: 300,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  pauseIconContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  videoCallButton: {
    backgroundColor: "#10B981",
    height: 65,
    borderRadius: 32.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  videoCallButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default videocallDetails;
