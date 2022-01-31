import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";

// AWS
import { DataStore, SortDirection } from "aws-amplify";

// MODELS
import { ChatRoom, Message as MessageModel } from "../src/models";

// COMPONENTS
import Message from "../components/message/";
import MessageInput from "../components/message-input";

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(
    null
  );
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);

  //* real time sync
  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe(
      (message) => {
        //? console.log(message.model, message.opType, message.element);
        // [Function Message] INSERT Message {
        //   "_deleted": undefined,
        //   "_lastChangedAt": undefined,
        //   "_version": undefined,
        //   "chatroomID": "e1a82a6f-efa9-41db-bc44-3002c2c0e62c",
        //   "content": "I’m great thanks. How are you feeling?",
        //   "id": "1f28643d-a6a8-41a7-bc5d-295b024bf169",
        //   "userID": "199b13a3-a7fa-40ba-af19-1e503a1282ed",
        // }

        //* append new message to messages
        if (message.model === MessageModel && message.opType === "INSERT") {
          setMessages((currentMessages) => [
            message.element,
            ...currentMessages,
          ]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

    const fetchedMessages = await DataStore.query(
      MessageModel,
      (message) => message.chatroomID("eq", chatRoom?.id),
      {
        sort: (message) => message.createdAt(SortDirection.DESCENDING),
      }
    );

    setMessages(fetchedMessages);
  };

  // console.log("route.params: ", route.params);
  // console.log("chatRoom: ", chatRoom);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.page}>
      {/* chat message list */}
      <FlatList
        inverted
        data={messages}
        renderItem={({ item }) => (
          <Message
            message={item}
            setAsMessageReply={() => setMessageReplyTo(item)}
          />
        )}
      />

      {/* new message input */}
      <MessageInput chatRoom={chatRoom} messageReplyTo={messageReplyTo} removeMessageReplyTo={() => setMessageReplyTo(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
});
