import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { theme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";

interface props {
  title: string;
}

const Header = ({ title }: props) => {
  const authCtx = useContext(AuthContext);
  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const marginTop = Platform.OS === "android" ? statusBarHeight : 0;
  console.log(statusBarHeight);
   console.log("top", marginTop);
  return (
    <View style={[styles.container
    ,{marginTop}
    ]}>
      <View style={styles.head}>
        <Pressable style={styles.start}>
          <Image
            source={{ uri: "https://picsum.photos/200/300" }}
            style={styles.img}
          />
          <Text style={styles.title}>{title}</Text>
        </Pressable>
        {title !== "Discover" && (
          <View style={styles.end}>
            {/* <TouchableOpacity style={styles.icon}>
              <Ionicons name="ios-camera" size={28} color="black" />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => authCtx.logout()}
              style={styles.icon}
            >
              {/* <Ionicons name="ios-create-outline" size={28} color="black" /> */}
              <Ionicons name="log-out-outline" size={28} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={24}
          color="grey"
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="grey"
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    backgroundColor: theme.colors.white,
    // backgroundColor: "red",
    paddingVertical: 16,
    paddingHorizontal: 10,
    // marginTop: Platform.OS === "android" ? 49 : 0,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginLeft: theme.spacing.s,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.xxl,
  },
  head: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  start: {
    flexDirection: "row",
    alignItems: "center",
  },
  end: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    padding: theme.spacing.xxs,
    marginHorizontal: theme.spacing.xs,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 100,
    paddingHorizontal: 10,
    marginTop: 15,
    paddingVertical: 2,
  },
  input: { flex: 1, fontSize: 20, color: "#333", paddingVertical: 10 },
});
