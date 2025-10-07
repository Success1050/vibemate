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
      {/* OSDashboard (only for ADMIN role) */}
      <Tabs.Screen
        name="OSDashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* OSProfile (only for ADMIN role) */}
      <Tabs.Screen
        name="OSProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-details"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="OSBookingmanage"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-details"
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
