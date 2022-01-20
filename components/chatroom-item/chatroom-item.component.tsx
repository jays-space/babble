import { useNavigation } from "@react-navigation/native";
import { Image, View, Text, TouchableOpacity } from "react-native";

//STYLES
import { styles } from "./chatroom-item.styles";

// TODO: type declarations
export default function ChatRoomItem({ chatRoom }) {
  const user = chatRoom.users[1];
  const navigation = useNavigation();

  const handleNavigateToChatRoom = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToChatRoom}
      style={styles.container}
    >
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
    </TouchableOpacity>
  );
}
