import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ContactUs = () => {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const email = "bsktechltd@gmail.com";
    const phone = "+2348139738894";

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${email}`);
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleContactSubmit = () => {
        if (!subject || !message) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        // Simulate sending
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                "Message Sent",
                "Your message has been received. We will get back to you shortly.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        }, 1500);
    };

    return (
        <ScreenWrapper bg="white">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Backbutton router={router} size={24} />
                        <Text style={styles.headerTitle}>Contact Us</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Get in Touch</Text>
                            <Text style={styles.infoSubtitle}>
                                Have a question or feedback? We'd love to hear from you.
                            </Text>

                            <View style={styles.contactCards}>
                                <TouchableOpacity style={styles.contactCard} onPress={handleEmailPress}>
                                    <View style={[styles.iconBox, { backgroundColor: "#EBF5FF" }]}>
                                        <MaterialCommunityIcons name="email-outline" size={24} color="#3B82F6" />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactLabel}>Email Us</Text>
                                        <Text style={styles.contactValue}>{email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactCard} onPress={handlePhonePress}>
                                    <View style={[styles.iconBox, { backgroundColor: "#ECFDF5" }]}>
                                        <MaterialCommunityIcons name="phone-outline" size={24} color="#10B981" />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactLabel}>Call Us</Text>
                                        <Text style={styles.contactValue}>{phone}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.formTitle}>Send us a Message</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Subject</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="What is this regarding?"
                                    value={subject}
                                    onChangeText={setSubject}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Message</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="How can we help you today?"
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={5}
                                    placeholderTextColor="#9CA3AF"
                                    textAlignVertical="top"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleContactSubmit}
                                disabled={loading}
                            >
                                <Text style={styles.submitButtonText}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
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
    infoSection: {
        marginBottom: 30,
    },
    infoTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 8,
    },
    infoSubtitle: {
        fontSize: 15,
        color: "#6B7280",
        lineHeight: 22,
        marginBottom: 20,
    },
    contactCards: {
        gap: 12,
    },
    contactCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 13,
        color: "#9CA3AF",
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: "600",
        color: theme.colors.text,
    },
    formSection: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 40,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: theme.colors.text,
    },
    textArea: {
        minHeight: 120,
        paddingTop: 12,
    },
    submitButton: {
        backgroundColor: theme.colors.activetabbarcolor,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
