import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";

//STYLES
import { styles } from "./audio-player.styles";

const AudioPlayer = ({ audioUri, previewer }) => {
  const [recordedAudio, setRecordedAudio] = useState<Audio.Sound | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(true);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgressPosition, setAudioProgressPosition] = useState<number>(0);

  useEffect(() => {
    loadAudio();

    return () => {
      if (recordedAudio) {
        recordedAudio.unloadAsync();
      }
    };
  }, [audioUri]);

  const loadAudio = async () => {
    if (!audioUri) {
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      {},
      onAudioPlaybackStatusUpdate
    );
    setRecordedAudio(sound);
  };

  //* audio playback status update functionality
  const onAudioPlaybackStatusUpdate = async (
    playbackStatus: AVPlaybackStatus
  ) => {
    if (!playbackStatus.isLoaded) {
      return;
    }

    setIsAudioPaused(!playbackStatus.isPlaying);
    setAudioDuration(playbackStatus.durationMillis || 0);
    setAudioProgressPosition(playbackStatus.positionMillis);
    setAudioProgress(
      playbackStatus.positionMillis / (playbackStatus.durationMillis || 1)
    );
  };

  //* convert audio duration
  const convertDuration = () => {
    const minutes = Math.floor(audioDuration / (60 * 1000));
    const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  //* recording preview and player
  const handlePlayPauseAudio = async () => {
    if (!recordedAudio) {
      return;
    }

    if (isAudioPaused) {
      if (audioProgressPosition < audioDuration) {
        await recordedAudio.playAsync();
      } else {
        await recordedAudio.playFromPositionAsync(0);
      }
    } else {
      await recordedAudio.pauseAsync();
    }
  };

  return (
    recordedAudio && (
      <View
        style={[styles.previewContainer, previewer && { marginBottom: 20 }]}
      >
        <TouchableOpacity onPress={handlePlayPauseAudio} style={{ padding: 5 }}>
          <Feather
            name={isAudioPaused ? "play" : "pause"}
            size={24}
            color={styles.recordBtn.color}
          />
        </TouchableOpacity>

        {/* player bar */}
        <View style={styles.audioPlayerProgressBar}>
          <View
            style={[
              styles.audioPlayerProgressBarMarker,
              { left: `${audioProgress * 100}%` },
            ]}
          />
        </View>

        <Text style={{ marginHorizontal: 10, alignSelf: "center" }}>
          {convertDuration()}
        </Text>

        {/* cancel button */}
        {/* <TouchableOpacity
          onPress={() => {
            if (recordedAudio) {
              recordedAudio.stopAsync();
            }
            setIsAudioPaused(true);
            setRecordedAudio(null);
            //   audioUri(null);
          }}
          style={{ padding: 5 }}
        >
          <AntDesign name="close" size={24} color={styles.btns.color} />
        </TouchableOpacity> */}
      </View>
    )
  );
};

export default AudioPlayer;
