import { supabase } from "@/lib/supabase";
import { useApp } from "@/store";
import * as intentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

type UserLocation = {
  longitude: number;
  latitude: number;
};

export default function useLocationEnforcer() {
  const [location, setLocation] = useState<UserLocation>({
    longitude: 0,
    latitude: 0,
  });

  const { userSession } = useApp();

  useEffect(() => {
    const checkAndFetchLocation = async () => {
      // 1. Check if GPS is enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          "Location Required",
          "Please enable GPS to continue using this app.",
          [
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "android") {
                  intentLauncher.startActivityAsync(
                    intentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
                  );
                } else {
                  Linking.openURL("app-settings:");
                }
              },
            },
          ]
        );
        return;
      }

      // 2. Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please grant location permission to use this feature."
        );
        return;
      }

      // 3. Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      // 4. Store to Supabase (update user's profile)
      if (userSession?.user?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({ latitude, longitude })
          .eq("user_id", userSession.user.id);

        if (error) console.log("Failed to insert location:", error.message);
      }

      // 5. Save locally to state
      setLocation({ latitude, longitude });
    };

    // Run immediately + every 10 seconds
    checkAndFetchLocation();
    const interval = setInterval(checkAndFetchLocation, 10000);

    return () => clearInterval(interval);
  }, [userSession]);

  return location;
}
