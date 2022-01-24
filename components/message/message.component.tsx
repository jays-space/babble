import { Auth, DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

//MODELS
import { User } from "../../src/models";

//STYLES
import { styles } from "./message.styles";

// TODO: type definitions
export default function Message({ message }) {
  //* query User model to get the user data
  const [messageSender, setMessageSender] = useState<User | undefined>();
  const [isCurrentUserMessage, setIsCurrentUserMessage] =
    useState<boolean>(false);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setMessageSender);
  }, []);

  useEffect(() => {
    const checkIfIsCurrentUserMessage = async () => {
      if (!messageSender) {
        return;
      }

      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      setIsCurrentUserMessage(messageSender.id === currentUserID);
    };

    checkIfIsCurrentUserMessage();
  }, []);

  // TODO: re-renders infinately. WHY??
  // message?.userID === messageSender
  //   ? setIsCurrentUserMessage(false)
  //   : setIsCurrentUserMessage(true);

  // if (!messageSender) {
  //   return <ActivityIndicator />;
  // }

  return (
    <View
      style={[
        styles.speechBubble,
        isCurrentUserMessage
          ? styles.currentUserSpeechBubbleColor
          : styles.senderSpeechBubbleColor,
      ]}
    >
      <Text
        style={
          isCurrentUserMessage
            ? styles.currentUserMessageColor
            : styles.senderMessageColor
        }
      >
        {message}
      </Text>
    </View>
  );
}
