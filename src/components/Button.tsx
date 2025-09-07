import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/themes";
import { hp } from "../helpers/command";
import Loading from "./Loading";

type ButtonProps = {
  buttonStyle?: object;
  textStyle?: object;
  title?: string;
  onpress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  isIcon?: boolean;
  icon?: React.ReactNode;
};

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onpress = () => {},
  loading = false,
  hasShadow = true,
  isIcon = false,
  icon,
}: ButtonProps) => {
  const shadowStyles = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onpress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyles]}
    >
      {isIcon ? icon : <Text style={[styles.text, textStyle]}>{title}</Text>}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: hp(5.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.activetabbarcolor,
  },

  text: {
    fontSize: hp(2.5),
    color: "white",
    fontWeight: "bold",
  },
});
