import { FlatList, SafeAreaView, StyleSheet } from "react-native";

// COMPONENTS
import Message from "../components/message/";

//DUMMY DATA
import chatData from "../assets/dummy-data/Chats";
import MessageInput from "../components/message-input";

export default function ChatRoomScreen() {
  const chatHistory = chatData.messages;
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
