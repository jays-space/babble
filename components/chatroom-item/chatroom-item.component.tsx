import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//AWS
import { Auth, DataStore } from "aws-amplify";

// MODELS
import { User, ChatRoomUser } from "../../src/models";

//STYLES
import { styles } from "./chatroom-item.styles";

// TODO: type declarations
export default function ChatRoomItem({ chatRoom }) {
  //* all users in this chatRoom
  // const [users, setUsers] = useState<User[]>([]);

  //* the displayed user's details
  const [user, setUser] = useState<User | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    /*
     * for each chatRoom, match ids where ChatRoomUsers and chatRooms are the same. Return all users who are part of a chatRoom with currentUser.
     */
    const fetchAllUsers = async () => {
      const allUsers = (await DataStore.query(ChatRoomUser))
        .filter(({ chatRoom: { id } }) => id === chatRoom.id)
        .map(({ user }) => user);

      // setUsers(allUsers);

      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      //* return user where user.id is not currentUserID
      setUser(allUsers.find((user) => user.id !== currentUserID) || null);

      // console.log("allUsers: ", allUsers);
    };

    fetchAllUsers();
  }, []);

  const handleNavigateToChatRoom = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <TouchableOpacity
      onPress={handleNavigateToChatRoom}
      style={styles.container}
    >
      {/* avatar */}
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.avatar}
      />
      {/* message notification counter: if new messages, render */}
      {!!chatRoom.newMessages && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{chatRoom.newMessages}</Text>
        </View>
      )}

      {/* content container */}
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>{chatRoom.lastMessage?.createdAt}</Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>
          {chatRoom.lastMessage?.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
