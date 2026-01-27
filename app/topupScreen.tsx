import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import React, { useEffect, useState } from "react";
import { usePaystack } from "react-native-paystack-webview";

import { verifyAndCreditWallet } from "@/src/helpers/verifyPayment";
import { useApp } from "@/store";
import { styles } from "@/styles/topupStyles";
import { useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PaystackTransactionResponse } from "react-native-paystack-webview/production/lib/types";
import Toast from "react-native-root-toast";

interface TopUpWalletScreenProps { }

const TopUpWalletScreen: React.FC<TopUpWalletScreenProps> = () => {
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { popup } = usePaystack();
  const router = useRouter();
  const { userSession } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const getwalletBalance = async () => {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userSession?.user.id)
      .single();
    if (error) return;
    setBalance(data.balance);
  };
  useEffect(() => {
    getwalletBalance();
  }, [userSession?.user.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getwalletBalance();
    setRefreshing(false);
  };

  const handleTopUp = () => {
    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email");
      return;
    }

    const txAmount = amount; // convert to kobo
    const reference = `${userId}-${Date.now()}`; // unique reference

    popup?.newTransaction({
      amount: txAmount,
      email,
      reference,
      onSuccess: (res: PaystackTransactionResponse) => {
        const reference = res.reference;
        if (reference) {
          Toast.show("Payment Approved, verifying...", {
            duration: Toast.durations.LONG,
          });
          verifyAndCreditWallet(reference, userSession, amount);
        } else {
          Toast.show("No reference found!", {
            duration: Toast.durations.LONG,
          });
        }
        console.log("✅ success", res);
      },
      onCancel: () => {
        console.log("❌ cancelled");
      },
      onLoad: () => {
        console.log("⏳ loading checkout UI...");
      },
      onError: (err) => {
        console.log("💥 Paystack error:", err);
      },
    });
  };

  return (
    <ScreenWrapper bg={theme.colors.activetabbarcolor}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Top Up Wallet</Text>
            <Text style={styles.headerSubtitle}>
              Add funds to your wallet securely
            </Text>
          </View>

          {/* Current Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>₦ {balance || 0.0}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={amount.toString()}
                onChangeText={(text) => setAmount(parseFloat(text) || 0)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountSection}>
            <Text style={styles.quickAmountLabel}>Quick Select</Text>
            <View style={styles.quickAmountButtons}>
              {[10, 25, 50, 100].map((quickAmount, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickAmountButton,
                    amount === quickAmount && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => setAmount(quickAmount)}
                >
                  <Text
                    style={[
                      styles.quickAmountButtonText,
                      amount === quickAmount &&
                      styles.quickAmountButtonTextActive,
                    ]}
                  >
                    ₦{quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* User Details Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Notes */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this transaction"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Top Up Button */}
          <TouchableOpacity
            style={[styles.topUpButton, !amount && styles.topUpButtonDisabled]}
            onPress={handleTopUp}
            disabled={!amount}
          >
            <Text style={styles.topUpButtonText}>
              Top Up ₦{amount || "0.00"}
            </Text>
          </TouchableOpacity>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityText}>
              🔒 All transactions are encrypted and secure
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default TopUpWalletScreen;
