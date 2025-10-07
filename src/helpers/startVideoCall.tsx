// import { supabase } from "@/lib/supabase";

// export const startVideoCall = async (receiverId: string, router: any) => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       console.error("User not logged in");
//       return;
//     }

//     1. Create a video call row
//     const channelName = `call_${Date.now()}`;
//     const { data, error } = await supabase
//       .from("video_calls")
//       .insert([
//         {
//           caller_id: user.id,
//           callee_id: receiverId,
//           status: "active",
//           agora_channel_name: channelName,
//         },
//       ])
//       .select()
//       .single();

//     if (error) {
//       console.error("Error creating video call:", error);
//       return;
//     }

//     2. Navigate to VideoCallScreen
//     router.push({
//       pathname: "/videoCallScreen",
//       params: {
//         channel: data.channel,
//         callId: data.id,
//       },
//     });
//   } catch (e) {
//     console.error("Error starting call:", e);
//   }
// };
