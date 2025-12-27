import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import {
  Call,
  CallContent,
  CallControlProps,
  CallingState,
  HangUpCallButton,
  StreamCall,
  ToggleVideoPublishingButton as ToggleCamera,
  ToggleAudioPublishingButton as ToggleMic,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const CustomCallControls = (props: CallControlProps) => {
  return (
    <View style={styles.customCallControlsContainer}>
      <ToggleMic />
      <ToggleCamera />
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};

const OsVideoCallScreen = () => {
  const router = useRouter();
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const client = useStreamVideoClient();

  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const joinCall = async () => {
      try {
        if (!client) {
          console.log("Stream client not ready yet");
          return;
        }

        if (!callId) {
          Alert.alert("Error", "Missing call ID");
          return;
        }

        console.log("Joining call:", callId);

        const _call = client.call("default", callId);

        await _call.join({ create: false });

        await supabase
          .from("video_calls")
          .update({
            status: "active",
            started_at: new Date().toISOString(),
          })
          .eq("call_id", callId)
          .eq("status", "pending");

        setCall(_call);
        console.log("Joined call successfully!");
      } catch (error) {
        console.error("Error joining call:", error);
        Alert.alert("Call Error", "Unable to join call. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    joinCall();

    // Cleanup on unmount
    return () => {
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave().catch(() => {});
      }
    };
  }, [client, callId]);

  const endCall = async () => {
    router.back();
    Alert.alert("Call Ended", "Thanks for calling!");

    if (callId) {
      await supabase
        .from("video_calls")
        .update({
          ended_at: new Date().toISOString(),
          status: "completed",
        })
        .eq("call_id", callId);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  if (!call) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unable to join call. Please retry.</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <StreamCall call={call}>
        <View style={styles.container}>
          <CallContent
            onHangupCallHandler={endCall}
            CallControls={CustomCallControls}
          />
        </View>
      </StreamCall>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  customCallControlsContainer: {
    position: "absolute",
    bottom: 40,
    paddingVertical: 10,
    width: "80%",
    marginHorizontal: 20,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    backgroundColor: "orange",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 5,
    zIndex: 5,
  },
});

export default OsVideoCallScreen;
