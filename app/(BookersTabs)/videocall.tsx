import { supabase } from "@/lib/supabase";
import { fetchOs } from "@/src/bookersActions/action";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { getGoldBal } from "@/src/helpers/goldAccount";
import { useApp } from "@/store";
import { styles } from "@/styles/videocallStyles";
import { ProviderCard } from "@/tsx-types";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 30) / 2; // 2 cards per row with margins

const VideoCallLayout = () => {
  const { userSession } = useApp();
  const [userid, setUserid] = useState<string>("");
  const [GoldBal, setGoldBal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [osProviders, setOsProviders] = useState<ProviderCard[]>([]);
  const router = useRouter();

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
            id: item.user_id,
            isOnline: item.online_status,
            name: os?.nickname ?? "Unnamed",
            bio: os?.bio?.split(".")[0] ?? "",
            image: firstImage,
            is_available: os?.is_available ?? false,
            featured: os?.featured ?? false,
            price_per_night: pricing?.price_per_night ?? 0,
          };
        });

        setOsProviders([...flattened]);
        console.log("our providers", flattened);
      }

      console.log(res.error);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const Gold = async () => {
    const res = await getGoldBal(userSession?.user?.id);
    if (res.error) {
      return;
    }
    setGoldBal(res.data.gold_balance);
  };

  useEffect(() => {
    fetchOsProviders();
    Gold();
  }, []);
  useEffect(() => {
    Gold();
  }, [GoldBal]);

  const startVideoCall = async (receiverId: string, userName: string) => {
    try {
      const channelName = `call_${Date.now()}`;

      router.push({
        pathname: "/videocallscreen",
        params: { callId: channelName },
      });

      supabase
        .from("video_calls")
        .insert([
          {
            caller_id: userSession?.user?.id,
            callee_id: receiverId,
            status: "pending",
            agora_channel_name: channelName,
          },
        ])
        .then(({ error }) => {
          if (error) console.error("Error creating video call:", error);
        });
    } catch (e) {
      console.error("Error starting call:", e);
    }
  };

  const renderUser = ({ item }: { item: any }) => {
    console.log("Rendering user with id:", item.id);

    return (
      <Link
        href={{ pathname: "/videocallDetails", params: { id: item.id } }}
        asChild
        key={item.id}
      >
        <TouchableOpacity onPress={() => console.log(item.id)}>
          <View style={styles.userCard}>
            <ImageBackground
              source={
                item?.image?.uri
                  ? { uri: item.image.uri }
                  : require("@/assets/images/2.jpg")
              }
              style={styles.backgroundImage}
              imageStyle={styles.imageStyle}
            >
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: item.isOnline ? "#4CAF50" : "#F44336",
                  },
                ]}
              />

              <View style={styles.bottomInfo}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userRate}>💎{item.price_per_night}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <View style={styles.chatButton}>
                    <Text style={styles.chatDots}>•••</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.videoButton}
                    onPress={() => startVideoCall(item.id, item.name)}
                  >
                    <Text style={styles.videoIcon}>📹</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <ScreenWrapper bg="#E1BEE7">
      <View style={styles.container}>
        <StatusBar backgroundColor="#E1BEE7" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.goldContainer}
            onPress={() => router.push("/gold-purchase")}
          >
            <Text style={styles.goldIcon}>💎</Text>
            <Text style={styles.goldAmount}>{GoldBal ?? 0}</Text>
            <Text style={styles.plusSign}>+</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Hot girls</Text>
          </View>

          <Button
            title="Service hub"
            color={theme.colors.activetabbarcolor}
            onPress={() => router.push("/Home")}
          />
        </View>
        <View style={styles.viewCont}>
          <FlatList
            data={osProviders}
            renderItem={renderUser}
            keyExtractor={(user, id) => `${user.id}-${id}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOsProviders();
              Gold();
            }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          />
        </View>

        {/* <View style={styles.grid}>
            {users.map((user) => renderUser(user))}
          </View> */}
      </View>
    </ScreenWrapper>
  );
};

export default VideoCallLayout;
