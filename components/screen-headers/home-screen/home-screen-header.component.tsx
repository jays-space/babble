import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";

// STYLES
import { styles } from "./home-screen-header.styles";

export default function HomeScreenHeader() {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.root, { width }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
        }}
        style={styles.avatar}
      />

      {/* Title */}
      <Text style={styles.title}>Home</Text>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <Feather
          name="camera"
          size={24}
          color={styles.icons.color}
          style={styles.icon}
        />
        <Feather
          name="edit-2"
          size={24}
          color={styles.icons.color}
          style={styles.icon}
        />
      </View>
    </View>
  );
}
