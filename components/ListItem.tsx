import { StyleSheet, Text, View, Image } from "react-native";
import {theme} from '../constants/theme'
import { Entypo } from "@expo/vector-icons";
import TouchableButton from "./Touchable";

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }
  return text;
};


const ListItem = ({onPress, name, detail, image}:any) => {
   const MAX_LENGTH = 25;
   const truncatedName = truncateText(name || "", MAX_LENGTH);
   const truncatedDetail = truncateText(detail || "", MAX_LENGTH);


  return (
    <TouchableButton onPress={onPress} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={{ uri: image ? image : "https://picsum.photos/200/300" }}
          style={styles.img}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{truncatedName}</Text>
          <Text style={styles.detail}>{truncatedDetail}</Text>
        </View>
      </View>
      <Entypo name="circle" size={24} color="#C2C6CC" />
    </TouchableButton>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.s,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
  },
  innerContainer:{
    flexDirection: "row",
    alignItems: "center",
  },
  img:{
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.xxl,
  },
  info: {
    marginLeft: theme.spacing.s,
  },
  name:{
    fontSize: 20,
  },
  detail:{
    color: theme.colors.info
  }
});
