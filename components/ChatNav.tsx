import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, SafeAreaView, Dimensions } from "react-native";
import React, {useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const ChatNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = (route.params as { name: string } | undefined)?.name;
  const groupId = (route.params as { groupId: string } | undefined)?.groupId;
  const image = (route.params as { image: string } | undefined)?.image;

  const { height } = Dimensions.get("window");
  const marginTop = Platform.OS === "android" ? height * 0.06 : 0;


  useEffect(()=>{
  console.log("chatNav.tsx", name, groupId);
  },[])

  const handlePress = ()=>{
    console.log("pressed")
    //navigate to the person's profile
  }

  return (
    <SafeAreaView style={[styles.outerContainer, {marginTop}]}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={32} color="#0584FE" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginLeft: 10,
            }}
          >
            <Image
              source={{ uri: image? image: "https://picsum.photos/200/300" }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 25,
              }}
            />
            <Text style={{ fontSize: 22 }}>{name}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <TouchableOpacity>
            <Ionicons name="call" size={28} color="#0584FE" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="videocam" size={28} color="#0584FE" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    // marginTop: Platform.OS === "android" ? 44 : 0,
  },
  outerContainer:{
    flex: 1,
  }
});
