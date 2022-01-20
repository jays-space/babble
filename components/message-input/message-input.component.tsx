import React from "react";
import { View, Text, TextInput } from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

//STYLES
import { styles } from "./message-input.styles";

export default function MessageInput() {
  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        {/* emoji btn*/}
        <SimpleLineIcons
          name="emotsmile"
          size={24}
          color={styles.emoteSmileBtn.color}
          style={styles.emoteSmileBtn}
        />

        {/* input*/}
        <TextInput style={styles.input} placeholder="Send Message..." />

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

      <View style={styles.primaryBtnContainer}>
        <AntDesign
          name="plus"
          size={24}
          color={styles.primaryBtnIcon.color}
        />
      </View>
    </View>
  );
}
