import { theme } from "@/src/constants/themes";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.activetabbarcolor,
        },
        headerTintColor: theme.colors.gray, // header text/icon color
        contentStyle: {
          backgroundColor: theme.colors.background, // screen body background
        },
        headerShown: false,
      }}
    />
  );
}
