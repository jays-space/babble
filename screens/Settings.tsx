import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Auth, DataStore } from "aws-amplify";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

//MODELS
import { User as UserModel } from "../src/models";

//UTILS
import { generateKeyPair } from "../utils/crypto";

//CONSTANTS
import { theme } from "../constants/Colors";
import { PRIVATE_KEY } from "../constants/Crypto";

const Settings = () => {
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    undefined
  );

  useEffect(() => {
    // get currenUser
    const getUser = async () => {
      const {
        attributes: { sub },
      } = await Auth.currentAuthenticatedUser();

      const response = await DataStore.query(UserModel, sub);
      setCurrentUser(response);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  const handleKeyPairUpdate = async () => {
    // check if there is a current generated key pair
    if (!currentUser) {
      Alert.alert("User not found");
      return;
    }

    const prKey = await AsyncStorageLib.getItem(PRIVATE_KEY);

    if (currentUser.publicKey && prKey) {
      Alert.alert(
        "Replace Current Key Pairs",
        "You are about to replace your current encryption keys. If you do, you may not be able to see your previous messages. Are you sure you want to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => createNewKeyPairs(),
            style: "destructive",
          },
        ]
      );
    } else {
      createNewKeyPairs();
    }
  };

  const createNewKeyPairs = async () => {
    if (!currentUser) {
      Alert.alert("User not found");
      return;
    }

    // generate private and secret keys
    const { publicKey, secretKey } = generateKeyPair();

    // save private key to Async storage (local device)
    await AsyncStorageLib.setItem(PRIVATE_KEY, secretKey.toString());

    // save public key to UserModel in DataStore
    await DataStore.save(
      UserModel.copyOf(currentUser, (updated) => {
        updated.publicKey = publicKey.toString();
      })
    );

    Alert.alert("Updated key pair");
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={handleKeyPairUpdate} style={styles.btn}>
        <Text style={styles.btnTitle}>Update Key Pair</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} style={styles.btn}>
        <Text style={styles.btnTitle}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  btn: {
    marginVertical: 8,
    width: "100%",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.primary.main,
    backgroundColor: "white",
  },
  btnTitle: {
    color: theme.primary.main,
  },
});
