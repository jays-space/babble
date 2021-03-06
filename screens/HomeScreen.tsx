import { useEffect, useState } from "react";
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
import {
  ChatRoom,
  ChatRoomUser,
  Message,
  Message as MessageModel,
  User,
} from "../src/models";

//COMPONENTS
import ChatRoomItem from "../components/chatroom-item";
import { theme } from "../constants/Colors";

export default function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      // console.log("currentUserID: ", currentUserID);
      // console.log("user: ", await DataStore.query(User, currentUserID));

      /*
       * get all chatRoomUser data, filter all records where currentUser
       * is in the chatRoomUser, then return an array of those chatRoom IDs
       */
      const currentUserChatRooms = (await DataStore.query(ChatRoomUser))
        .filter(({ user: { id } }) => id === currentUserID)
        .map(({ chatRoom }) => chatRoom);

      setChatRooms(currentUserChatRooms);
    };

    fetchChatRooms();
    // console.log("chatRooms: ", chatRooms);

    return () => setChatRooms([]);
  }, []);

  return (
    <View style={styles.page}>
      {chatRooms.length > 0 ? (
        <FlatList
          data={chatRooms}
          renderItem={({ item: chatRoom }) => (
            <ChatRoomItem chatRoom={chatRoom} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ textAlign: "center" }}>No chats</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.white.default,
  },
});

// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from '../components/Themed';
// import { RootTabScreenProps } from '../types';

// export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="/screens/TabOneScreen.tsx" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
