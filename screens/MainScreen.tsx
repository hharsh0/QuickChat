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
  // console.log(otherUsersArray);
  return otherUsersArray;
};



const MainScreen = () => {
  const navigation: any = useNavigation();
  const authCtx = useContext(AuthContext);
  const [groups, setGroups] = useState<any>([]);
  const [detailsToRender, setDetailsToRender] = useState<any>();

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
          // console.log(docs)
          setGroups(docs);
        });
      }
    };

    render();

    // return the unsubscribe function to clean up the listener when the component unmounts
    return unsubscribe;
  }, [currentUser]);

  const getUserName = async (data: any) => {
    const usersCollection = collection(projectFirestore, "users");
    const namesArrayWithUid: any = [];

    // Use the `await` keyword to wait for `getDocs` to complete before continuing
    const querySnapshot = await getDocs(usersCollection);

    querySnapshot.forEach((doc) => {
      data.map((user: any) => {
        if (user.otherUserId === doc.id) {
          namesArrayWithUid.push({
            name: doc.data().displayName,
            uid: doc.id,
          });
        }
      });
    });

    // Return the array from the function
    return namesArrayWithUid;
  };


  // to loop through users collection and find name of other user and make new array with name, uid and docId
  useEffect(() => {
    if (groups) {
      const otherUsersArray = otherUsers(groups, currentUser);
      // console.log(otherUsersArray)

      getUserName(otherUsers(groups, currentUser)).then((namesArrayWithUid) => {
        // console.log(namesArrayWithUid);
       const newArray:any = [];
       otherUsersArray.forEach((otherUser:any) => {
         const correspondingName = namesArrayWithUid.find(
           (name:any) => name.uid === otherUser.otherUserId
         );
         if (correspondingName) {
           const newItem = {
             uid: otherUser.otherUserId,
             name: correspondingName.name,
             docId: otherUser.docId,
           };
           newArray.push(newItem);
         }
        //  console.log(newArray)
         setDetailsToRender(newArray)
       });
      });
    }
  }, [groups]);

  const handlePress = (item:any) => {
    navigation.navigate("Chat", { name: item.name, groupId: item.docId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Header title="Chats" />
      <FlatList
        data={detailsToRender}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => handlePress(item)}
            name={item.name ?item.name : currentUser}
            detail={item.docId}
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
