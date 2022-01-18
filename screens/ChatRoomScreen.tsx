import { FlatList, StyleSheet, Text, View } from "react-native";

// COMPONENTS
import Message from "../components/message/";

//DUMMY DATA
import chatData from "../assets/dummy-data/Chats";

export default function ChatRoomScreen() {
  const chatHistory = chatData.messages;
  return (
    <View style={styles.page}>
      <FlatList
        inverted={true}
        data={chatHistory}
        renderItem={({ item: { content, user } }) => (
          <Message message={content} user={user} />
        )}
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
