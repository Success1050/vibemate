import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const PrivacyPolicy = () => {
    const router = useRouter();
    const lastUpdated = "January 20, 2026";

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Backbutton router={router} size={24} />
                    <Text style={styles.headerTitle}>Privacy Policy</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    <View style={styles.introSection}>
                        <Text style={styles.introText}>
                            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use VibeMate.
                        </Text>
                        <Text style={styles.updatedDate}>Last updated: {lastUpdated}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                        <Text style={styles.paragraph}>
                            We collect information you provide directly to us when you create an account, update your profile, or use our services. This includes:
                        </Text>
                        <View style={styles.list}>
                            <Text style={styles.listItem}>• Name, email address, and phone number.</Text>
                            <Text style={styles.listItem}>• Profile information (photos, bio, nickname).</Text>
                            <Text style={styles.listItem}>• Location data (if allowed).</Text>
                            <Text style={styles.listItem}>• Communication records (chat history, support tickets).</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                        <Text style={styles.paragraph}>
                            We use the collected information for various purposes, including:
                        </Text>
                        <View style={styles.list}>
                            <Text style={styles.listItem}>• To provide and maintain our Service.</Text>
                            <Text style={styles.listItem}>• To verify accounts and ensure safety.</Text>
                            <Text style={styles.listItem}>• To process transactions and send notifications.</Text>
                            <Text style={styles.listItem}>• To improve our app and develop new features.</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>3. Data Protection</Text>
                        <Text style={styles.paragraph}>
                            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
                        <Text style={styles.paragraph}>
                            We do not sell your personal data. We may share information with third-party service providers (like payment processors) only to facilitate our services.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>5. Your Rights</Text>
                        <Text style={styles.paragraph}>
                            You have the right to access, update, or delete your personal information at any time through your account settings. You can also contact us for assistance.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>6. Contact Us</Text>
                        <Text style={styles.paragraph}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </Text>
                        <Text style={styles.contactEmail}>bsktechltd@gmail.com</Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default PrivacyPolicy;

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
        padding: 20,
    },
    introSection: {
        marginBottom: 24,
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 12,
    },
    introText: {
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 22,
        fontStyle: "italic",
    },
    updatedDate: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 10,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 22,
    },
    list: {
        marginTop: 8,
        paddingLeft: 10,
    },
    listItem: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 22,
        marginBottom: 4,
    },
    contactEmail: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.colors.activetabbarcolor,
        marginTop: 5,
    },
});
