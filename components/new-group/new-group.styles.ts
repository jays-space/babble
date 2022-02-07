import { StyleSheet } from "react-native";

//THEME
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    paddingTop: 25,
    paddingRight: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: theme.grey.default,
  },
  text: {
    marginLeft: 10,
    fontWeight: "bold",
  },
});
