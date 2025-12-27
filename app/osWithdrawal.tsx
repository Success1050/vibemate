import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { useApp } from "@/store";
import React, { useEffect, useState } from "react";
import { styles } from "@/styles/withdrawalStyles";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
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
import Toast from "react-native-root-toast";

interface WithdrawalScreenProps {}

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = () => {
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { userSession } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const getWalletBalance = async () => {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userSession?.user.id)
      .single();
    if (error) return;
    setBalance(data.balance);
  };

  useEffect(() => {
    if (userSession?.user.id) {
      setUserId(userSession.user.id);
      getWalletBalance();
    }
  }, [userSession?.user.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getWalletBalance();
    setRefreshing(false);
  };

  const handleWithdrawal = async () => {
    // Validation
    if (!amount || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (amount > balance) {
      Alert.alert(
        "Insufficient Balance",
        "You don't have enough balance for this withdrawal"
      );
      return;
    }

    if (!accountName || !accountNumber || !bankName) {
      Alert.alert(
        "Missing Information",
        "Please fill in all bank account details"
      );
      return;
    }

    if (accountNumber.length < 10) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid account number (minimum 10 digits)"
      );
      return;
    }

    // Confirm withdrawal
    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw NGN ${amount.toFixed(
        2
      )} to ${accountName} (${accountNumber})?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            await processWithdrawal();
          },
        },
      ]
    );
  };

  const processWithdrawal = async () => {
    setIsProcessing(true);

    try {
      // Create withdrawal record
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("withdrawals")
        .insert({
          user_id: userId,
          amount: amount,
          account_name: accountName,
          account_number: accountNumber,
          bank_name: bankName,
          notes: notes,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (withdrawalError) {
        throw new Error(withdrawalError.message);
      }

      // Deduct from wallet (you might want to do this after admin approval)
      const { error: walletError } = await supabase
        .from("wallets")
        .update({
          balance: balance - amount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (walletError) {
        throw new Error(walletError.message);
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          type: "withdrawal",
          amount: amount,
          status: "pending",
          description: `Withdrawal to ${accountName} - ${bankName}`,
          reference: withdrawalData.id,
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        throw new Error(transactionError.message);
      }

      Toast.show("Withdrawal request submitted successfully!", {
        duration: Toast.durations.LONG,
        backgroundColor: theme.colors.primary,
      });

      // Reset form
      setAmount(0);
      setAccountName("");
      setAccountNumber("");
      setBankName("");
      setNotes("");

      // Refresh balance
      await getWalletBalance();

      // Navigate back or to transaction history
      router.back();
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      Alert.alert(
        "Withdrawal Failed",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
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
            <Text style={styles.headerTitle}>Withdraw Funds</Text>
            <Text style={styles.headerSubtitle}>
              Transfer money from your wallet to your bank account
            </Text>
          </View>

          {/* Current Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>NGN {balance.toFixed(2)}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Withdrawal Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>NGN</Text>
              <TextInput
                style={styles.amountInput}
                value={amount > 0 ? amount.toString() : ""}
                onChangeText={(text) => setAmount(parseFloat(text) || 0)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            {amount > balance && (
              <Text style={styles.errorText}>
                Amount exceeds available balance
              </Text>
            )}
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
                    quickAmount > balance && styles.quickAmountButtonDisabled,
                  ]}
                  onPress={() => setAmount(quickAmount)}
                  disabled={quickAmount > balance}
                >
                  <Text
                    style={[
                      styles.quickAmountButtonText,
                      amount === quickAmount &&
                        styles.quickAmountButtonTextActive,
                      quickAmount > balance &&
                        styles.quickAmountButtonTextDisabled,
                    ]}
                  >
                    NGN{quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bank Details Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bank Account Details</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Account Name</Text>
            <TextInput
              style={styles.textInput}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Enter account holder name"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.textInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              placeholderTextColor="#A0A0A0"
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput
              style={styles.textInput}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Enter bank name"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
            />
          </View>

          {/* Notes */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this withdrawal"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Withdrawal Button */}
          <TouchableOpacity
            style={[
              styles.withdrawalButton,
              (!amount || amount > balance || isProcessing) &&
                styles.withdrawalButtonDisabled,
            ]}
            onPress={handleWithdrawal}
            disabled={!amount || amount > balance || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.withdrawalButtonText}>
                Withdraw NGN {amount > 0 ? amount.toFixed(2) : "0.00"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Notice */}
          <View style={styles.infoNotice}>
            <Text style={styles.infoTitle}>⏱️ Processing Time</Text>
            <Text style={styles.infoText}>
              Withdrawal requests are typically processed within 24-48 hours on
              business days.
            </Text>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityText}>
              🔒 All withdrawals are reviewed for security
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default WithdrawalScreen;
