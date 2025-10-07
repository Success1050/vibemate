import { supabase } from "@/lib/supabase";
import { users } from "@/mockData";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { getGoldBal } from "@/src/helpers/goldAccount";
import { styles } from "@/styles/videocallStyles";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 30) / 2; // 2 cards per row with margins

const VideoCallLayout = () => {
  const [userid, setUserid] = useState<string>("");
  const [GoldBal, setGoldBal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const Gold = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("User not logged in");
        return;
      }

      setUserid(session.user.id);
      const res = await getGoldBal(session.user.id);
      if (res.error) {
        return;
      }
      setGoldBal(res.data.gold_balance);
    };
    Gold();
  }, []);

  const startVideoCall = async (receiverId: string, userName: string) => {
    try {
      // 1. Create a video call row
      const channelName = `call_${Date.now()}`;
      const { data, error } = await supabase
        .from("video_calls")
        .insert([
          {
            caller_id: userid,
            callee_id: receiverId,
            status: "active",
            agora_channel_name: channelName,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating video call:", error);
        return;
      }

      router.push({
        pathname: "/videocallscreen",
        params: { callid: channelName },
      });
    } catch (e) {
      console.error("Error starting call:", e);
    }
  };

  const renderUser = (user: any) => {
    console.log("Rendering user with id:", user.id);

    return (
      <Link
        href={{ pathname: "/videocallDetails", params: { id: user.id } }}
        asChild
        key={user.id}
      >
        <TouchableOpacity onPress={() => console.log(user.id)}>
          <View key={user.id} style={styles.userCard}>
            <ImageBackground
              source={{ uri: user.image }}
              style={styles.backgroundImage}
              imageStyle={styles.imageStyle}
            >
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      user.status === "online" ? "#4CAF50" : "#F44336",
                  },
                ]}
              />

              <View style={styles.bottomInfo}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.name} {user.emoji || ""}
                  </Text>
                  <Text style={styles.userRate}>💎{user.rate}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <View style={styles.chatButton}>
                    <Text style={styles.chatDots}>•••</Text>
                  </View>
                  {/* 📹 Video Call Button */}
                  <TouchableOpacity
                    style={styles.videoButton}
                    onPress={() => startVideoCall(user.id, user.name)}
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {users.map((user) => renderUser(user))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default VideoCallLayout;
