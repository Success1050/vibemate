import ScreenWrapper from "@/src/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Login = () => {
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View>
        <Text>Login</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({});
