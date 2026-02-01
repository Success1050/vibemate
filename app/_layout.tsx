import { supabase } from "@/lib/supabase";
import useLocationEnforcer from "@/src/components/useLocationEnforcer";
import { theme } from "@/src/constants/themes";
import { AppProvider, useApp } from "@/store";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StreamVideo } from "@stream-io/video-react-native-sdk";
import { useAudioPlayer } from "expo-audio";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { PaystackProvider } from "react-native-paystack-webview";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white", // Prevent system background from showing through as different colors
  },
};

const ringtone = require("@/assets/audio/ringtone.mp3");

function RootLayoutContent() {
  const router = useRouter();
  const { userSession, role, client, loading, error, refreshKey } = useApp();

  // 1. Hooks must be called unconditionally at the top level
  const player = useAudioPlayer(ringtone);
  const location = useLocationEnforcer();

  useEffect(() => {
    if (location) console.log("the locations", location);
  }, [location]);

  // role redirect
  useEffect(() => {
    if (loading || !userSession) return;

    if (role === "booker") {
      router.replace("/(BookersTabs)/videocall");
    } else if (role === "os") {
      router.replace("/(OSTabs)/OSDashboard");
    } else {
      router.replace("/login");
    }
  }, [role, loading, userSession]);

  useEffect(() => {
    if (!userSession?.user?.id) return;

    const channel = supabase
      .channel("incoming-video-calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "video_calls",
          filter: `callee_id=eq.${userSession.user.id}`,
        },
        async (payload) => {
          const call = payload.new;
          if (call.status === "pending") {
            // start ringing
            try {
              player.seekTo(0);
              player.play();
            } catch (err) {
              // Ignore audio errors
            }

            Alert.alert("Incoming Video Call", "you have an incoming call", [
              {
                text: "Reject",
                style: "cancel",
                onPress: async () => {
                  try {
                    player.pause();
                    player.seekTo(0);
                  } catch (e) {
                    // Ignore audio errors
                  }

                  await supabase
                    .from("video_calls")
                    .update({ status: "failed" })
                    .eq("id", call.id);
                },
              },
              {
                text: "Accept",
                onPress: async () => {
                  try {
                    player.pause();
                    player.seekTo(0);
                  } catch (e) {
                    // Ignore audio errors
                  }

                  await supabase
                    .from("video_calls")
                    .update({
                      status: "active",
                      started_at: new Date().toISOString(),
                    })
                    .eq("id", call.id);

                  router.push({
                    pathname: "/osVideoCallScreen" as any,
                    params: { callId: call.agora_channel_name },
                  });
                },
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      try {
        // Attempt to stop the ringtone if cleanup happens
        player.pause();
        player.seekTo(0);
      } catch (e) {
        // Ignore errors if player is already released (common on unmount)
      }

      supabase.removeChannel(channel);
    };
  }, [userSession?.user?.id]);

  useEffect(() => {
    if (!userSession?.user) return;

    const setOnline = async (status: boolean) => {
      const { error } = await supabase
        .from("profiles")
        .update({ online_status: status })
        .eq("user_id", userSession.user.id);

      if (error) console.log("Error updating status:", error);
    };

    setOnline(true);

    return () => {
      setOnline(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSession]);

  // Render logic with NO early returns
  return (
    <ThemeProvider value={customTheme}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.activetabbarcolor,
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ color: "white", marginTop: 10 }}>
            Preparing your dashboard...
          </Text>
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.activetabbarcolor,
          }}
        >
          <Text style={{ color: "white" }}>Error: {error}</Text>
        </View>
      ) : !userSession ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
        </Stack>
      ) : (
        <PaystackProvider
          debug
          publicKey={
            process.env.EXPO_PAYSTACK_PUBLIC_KEY ||
            "pk_test_ece223e8c61258f8576a6c31eadf3874e4e54d0c"
          }
          defaultChannels={["bank", "card", "bank_transfer", "mobile_money"]}
        >
          {client ? (
            <StreamVideo client={client}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(BookersTabs)" />
                <Stack.Screen name="(OSTabs)" />
              </Stack>
            </StreamVideo>
          ) : (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(BookersTabs)" />
              <Stack.Screen name="(OSTabs)" />
            </Stack>
          )}
        </PaystackProvider>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
