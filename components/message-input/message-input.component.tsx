import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { Message } from "../../src/models";

//STYLES
import { styles } from "./message-input.styles";

export default function MessageInput({ chatRoomID }) {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    const {
      attributes: { sub: currentUserID },
    } = await Auth.currentAuthenticatedUser();

    //* Send message
    await DataStore.save(
      new Message({
        content: newMessage,
        userID: currentUserID,
        chatroomID: chatRoomID,
      })
    );

    setNewMessage("");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={styles.root}
    >
      <View style={styles.inputContainer}>
        {/* emoji btn*/}
        <SimpleLineIcons
          name="emotsmile"
          size={24}
          color={styles.emoteSmileBtn.color}
          style={styles.emoteSmileBtn}
        />

        {/* input*/}
        <TextInput
          style={styles.input}
          placeholder="Send Message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />

        {/* other btn container*/}
        <Feather
          name="camera"
          size={24}
          color={styles.emoteSmileBtn.color}
          style={styles.emoteSmileBtn}
        />
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
          <Ionicons name="send" size={18} color={styles.primaryBtnIcon.color} />
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
