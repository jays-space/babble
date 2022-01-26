import { Auth, DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { S3Image } from "aws-amplify-react-native";

//MODELS
import { User } from "../../src/models";

//STYLES
import { styles } from "./message.styles";

// TODO: type definitions
export default function Message({ message }) {
  const { width } = useWindowDimensions();

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

      setIsCurrentUserMessage(messageSender.id !== currentUserID);
    };

    checkIfIsCurrentUserMessage();
  }, [messageSender]);

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
      {/* image content */}
      {message.image && (
        // TODO: on image press, show whole picture in a new screen/modal
        <TouchableOpacity>
          <S3Image
            imgKey={message.image}
            style={{
              width: width * 0.7,
              aspectRatio: 4 / 3,
              marginBottom: !!message.content ? 10 : 0,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* text content */}
      {!!message.content && (
        <Text
          style={
            isCurrentUserMessage
              ? styles.currentUserMessageColor
              : styles.senderMessageColor
          }
        >
          {message.content}
        </Text>
      )}
    </View>
  );
}
