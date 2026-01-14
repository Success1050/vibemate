import { supabase } from "@/lib/supabase";
import Backbutton from "@/src/components/Backbutton";
import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import TextInputFields from "@/src/components/TextInput";
import { theme } from "@/src/constants/themes";
import { hp, wp } from "@/src/helpers/command";
// import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CreateDedicatedAccountParams = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

const Signup = () => {
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  console.log(emailRef.current);
  console.log(passwordRef.current);

  const onsubmit = async () => {
    if (!emailRef || !passwordRef || !role) {
      return Alert.alert("invalid", "please fill all the details");
    }
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { userRole: role } },
      });
      if (error) {
        return console.log(error);
      }
      console.log("successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View style={styles.container}>
          <Backbutton router={router} size={24} />
          {/* Header */}
          <View>
            <Text style={styles.welcmeText}>Let's</Text>
            <Text style={styles.welcmeText}>Get started</Text>
          </View>

          {/* form text */}

          <View style={{ gap: 25 }}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill the details to create an account
            </Text>

            {/* Email */}
            <TextInputFields
              icon={<AntDesign name="mail" size={24} color="black" />}
              color="#000"
              placeholder={"Enter your email"}
              onchangeText={(value) => (emailRef.current = value)}
              secureTextEntry={false}
              keyboardType="email-address"
            />

            {/* Password */}
            <TextInputFields
              icon={<Feather name="lock" size={24} color="black" />}
              color="#000"
              placeholder={"Enter your password"}
              onchangeText={(value) => (passwordRef.current = value)}
              secureTextEntry={true}
            />

            {/* Role Selection */}
            <Text style={[styles.sectionLabel]}>I want to:</Text>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === "booker" && styles.roleSelected,
              ]}
              onPress={() => setRole("booker")}
            >
              <Ionicons name="person" size={20} color="#2563eb" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.roleTitle}>Book Services</Text>
                <Text style={styles.roleSubtitle}>
                  Find and hire service providers
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === "os" && styles.roleSelected]}
              onPress={() => setRole("os")}
            >
              <MaterialIcons name="work" size={20} color="#2563eb" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.roleTitle}>Offer Services</Text>
                <Text style={styles.roleSubtitle}>
                  Provide services to customers
                </Text>
              </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
              title="Signup"
              loading={isLoading}
              buttonStyle={{ backgroundColor: theme.colors.activetabbarcolor }}
              onpress={onsubmit}
            />

            {/* <View>
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
            </View> */}

            {/* Already have account */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>

              <Pressable onPress={() => router.push("/login")}>
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
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(5),
    // paddingBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
    marginLeft: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },

  welcmeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
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

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 8,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
  },
  roleSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  roleSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  radioSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563eb",
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  radioSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  selectedText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#374151",
  },
});
