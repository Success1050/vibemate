import Backbutton from "@/src/components/Backbutton";
import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import TextInputFields from "@/src/components/TextInput";
import { theme } from "@/src/constants/themes";
import { hp, wp } from "@/src/helpers/command";
// import { supabase } from "@/lib/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Signup = () => {
  const router = useRouter();
  const namerRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  console.log(emailRef.current);
  console.log(passwordRef.current);

  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = async () => {
    // if (!emailRef.current || !passwordRef.current || !namerRef.current) {
    //   Alert.alert("Signup", "Please fill all the fields");
    //   return;
    // }
    // let name = namerRef.current.trim();
    // let email = emailRef.current.trim();
    // let password = passwordRef.current.trim();
    // setIsLoading(true);
    // try {
    //   const {
    //     data: { session },
    //     error,
    //   } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     options: {
    //       data: {
    //         name,
    //       },
    //     },
    //   });
    //   if (error) {
    //     Alert.alert("Signup", error.message);
    //   }
    // } catch (error) {
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Backbutton router={router} size={24} />

        {/* welcome */}
        <View>
          <Text style={styles.welcmeText}>Let's</Text>
          <Text style={styles.welcmeText}>Get started</Text>
        </View>

        {/* form text */}

        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill thw dettauls to create an account
          </Text>

          <TextInputFields
            icon={<Feather name="user" size={24} color="black" />}
            placeholder={"Enter your fullname"}
            onchangeText={(value) => (namerRef.current = value)}
            secureTextEntry={false}
            keyboardType="default"
          />
          <TextInputFields
            icon={<AntDesign name="mail" size={24} color="black" />}
            placeholder={"Enter your email"}
            onchangeText={(value) => (emailRef.current = value)}
            secureTextEntry={false}
            keyboardType="email-address"
          />
          <TextInputFields
            icon={<Feather name="lock" size={24} color="black" />}
            placeholder={"Enter your password"}
            onchangeText={(value) => (passwordRef.current = value)}
            secureTextEntry={true}
          />

          {/* button */}

          <Button
            title="Signup"
            loading={isLoading}
            buttonStyle={{ backgroundColor: theme.colors.activetabbarcolor }}
            onpress={onsubmit}
          />
        </View>

        {/* Social media signup */}

        <View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: hp(2.3),
            }}
          >
            Signup with
          </Text>
          <View style={styles.socialButtonsContainer}>
            <Button
              title="Google"
              buttonStyle={{ backgroundColor: "#4285F4" }}
              onpress={() => {}}
            />
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: hp(2.3),
              }}
            >
              OR
            </Text>
            <Button
              title="Facebook"
              buttonStyle={{ backgroundColor: "blue" }}
              onpress={() => {}}
            />
          </View>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/Login")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.activetabbarcolor,
                  fontWeight: "semibold",
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(5),
  },

  welcmeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    color: theme.colors.text,
    fontWeight: "semibold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },

  socialButtonsContainer: {
    gap: 5,
    marginTop: 5,
  },
});
