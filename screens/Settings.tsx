import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Auth, DataStore } from "aws-amplify";

//UTILS
import { generateKeyPair } from "../utils/crypto";

//CONSTANTS
import { theme } from "../constants/Colors";

const Settings = () => {
  const handleSignOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  const handleKeyPairUpdate = async () => {
    const { publicKey, secretKey } = generateKeyPair();
    console.log("publicKey: ", publicKey);
    console.log("secretKey: ", secretKey);
    
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
