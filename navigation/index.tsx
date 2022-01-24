/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors, { theme } from "../constants/Colors";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

//SCREENS
import HomeScreen from "../screens/HomeScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";

//COMPONENTS
import HomeScreenHeader from "../components/screen-headers/home-screen/home-screen-header.component";
import ChatRoomScreenHeader from "../components/screen-headers/chat-room/chatroom-screen-header.component";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      // theme={DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      {/* TODO: types */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: (props) => <HomeScreenHeader {...props} />,
          headerStyle: {
            backgroundColor: theme.primary.main,
          },
        }}
      />

      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: "Contacts",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: theme.primary.main,
          },
          headerTintColor: theme.white.default,
        }}
      />

      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerTitle: (props) => <ChatRoomScreenHeader {...props} />,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: theme.primary.main,
          },
          headerTintColor: theme.white.default,
        }}
      />
    </Stack.Navigator>
  );
}
