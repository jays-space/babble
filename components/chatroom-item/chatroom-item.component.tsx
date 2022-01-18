import { Image, View, Text, StyleSheet } from "react-native";
import Users from "../../assets/dummy-data/Users";

//STYLES
import { styles } from "./chatroom-item.styles";

export default function ChatRoomItem({ chatRoom }) {
  const user = chatRoom.users[1];
  return (
    <View style={styles.container}>
      {/* avatar */}
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.avatar}
      />
      {/* message notification counter: if new messages, render */}
      {chatRoom.newMessages && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{chatRoom.newMessages}</Text>
        </View>
      )}

      {/* content container */}
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>
          {chatRoom.lastMessage.content}
        </Text>
      </View>
    </View>
  );
}
