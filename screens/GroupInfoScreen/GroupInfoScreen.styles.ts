import { StyleSheet } from "react-native";
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    padding: 10,
    flex: 1,
    backgroundColor: theme.white.default,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10
  },
});
