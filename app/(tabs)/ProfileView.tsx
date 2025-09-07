import { theme } from "@/src/constants/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12", // placeholder avatar
            }}
            style={styles.avatar}
          />
          <View style={styles.avatarBorder} />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>johndoe@email.com</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <MenuItem
          icon="wallet"
          title="Wallet"
          onPress={() => router.push("/WalletScreen")}
        />
        <MenuItem
          icon="bell"
          title="Notifications"
          onPress={() => router.push("/Notifications")}
        />
        <MenuItem
          icon="cog"
          title="Settings"
          onPress={() => router.push("/settings")}
        />
        <MenuItem
          icon="logout"
          title="Logout"
          onPress={() => console.log("Logout")}
          isLogout
        />
      </View>
    </ScrollView>
  );
};

interface MenuItemsProps {
  icon: "logout" | "cog" | "bell" | "wallet";
  title: string;
  isLogout?: boolean;
  onPress: () => void;
}

const MenuItem = ({
  icon,
  title,
  onPress,
  isLogout = false,
}: MenuItemsProps) => (
  <TouchableOpacity
    style={[styles.menuItem, isLogout && styles.logoutItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={isLogout ? "#ffffff" : theme.colors.text}
      />
    </View>
    <Text style={[styles.menuText, isLogout && styles.logoutText]}>
      {title}
    </Text>
    <MaterialCommunityIcons
      name="chevron-right"
      size={20}
      color={isLogout ? "#ffffff" : "#cccccc"}
      style={styles.chevronIcon}
    />
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
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
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.84,
    elevation: 8,
  },
  avatarBorder: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: theme.colors.activetabbarcolor,
    top: -6,
    left: -6,
    opacity: 0.3,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 5,
    // textShadow: "0px 1px 2px rgba(0,0,0,0.1)",
  },
  email: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  menu: {
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
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#ffffff",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 10,
  },
  logoutItem: {
    backgroundColor: theme.colors.activetabbarcolor,
    borderBottomWidth: 0,
  },
  logoutIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
