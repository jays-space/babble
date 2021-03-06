import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  Text,
  Alert,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { box } from "tweetnacl";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

//AWS
import { Auth, DataStore, Storage } from "aws-amplify";

//MODELS
import {
  Message as MessageModel,
  ChatRoom,
  MessageStatus,
  ChatRoomUser as ChatRoomUserModel,
  User as UserModel,
} from "../../src/models";

//COMPONENTS
import AudioPlayer from "../audio-player";
import MessageComponent from "../message/message.component";

//UTILS
import {
  encrypt,
  getCurrentUserSecretKey,
  stringToUint8Array,
} from "../../utils/crypto";

//STYLES
import { styles } from "./message-input.styles";

export default function MessageInput({
  chatRoom,
  messageReplyTo,
  removeMessageReplyTo,
}) {
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string | "">("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] =
    useState<boolean>(false);

  const navigation = useNavigation();

  //* get currentUser
  useEffect(() => {
    const getCurrentUserID = async () => {
      const {
        attributes: { sub },
      } = await Auth.currentAuthenticatedUser();

      setCurrentUserID(sub);
    };

    getCurrentUserID();
  }, []);

  //* get phone permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        setDevice(Device?.modelId);
        // const libraryResponse =
        //   await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraResponse =
          await ImagePicker.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();

        if (
          // libraryResponse.status !== "granted" ||
          cameraResponse.status !== "granted"
        ) {
          alert("Sorry, we need camera roll permissions to make this work");
        }
      }
    })();
  }, []);

  //* Get blob
  const getBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return blob;
  };

  //* launch image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      presentationStyle: device === "iPhone7,2" ? 0 : 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImage(result.uri);
    }
  };

  //* launch camera
  const takePhoto = async () => {
    // TODO: video support?
    let result = await ImagePicker.launchCameraAsync({
      presentationStyle: device === "iPhone7,2" ? 0 : 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImage(result.uri);
    }
  };

  //* start recoding
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  //* stop recording
  const stopRecording = async () => {
    console.log("Stopping recording..");
    if (!recording) {
      return;
    }

    setRecording(null);
    await recording.stopAndUnloadAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    if (!uri) {
      return;
    }
    setRecordedAudioUri(uri);
  };

  const updateLastMessage = async (messageRefToUpdateWith) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = messageRefToUpdateWith;
      })
    );
  };

  //* Send message functionality

  const encryptAndSendOneToOneMessage = async (user: UserModel) => {
    if (!currentUserID) {
      return;
    }

    const currentUserPrivateKey = await getCurrentUserSecretKey();

    //! will run this alert as many times as there are users
    if (!currentUserPrivateKey) {
      Alert.alert(
        "Security Error",
        "Cannot send message. Please set new encryption keys in the Settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "To Settings",
            onPress: () => navigation.navigate("SettingsScreen"),
            style: "default",
          },
        ]
      );

      return;
    }

    //! will run this alert as many times as there are users
    if (!user.publicKey) {
      Alert.alert(
        "Security Error",
        "Cannot send message. The receipient has not set up their encryption keys yet. Until the reciepient generates new encryption keys, you cannot securly send/recieve messages."
      );

      return;
    }

    // encrypt message
    const sharedKey = box.before(
      stringToUint8Array(user?.publicKey),
      currentUserPrivateKey
    );

    const encryptedMessage = encrypt(sharedKey, { newMessage });

    const newMessageRef = await DataStore.save(
      new MessageModel({
        content: encryptedMessage, //! <- this message is encrypted
        userID: currentUserID,
        forUserID: user.id,
        chatroomID: chatRoom.id,
        replyToMessageID: messageReplyTo?.id,
        status: MessageStatus.SENT,
      })
    );

    updateLastMessage(newMessageRef);
  };

  const sendMessage = async () => {
    // get all users of the current chatroom
    const users = (await DataStore.query(ChatRoomUserModel))
      .filter((chatroomUser) => chatroomUser.chatRoom.id === chatRoom.id)
      .map((chatroomUser) => chatroomUser.user);

    // for each user, encrypt the 'content' with their public key, and save this as a new message
    if (!users) {
      return;
    }

    await Promise.all(users.map((user) => encryptAndSendOneToOneMessage(user)));
    clearFieldsState();
  };

  //* Send new image
  const sendNewImage = async () => {
    if (!currentUserID || !newImage) {
      return;
    }

    const blob = await getBlob(newImage);

    const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
      progressCallback(progress) {
        setProgress(progress.loaded / progress.total);
      },
    });

    // console.log("key: ", key);

    const newMessageRef = await DataStore.save(
      new MessageModel({
        content: newMessage,
        image: key,
        userID: currentUserID,
        chatroomID: chatRoom.id,
        replyToMessageID: messageReplyTo?.id,
        status: MessageStatus.SENT,
      })
    );

    clearFieldsState();
    updateLastMessage(newMessageRef);

    // permanently delete
  };

  //* Send new audio
  const sendNewAudio = async () => {
    if (!currentUserID || !recordedAudioUri) {
      return;
    }

    const uriParts = recordedAudioUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const blob = await getBlob(recordedAudioUri);

    const { key } = await Storage.put(`${uuidv4()}.${fileType}`, blob, {
      progressCallback(progress) {
        setProgress(progress.loaded / progress.total);
      },
    });

    const newMessageRef = await DataStore.save(
      new MessageModel({
        content: newMessage,
        audio: key,
        userID: currentUserID,
        chatroomID: chatRoom.id,
        replyToMessageID: messageReplyTo?.id,
        status: MessageStatus.SENT,
      })
    );

    updateLastMessage(newMessageRef);
    clearFieldsState();
  };

  const toggleEmojiPickerVisibility = () => {
    Keyboard.dismiss();
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const clearFieldsState = () => {
    setIsEmojiPickerVisible(false);
    setNewMessage("");
    setNewImage(null);
    setProgress(0);
    removeMessageReplyTo();
    setRecordedAudioUri(null);
    setRecording(null);
  };

  const onPlusPress = () => {
    console.warn("onPlus pressed");
  };

  //   TODO: type definitions
  const handlePrimaryButtonPress = () => {
    //* if there is a new image in state, envoke image send function
    //* if there is a new message in state, envoke message send function

    if (newImage) {
      console.log("send image");
      sendNewImage();
    } else if (recordedAudioUri) {
      console.log("send audio");
      sendNewAudio();
    } else if (newMessage) {
      console.log("send text");
      sendMessage();
    } else {
      onPlusPress();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={[styles.root, { height: isEmojiPickerVisible ? "50%" : "auto" }]}
    >
      {/* //* message replies */}

      {messageReplyTo && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "stretch",
            padding: 10,
            backgroundColor: "#f2f2f2",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Reply to:</Text>
            <MessageComponent message={messageReplyTo} />
          </View>

          {/* cancel button */}
          <TouchableOpacity onPress={removeMessageReplyTo}>
            <AntDesign
              name="close"
              size={24}
              color={styles.emoteSmileBtn.color}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* //* picked image preview */}
      {newImage && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: newImage }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          {/* progress bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>

          {/* cancel button */}
          <TouchableOpacity onPress={() => setNewImage(null)}>
            <AntDesign
              name="close"
              size={24}
              color={styles.emoteSmileBtn.color}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* //* recorded audio preview */}
      {recordedAudioUri && (
        <View style={{ flexDirection: "column" }}>
          <AudioPlayer audioUri={recordedAudioUri} previewer />

          {/* progress bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { flex: 1, width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.inputContainerWrapper}>
        <View style={styles.inputContainer}>
          {/* emoji btn*/}
          <TouchableOpacity onPress={toggleEmojiPickerVisibility}>
            <SimpleLineIcons
              name="emotsmile"
              size={24}
              color={styles.emoteSmileBtn.color}
              style={styles.emoteSmileBtn}
            />
          </TouchableOpacity>

          {/* input*/}
          <TextInput
            style={styles.input}
            placeholder="Send Message..."
            value={newMessage}
            onChangeText={setNewMessage}
            onFocus={() => setIsEmojiPickerVisible(false)}
          />

          {/* other btn container*/}
          <TouchableOpacity onPress={pickImage}>
            <Feather
              name="image"
              size={24}
              color={styles.emoteSmileBtn.color}
              style={styles.emoteSmileBtn}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto}>
            <Feather
              name="camera"
              size={24}
              color={styles.emoteSmileBtn.color}
              style={styles.emoteSmileBtn}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <MaterialCommunityIcons
              name={recording ? "microphone" : "microphone-outline"}
              size={24}
              color={
                recording
                  ? styles.recordBtnActive.color
                  : styles.recordBtn.color
              }
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryBtnContainer}
          onPress={handlePrimaryButtonPress}
        >
          {/* if state.newMessage is set, show the send icon, else the plus icon */}
          {newMessage || newImage || recordedAudioUri ? (
            <Ionicons
              name="send"
              size={18}
              color={styles.primaryBtnIcon.color}
            />
          ) : (
            <AntDesign
              name="plus"
              size={24}
              color={styles.primaryBtnIcon.color}
            />
          )}
        </TouchableOpacity>
      </View>

      {isEmojiPickerVisible && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setNewMessage((currentMessage) => currentMessage + emoji)
          }
          columns={8}
        />
      )}
    </KeyboardAvoidingView>
  );
}
