import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingProps {
  size?: "small" | "large";
  color?: string;
}

const Loading = ({ size = "large", color = "#0000ff" }: LoadingProps) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
