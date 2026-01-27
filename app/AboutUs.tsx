import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const AboutUs = () => {
    const router = useRouter();
    const appVersion = "1.0.0";

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Backbutton router={router} size={24} />
                    <Text style={styles.headerTitle}>About Us</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    <View style={styles.logoSection}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="heart-multiple" size={60} color="white" />
                        </View>
                        <Text style={styles.appName}>VibeMate</Text>
                        <Text style={styles.versionText}>Version {appVersion}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Mission</Text>
                        <Text style={styles.paragraph}>
                            VibeMate is dedicated to bringing people together in a safe, fun, and meaningful way. In a world that's increasingly digital, we believe in the power of real connections and unforgettable experiences.
                        </Text>
                        <Text style={styles.paragraph}>
                            Whether you're looking for companionship, interesting conversations, or exceptional services, VibeMate is your trusted platform to find exactly what you're looking for.
                        </Text>
                    </View>

                    <View style={styles.statsSection}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>10k+</Text>
                            <Text style={styles.statLabel}>Users</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>500+</Text>
                            <Text style={styles.statLabel}>Providers</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>4.8/5</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Why Choose VibeMate?</Text>

                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: "#EBF5FF" }]}>
                                <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>Verified Profiles</Text>
                                <Text style={styles.featureDescription}>Every provider profile undergoes a mandatory verification process for your safety.</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: "#ECFDF5" }]}>
                                <Ionicons name="videocam" size={24} color="#10B981" />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>Video Calls</Text>
                                <Text style={styles.featureDescription}>Connect instantly through our high-quality video calling feature.</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: "#FFF7ED" }]}>
                                <Ionicons name="wallet" size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>Secure Payments</Text>
                                <Text style={styles.featureDescription}>Your funds are handled securely through integrated wallet and payment systems.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.copyrightText}>© 2026 BSK Tech Ltd. All rights reserved.</Text>
                        <Text style={styles.footerText}>Made with ❤️ for meaningful connections.</Text>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default AboutUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.text,
        marginLeft: 15,
    },
    content: {
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: "center",
        paddingVertical: 40,
        backgroundColor: "#F9FAFB",
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: theme.colors.activetabbarcolor,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: theme.colors.activetabbarcolor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.text,
        marginTop: 15,
    },
    versionText: {
        fontSize: 14,
        color: "#9CA3AF",
        marginTop: 4,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 15,
    },
    paragraph: {
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 24,
        marginBottom: 15,
    },
    statsSection: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 20,
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 10,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.activetabbarcolor,
    },
    statLabel: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: "#D1D5DB",
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    footer: {
        alignItems: "center",
        paddingVertical: 30,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        marginTop: 20,
    },
    copyrightText: {
        fontSize: 13,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    footerText: {
        fontSize: 13,
        color: "#6B7280",
    },
});
