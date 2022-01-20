import React from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// STYLES
import { styles } from "./chatroom-screen-header.styles";

export default function ChatRoomScreenHeader(props) {
  const { width } = useWindowDimensions();

  // console.log("props: ", props);

  return (
    <View style={[styles.root, { width: width - 45 }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
        }}
        style={styles.avatar}
      />

      {/* Title */}
      <Text style={styles.title}>{props.children}</Text>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <Ionicons
          name="videocam-outline"
          size={24}
          color={styles.icons.color}
          style={styles.icon}
        />

        <Ionicons
          name="call-outline"
          size={22}
          color={styles.icons.color}
          style={styles.icon}
        />

        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={styles.icons.color}
          style={styles.icon}
        />
      </View>
    </View>
  );
}
