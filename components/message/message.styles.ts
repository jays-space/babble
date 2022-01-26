import { StyleSheet } from "react-native";

//  CONSTANTS
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  speechBubble: {
    width: "auto",
    maxWidth: "75%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  currentUserSpeechBubbleColor: {
    backgroundColor: theme.primary.main,
    marginLeft: 10,
    marginRight: "auto",
  },
  currentUserMessageColor: {
    color: theme.white.default,
  },
  senderSpeechBubbleColor: {
    backgroundColor: "lightgrey",
    marginLeft: "auto",
    marginRight: 10,
  },
  senderMessageColor: {
    color: theme.black.default,
  },
  audioBubble: {
    width: "75%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  senderAudioBubbleColor: {
    backgroundColor: "lightgrey",
    marginLeft: "auto",
    marginRight: 10,
  },
  currentUserAudioBubbleColor: {
    backgroundColor: theme.primary.main,
    marginLeft: 10,
    marginRight: "auto",
  },
});
