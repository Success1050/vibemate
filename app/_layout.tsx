// app/_layout.tsx
import { theme } from "@/src/constants/themes";
import { AppProvider, useApp } from "@/store"; // path to the provider file above
import { StreamVideo } from "@stream-io/video-react-native-sdk";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PaystackProvider } from "react-native-paystack-webview";

function RootLayoutContent() {
  const { userSession, role, client, loading, error } = useApp();

  // Still initializing provider
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
          Checking session...
        </Text>
      </View>
    );
  }

  // If provider has an error, surface it
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

  // Not signed in -> auth stack (index, login, signup, etc)
  if (!userSession) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        {/* add more auth routes if you want */}
      </Stack>
    );
  }

  // Signed in but no role yet -> show a loader (or a "complete profile" screen)
  if (userSession && !role) {
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
        <Text style={{ color: "white", marginTop: 8 }}>
          Loading permissions...
        </Text>
      </View>
    );
  }

  // Signed in + role -> show role-specific stacks; also wrap with StreamVideo & Paystack if client exists
  return (
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
        </StreamVideo>
      ) : (
        // If client hasn't been created for some reason — still allow fallback
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
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
