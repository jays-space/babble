import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

//AWS
import { Auth, DataStore } from "aws-amplify";

//MODELS
import { User } from "../src/models";

//COMPONENTS
import ContactsItem from "../components/contacts-item";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<User[]>([]);
  useEffect(() => {
    //* query users
    // const allUsers = await DataStore.query(User).then(setContacts);

    const fetchContacts = async () => {
      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      //* filter out currentUser
      const allUsers = (await DataStore.query(User))
        .filter(({ id }) => id !== currentUserID)
        .map((user) => user);

      setContacts(allUsers);
    };

    fetchContacts();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={contacts}
        renderItem={({ item: contact }) => <ContactsItem contact={contact} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
});
