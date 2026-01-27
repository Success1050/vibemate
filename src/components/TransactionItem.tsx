import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "../../tsx-types";

export default function TransactionItem({ item }: { item: Transaction }) {
  const isCredit = item.type === "credit";
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.typeIcon,
              isCredit ? styles.creditIcon : styles.debitIcon,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                isCredit ? styles.creditText : styles.debitText,
              ]}
            >
              {isCredit ? "+" : "-"}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              isCredit ? styles.creditAmount : styles.debitAmount,
            ]}
          >
            {isCredit ? "+" : "-"}₦{item.amount}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusIndicator, getStatusColor(item.status)]}
            />
            <Text style={[styles.statusText, getStatusTextColor(item.status)]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function getStatusColor(status: any) {
  switch (status) {
    case "completed":
      return { backgroundColor: "#10b981" };
    case "pending":
      return { backgroundColor: "#f59e0b" };
    case "failed":
      return { backgroundColor: "#ef4444" };
    default:
      return { backgroundColor: "#6b7280" };
  }
}

function getStatusTextColor(status: any) {
  switch (status) {
    case "completed":
      return { color: "#059669" };
    case "pending":
      return { color: "#d97706" };
    case "failed":
      return { color: "#dc2626" };
    default:
      return { color: "#6b7280" };
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  creditIcon: {
    backgroundColor: "#dcfce7",
  },
  debitIcon: {
    backgroundColor: "#fee2e2",
  },
  typeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  creditText: {
    color: "#059669",
  },
  debitText: {
    color: "#dc2626",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontWeight: "500",
    color: "#111827",
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontWeight: "600",
    fontSize: 16,
  },
  creditAmount: {
    color: "#059669",
  },
  debitAmount: {
    color: "#dc2626",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
});
