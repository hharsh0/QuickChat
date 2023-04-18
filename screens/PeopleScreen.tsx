import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
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
  updateDoc,
  doc
} from "firebase/firestore";
import { projectFirestore, projectAuth } from "../firebase/config";
import { AuthContext } from "../store/auth-context";
import { StatusBar } from "expo-status-bar";


const PeopleScreen = ({navigation}:any) => {
  const [users, setUsers] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(projectFirestore, "users"),
      (querySnapshot) => {
        const users:any = [];
        querySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setUsers(users);
      }
    );
    return () => unsubscribe();
  }, []);

  const handlePress = async (uid:any, displayName:any)=>{
    const currentUser = authCtx.uid;
    const otherUser = uid;
    console.log(otherUser);

    // Check if a group already exists with these two members
    const q = query(
      collection(projectFirestore, "groups"),
      where("members", "==", [currentUser, otherUser])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      console.log("Group already exists!");
      navigation.navigate("Chat", { name: displayName });
      return;
    }

    // Create a new group document
    try {
      const docRef:any = await addDoc(collection(projectFirestore, "groups"), {
        createdAt: new Date(),
        createdBy: currentUser,
        id: "",
        members: [currentUser, otherUser],
        type: "notgroup",
      });
      console.log("New group created with ID: ", docRef.id);

      // Update the group ID with the newly generated ID
      // await updateDoc(doc(docRef.id, "groups"), { id: docRef.id });
      // console.log("Group ID updated!");

      // Navigate the user to the chat screen with the newly created group ID
      navigation.navigate("Chat", { groupId: docRef.id, name: displayName });
    } catch (error) {
      console.error("Error creating group: ", error);
    }
  }

  const renderItem = ({ item }:any) => <PeopleListItem name={item.displayName} uid={item.uid} onPress={()=>handlePress(item.uid, item.displayName)} />;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="People" />
      <StatusBar backgroundColor="#fff" style="dark" />
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
});
