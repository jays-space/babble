import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { Amplify, Auth, DataStore, Hub } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";

import awsconfig from "./src/aws-exports.js";
Amplify.configure(awsconfig);

//MODELS
import { Message, MessageStatus, User as UserModel } from "./src/models";
import { formatDistance } from "date-fns";

function App() {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);

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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const subscription = DataStore.observe(UserModel, currentUser.id).subscribe(
      (msg) => {
        if (msg.model === UserModel && msg.opType === "UPDATE") {
          setCurrentUser(msg.element);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [currentUser?.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await updateLastOnline();
    }, 2 * 60 * 1000); //2min

    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    const {
      attributes: { sub: currentUserID },
    } = await Auth.currentAuthenticatedUser();

    const user = await DataStore.query(UserModel, currentUserID);

    if (user) {
      setCurrentUser(user);
    }
  };

  const updateLastOnline = async () => {
    if (!currentUser) {
      return;
    }

    await DataStore.save(
      UserModel.copyOf(currentUser, (updated) => {
        updated.lastOnlineAt = +new Date();
      })
    );
  };

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
