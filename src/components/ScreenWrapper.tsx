import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop }}>{children}</View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
