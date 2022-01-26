import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

//AWS
import { Auth, DataStore, Storage } from "aws-amplify";

//MODELS
import { Message, ChatRoom } from "../../src/models";

//STYLES
import { styles } from "./message-input.styles";

export default function MessageInput({ chatRoom }) {
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] =
    useState<boolean>(false);
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUserID = async () => {
      const {
        attributes: { sub },
      } = await Auth.currentAuthenticatedUser();

      setCurrentUserID(sub);
    };

    getCurrentUserID();
  }, []);

  //* get phone camera and image lib permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        setDevice(Device?.modelId);
        // const libraryResponse =
        //   await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraResponse =
          await ImagePicker.requestCameraPermissionsAsync();

        if (
          // libraryResponse.status !== "granted" ||
          cameraResponse.status !== "granted"
        ) {
          alert("Sorry, we need camera roll permissions to make this work");
        }
      }
    })();
  }, []);

  const sendMessage = async () => {
    //* Send message
    if (!currentUserID) {
      return;
    }

    const newMessageRef = await DataStore.save(
      new Message({
        content: newMessage,
        userID: currentUserID,
        chatroomID: chatRoom.id,
      })
    );

    updateLastMessage(newMessageRef);
    clearFieldsState();
  };

  //* Get image blob
  const getImageBlob = async () => {
    if (!newImage) {
      return null;
    }

    const response = await fetch(newImage);
    const imageBlob = await response.blob();

    return imageBlob;
  };

  //* Send new image
  const sendNewImage = async () => {
    if (!currentUserID || !newImage) {
      return;
    }

    const blob = await getImageBlob();
    const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
      progressCallback(progress) {
        setProgress(progress.loaded / progress.total);
      },
    });

    const newMessageRef = await DataStore.save(
      new Message({
        content: newMessage,
        image: key,
        userID: currentUserID,
        chatroomID: chatRoom.id,
      })
    );

    clearFieldsState();
    updateLastMessage(newMessageRef);
  };

  const updateLastMessage = async (messageRefToUpdateWith) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = messageRefToUpdateWith;
      })
    );
  };

  const clearFieldsState = () => {
    setIsEmojiPickerVisible(false);
    setNewMessage("");
    setNewImage(null);
    setProgress(0);
  };

  const onPlusPress = () => {
    console.warn("onPlus pressed");
  };

  //   TODO: type definitions
  const handlePrimaryButtonPress = () => {
    //* if there is a new image in state, envoke image send function
    //* if there is a new message in state, envoke message send function

    if (newImage) {
      sendNewImage();
    } else if (newMessage) {
      sendMessage();
    } else {
      onPlusPress();
    }
  };

  const toggleEmojiPickerVisibility = () => {
    Keyboard.dismiss();
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={[styles.root, { height: isEmojiPickerVisible ? "50%" : "auto" }]}
    >
      {/* picked image to send */}
      {newImage && (
        <View style={styles.sendImageContainer}>
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

          {/* //* cancel button */}
          <TouchableOpacity onPress={() => setNewImage(null)}>
            <AntDesign
              name="close"
              size={24}
              color={styles.emoteSmileBtn.color}
            />
          </TouchableOpacity>
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

          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color={styles.emoteSmileBtn.color}
            style={styles.emoteSmileBtn}
          />
        </View>

        <TouchableOpacity
          style={styles.primaryBtnContainer}
          onPress={handlePrimaryButtonPress}
        >
          {/* if state.newMessage is set, show the send icon, else the plus icon */}
          {newMessage || newImage ? (
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
