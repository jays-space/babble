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
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
