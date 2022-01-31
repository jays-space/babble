import { StyleSheet } from "react-native";

//  CONSTANTS
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  speechBubble: {
    width: "auto",
    maxWidth: "75%",
    padding: 12,
    margin: 10,
    borderRadius: 10,
    // flexDirection: "row",
  },
  senderSpeechBubbleColor: {
    backgroundColor: theme.primary.main,
    marginLeft: 10,
    marginRight: "auto",
  },
  senderMessageColor: {
    color: theme.white.default,
  },
  currentUserSpeechBubbleColor: {
    backgroundColor: "lightgrey",
    marginLeft: "auto",
    marginRight: 10,
  },
  currentUserMessageColor: {
    color: theme.black.default,
  },
  audioBubble: {
    width: "75%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  currentUserAudioBubbleColor: {
    backgroundColor: "lightgrey",
    marginLeft: "auto",
    marginRight: 10,
  },
  senderAudioBubbleColor: {
    backgroundColor: theme.primary.main,
    marginLeft: 10,
    marginRight: "auto",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkmarkDefaultColor: {
    color: theme.grey.default,
  },
  checkmarkReadColor: {
    color: theme.primary.main,
  },
  repliedTo: {
    marginBottom: 10,
    backgroundColor: "#b1b1b1",
    padding: 5,
    borderRadius: 5,
  }
});
