import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

// COMPONENTS
import Message from "../components/message/";

//DUMMY DATA
import chatData from "../assets/dummy-data/Chats";
import MessageInput from "../components/message-input";

export default function ChatRoomScreen() {
  const chatHistory = chatData.messages;
  const route = useRoute();
  const navigation = useNavigation();

  console.log("route.params: ", route.params);

  navigation.setOptions({ title:  route?.params?.contact?.name}); //* manually change header title

  return (
    <SafeAreaView style={styles.page}>
      {/* chat message list */}
      <FlatList
        inverted={true}
        data={chatHistory}
        renderItem={({ item: { content, user } }) => (
          <Message message={content} user={user} />
        )}
      />

      {/* new message input */}
      <MessageInput />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
});
