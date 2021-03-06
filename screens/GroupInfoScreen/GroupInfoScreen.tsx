import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { ChatRoom, ChatRoomUser, User } from "../../src/models";

//STYLES
import { styles } from "./GroupInfoScreen.styles";
import ContactsItem from "../../components/contacts-item";

const GroupInfoScreen = () => {
  const route = useRoute();
  const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const fetchChatRoom = async () => {
    await DataStore.query(ChatRoom, route?.params?.chatRoomID).then(
      setChatRoom
    );
  };

  const fetchAllUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter(({ chatRoom: { id } }) => id === route?.params?.chatRoomID)
      .map(({ user }) => user);

    setAllUsers(fetchedUsers);
  };

  useEffect(() => {
    if (!route?.params?.chatRoomID) {
      console.warn("No chatroom ID provided");

      return;
    }

    fetchChatRoom();
    fetchAllUsers();
  }, []);

  const checkIsAdmin = (id) => {
    return chatRoom?.Admin?.id === id;
  };

  const confirmDelete = async (contact) => {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();

    if (sub !== chatRoom?.Admin?.id) {
      Alert.alert(
        "Remove Contact",
        `Only an admin can remove contacts from a group`
      );
      return;
    }

    if (contact.id !== chatRoom?.Admin?.id) {
      Alert.alert(
        "Remove Contact",
        `Are you sure you want to remove ${contact.name} from the group?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => removeContactFromGroup(contact),
            style: "destructive",
          },
        ]
      );
    } else {
      Alert.alert("Remove Contact", `Cannot remove the admin from a group`);
      return;
    }
  };

  const removeContactFromGroup = async (contact) => {
    const chatRoomUserToDelete = (await DataStore.query(ChatRoomUser)).filter(
      (chatroomUser) =>
        chatroomUser.chatRoom.id === chatRoom?.id &&
        chatroomUser.user.id === contact.id
    );

    if (chatRoomUserToDelete.length > 0) {
      // console.warn(`Removing:`, chatRoomUserToDelete);
      DataStore.delete(chatRoomUserToDelete[0]);

      //? update allUsers to exclude deleted user
      setAllUsers(allUsers.filter((user) => user.id !== contact.id));
    }
  };

  return (
    <View style={styles.root}>
      {chatRoom?.groupName && (
        <Text style={styles.title}>{chatRoom?.groupName}</Text>
      )}

      <Text style={styles.title}>Contacts</Text>

      {allUsers.length > 0 ? (
        <FlatList
          data={allUsers}
          renderItem={({ item }) => (
            <ContactsItem
              contact={item}
              isAdmin={checkIsAdmin(item.id)}
              onLongPress={() => confirmDelete(item)}
            />
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

export default GroupInfoScreen;
