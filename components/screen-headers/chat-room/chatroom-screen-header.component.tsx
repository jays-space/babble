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
import { ChatRoomUser, User } from "../../../src/models";

// STYLES
import { styles } from "./chatroom-screen-header.styles";
import { formatDistance } from "date-fns";

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

  useEffect(() => {
    const interval = setInterval(() => {
      checkOnlineStatus();
    }, 5 * 60 * 1000); //5min

    return () => clearInterval(interval);
  }, [user]);

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
  // console.log(checkOnlineStatus());

  return (
    <View style={[styles.root, { width: width - 45 }]}>
      {/* Avatar */}
      <Image
        source={{
          uri: user?.imageUri,
        }}
        style={styles.avatar}
      />

      {/* Title - name and online status */}
      <View style={styles.titleContainer}>
        {/* Title - contact name */}
        <Text style={styles.title}>{user?.name}</Text>

        {/* Title - online status */}
        <Text style={styles.subTitile}>{checkOnlineStatus()}</Text>
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
