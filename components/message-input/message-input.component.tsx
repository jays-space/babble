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

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { Message, ChatRoom } from "../../src/models";

//STYLES
import { styles } from "./message-input.styles";

export default function MessageInput({ chatRoom }) {
  const [device, setDevice] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] =
    useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

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
    const {
      attributes: { sub: currentUserID },
    } = await Auth.currentAuthenticatedUser();

    //* Send message
    const newMessageRef = await DataStore.save(
      new Message({
        content: newMessage,
        userID: currentUserID,
        chatroomID: chatRoom.id,
      })
    );

    updateLastMessage(newMessageRef);

    setIsEmojiPickerVisible(false);
    setNewMessage("");
  };

  const updateLastMessage = async (messageRefToUpdateWith) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = messageRefToUpdateWith;
      })
    );
  };

  const onPlusPress = () => {
    console.warn("onPlus pressed");
  };

  //   TODO: type definitions
  const handlePrimaryButtonPress = () => {
    //* if there is a new message in state, envoke message send function

    if (newMessage) {
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
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {    
    let result = await ImagePicker.launchCameraAsync({
      presentationStyle: device === "iPhone7,2" ? 0 : 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={[styles.root, { height: isEmojiPickerVisible ? "50%" : "auto" }]}
    >
      {/* picked image to send */}
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          {/* //* cancel button */}
          <TouchableOpacity onPress={() => setImage(null)}>
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
          {!newMessage ? (
            <AntDesign
              name="plus"
              size={24}
              color={styles.primaryBtnIcon.color}
            />
          ) : (
            <Ionicons
              name="send"
              size={18}
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
