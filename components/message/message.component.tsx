import { Text, View } from "react-native";

//STYLES
import { styles } from "./message.styles";

// TODO: type definitions
export default function Message({ message, user }) {
  const currentUserId = "u1";
  const { id } = user;
  let currentUserMessage = null;

  id === currentUserId
    ? (currentUserMessage = true)
    : (currentUserMessage = false);

  return (
    <View
      style={[
        styles.speechBubble,
        currentUserMessage
          ? styles.currentUserSpeechBubbleColor
          : styles.senderSpeechBubbleColor,
      ]}
    >
      <Text
        style={
          currentUserMessage
            ? styles.currentUserMessageColor
            : styles.senderMessageColor
        }
      >
        {message}
      </Text>
    </View>
  );
}
