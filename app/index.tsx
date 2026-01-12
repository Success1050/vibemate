import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { hp, wp } from "@/src/helpers/command";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      if (value === null) {
        // First time
        router.replace("/onboarding");
      }
      // If value exists, we stay here (Welcome Screen)
      setLoading(false);
    } catch (error) {
      console.log("Error checking onboarding:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper bg={theme.colors.activetabbarcolor}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg={theme.colors.activetabbarcolor}>
      <View style={styles.container}>
        <Image source={require("../assets/vibemate.png")} style={styles.logo} />
        <View style={{ gap: 3, marginTop: 12 }}>
          <Text style={styles.text}>Welcome to Vibemate</Text>
          <Button
            title={"Get started"}
            onpress={() => router.push("/login")}
            buttonStyle={{ paddingHorizontal: wp(2) }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.activetabbarcolor,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 0,
  },
  text: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: theme.colors.gray,
  },
});
