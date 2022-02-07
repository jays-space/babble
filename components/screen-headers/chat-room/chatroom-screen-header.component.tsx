import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { ChatRoom, ChatRoomUser, User } from "../../../src/models";

// STYLES
import { styles } from "./chatroom-screen-header.styles";
import { formatDistance } from "date-fns";

export default function ChatRoomScreenHeader({ chatRoomID, children }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined);
  const { width } = useWindowDimensions();

  const fetchAllUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter(({ chatRoom: { id } }) => id === chatRoomID)
      .map(({ user }) => user);

    setAllUsers(fetchedUsers);

    const {
      attributes: { sub: currentUserID },
    } = await Auth.currentAuthenticatedUser();

    //* return user where user.id is not currentUserID
    setUser(fetchedUsers.find((user) => user.id !== currentUserID) || null);
  };

  const fetchChatRoom = async () => {
    await DataStore.query(ChatRoom, chatRoomID).then(setChatRoom);
  };

  useEffect(() => {
    if (chatRoomID === null) {
      return;
    }

    fetchAllUsers();
    fetchChatRoom();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkOnlineStatus();
    }, 3 * 60 * 1000); //1min

    return () => clearInterval(interval);
  }, [user]);

  //? returns bool based on whether or not there are more than two users in a chatroom
  const isGroupChat = () => {
    return allUsers.length > 2;
  };

  const checkOnlineStatus = () => {
    if (!user?.lastOnlineAt) {
      return "Last online some time ago";
    }

    if (user?.lastOnlineAt < 5 * 60 * 1000) {
      return "Online";
    } else {
      return `Last online ${formatDistance(user?.lastOnlineAt, new Date(), {
        addSuffix: true,
      })}`;
    }
  };

  const getUserNames = () => {
    return allUsers.map((user) => user.name).join(", ");
  };

  return (
    <View style={[styles.root, { width: width - 45 }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: chatRoom?.imageUri || user?.imageUri,
        }}
        style={styles.avatar}
      />

      {/* Title - name and online status */}
      <View style={styles.titleContainer}>
        {/* Title - contact name */}
        <Text style={styles.title}>{chatRoom?.groupName || user?.name}</Text>

        {/* Title - online status */}
        <Text numberOfLines={1} style={styles.subTitile}>
          {isGroupChat() ? getUserNames() : checkOnlineStatus()}
        </Text>
      </View>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Ionicons
            name="videocam-outline"
            size={24}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="call-outline"
            size={22}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={styles.icons.color}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
