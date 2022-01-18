import { StyleSheet } from "react-native";

//  CONSTANTS
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  speechBubble: {
    maxWidth: "75%",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  currentUserSpeechBubbleColor: {
    backgroundColor: "lightgrey",
    color: "green",
    marginLeft: "auto",
    marginRight: 10,
  },
  senderSpeechBubbleColor: {
    backgroundColor: theme.primary.main,
    marginLeft: 10,
    marginRight: "auto",
  },
  currentUserMessageColor: {
    color: theme.black.default,
  },
  senderMessageColor: {
    color: theme.white.default,
  },
});
