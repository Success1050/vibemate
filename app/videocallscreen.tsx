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
import React, { useEffect } from "react";
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

const VideoCallScreen = () => {
  const router = useRouter();
  const { callId } = useLocalSearchParams<{
    callId: string;
  }>();

  const [call, setCall] = React.useState<Call | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call("default", callId);
    _call?.join({ create: true }).then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View style={styles.container}>
        <Text>Joining call...</Text>
      </View>
    );
  }

  const endCall = async () => {
    if (callId) {
      await supabase
        .from("video_calls")
        .update({
          ended_at: new Date().toISOString(),
          status: "completed",
        })
        .eq("id", callId);
    }
    router.back();
    Alert.alert("Call Ended", "Thanks for calling!");
  };

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
    marginBottom: 20,
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

export default VideoCallScreen;
