import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { getGoldBal } from "@/src/helpers/goldAccount";
import { verifyAndCreditWallet } from "@/src/helpers/verifyPayment";
import { useApp } from "@/store";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { PaystackTransactionResponse } from "react-native-paystack-webview/production/lib/types";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const GoldPurchaseScreen = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [goldBal, setGoldBalance] = useState<number>(0);
  const { userSession } = useApp();
  const { popup } = usePaystack();

  const goldPackages = [
    { id: 1, gold: 100, price: 500, badge: "" },
    { id: 2, gold: 500, price: 2000, badge: "POPULAR" },
    { id: 3, gold: 1000, price: 3500, badge: "BEST VALUE" },
    { id: 4, gold: 2500, price: 8000, badge: "" },
    { id: 5, gold: 5000, price: 15000, badge: "VIP" },
    { id: 6, gold: 10000, price: 28000, badge: "MEGA" },
  ];

  const handlePurchase = () => {
    if (!selectedPackage) return;

    const pkg = goldPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const computedAmount = pkg.price; // Paystack expects kobo
    const reference = `${userSession?.user?.id}-${Date.now()}`;

    console.log("computed amount", computedAmount);

    popup?.newTransaction({
      amount: computedAmount,
      email: userSession?.user?.email || "",
      reference,
      onSuccess: async (res: PaystackTransactionResponse) => {
        const ref = res.reference;

        if (!ref) {
          Toast.show("No reference found!", { duration: Toast.durations.LONG });
          return;
        }

        Toast.show("Payment Approved, verifying...", {
          duration: Toast.durations.SHORT,
        });

        const result = await verifyAndCreditWallet(
          reference,
          userSession,
          computedAmount,
          pkg.gold
        );

        if (result.success) {
          if (result.type === "gold") {
            Toast.show("🥇 Gold credited successfully!", {
              duration: Toast.durations.LONG,
            });
          } else {
            Toast.show("💰 Wallet funded successfully!", {
              duration: Toast.durations.LONG,
            });
          }
        } else {
          Toast.show(`❌ Verification failed: ${result.error}`, {
            duration: Toast.durations.LONG,
          });
        }

        console.log("Payment verification result:", result);
      },

      onCancel: () => {
        console.log("❌ cancelled");
      },
      onLoad: () => {
        console.log("loading payment UI...");
      },
      onError: () => {
        console.log("💥 an error occurred");
      },
    });

    console.log(`Purchase package: ₦${pkg.price}`);
  };

  useEffect(() => {
    const fetchGoldBalance = async () => {
      const res = await getGoldBal(userSession?.user.id ?? undefined);
      if (res && res.success) {
        console.log(res.data.gold_balance);
        setGoldBalance(res.data.gold_balance);
      }
      console.log(res.error);
    };
    fetchGoldBalance();
  }, [userSession?.user.id]);

  return (
    <ScreenWrapper bg="#1a1a2e">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buy Gold</Text>
          <Text style={styles.headerSubtitle}>Choose your package</Text>
        </View>

        <View style={styles.currentBalanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.goldIcon}>💰</Text>
            <Text style={styles.balanceAmount}>{goldBal ?? 0}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.packagesContainer}>
            {goldPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage === pkg.id && styles.packageCardSelected,
                ]}
                onPress={() => setSelectedPackage(pkg.id)}
                activeOpacity={0.8}
              >
                {pkg.badge !== "" && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pkg.badge}</Text>
                  </View>
                )}

                <View style={styles.packageContent}>
                  <Text style={styles.goldIconLarge}>💰</Text>
                  <Text style={styles.goldAmount}>
                    {pkg.gold.toLocaleString()}
                  </Text>
                  <Text style={styles.goldLabel}>Gold Coins</Text>

                  <View style={styles.priceContainer}>
                    <Text style={styles.currency}>₦</Text>
                    <Text style={styles.price}>
                      {pkg.price.toLocaleString()}
                    </Text>
                  </View>

                  {selectedPackage === pkg.id && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Why Buy Gold?</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎁</Text>
              <Text style={styles.featureText}>
                Send premium gifts to your favorite girls
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureText}>
                Unlock exclusive features and content
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💎</Text>
              <Text style={styles.featureText}>Stand out with VIP status</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔥</Text>
              <Text style={styles.featureText}>
                Priority support and access
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.purchaseButton,
              !selectedPackage && styles.purchaseButtonDisabled,
            ]}
            onPress={handlePurchase}
            disabled={!selectedPackage}
            activeOpacity={0.8}
          >
            <Text style={styles.purchaseButtonText}>
              {selectedPackage
                ? `Purchase ${goldPackages
                    .find((p) => p.id === selectedPackage)
                    ?.gold.toLocaleString()} Gold`
                : "Select a Package"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.secureText}>🔒 Secure payment with Paystack</Text>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.activetabbarcolor,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#16213e",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  currentBalanceContainer: {
    backgroundColor: "#16213e",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#a0a0a0",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  goldIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
  },
  scrollView: {
    flex: 1,
  },
  packagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    justifyContent: "space-between",
  },
  packageCard: {
    width: "48%",
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  packageCardSelected: {
    borderColor: "#FFD700",
    backgroundColor: "#1f2b4d",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: 12,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  packageContent: {
    alignItems: "center",
  },
  goldIconLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  goldAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  goldLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  currency: {
    fontSize: 16,
    color: "#fff",
    marginRight: 2,
    marginTop: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFD700",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "bold",
  },
  featuresContainer: {
    backgroundColor: "#16213e",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#e0e0e0",
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#2a2a4e",
  },
  purchaseButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    backgroundColor: "#4a4a6e",
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  secureText: {
    textAlign: "center",
    fontSize: 12,
    color: "#a0a0a0",
  },
});

export default GoldPurchaseScreen;
