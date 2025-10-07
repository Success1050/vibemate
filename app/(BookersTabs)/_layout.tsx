import { theme } from "@/src/constants/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.activetabbarcolor,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#FBBF24",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="videocall"
        options={{
          title: "Video call",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="video" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileView"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
