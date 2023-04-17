import { StyleSheet, Text, View, FlatList, Platform } from 'react-native'
import ListItem from '../components/ListItem'
import Header from '../components/Header'
import {data} from "../data"
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";



const MainScreen = () => {
  const navigation:any = useNavigation();

  const handlePress = (name:string)=>{
    navigation.navigate("Chat", {name});
    console.log(name)
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Header title="Chats" />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => handlePress(item.name)}
            name={item.name}
            detail={item.detail}
          />
        )}
      />
    </View>
  );
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 40 : 0,
    backgroundColor: "#fff",
  },
});