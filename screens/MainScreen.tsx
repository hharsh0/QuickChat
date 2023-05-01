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
  orderBy,
  limit,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";
import LoadingScreen from "./LoadingScreen";
import { useIsFocused } from "@react-navigation/native";



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
  const [latestMessages, setLatestMessages] = useState<any>();
  const [otherUsersArray, setOtherUsersArray] = useState<any>();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();


  const currentUser = authCtx.uid;

  // console.log(isFocused)

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
          setLoading(false);
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
            image: doc.data().photoURL
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
      // [{"docId": "69sO4PnJtCw5GUzjYbMC", "otherUserId": "rXzm9jeIh7eHIwDSwSzr"}, {"docId": "DmyDwboVKICjzq5Qxmgo", "otherUserId": "seKT2LhnTGTd2h93yrhpezT2uR12"}, {"docId": "UxQezluUQpac2XJKGHIP", "otherUserId": "lGByuBrzPsMpXJNzjECaUluA6Q43"}, {"docId": "Z5jfmSgzdzwYRLx6o3nH", "otherUserId": "2r5vsnPv4sTTaqwmEM4OsCaGor82"}, {"docId": "hx1Bl5WH2HuugEgx6M5d", "otherUserId": undefined}, {"docId": "mZVNsUPIpsgZpnDAHZbI", "otherUserId": "exEuiBwVkdhIuGLjfkZPzaUvjzZ2"}]
      // console.log("other",otherUsersArray)

      getUserName(otherUsers(groups, currentUser)).then((namesArrayWithUid) => {
        // console.log("other", namesArrayWithUid);
        // [{"image": "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492__340.jpg", "name": "harsh2", "uid": "2r5vsnPv4sTTaqwmEM4OsCaGor82"}]
        const newArray: any = [];
        otherUsersArray.forEach((otherUser: any) => {
          const correspondingName = namesArrayWithUid.find(
            (name: any) => name.uid === otherUser.otherUserId
          );
          if (correspondingName) {
            const newItem = {
              uid: otherUser.otherUserId,
              name: correspondingName.name,
              docId: otherUser.docId,
              image: correspondingName.image
            };
            newArray.push(newItem);
          }
          //  console.log("new",newArray)
          //  [{"docId": "69sO4PnJtCw5GUzjYbMC", "image": "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492__340.jpg", "name": "Name", "uid": "rXzm9jeIh7eHIwDSwSzr"}]
          setDetailsToRender(newArray);
        });
      });

      // getLatestMessages(otherUsersArray);
      setOtherUsersArray(otherUsersArray);
    }
  }, [groups]);

  // useEffect(()=>{
  //   console.log("hello",latestMessages)
  // },[latestMessages])

  const getLatestMessages = async (otherUsersArray: any) => {
    const latestMessages: any = [];

    // Loop through the group IDs and query the messages collection for each group
    for (const obj of otherUsersArray) {
      const groupId = obj.docId;
      // console.log(groupId)
      const q = query(
        collection(projectFirestore, "messages", groupId, "message"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // console.log("New message:", change.doc.data());
            const existingMessageIndex = latestMessages.findIndex(
              (msg:any) => msg.groupId === groupId
            );
            const messageData = change.doc.data();
            if (existingMessageIndex !== -1) {
              // If a message with the same groupId exists, update it with the latest data
              // console.log("not triggered");
              latestMessages[existingMessageIndex] = {
                groupId: groupId,
                message: messageData.message,
                createdAt: messageData.createdAt,
                sentBy: messageData.sentBy,
              };
              setLatestMessages(latestMessages);
            } else {
              // If a message with the same groupId does not exist, add a new object to latestMessages
              // console.log("triggered")
              latestMessages.push({
                groupId: groupId,
                message: messageData.message,
                createdAt: messageData.createdAt,
                sentBy: messageData.sentBy,
              });
              setLatestMessages([...latestMessages]);
            }
          }
        });
      });
      // const querySnapshot = await getDocs(q);
      // if (!querySnapshot.empty) {
      //   const messageData = querySnapshot.docs[0].data();
      //   latestMessages.push({
      //     groupId: groupId,
      //     message: messageData.message,
      //     createdAt: messageData.createdAt,
      //     sentBy: messageData.sentBy,
      //   });
      // }
    }
    

    // setLatestMessages(latestMessages);

  };

  // if focused is added to re render when on focus
  useEffect(()=>{
    if(otherUsersArray){
      getLatestMessages(otherUsersArray)
    }
  },[otherUsersArray, isFocused])

  const handlePress = (item:any) => {
    navigation.navigate("Chat", { name: item.name, groupId: item.docId });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" style="dark" />
      {/* <Header title="Chats" /> */}
      <FlatList
        data={detailsToRender}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => handlePress(item)}

            name={item.name ? item.name : currentUser}
            image={item.image}
            detail={
              latestMessages?.find(
                (message: any) => message.groupId === item.docId
              )?.sentBy === currentUser
                ? "You: " +
                  latestMessages?.find(
                    (message: any) => message.groupId === item.docId
                  )?.message
                : latestMessages?.find(
                    (message: any) => message.groupId === item.docId
                  )?.message
            }
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
    // marginTop: Platform.OS === "android" ? 40 : 0,
    backgroundColor: "#fff",
  },
});
