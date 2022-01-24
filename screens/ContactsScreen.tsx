import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

//AWS
import { DataStore } from "aws-amplify";
import { User } from "../src/models";

//COMPONENTS
import ContactsItem from "../components/contacts-item";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<User[]>([]);
  useEffect(() => {
    //* query users
    DataStore.query(User).then(setContacts);

    // const fetchContacts = async () => {
    //   const users = await DataStore.query(User);
    //   setContacts(users);
    // };
    // fetchContacts();
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
