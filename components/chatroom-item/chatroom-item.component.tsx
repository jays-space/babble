import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import formatDistance from "date-fns/formatDistance";

//AWS
import { Auth, DataStore } from "aws-amplify";

// MODELS
import { User, ChatRoomUser, Message } from "../../src/models";

//STYLES
import { styles } from "./chatroom-item.styles";

// TODO: type declarations
export default function ChatRoomItem({ chatRoom }) {
  //* all users in this chatRoom
  // const [users, setUsers] = useState<User[]>([]);
  const [lastMessage, setLastMessage] = useState<Message | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //* the displayed user's details
  const [user, setUser] = useState<User | null>(null);

  const navigation = useNavigation();

  /*
   * for each chatRoom, match ids where ChatRoomUsers and chatRooms are the same. Return all users who are part of a chatRoom with currentUser.
   */
  useEffect(() => {
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
      setIsLoading(false);

      // console.log("allUsers: ", allUsers);
    };

    fetchAllUsers();
  }, []);
  // console.log("lastMesageID: ", chatRoom.chatRoomLastMessageId);

  /*
   * Fetch the message which matches the lastMessageID from the chatRoom obj (if !null).
   */
  useEffect(() => {
    if (chatRoom?.chatRoomLastMessageId) {
      DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
        setLastMessage
      );
    }
  }, []);

  const handleNavigateToChatRoom = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  const getTime = () => {
    if (lastMessage?.createdAt) {
      const format = Date.parse(lastMessage?.createdAt);
      const final = formatDistance(format, new Date());
      return final + " ago";
    }
  };

  if (isLoading) {
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
          uri: chatRoom.imageUri || user.imageUri,
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
          <Text style={styles.name}>{chatRoom.groupName || user.name}</Text>

          <Text style={styles.text}>{getTime()}</Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>
          {lastMessage?.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
