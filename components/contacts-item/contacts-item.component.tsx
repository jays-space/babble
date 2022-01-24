import { useNavigation } from "@react-navigation/native";
import { Auth, DataStore } from "aws-amplify";
import { Image, View, Text, TouchableOpacity } from "react-native";
import ChatRooms from "../../assets/dummy-data/ChatRooms";
import { User } from "../../src/models";
import { ChatRoomUser } from "../../src/models";

//MODELS
import { ChatRoom } from "../../src/models";

//STYLES
import { styles } from "./contacts-item.styles";

// TODO: type declarations
export default function ContactsItem({ contact }) {
  const navigation = useNavigation();

  const handleNavigateToChatRoom = async () => {
    /*
     * if there is already a chatroom between currentUser and selected contact,
     * then redirect to existing chatroom, else create new chatroom with selected contact
     * 
     !Bug: in the current solution, we check for common chatrooms between selected user and curretUser. We however, do return chatrooms common chatroom groups where
     ! there are also the currentUser and selected user. In other words, when we implement groups, we will return more than one result, which will cause a problem
     */

    const {
      attributes: { sub: currentUserID },
    } = await Auth.currentAuthenticatedUser(); //* get current userID
    const chatRoomUsers = await DataStore.query(ChatRoomUser); //* get all chatroomUser records

    const currentUserChatrooms = chatRoomUsers.filter(
      ({ user }) => user.id === currentUserID
    ); //* get all chatroomUser records where the currentUser is the user of the chatroomUser

    const selectedUserChatrooms = chatRoomUsers.filter(
      ({ user }) => user.id === contact.id
    ); //* get all chatroomUser records where the selected contact is the user of the chatroomUser

    //* get all chatRoomUser data where both currentUser && selected contact exist
    let commonChatRoomUsers = [];
    for (let x = 0; x < currentUserChatrooms.length; x++) {
      for (let y = 0; y < selectedUserChatrooms.length; y++) {
        if (
          currentUserChatrooms[x].chatRoom.id ===
          selectedUserChatrooms[y].chatRoom.id
        ) {
          commonChatRoomUsers.push(currentUserChatrooms[x]);
        }
      }
    }

    //* compare all chatRooms with commonChatRoomUsers.chatRoom and get the record(s) where the ids are equal
    const chatRooms = await DataStore.query(ChatRoom);
    let commonChatRooms = [];
    for (let x = 0; x < commonChatRoomUsers.length; x++) {
      for (let y = 0; y < chatRooms.length; y++) {
        if (commonChatRoomUsers[x].chatRoom.id === chatRooms[y].id) {
          commonChatRooms.push(chatRooms[x]);
        }
      }
    }

    if (commonChatRooms.length >= 1) {
      const commonChatRoomID = commonChatRooms[0].id;
      navigation.navigate("ChatRoom", {
        id: commonChatRoomID,
        chatRoom: commonChatRooms[0],
        contact,
      });
    } else {
      //* create a chatroom with contact
      const newChatRoom = await DataStore.save(
        new ChatRoom({ newMessages: 0 })
      );

      //* link currentUser with the newChatRoom created
      const currentUserDB = await DataStore.query(User, currentUserID); // get current user data from db

      await DataStore.save(
        new ChatRoomUser({
          user: currentUserDB,
          chatRoom: newChatRoom,
        })
      );

      //* link selected contact with the newChatRoom created
      await DataStore.save(
        new ChatRoomUser({
          user: contact,
          chatRoom: newChatRoom,
        })
      );

      navigation.navigate("ChatRoom", { id: newChatRoom.id });
    }
    return;
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToChatRoom}
      style={styles.container}
    >
      {/* avatar */}
      <Image
        source={{
          uri: contact.imageUri,
        }}
        style={styles.avatar}
      />

      {/* content container */}
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.name}>{contact.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
