import { useEffect, useState } from "react";
import { Auth, DataStore, Storage } from "aws-amplify";
import {
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { S3Image } from "aws-amplify-react-native";

//MODELS
import { User } from "../../src/models";

//COMPONENTS
import AudioPlayer from "../audio-player";

//STYLES
import { styles } from "./message.styles";

// TODO: type definitions
export default function Message({ message }) {
  const { width } = useWindowDimensions();

  //* query User model to get the user data
  const [messageSender, setMessageSender] = useState<User | undefined>();
  const [isCurrentUserMessage, setIsCurrentUserMessage] =
    useState<boolean>(false);
  const [audioUri, setAudioUri] = useState<any>(null);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setMessageSender);
  }, []);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setAudioUri);
    }
  }, [message]);

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

  return message.image || !!message.content ? (
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
        // TODO: on image press, show whole picture in a new screen/modal (https://www.npmjs.com/package/react-native-lightbox)
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
  ) : (
    <View
      style={[
        styles.audioBubble,
        isCurrentUserMessage
          ? styles.currentUserAudioBubbleColor
          : styles.senderAudioBubbleColor,
      ]}
    >
      {/* audio content */}
      {audioUri && <AudioPlayer audioUri={audioUri} previewer={false} />}
    </View>
  );
}
