import { supabase } from "@/lib/supabase";
import useLocationEnforcer from "@/src/components/useLocationEnforcer";
import { theme } from "@/src/constants/themes";
import { AppProvider, useApp } from "@/store";
import { StreamVideo } from "@stream-io/video-react-native-sdk";
import { useAudioPlayer } from "expo-audio";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { PaystackProvider } from "react-native-paystack-webview";

const ringtone = require("@/assets/audio/ringtone.mp3");

function RootLayoutContent() {
  const router = useRouter();
  const { userSession, role, client, loading, error, refreshKey } = useApp();

  // loading / auth guards same as before ...
  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!userSession) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    );
  }

  // Removed redundant role guard to prevent hanging if role fetch fails
  // The redirect useEffect below will handle unidentified roles by sending them to login.

  const player = useAudioPlayer(ringtone);

  const location = useLocationEnforcer();

  useEffect(() => {
    if (location) console.log("the locations", location);
  }, [location]);

  // role redirect
  useEffect(() => {
    if (role === "booker") {
      router.replace("/(BookersTabs)/videocall");
    } else if (role === "os") {
      router.replace("/(OSTabs)/OSDashboard");
    } else {
      router.replace("/login");
    }
  }, [role]);

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
            player.seekTo(0);
            player.play();

            Alert.alert("Incoming Video Call", "you have an incoming call", [
              {
                text: "Reject",
                style: "cancel",
                onPress: async () => {
                  player.pause();
                  player.seekTo(0);

                  await supabase
                    .from("video_calls")
                    .update({ status: "failed" })
                    .eq("id", call.id);
                },
              },
              {
                text: "Accept",
                onPress: async () => {
                  player.pause();
                  player.seekTo(0);

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
      player.pause();
      player.seekTo(0);

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
  }, [userSession]);

  // render role-based layout
  return (
    <PaystackProvider
      key={refreshKey}
      debug
      publicKey={
        process.env.EXPO_PAYSTACK_PUBLIC_KEY ||
        "pk_test_ece223e8c61258f8576a6c31eadf3874e4e54d0c"
      }
      defaultChannels={["bank", "card", "bank_transfer", "mobile_money"]}
    >
      {client ? (
        <StreamVideo client={client}>
          {role === "booker" && (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(BookersTabs)" />
            </Stack>
          )}
          {role === "os" && (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(OSTabs)" />
            </Stack>
          )}
          {!role && (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
            </Stack>
          )}
        </StreamVideo>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          {role === "booker" && <Stack.Screen name="(BookersTabs)" />}
          {role === "os" && <Stack.Screen name="(OSTabs)" />}
          {!role && (
            <>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
            </>
          )}
        </Stack>
      )}
    </PaystackProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
