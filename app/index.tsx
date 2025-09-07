import Button from "@/src/components/Button";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants/themes";
import { hp, wp } from "@/src/helpers/command";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ScreenWrapper bg={theme.colors.activetabbarcolor}>
      <View style={styles.container}>
        <Image source={require("../assets/vibemate.png")} style={styles.logo} />
        <View style={{ gap: 3, marginTop: 12 }}>
          <Text style={styles.text}>Welcome to Vibemate</Text>
          <Button
            title={"Get started"}
            onpress={() => router.push("/Login")}
            buttonStyle={{ paddingHorizontal: wp(2), width: "fit-content" }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.activetabbarcolor,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 0,
  },
  text: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: theme.colors.gray,
  },
});
