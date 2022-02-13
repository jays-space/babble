import { StyleSheet } from "react-native";

//CONSTANTS
import { theme } from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 45,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: theme.primary.main,
  },
  notificationText: {
    fontSize: 12,
    color: "white",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    marginBottom: 2,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  status: {
    flex: 1,
    marginBottom: 2,
    fontSize: 14,
    textTransform: "capitalize",
    fontStyle: "italic",
    color: theme.text.lightTheme.default
  },
  text: {
    color: "grey",
  },
  icons: {
    color: theme.grey.default,
  },
});
