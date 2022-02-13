import { useEffect, useState } from "react";
import { Auth, DataStore, Storage } from "aws-amplify";
import {
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { S3Image } from "aws-amplify-react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { box } from "tweetnacl";

//MODELS
import { MessageStatus, User, Message as MessageModel } from "../../src/models";

//COMPONENTS
import AudioPlayer from "../audio-player";

//STYLES
import { styles } from "./message.styles";
import { Ionicons } from "@expo/vector-icons";
import {
  decrypt,
  getCurrentUserSecretKey,
  stringToUint8Array,
} from "../../utils/crypto";

// TODO: type definitions
export default function Message({
  message: MessageProp,
  setAsMessageReply,
  onLongPress,
}) {
  const { width } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  //* query User model to get the user data
  const [messageSender, setMessageSender] = useState<User | undefined>();
  const [isCurrentUserMessage, setIsCurrentUserMessage] = useState<
    boolean | null
  >(null);
  const [audioUri, setAudioUri] = useState<any>(null);
  const [message, setMessage] = useState<MessageModel>(MessageProp);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(
    undefined
  );
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  //* real time sync -> obsetve messageModel by message.id
  useEffect(() => {
    const subscription = DataStore.observe(MessageModel, message.id).subscribe(
      (message) => {
        // }

        //* append new message to messages
        if (message.model === MessageModel) {
          if (message.opType === "UPDATE") {
            // console.log(message.element);
            setMessage((currentMessage) => ({
              ...currentMessage,
              ...message.element,
            }));
          } else if (message.opType === "DELETE") {
            setIsDeleted(true);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    if (message.replyToMessageID) {
      DataStore.query(MessageModel, message.replyToMessageID).then(
        setRepliedTo
      );
    }
  }, [message]);

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

      setIsCurrentUserMessage(messageSender.id === currentUserID);
    };

    checkIfIsCurrentUserMessage();
  }, [messageSender]);

  useEffect(() => {
    setMessage(MessageProp);
  }, [MessageProp]);

  useEffect(() => {
    setMessageAsRead();
  }, [isCurrentUserMessage]);

  useEffect(() => {
    const decryptMessage = async () => {
      if (!message?.content || !messageSender?.publicKey) {
        return;
      }

      const currentUserPrivateKey = await getCurrentUserSecretKey();
      if (!currentUserPrivateKey) {
        return;
      }

      const sharedKey = box.before(
        stringToUint8Array(messageSender?.publicKey),
        currentUserPrivateKey
      );

      const decrypted = decrypt(sharedKey, message?.content);
      setDecryptedMessage(decrypted?.newMessage);
    };

    decryptMessage();
  }, [message, messageSender]);

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

  const confirmDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this message`,
      [
        {
          text: "Delete",
          onPress: () => deleteMessage(),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const deleteMessage = async () => {
    await DataStore.delete(message);
  };

  const onActionPress = (actionIndex) => {
    //* reply to message
    if (actionIndex === 0) {
      setAsMessageReply();
    }

    //* delete message
    if (actionIndex === 1 && isCurrentUserMessage) {
      confirmDelete();
    }
  };

  const openActionMenu = () => {
    if (isCurrentUserMessage) {
      const options = ["Reply to message", "Delete message", "Cancel"];
      const destructiveButtonIndex = 1;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        { options, destructiveButtonIndex, cancelButtonIndex },
        onActionPress
      );
    } else {
      const options = ["Reply to message", "Cancel"];
      const cancelButtonIndex = 1;

      showActionSheetWithOptions({ options, cancelButtonIndex }, onActionPress);
    }
  };

  return message.image || !!message.content ? (
    <View>
      <TouchableOpacity
        onLongPress={openActionMenu}
        style={[
          styles.speechBubble,
          isCurrentUserMessage
            ? styles.currentUserSpeechBubbleColor
            : styles.senderSpeechBubbleColor,
        ]}
      >
        {/* //* message reply */}
        {repliedTo && (
          <View style={styles.repliedTo}>
            <Text>
              Replied to:{" "}
              {repliedTo.content
                ? repliedTo.content
                : repliedTo.audio
                ? "audio"
                : "image"}
            </Text>
          </View>
        )}

        {/* image content */}
        {message.image && !isDeleted && (
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
        {message.image && isDeleted && <Text>image deleted... </Text>}

        <View style={styles.messageContainer}>
          {/* text content */}
          {!!decryptedMessage && (
            <Text
              style={[
                isCurrentUserMessage
                  ? styles.currentUserMessageColor
                  : styles.senderMessageColor,
                isCurrentUserMessage &&
                  !!message?.status && { maxWidth: "92%" },
              ]}
            >
              {isDeleted ? "message deleted..." : decryptedMessage}
            </Text>
          )}

          {/* message status */}
          {isCurrentUserMessage && !!message?.status && (
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
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      onLongPress={openActionMenu}
      style={[
        styles.audioBubble,
        isCurrentUserMessage
          ? styles.currentUserAudioBubbleColor
          : styles.senderAudioBubbleColor,
      ]}
    >
      {/* audio content */}
      {audioUri && !isDeleted && (
        <AudioPlayer audioUri={audioUri} previewer={false} />
      )}
      {isDeleted && <Text>audio recording deleted... </Text>}

      {/* message status */}
      {isCurrentUserMessage && !!message?.status && (
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
    </TouchableOpacity>
  );
}
