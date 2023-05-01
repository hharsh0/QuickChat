import { StyleSheet, SafeAreaView, FlatList, Platform, Text } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import PeopleListItem from "../components/PeopleListItem";
import {
  collection,
  onSnapshot,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";
import { AuthContext } from "../store/auth-context";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "./LoadingScreen";


const PeopleScreen = ({navigation}:any) => {
  const [users, setUsers] = useState([]);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(projectFirestore, "users"),
      (querySnapshot) => {
        const users:any = [];
        querySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setUsers(users);
        setLoading(false);
        console.log(users)
      }
    );
    return () => unsubscribe();
  }, []);

  const handlePress = async (uid: any, displayName: string, photoURL: string) => {
    const currentUser = authCtx.uid;
    const otherUser = uid;
    setLoading(true);

    // Check if a group already exists with these two members
     const q = query(
       collection(projectFirestore, "groups"),
       where("members", "==", [currentUser, otherUser])
     );

     const q2 = query(
       collection(projectFirestore, "groups"),
       where("members", "==", [otherUser, currentUser])
     );

    try {
      const querySnapshot = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);
      if (querySnapshot.docs.length > 0 || querySnapshot2.docs.length > 0) {
        console.log("Group already exists!");
        const groupId =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].id
            : querySnapshot2.docs[0].id;
        navigation.navigate("Chat", {
          name: displayName,
          groupId: groupId,
          image: photoURL,
        });
        setLoading(false);
        return;
      } else {
        // Create a new group document
        const docRef = await addDoc(collection(projectFirestore, "groups"), {
          createdAt: new Date(),
          createdBy: currentUser,
          members: [currentUser, otherUser],
          type: "notgroup",
        });
        console.log("New group created with ID: ", docRef.id);

        // Create a new document inside "messages" collection with the same ID as group document
        const messagesDocRef = doc(
          collection(projectFirestore, "messages"),
          docRef.id
        );
        await setDoc(messagesDocRef, { groupId: docRef.id });

        // Navigate the user to the chat screen with the newly created group ID
        navigation.navigate("Chat", {
          groupId: docRef.id,
          name: displayName,
          image: photoURL,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating group: ", error);
    }
  };


  if(loading){
    return <LoadingScreen />
  }

  const renderItem = ({ item }: any) => (
    <PeopleListItem
      name={item.displayName}
      uid={item.uid}
      image={item.photoURL}
      onPress={() => handlePress(item.uid, item.displayName, item.photoURL)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contacts" />
      <StatusBar backgroundColor="#fff" style="dark" />
      {/* <Text style={styles.info}>All Contacts</Text> */}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  info:{
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 16,
  }
});
