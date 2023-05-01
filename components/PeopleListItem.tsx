import { StyleSheet, Text, View, Image } from "react-native";
import { theme } from "../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";import TouchableButton from "./Touchable";

const PeopleListItem = ({ onPress, name, uid, image }: any) => {
  return (
    <TouchableButton onPress={onPress} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={{ uri: image ? image : "https://picsum.photos/200/300" }}
          style={styles.img}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      {/* <View style={styles.icon}>
        <Image source={require("../assets/wave.png")} />
      </View> */}
    </TouchableButton>
  );
};

export default PeopleListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.s,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.xxl,
  },
  info: {
    marginLeft: theme.spacing.s,
  },
  name: {
    fontSize: 20,
  },
  detail: {
    color: theme.colors.info,
  },
  icon: {
    backgroundColor: "#e9e9e9",
    padding: 10,
    borderRadius: 50,
  },
});
