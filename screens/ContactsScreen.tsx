import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { User, ChatRoom, ChatRoomUser } from "../src/models";

//COMPONENTS
import ContactsItem from "../components/contacts-item";
import AddNewGroup from "../components/new-group";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/Colors";

export default function ContactsScreen() {
  const navigation = useNavigation();
  const [currentUserDB, setCurrentUserDB] = useState<User | undefined>(
    undefined
  );
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<User[]>([]);
  const [toggleCreateGroup, setToggleCreateGroup] = useState<boolean>(false);

  useEffect(() => {
    //* query users
    // const allUsers = await DataStore.query(User).then(setContacts);
    const fetchContacts = async () => {
      const {
        attributes: { sub },
      } = await Auth.currentAuthenticatedUser();

      // console.log("sub: ", sub);
      // console.log("user: ",  await DataStore.query(User, sub));
      await DataStore.query(User, sub).then(setCurrentUserDB);

      //* filter out currentUser
      const allUsers = (await DataStore.query(User))
        .filter(({ id }) => id !== sub)
        .map((user) => user);

      setContacts(allUsers);
    };

    fetchContacts();
  }, []);

  const handleCreateOrNavigateToNewChatRoom = async (selectedContacts) => {
    if (!currentUserDB) {
      alert("No currentUserDB");
      return;
    }

    const newChatRoomData = {
      newMessages: 18,
      Admin: currentUserDB,
    };

    if (selectedContacts.length > 1) {
      (newChatRoomData.groupName = "New Group"),
        (newChatRoomData.imageUri =
          "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/group.jpeg");
    }

    //* create a chatroom with contact
    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

    //* link currentUser with the newChatRoom created
    await addUsertoChatRoom(currentUserDB, newChatRoom);

    //* link selected contact with the newChatRoom created
    await Promise.all(
      selectedContacts.map((user) => addUsertoChatRoom(user, newChatRoom))
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  const addUsertoChatRoom = async (user, chatRoom) => {
    await DataStore.save(
      new ChatRoomUser({
        user,
        chatRoom,
      })
    );
  };

  const isContactSelected = (contact) => {
    return selectedContacts.some(
      (selectedContact) => selectedContact.id === contact.id
    );
  };

  const addChatRoom = async (contact) => {
    if (toggleCreateGroup) {
      if (isContactSelected(contact)) {
        //* check if contact is selected
        setSelectedContacts(
          selectedContacts.filter(
            (selectedContact) => selectedContact.id !== contact.id
          )
        ); //* remove selected contact
      } else {
        setSelectedContacts([...selectedContacts, contact]); //* add selected contact
      }
    } else {
      await handleCreateOrNavigateToNewChatRoom([contact]); //* add new one-to-one chatroom
    }
  };

  const createNewChatGroup = async () => {
    await handleCreateOrNavigateToNewChatRoom(selectedContacts); //* add new many-to-many chatroom
    setSelectedContacts([]);
  };

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={contacts}
        renderItem={({ item: contact }) => (
          <ContactsItem
            contact={contact}
            isSelected={
              toggleCreateGroup ? isContactSelected(contact) : undefined
            }
            addOneToOneChatRoom={() => addChatRoom(contact)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <AddNewGroup
            toggle={() => {
              setToggleCreateGroup(!toggleCreateGroup);

              if (!toggleCreateGroup) {
                setSelectedContacts([]);
              }
            }}
          />
        )}
      />

      {toggleCreateGroup && selectedContacts.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={createNewChatGroup}>
          <Text style={styles.buttonText}>
            Save Group{" "}
            {selectedContacts.length > 0 && `(${selectedContacts.length})`}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: theme.primary.main,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: theme.white.default,
    fontWeight: "bold",
  },
});
