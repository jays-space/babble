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
    backgroundColor: theme.error.default,
  },
  notificationText: {
    fontSize: 12,
    color: theme.white.default,
  },
  activityContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "95%",
    left: 48,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: theme.white.default,
    borderRadius: 7,
    backgroundColor: theme.primary.main,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    marginBottom: 2,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  text: {
    color: theme.grey.default,
  },
});
