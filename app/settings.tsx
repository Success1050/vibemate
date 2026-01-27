import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Settings = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Backbutton router={router} size={24} />
          <Text style={[styles.headerTitle, { marginLeft: "25%" }]}>
            Settings
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContainer}>
            <SettingsItem
              icon="account-edit"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push("/(BookersTabs)/editProfile")}
            />
            <SettingsItem
              icon="lock"
              title="Privacy & Policy"
              subtitle="Manage your privacy settings"
              onPress={() => router.push("/PrivacyPolicy")}
            />
            <SettingsItem
              icon="key"
              title="Change Password"
              subtitle="Update your account password"
              onPress={() => console.log("Change Password")}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContainer}>
            <SettingsToggle
              icon="bell"
              title="Push Notifications"
              subtitle="Receive app notifications"
              value={notificationsEnabled}
              onToggle={setNotificationsEnabled}
            />
            {/* <SettingsToggle
              icon="weather-night"
              title="Dark Mode"
              subtitle="Switch to dark theme"
              value={darkModeEnabled}
              onToggle={setDarkModeEnabled}
            /> */}
            {/* <SettingsToggle
              icon="map-marker"
              title="Location Services"
              subtitle="Allow location access"
              value={locationEnabled}
              onToggle={setLocationEnabled}
            /> */}
            {/* <SettingsItem
              icon="translate"
              title="Language"
              subtitle="English (US)"
              onPress={() => console.log("Language")}
            /> */}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContainer}>
            <SettingsItem
              icon="help-circle"
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => router.push("/HelpCenter")}
            />
            <SettingsItem
              icon="email"
              title="Contact Us"
              subtitle="Send us your feedback"
              onPress={() => router.push("/ContactUs")}
            />
            <SettingsItem
              icon="information"
              title="About"
              subtitle="App version and info"
              onPress={() => router.push("/AboutUs")}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.sectionContainer}>
            <SettingsItem
              icon="delete"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={() => console.log("Delete Account")}
              isDangerous
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

interface SettingsItemProps {
  icon:
  | "delete"
  | "information"
  | "email"
  | "help-circle"
  | "translate"
  | "map-marker"
  | "weather-night"
  | "bell"
  | "key"
  | "lock"
  | "account-edit";
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDangerous?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isDangerous = false,
}: SettingsItemProps) => (
  <TouchableOpacity
    style={[styles.settingsItem, isDangerous && styles.dangerousItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconContainer,
        isDangerous && styles.dangerousIconContainer,
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={isDangerous ? "#ff4757" : theme.colors.text}
      />
    </View>
    <View style={styles.textContainer}>
      <Text style={[styles.itemTitle, isDangerous && styles.dangerousText]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
    </View>
    <MaterialCommunityIcons
      name="chevron-right"
      size={20}
      color="#cccccc"
      style={styles.chevronIcon}
    />
  </TouchableOpacity>
);

interface SettingsToggleProps {
  icon:
  | "delete"
  | "information"
  | "email"
  | "help-circle"
  | "translate"
  | "map-marker"
  | "weather-night"
  | "bell"
  | "key"
  | "lock"
  | "account-edit";
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingsToggle = ({
  icon,
  title,
  subtitle,
  value,
  onToggle,
}: SettingsToggleProps) => (
  <View style={styles.settingsItem}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={24} color={theme.colors.text} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{
        false: "#e0e0e0",
        true: theme.colors.activetabbarcolor + "80",
      }}
      thumbColor={value ? theme.colors.activetabbarcolor : "#ffffff"}
      style={styles.switch}
    />
  </View>
);

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginHorizontal: 20,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#ffffff",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "400",
  },
  chevronIcon: {
    marginLeft: 10,
  },
  switch: {
    marginLeft: 10,
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  dangerousItem: {
    backgroundColor: "#fff5f5",
  },
  dangerousIconContainer: {
    backgroundColor: "#fee2e2",
  },
  dangerousText: {
    color: "#ff4757",
    fontWeight: "600",
  },
});
