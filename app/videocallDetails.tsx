import Backbutton from "@/src/components/Backbutton";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const videocallDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  if (!id) return;
  const profileCards = [
    {
      id: 1,
      name: "Franca",
      emoji: "💛",
      rate: "60/min",
      status: "offline",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face",
      hasRecharge: false,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face",
      title: "Gallery 2",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=400&fit=crop&crop=face",
      title: "Gallery 3",
    },
  ];
  const user = profileCards.find((u) => u.id === Number(id));

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />

      {/* Main Profile Section */}
      <ImageBackground
        source={{
          uri: user?.image,
        }}
        style={styles.mainBackground}
        imageStyle={styles.mainBackgroundImage}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <Backbutton router={router} size={24} />
        </View>

        {/* Profile Info Overlay */}
        <View style={styles.profileOverlay}>
          {/* Small profile image */}
          <View style={styles.smallProfileContainer}>
            <ImageBackground
              source={{
                uri: user?.image,
              }}
              style={styles.smallProfileImage}
              imageStyle={styles.smallProfileImageStyle}
            />
          </View>

          {/* Profile Details */}
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileId}>ID: 393933030303</Text>
          </View>

          {/* Bio Section */}
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>I am a very good girl</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Cards Section */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>More Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {profileCards.map((card) => (
            <TouchableOpacity key={card.id} style={styles.card}>
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.cardBackground}
                imageStyle={styles.cardImageStyle}
              >
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Message Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonIcon}>💬</Text>
          <Text style={styles.messageButtonText}>Message Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  mainBackground: {
    height: height * 0.6,
    justifyContent: "space-between",
  },
  mainBackgroundImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  smallProfileContainer: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  smallProfileImage: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  smallProfileImageStyle: {
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "white",
  },
  profileDetails: {
    marginBottom: 15,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileId: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  bioContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: "flex-start",
    backdropFilter: "blur(10px)",
  },
  bioText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cardsSection: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  cardsContainer: {
    paddingRight: 20,
  },
  card: {
    width: 150,
    height: 200,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingBottom: 35,
  },
  messageButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  messageButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  messageButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default videocallDetails;
