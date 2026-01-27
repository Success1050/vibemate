import Backbutton from "@/src/components/Backbutton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.faqCard}>
            <TouchableOpacity onPress={toggleOpen} style={styles.faqHeader} activeOpacity={0.7}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.colors.text}
                />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

const HelpCenter = () => {
    const router = useRouter();

    const faqs = [
        {
            question: "How do I create a match?",
            answer: "Browse through profiles of available providers and click on their profiles to see details. You can then book a session or start a video call directly.",
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, we use industry-standard encryption and secure payment gateways (like Paystack) to ensure your financial information is always protected.",
        },
        {
            question: "How do I report a suspicious profile?",
            answer: "Safety is our priority. If you encounter a profile that violates our terms, please use the report button on their profile or contact our support team immediately.",
        },
        {
            question: "What is Gold and how do I use it?",
            answer: "Gold is our premium currency used for booking special sessions and unlocking exclusive features. You can purchase Gold from the 'Gold Purchase' section in your wallet.",
        },
        {
            question: "Can I cancel a booking?",
            answer: "Cancellations are subject to our cancellation policy. Generally, you can cancel within a certain timeframe before the session starts for a full or partial refund.",
        },
    ];

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Backbutton router={router} size={24} />
                    <Text style={styles.headerTitle}>Help Center</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    <View style={styles.heroSection}>
                        <Ionicons name="help-buoy-outline" size={80} color={theme.colors.activetabbarcolor} />
                        <Text style={styles.heroTitle}>How can we help you?</Text>
                        <Text style={styles.heroSubtitle}>Find answers to the most common questions below.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </View>

                    <View style={styles.contactSection}>
                        <Text style={styles.contactTitle}>Still need help?</Text>
                        <Text style={styles.contactDescription}>
                            If you couldn't find what you're looking for, our support team is available 24/7.
                        </Text>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => router.push("/ContactUs")}
                        >
                            <Text style={styles.contactButtonText}>Contact Support</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default HelpCenter;

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
    heroSection: {
        alignItems: "center",
        marginBottom: 30,
        paddingVertical: 20,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.text,
        marginTop: 15,
    },
    heroSubtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 15,
    },
    faqCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: "hidden",
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: "600",
        color: theme.colors.text,
        flex: 1,
        marginRight: 10,
    },
    faqAnswerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 12,
    },
    faqAnswer: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
    },
    contactSection: {
        backgroundColor: theme.colors.activetabbarcolor + "10",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 40,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 8,
    },
    contactDescription: {
        fontSize: 14,
        color: "#4B5563",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    contactButton: {
        backgroundColor: theme.colors.activetabbarcolor,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    contactButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
});
