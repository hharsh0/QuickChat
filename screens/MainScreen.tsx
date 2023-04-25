import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  SafeAreaView,
} from "react-native";
import ListItem from "../components/ListItem";
import Header from "../components/Header";
import { data } from "../data";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

const otherUsers = (data: any, currentUser: string) => {
  const otherUsersArray = data.map((doc: any) => {
    const otherUserIds = doc.members.filter(
      (memberId: string) => memberId !== currentUser
    );
    return { docId: doc.id, otherUserId: otherUserIds[0] };
  });
  console.log(otherUsersArray);
  return otherUsersArray;
};



const MainScreen = () => {
  const navigation: any = useNavigation();
  const authCtx = useContext(AuthContext);
  const [groups, setGroups] = useState<any>([]);
  const [otherUserId, setOtherUserId] = useState<string>();
  const [otherUserDetails, setOtherUserDetails] = useState<any>([]);
  const [otherUserName, setOtherUserName] = useState<string>();

  const currentUser = authCtx.uid;

  

  useEffect(() => {
    const unsubscribe = () => {}; // declare empty unsubscribe function to use later

    const render = async () => {
      if (currentUser) {
        const q = query(
          collection(projectFirestore, "groups"),
          where("members", "array-contains", currentUser)
        );

        // set up realtime listener with onSnapshot
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const docs: any[] = [];
          querySnapshot.docs.forEach((doc) => {
            const groupData = doc.data();
            docs.push({ id: doc.id, ...groupData });
          });
          setGroups(docs);
        });
      }
    };

    render();

    // return the unsubscribe function to clean up the listener when the component unmounts
    return unsubscribe;
  }, [currentUser]);



  // to loop through users collection and find name of other user
  useEffect(() => {
    if(groups){
     setOtherUserDetails(otherUsers(groups, currentUser))
    }
    const getData = async () => {
      if (otherUserId) {
        const q = query(
          collection(projectFirestore, "users"),
          where("uid", "==", otherUserId)
        );
        try {
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            const userData = querySnapshot.docs[0].data();
            querySnapshot.docs.map((doc)=>console.log("inside",doc.data()));
            setOtherUserName(userData.displayName);
          }
        } catch (error) {
          console.error("Error searching users: ", error);
        }
      }
    };
    getData();
  }, [groups]);

  const handlePress = (item:any) => {
    navigation.navigate("Chat", { name: item.otherUserId, groupId: item.docId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Header title="Chats" />
      <FlatList
        data={otherUserDetails}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => handlePress(item)}
            name={item.otherUserId ?item.otherUserId : currentUser}
            detail={item.docId}
            // name={item.name}
            // detail={item.detail}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 40 : 0,
    backgroundColor: "#fff",
  },
});
