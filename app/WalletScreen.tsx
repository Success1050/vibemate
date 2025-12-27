import { supabase } from "@/lib/supabase";
import { transactions } from "@/mockData";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import TransactionItem from "@/src/components/TransactionItem";
import { useApp } from "@/store";
import { useRouter } from "expo-router";
import { Wallet } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userSession, role } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);

      // ✅ get current user

      const userId = userSession?.user?.id;

      if (!userId) {
        console.log("User not logged in:");
        setLoading(false);
        return;
      }

      // ✅ fetch wallet balance
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching wallet:", error);
      } else {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error("Unexpected error fetching wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch balance on mount
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletBalance();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }} // add padding
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => router.push("/topupScreen")}
          >
            <Text style={styles.withdrawButtonText}>Fund wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Cards */}
        <View style={styles.balanceContainer}>
          <View style={styles.cardRow}>
            <View style={[styles.balanceCard, styles.availableBalanceCard]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardLabel}>Available Balance</Text>
                  <Text style={styles.cardAmount}>
                    {loading ? "Loading..." : `$${balance?.toFixed(2)}`}
                  </Text>
                </View>
                <Wallet size={32} color="#bfdbfe" />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          </View>

          {transactions.map((item) => (
            <TransactionItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  withdrawButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  withdrawButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  balanceContainer: {
    width: "100%",
  },
  cardRow: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  balanceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  availableBalanceCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#2563eb",
  },
  monthlyCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#16a34a",
  },
  totalEarnedCard: {
    backgroundColor: "#9333ea",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "#bfdbfe",
    fontSize: 14,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  monthlyCardLabel: {
    color: "#bbf7d0",
    fontSize: 14,
  },
  monthlyCardAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  totalEarnedLabel: {
    color: "#e9d5ff",
    fontSize: 14,
  },
  totalEarnedAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#15803d",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  transactionsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 24,
  },
  transactionsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
});
