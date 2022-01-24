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
import { ChatRoom, ChatRoomUser } from "../src/models";

//COMPONENTS
import ChatRoomItem from "../components/chatroom-item";

export default function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const {
        attributes: { sub: currentUserID },
      } = await Auth.currentAuthenticatedUser();

      /*
       * get all chatRoomUser data, filter out all records where currentUser
       * is the chatRoomUser, then return an array of those chatRooms
       */
      const currentUserChatRooms = (await DataStore.query(ChatRoomUser))
        .filter(({ user: { id } }) => id === currentUserID)
        .map(({ chatRoom }) => chatRoom);

      setChatRooms(currentUserChatRooms);
    };

    fetchChatRooms();
  }, []);

  const handleSignOut = () => {
    Auth.signOut();
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item: chatRoom }) => (
          <ChatRoomItem chatRoom={chatRoom} />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: "orangered",
          width: "100%",
          height: 50,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>SignOut</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
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
