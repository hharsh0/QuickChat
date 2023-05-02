import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  SafeAreaView,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import MessageBubble from "../components/MessageBubble";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { projectFirestore } from "../firebase/config";
import { AuthContext } from "../store/auth-context";


const ChatScreen = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const route = useRoute();
  // const name = (route.params as { name: string } | undefined)?.name;
  const groupId = (route.params as { groupId: string } | undefined)?.groupId;
  const messageRef = collection(projectFirestore, "messages", groupId, "message");
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const messagesQuery = query(messageRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        };
      });
      setMessages(messagesList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    if (text && authCtx) {
      const messageToSend = text;
      setText("");
      await addDoc(messageRef, {
        message: messageToSend,
        sentBy: authCtx.uid,
        createdAt: serverTimestamp(),
      });
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 45;

  return (
    <SafeAreaView style={styles.outerContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <StatusBar backgroundColor="#fff" style="dark" />
        <View style={styles.container}>
          <FlatList
            style={styles.main}
            data={[...messages].reverse()}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <MessageBubble item={item.message} sentBy={item.sentBy} />
            )}
            inverted
          />
          <View style={styles.bottomContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="grey"
                value={text}
                onChangeText={(text) => setText(text)}
                onSubmitEditing={sendMessage}
                autoCapitalize="none"
              />
              <View style={styles.inputIcon} onTouchEnd={sendMessage}>
                {/* {text ? (
                  <Ionicons name="send" size={28} color="#fff" />
                ) : (
                  <Ionicons name="mic" size={28} color="#fff" />
                )} */}
                <Ionicons name="send" size={28} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.white,
  },
  main: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#e9e9e9",
    borderRadius: theme.borderRadius.xl,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginLeft: 5,
    padding: 10,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
