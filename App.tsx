import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { Amplify, DataStore, Hub } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";

import awsconfig from "./src/aws-exports.js";
import { useEffect } from "react";
import { Message, MessageStatus } from "./src/models";
Amplify.configure(awsconfig);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Create listener
    console.info("Registering Hub Listerner");
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;

      // console.log("DATASTORE EVENT");
      // console.info("event: ", event);
      // console.info("data: ", data);

      if (event === "networkStatus") {
        console.info(`User has a network connection: ${data.active}`);
      }

      if (
        event === "outboxMutationProcessed" &&
        data.model === Message &&
        ![MessageStatus.DELIVERED, MessageStatus.READ].includes(
          data.element.status
        ) //? if the message status does not include "DELIVERED" and "READ"
      ) {
        //* set message status to delivered
        DataStore.save(
          Message.copyOf(data.element, (updated) => {
            updated.status = MessageStatus.DELIVERED;
          })
        );
      }
    });

    // return () => listener.unsubscribe();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
