import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { User } from "../../../src/models";

// STYLES
import { styles } from "./home-screen-header.styles";

export default function HomeScreenHeader() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const { width } = useWindowDimensions();
  const navigate = useNavigation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      DataStore.query(User, currentUserID).then(setCurrentUser);
    };

    fetchCurrentUser();
  }, []);

  return (
    <View style={[styles.root, { width }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: currentUser?.imageUri,
        }}
        style={styles.avatar}
      />

      {/* Title */}
      <Text style={styles.title}>Babble</Text>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        {/* new chat */}
        <TouchableOpacity onPress={() => navigate.navigate("Contacts")}>
          <Feather
            name="edit-2"
            size={22}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* settings */}
        <TouchableOpacity onPress={() => navigate.navigate("SettingsScreen")}>
          <Feather
            name="settings"
            size={22}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
