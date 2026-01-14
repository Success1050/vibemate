// ProfileSettings.tsx
import { supabase } from "@/lib/supabase";
import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { getOsProfile, saveOsProfile } from "@/src/osActions/action";
import { useApp } from "@/store";
import { styles } from "@/styles/osProfile";
import { MediaGallery, PrivacySettings, ProfileData } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import { Video } from 'expo-av';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const { userSession, role } = useApp();
  const [loading, setLoading] = useState(false);
  const [Logoutloading, setLogoutLoading] = useState(false);
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
    name: "",
    nickname: "",
    description: "",
    age: 0,
    location: "",
    specificAddress: "",
    country: "",
    phone: "",
    email: "",
    languages: [],
    isVerified: false,
    emergencyContact: "",
  });

  useEffect(() => {
    const fetchOsProfiles = async () => {
      try {
        const res = await getOsProfile(userSession, role);
        if (res?.data) {
          setProfileData((prev) => ({ ...prev, ...res.data }));
        }
        if (res?.media) {
          setMediaGallery((prev) => ({ ...prev, ...res.media }));
        }
      } catch (err) {
        console.log("Error fetching profile:", err);
      }
    };
    fetchOsProfiles();
  }, []);

  const [uploading, setUploading] = useState(false);

  const [mediaGallery, setMediaGallery] = useState<MediaGallery>({
    mainImages: [],
    videoSource: "",
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showLocation: true,
    showAge: true,
    showPhone: false,
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

  const uploadToSupabase = async (uri: string, folder: string = "misc") => {
    if (!userSession?.user?.id) return null;
    try {
      const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userSession.user.id}/${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profileImage')
        .upload(filePath, arrayBuffer, {
          contentType: fileExt === 'mp4' || fileExt === 'mov' ? `video/${fileExt}` : `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('profileImage').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.log("Upload error:", error);
      Alert.alert("Error", "Failed to upload file");
      return null;
    }
  };


  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      const url = await uploadToSupabase(result.assets[0].uri);
      if (url) {
        updateProfile("profile_img", url);
      }
      setUploading(false);
    }
  };

  const pickGalleryImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setUploading(true);
      const urls: any[] = [];
      for (const asset of result.assets) {
        const url = await uploadToSupabase(asset.uri);
        if (url) urls.push(url);
      }
      setMediaGallery(prev => ({ ...prev, mainImages: [...prev.mainImages, ...urls] }));
      setUploading(false);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      const url = await uploadToSupabase(result.assets[0].uri);
      if (url) {
        setMediaGallery(prev => ({ ...prev, videoSource: url }));
      }
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...mediaGallery.mainImages];
    newImages.splice(index, 1);
    setMediaGallery(prev => ({ ...prev, mainImages: newImages }));
  };


  const handlesave = async () => {
    console.log(userSession?.user.id);

    try {
      setLoading(true);
      const res = await saveOsProfile(
        profileData,
        mediaGallery,
        privacy,
        userSession,
        role
      );

      console.log("Save response:", res);

      if (res?.success) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.log("Error saving profile:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profileData.profile_img || "https://i.pravatar.cc/300" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={pickAvatar} disabled={uploading}>
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
            value={profileData.age?.toString() || ""}
            onChangeText={(text) => {
              const numericValue = Number(text);
              updateProfile("age", isNaN(numericValue) ? 0 : numericValue);
            }}
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
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Country</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.country}
            onChangeText={(text) => updateProfile("country", text)}
            placeholder="Enter your country"
          />
          <Text style={styles.inputHelper}>
            Only shared after booking confirmation
          </Text>
        </View>

        {/* <View style={styles.locationPreview}>
          <Text style={styles.previewTitle}>Location Preview</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={32} color="#007AFF" />
            <Text style={styles.mapText}>Map preview will appear here</Text>
          </View>
        </View> */}

        {/* <TouchableOpacity style={styles.updateLocationButton}>
          <Ionicons name="location-outline" size={20} color="#007AFF" />
          <Text style={styles.updateLocationText}>Update Location on Map</Text>
        </TouchableOpacity> */}
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
              <Image source={{ uri: image }} style={styles.galleryImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeGalleryImage(index)}>
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickGalleryImages} disabled={uploading}>
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

        {mediaGallery.videoSource ? (
          <View style={styles.videoPreviewContainer}>
            <Video
              source={{ uri: mediaGallery.videoSource }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                backgroundColor: '#000'
              }}
              useNativeControls
              // resizeMode=""
              isLooping
            />
            <TouchableOpacity
              style={styles.removeVideoButton}
              onPress={() => setMediaGallery(prev => ({ ...prev, videoSource: '' }))}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
              <Text style={styles.removeVideoText}>Remove Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.videoUploadButton}
            onPress={pickVideo}
            disabled={uploading}
          >
            <Ionicons name="videocam" size={24} color="#007AFF" />
            <Text style={styles.videoUploadText}>Upload Video</Text>
          </TouchableOpacity>
        )}
      </View>
    </View >
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

        {/* <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <Text style={styles.safetyText}>Two-Factor Authentication</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="lock-closed" size={24} color="#007AFF" />
            <Text style={styles.safetyText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.safetyOption}>
          <View style={styles.safetyLeft}>
            <Ionicons name="people" size={24} color="#FF9500" />
            <Text style={styles.safetyText}>Blocked Users</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity> */}

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
          <Backbutton router={router} size={24} />
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handlesave()}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "saving..." : "save"}
            </Text>
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

export default ProfileSettings;
