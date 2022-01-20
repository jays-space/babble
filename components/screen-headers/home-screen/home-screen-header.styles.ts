import { StyleSheet } from "react-native";
import { theme } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    flex: 1,
    marginLeft: 45,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icons: {
    color: theme.grey.default,
  },
  icon: {
    marginHorizontal: 10,
  },
});
