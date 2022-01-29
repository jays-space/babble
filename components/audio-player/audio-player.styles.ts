import { StyleSheet } from "react-native";

//THEME
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  previewContainer: {
    padding: 10,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.primary.main,
    borderRadius: 10,
    backgroundColor: theme.grey.ultraLightGrey,
  },
  recordBtn: {
    color: theme.grey.default,
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
  btns: {
    marginHorizontal: 5,
    color: theme.grey.default,
  },
});
