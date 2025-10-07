// ProfileSettings.tsx
import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileData {
  name: string;
  nickname: string;
  description: string;
  profileImage: any;
  age: string;
  location: string;
  specificAddress: string;
  phone: string;
  email: string;
  languages: string[];
  services: string[];
  isVerified: boolean;
  emergencyContact: string;
}

interface MediaGallery {
  mainImages: any[];
  videoSource: string;
}

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("basic");
  // const user = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      return console.log(error);
    }
    router.replace("/login");
    setLoading(false);
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Sarah Johnson",
    nickname: "Sarah",
    description:
      "Professional companion with 5+ years experience. I provide genuine companionship for social events, dinner dates, and business functions.",
    profileImage: require("@/assets/images/1.jpg"), // Replace with actual path
    age: "28",
    location: "Lagos, Nigeria",
    specificAddress: "123 Victoria Island, Lagos State",
    phone: "+234 801 234 5678",
    email: "sarah.johnson@example.com",
    languages: ["English", "Yoruba", "French"],
    services: [
      "Dinner Companion",
      "Social Events",
      "Business Functions",
      "Travel Companion",
    ],
    isVerified: true,
    emergencyContact: "+234 803 456 7890",
  });

  const [mediaGallery, setMediaGallery] = useState<MediaGallery>({
    mainImages: [
      require("@/assets/images/1.jpg"),
      require("@/assets/images/2.jpg"),
      require("@/assets/images/3.jpg"),
    ],
    videoSource: "https://example.com/intro-video.mp4",
  });

  const [privacy, setPrivacy] = useState({
    showLocation: true,
    showAge: true,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
  });

  const updateProfile = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePrivacy = (field: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  const addLanguage = () => {
    Alert.prompt("Add Language", "Enter a new language you speak", (text) => {
      if (text && !profileData.languages.includes(text)) {
        updateProfile("languages", [...profileData.languages, text]);
      }
    });
  };

  const removeLanguage = (language: string) => {
    updateProfile(
      "languages",
      profileData.languages.filter((l) => l !== language)
    );
  };

  const addService = () => {
    Alert.prompt("Add Service", "Enter a new service you offer", (text) => {
      if (text && !profileData.services.includes(text)) {
        updateProfile("services", [...profileData.services, text]);
      }
    });
  };

  const removeService = (service: string) => {
    updateProfile(
      "services",
      profileData.services.filter((s) => s !== service)
    );
  };

  const renderBasicInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={profileData.profileImage}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileImageText}>
          Tap to change profile picture
        </Text>
      </View>

      {/* Basic Information */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.name}
            onChangeText={(text) => updateProfile("name", text)}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nickname/Stage Name</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.nickname}
            onChangeText={(text) => updateProfile("nickname", text)}
            placeholder="Enter your preferred name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.age}
            onChangeText={(text) => updateProfile("age", text)}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio/Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={profileData.description}
            onChangeText={(text) => updateProfile("description", text)}
            placeholder="Tell clients about yourself..."
            multiline
            numberOfLines={4}
          />
          <Text style={styles.characterCount}>
            {profileData.description.length}/500
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.phone}
            onChangeText={(text) => updateProfile("phone", text)}
            placeholder="+234 801 234 5678"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.email}
            onChangeText={(text) => updateProfile("email", text)}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Emergency Contact</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.emergencyContact}
            onChangeText={(text) => updateProfile("emergencyContact", text)}
            placeholder="+234 803 456 7890"
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </View>
  );

  const renderLocationTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Location Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City/State</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.location}
            onChangeText={(text) => updateProfile("location", text)}
            placeholder="Lagos, Nigeria"
          />
          <Text style={styles.inputHelper}>This will be shown to clients</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Specific Address (Private)</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.specificAddress}
            onChangeText={(text) => updateProfile("specificAddress", text)}
            placeholder="Enter your specific address"
          />
          <Text style={styles.inputHelper}>
            Only shared after booking confirmation
          </Text>
        </View>

        <View style={styles.locationPreview}>
          <Text style={styles.previewTitle}>Location Preview</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={32} color="#007AFF" />
            <Text style={styles.mapText}>Map preview will appear here</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.updateLocationButton}>
          <Ionicons name="location-outline" size={20} color="#007AFF" />
          <Text style={styles.updateLocationText}>Update Location on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      {/* Languages */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Languages</Text>
          <TouchableOpacity onPress={addLanguage} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {profileData.languages.map((language, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{language}</Text>
              <TouchableOpacity onPress={() => removeLanguage(language)}>
                <Ionicons name="close-circle" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Services */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Services Offered</Text>
          <TouchableOpacity onPress={addService} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {profileData.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service}</Text>
              <TouchableOpacity onPress={() => removeService(service)}>
                <Ionicons name="close-circle" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Media Gallery */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Photo Gallery</Text>
        <Text style={styles.cardSubtitle}>Add up to 8 photos</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryContainer}
        >
          {mediaGallery.mainImages.map((image, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image source={image} style={styles.galleryImage} />
              <TouchableOpacity style={styles.removeImageButton}>
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton}>
            <Ionicons name="add" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Video Introduction */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Video Introduction</Text>
        <Text style={styles.cardSubtitle}>
          Add a short video to introduce yourself
        </Text>

        <TouchableOpacity style={styles.videoUploadButton}>
          <Ionicons name="videocam" size={24} color="#007AFF" />
          <Text style={styles.videoUploadText}>Upload Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPrivacyTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Privacy Settings</Text>
        <Text style={styles.cardSubtitle}>
          Control what information is visible to clients
        </Text>

        <View style={styles.privacySettings}>
          <View style={styles.privacySetting}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Show Location</Text>
              <Text style={styles.privacyDescription}>
                Display your city/state to clients
              </Text>
            </View>
            <Switch
              value={privacy.showLocation}
              onValueChange={(value) => updatePrivacy("showLocation", value)}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.privacySetting}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Show Age</Text>
              <Text style={styles.privacyDescription}>
                Display your age on profile
              </Text>
            </View>
            <Switch
              value={privacy.showAge}
              onValueChange={(value) => updatePrivacy("showAge", value)}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.privacySetting}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Show Phone Number</Text>
              <Text style={styles.privacyDescription}>
                Display phone to clients before booking
              </Text>
            </View>
            <Switch
              value={privacy.showPhone}
              onValueChange={(value) => updatePrivacy("showPhone", value)}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.privacySetting}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Allow Direct Messages</Text>
              <Text style={styles.privacyDescription}>
                Let clients message you directly
              </Text>
            </View>
            <Switch
              value={privacy.allowDirectMessages}
              onValueChange={(value) =>
                updatePrivacy("allowDirectMessages", value)
              }
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.privacySetting}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Show Online Status</Text>
              <Text style={styles.privacyDescription}>
                Display when you're online
              </Text>
            </View>
            <Switch
              value={privacy.showOnlineStatus}
              onValueChange={(value) =>
                updatePrivacy("showOnlineStatus", value)
              }
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Verification Status */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Verification Status</Text>

        <View style={styles.verificationItem}>
          <View style={styles.verificationLeft}>
            <Ionicons
              name={
                profileData.isVerified ? "checkmark-circle" : "alert-circle"
              }
              size={24}
              color={profileData.isVerified ? "#34C759" : "#FF9500"}
            />
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationLabel}>
                Identity Verification
              </Text>
              <Text style={styles.verificationStatus}>
                {profileData.isVerified ? "Verified" : "Pending Verification"}
              </Text>
            </View>
          </View>
          {!profileData.isVerified && (
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.verificationBenefits}>
          <Text style={styles.benefitsTitle}>Verification Benefits:</Text>
          <Text style={styles.benefitItem}>• Increased trust from clients</Text>
          <Text style={styles.benefitItem}>• Higher visibility in search</Text>
          <Text style={styles.benefitItem}>• Access to premium features</Text>
          <Text style={styles.benefitItem}>• Verified badge on profile</Text>
        </View>
      </View>

      {/* Safety Settings */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Safety & Security</Text>

        <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <Text style={styles.safetyText}>Two-Factor Authentication</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="lock-closed" size={24} color="#007AFF" />
            <Text style={styles.safetyText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="people" size={24} color="#FF9500" />
            <Text style={styles.safetyText}>Blocked Users</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.safetyOption}
          onPress={() => handleLogout()}
        >
          <View style={styles.safetyLeft}>
            <Ionicons name="people" size={24} color="#FF9500" />
            <Text style={styles.safetyText}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper bg="white">
      <StatusBar backgroundColor={theme.colors.activetabbarcolor} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabNavigation}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "basic" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("basic")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={activeTab === "basic" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "basic" && styles.activeTabText,
              ]}
            >
              Basic Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "location" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("location")}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={activeTab === "location" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "location" && styles.activeTabText,
              ]}
            >
              Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "services" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("services")}
          >
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={activeTab === "services" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "services" && styles.activeTabText,
              ]}
            >
              Services & Media
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "privacy" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("privacy")}
          >
            <Ionicons
              name="shield-outline"
              size={20}
              color={activeTab === "privacy" ? "#007AFF" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "privacy" && styles.activeTabText,
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "basic" && renderBasicInfoTab()}
          {activeTab === "location" && renderLocationTab()}
          {activeTab === "services" && renderServicesTab()}
          {activeTab === "privacy" && renderPrivacyTab()}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D1D1F",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  tabNavigation: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 100,
  },
  activeTab: {
    backgroundColor: "#007AFF15",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileImageText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
    marginTop: 4,
  },
  inputHelper: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  locationPreview: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
  },
  updateLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
  },
  updateLocationText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#1D1D1F",
  },
  serviceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  serviceTagText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  galleryContainer: {
    marginTop: 12,
  },
  galleryItem: {
    position: "relative",
    marginRight: 12,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  videoUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    marginTop: 12,
  },
  videoUploadText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: 8,
  },
  privacySettings: {
    marginTop: 8,
  },
  privacySetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  privacyInfo: {
    flex: 1,
    marginRight: 16,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  verificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  verificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  verificationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
  },
  verificationStatus: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  verificationBenefits: {
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 2,
  },
  safetyOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  safetyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  safetyText: {
    fontSize: 16,
    color: "#1D1D1F",
    marginLeft: 12,
  },
});

export default ProfileSettings;
