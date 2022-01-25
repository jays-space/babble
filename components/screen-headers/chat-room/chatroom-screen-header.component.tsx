import React, { useEffect, useState } from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { ChatRoomUser, User } from "../../../src/models";

// STYLES
import { styles } from "./chatroom-screen-header.styles";

export default function ChatRoomScreenHeader({ chatRoomID, children }) {
  const [user, setUser] = useState<User | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (chatRoomID === null) {
      return;
    }

    const fetchAllUsers = async () => {
      const allUsers = (await DataStore.query(ChatRoomUser))
        .filter(({ chatRoom: { id } }) => id === chatRoomID)
        .map(({ user }) => user);

      // setUsers(allUsers);

      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      //* return user where user.id is not currentUserID
      setUser(allUsers.find((user) => user.id !== currentUserID) || null);
    };

    fetchAllUsers();
  }, []);

  return (
    <View style={[styles.root, { width: width - 45 }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: user?.imageUri,
        }}
        style={styles.avatar}
      />

      {/* Title - contact name */}
      <Text style={styles.title}>{user?.name}</Text>

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
