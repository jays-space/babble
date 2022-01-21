import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

// STYLES
import { styles } from "./home-screen-header.styles";

export default function HomeScreenHeader() {
  const { width } = useWindowDimensions();
  const navigate = useNavigation()

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
      <Text style={styles.title}>Babble</Text>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <Feather
          name="camera"
          size={22}
          color={styles.icons.color}
          style={styles.icon}
        />
        <TouchableOpacity onPress={() => navigate.navigate("Contacts")}>
          <Feather
            name="edit-2"
            size={22}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
