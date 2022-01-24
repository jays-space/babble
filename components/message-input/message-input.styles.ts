import { StyleSheet } from "react-native";

//THEME
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    padding: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    backgroundColor: theme.grey.ultraLightGrey,
    alignItems: "center",
  },
  emoteSmileBtn: {
    marginHorizontal: 5,
    color: theme.grey.default,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  primaryBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primary.main,
  },
  primaryBtnIcon: {
    color: theme.white.default,
  },
});
