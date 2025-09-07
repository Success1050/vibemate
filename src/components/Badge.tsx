import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Badge({ value }: { value: number }) {
  if (!value) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: "auto",
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
