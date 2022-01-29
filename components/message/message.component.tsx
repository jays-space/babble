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
import { MessageStatus, User, Message as MessageModel } from "../../src/models";

//COMPONENTS
import AudioPlayer from "../audio-player";

//STYLES
import { styles } from "./message.styles";
import { Ionicons } from "@expo/vector-icons";

// TODO: type definitions
export default function Message({ message: MessageProp }) {
  const { width } = useWindowDimensions();

  //* query User model to get the user data
  const [messageSender, setMessageSender] = useState<User | undefined>();
  const [isCurrentUserMessage, setIsCurrentUserMessage] = useState<
    boolean | null
  >(null);
  const [audioUri, setAudioUri] = useState<any>(null);
  const [message, setMessage] = useState<MessageModel>(MessageProp);

  //* real time sync -> obsetve messageModel by message.id
  useEffect(() => {
    const subscription = DataStore.observe(MessageModel, message.id).subscribe(
      (message) => {
        // }

        //* append new message to messages
        if (message.model === MessageModel && message.opType === "UPDATE") {
          // console.log(message.element);
          setMessage((currentMessage) => ({
            ...currentMessage,
            ...message.element,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  });

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

  useEffect(() => {
    setMessageAsRead();
  }, [isCurrentUserMessage]);

  // TODO: re-renders infinately. WHY??
  // message?.userID === messageSender
  //   ? setIsCurrentUserMessage(false)
  //   : setIsCurrentUserMessage(true);

  // if (!messageSender) {
  //   return <ActivityIndicator />;
  // }

  const setMessageAsRead = async () => {
    if (
      isCurrentUserMessage === false &&
      message.status !== MessageStatus.READ
    ) {
      await DataStore.save(
        MessageModel.copyOf(message, (updated) => {
          updated.status = MessageStatus.READ;
        })
      );
    }
  };

  return message.image || !!message.content ? (
    <View
      style={[
        styles.speechBubble,
        isCurrentUserMessage
          ? styles.senderSpeechBubbleColor
          : styles.currentUserSpeechBubbleColor,
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
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          {/* <Text>{message.image}</Text> */}
        </TouchableOpacity>
      )}

      <View style={styles.messageContainer}>
        {/* text content */}
        {!!message.content && (
          <Text
            style={[
              isCurrentUserMessage
                ? styles.senderMessageColor
                : styles.currentUserMessageColor,
              !isCurrentUserMessage && !!message?.status && { maxWidth: "92%" },
            ]}
          >
            {message.content}
          </Text>
        )}

        {/* message status */}
        {!isCurrentUserMessage && !!message?.status && (
          <View
            style={[
              !!message.image && { flex: 1, marginTop: 5 },
              {
                justifyContent: "flex-end",
                alignItems: "flex-end",
              },
            ]}
          >
            <Ionicons
              name={
                message?.status === MessageStatus.SENT
                  ? "checkmark"
                  : "checkmark-done"
              }
              size={16}
              color={
                message?.status === MessageStatus.READ
                  ? styles.checkmarkReadColor.color
                  : styles.checkmarkDefaultColor.color
              }
              style={[
                !message.image && { marginLeft: 5 },
                { alignSelf: "flex-end" },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  ) : (
    <View
      style={[
        styles.audioBubble,
        isCurrentUserMessage
          ? styles.senderAudioBubbleColor
          : styles.currentUserAudioBubbleColor,
      ]}
    >
      {/* audio content */}
      {audioUri && <AudioPlayer audioUri={audioUri} previewer={false} />}

      {/* message status */}
      {!isCurrentUserMessage && !!message?.status && (
        <Ionicons
          name={
            message?.status === MessageStatus.SENT
              ? "checkmark"
              : "checkmark-done"
          }
          size={16}
          color={
            message?.status === MessageStatus.READ
              ? styles.checkmarkReadColor.color
              : styles.checkmarkDefaultColor.color
          }
          style={{ marginTop: 5, alignSelf: "flex-end" }}
        />
      )}
    </View>
  );
}
