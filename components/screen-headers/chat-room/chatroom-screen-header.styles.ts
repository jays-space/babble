import { StyleSheet } from "react-native";
import { theme } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    marginLeft: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // flex: 1
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.white.default,
  },
  subTitile: {
    color: theme.white.default,
    fontSize: 10
  },
  iconsContainer: {
    flexDirection: "row",
    width: '40%'
  },
  icons: {
    flex: 1,
    color: theme.white.default,
  },
  icon: {
    marginHorizontal: 10,
  },
});
