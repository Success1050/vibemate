import { theme } from "@/src/constants/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: false,
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
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Chatscreen"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="chat" size={size} color={color} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="BookingDetails"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="heart" size={size} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="ProfileView"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
