import Ionicons from "@expo/vector-icons/Ionicons";
import { Router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { theme } from "../constants/themes";

type backbutton = {
  router: Router;
  size: number;
};

const Backbutton = ({ router, size = 24 }: backbutton) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Ionicons name="chevron-back" size={size} color="black" />
    </Pressable>
  );
};

export default Backbutton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0, 0.07)",
  },
});
