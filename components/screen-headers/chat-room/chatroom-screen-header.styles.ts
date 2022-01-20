import { StyleSheet } from "react-native";
import { theme } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    marginLeft: 10,
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
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: theme.white.default,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icons: {
    color: theme.white.default,
  },
  icon: {
    marginHorizontal: 10,
  },
});
