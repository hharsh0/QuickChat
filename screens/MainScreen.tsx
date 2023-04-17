import { StyleSheet, Text, View, FlatList } from 'react-native'
import ListItem from '../components/ListItem'
import Header from '../components/Header'
import {data} from "../data"
import { useNavigation } from "@react-navigation/native";


const MainScreen = () => {
  const navigation:any = useNavigation();

  const handlePress = (name:string)=>{
    navigation.navigate("Chat", {name});
    console.log(name)
  }
  return (
    <View style={styles.container}>
      <Header title="Chats" />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem
              onPress={()=>handlePress(item.name)}
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
  }
})