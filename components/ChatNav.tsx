import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const ChatNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = (route.params as { name: string } | undefined)?.name;

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={32} color="#0584FE" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginLeft: 10,
          }}
        >
          <Image
            source={{ uri: "https://picsum.photos/200/300" }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 25,
            }}
          />
          <Text style={{ fontSize: 22, }}>{name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 20, alignItems: 'center' }}>
        <TouchableOpacity>
          <Ionicons name="call" size={28} color="#0584FE" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={28} color="#0584FE" />
        </TouchableOpacity>
      </View>
    </View>
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
  },
});
