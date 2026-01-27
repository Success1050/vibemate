import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<{
    username?: string;
    profile_img?: string;
    full_name?: string;
    email?: string;
  } | null>(null);

  const router = useRouter();

  // 1. Get User Session Directly
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name, email, profile_img")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setProfile(data);
          console.log('profile data', data);
        }
        if (error) {
          console.log("Error fetching profile:", error);
        }
      } catch (e) {
        console.log("Exception fetching profile:", e);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }
    Alert.alert("Success", "User logged out successfully");
    router.replace("/login");
    setLoading(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user?.id) return;
    setUploading(true);
    try {
      const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profileImage')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profileImage')
        .getPublicUrl(filePath);

      if (data) {
        const publicUrl = data.publicUrl;

        // Update profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_img: publicUrl })
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }

        setProfile((prev) => prev ? ({ ...prev, profile_img: publicUrl }) : null);
        Alert.alert("Success", "Profile image updated successfully!");
      }

    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };


  const displayName = profile?.username || profile?.full_name || "Booker";
  const displayEmail = profile?.email || "Booker";
  // Clean up image string if needed
  const rawImg = profile?.profile_img;
  let displayImg = "https://i.pravatar.cc/150?img=12";
  if (rawImg) {
    const cleaned = rawImg.trim().replace(/^["']|["']$/g, '').split(',')[0].trim().replace(/['"]+/g, '');
    if (cleaned.startsWith('http')) {
      displayImg = cleaned;
    }
  }

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        {/* User Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: displayImg,
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon} onPress={pickImage} disabled={uploading}>
              <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.avatarBorder} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
          {uploading && <Text style={{ color: theme.colors.primary, marginTop: 5 }}>Uploading...</Text>}
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
            onPress={() => handleLogout()}
            isLogout
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

interface MenuItemsProps {
  icon: "logout" | "cog" | "bell" | "wallet" | "account-edit";
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
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
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
