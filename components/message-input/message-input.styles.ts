import { StyleSheet } from "react-native";

//THEME
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    marginBottom: 10,
    padding: 10,
    flexDirection: "column",
  },
  previewContainer: {
    marginBottom: 20,
    padding: 10,
    flexDirection: "row",
    alignSelf: "stretch",
    // alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.primary.main,
    borderRadius: 10,
  },
  inputContainerWrapper: {
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
  progressBarContainer: {
    marginLeft: 5,
    flex: 1,
    justifyContent: "flex-start",
    alignSelf: "flex-end",
  },
  progressBar: {
    height: 5,
    backgroundColor: theme.primary.main,
    borderRadius: 5,
  },
  audioPlayerProgressBar: {
    height: 3,
    marginHorizontal: 10,
    flex: 1,
    alignSelf: "center",
    backgroundColor: theme.grey.lightgrey,
    borderRadius: 3,
  },
  audioPlayerProgressBarMarker: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.primary.main,
    position: "absolute",
    top: -2.5,
  },
  emoteSmileBtn: {
    marginHorizontal: 5,
    color: theme.grey.default,
  },
  recordBtn: {
    color: theme.grey.default,
  },
  recordBtnActive: {
    color: "red",
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
