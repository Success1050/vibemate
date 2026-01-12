import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { hp, wp } from "@/src/helpers/command";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: "1",
        title: "Find Top Services",
        description: "Discover the best service providers in your area with ease.",
        image: require("@/assets/vibemate.png"), // Placeholder, ideally use different illustrations
    },
    {
        id: "2",
        title: "Easy Booking",
        description: "Book appointments quickly and securely within the app.",
        image: require("@/assets/vibemate.png"),
    },
    {
        id: "3",
        title: "Secure Payments",
        description: "Experience safe and hassle-free transactions.",
        image: require("@/assets/vibemate.png"),
    },
];

export default function Onboarding() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleFinish = async () => {
        try {
            await AsyncStorage.setItem("hasSeenOnboarding", "true");
            router.replace("/login");
        } catch (error) {
            console.log("Error saving onboarding status:", error);
            router.replace("/login");
        }
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            handleFinish();
        }
    };

    const onMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
        return (
            <View style={styles.slide}>
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <ScreenWrapper bg={theme.colors.activetabbarcolor}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    keyExtractor={(item) => item.id}
                />

                <View style={styles.footer}>
                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleFinish}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextText}>
                                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.activetabbarcolor,
    },
    slide: {
        width: width,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: wp(80),
        height: hp(40),
        marginBottom: 40,
    },
    textContainer: {
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: hp(3.5),
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    description: {
        fontSize: hp(2),
        color: "#ddd",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    footer: {
        height: hp(20),
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#ccc",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: theme.colors.primary, // Assuming primary color exists, or use a bright color
        width: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    skipText: {
        fontSize: hp(2.2),
        color: "#fff",
        fontWeight: "600",
    },
    nextButton: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    nextText: {
        fontSize: hp(2.2),
        color: theme.colors.activetabbarcolor,
        fontWeight: "bold",
    },
});
