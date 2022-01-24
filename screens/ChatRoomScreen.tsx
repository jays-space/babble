import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";

// AWS
import { DataStore } from "aws-amplify";

// MODELS
import { ChatRoom, Message as MessageModel } from "../src/models";

// COMPONENTS
import Message from "../components/message/";
import MessageInput from "../components/message-input";

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);

  const fetchChatRoom = async () => {
    if (!route.params?.id) {
      console.warn("No chatroom id provided");
      return;
    }

    const chatRoom = await DataStore.query(ChatRoom, route.params.id);
    if (!chatRoom) {
      console.error("Couldn't find a chat room with this id");
    } else {
      setChatRoom(chatRoom);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoom) {
      return;
    }

    const fetchedMessages = await DataStore.query(MessageModel, (message) =>
      message.chatroomID("eq", chatRoom?.id)
    );

    setMessages(fetchedMessages);
  };

  // console.log("route.params: ", route.params);
  // console.log("messages: ", messages);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  navigation.setOptions({ title: route?.params?.contact?.name }); //* manually change header title

  return (
    <SafeAreaView style={styles.page}>
      {/* chat message list */}
      <FlatList
        inverted
        data={messages}
        renderItem={({ item: { content } }) => <Message message={content} />}
      />

      {/* new message input */}
      <MessageInput chatRoomID={chatRoom?.id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
});
