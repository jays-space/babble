import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//COMPONENTS
import ChatRoomItem from "../components/chatroom-item";

//DUMMY DATA
import chatRoomData from "../assets/dummy-data/ChatRooms";
import { Auth } from "aws-amplify";

export default function HomeScreen() {
  const handleSignOut = () => {
    Auth.signOut();
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRoomData}
        renderItem={({ item: chatRoom }) => (
          <ChatRoomItem chatRoom={chatRoom} />
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
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
      </TouchableOpacity>
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
