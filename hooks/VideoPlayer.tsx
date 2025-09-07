// hooks/useVideoPlayerState.ts
import { useEvent } from "expo";
import { useVideoPlayer } from "expo-video";

export const useVideoPlayerState = (videoSource: string) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return { player, isPlaying };
};
