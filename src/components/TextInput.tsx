import React from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "../constants/themes";
import { hp } from "../helpers/command";

type textinputprops = {
  containerStyles?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  inputRef?: React.Ref<TextInput>;
  placeholder: string;
  secureTextEntry: boolean;
  keyboardType?: KeyboardTypeOptions;
  value?: string | "";
  multiline?: boolean;

  onchangeText: (text: string) => void;
};

const TextInputFields = ({
  containerStyles,
  icon,
  inputRef,
  placeholder,
  onchangeText,
  ...props
}: textinputprops) => {
  return (
    <View style={[styles.container, containerStyles && containerStyles]}>
      {icon && icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={inputRef && inputRef}
        placeholder={placeholder}
        onChangeText={onchangeText}
        {...props}
      />
    </View>
  );
};

export default TextInputFields;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
