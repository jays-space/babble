import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

//STYLES
import { styles } from "./new-group.styles";

const AddNewGroup = ({ toggle }) => {
  return (
    <TouchableOpacity onPress={toggle}>
      <View style={styles.root}>
        <FontAwesome name="group" size={24} color={styles.icon.color} />
        <Text style={styles.text}>Create a new group</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddNewGroup;
