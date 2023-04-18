import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  SafeAreaView
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import MessageBubble from "../components/MessageBubble";
import { dummyData } from "../data";
import { StatusBar } from "expo-status-bar";


const ChatScreen = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState(dummyData);

  const sendMessage = () => {
    if (text) {
      setMessages([
        ...messages,
        { id: (messages.length + 1).toString(), message: text, sentByMe: true },
      ]);
      setText("");
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 90;


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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <MessageBubble item={item.message} sentByMe={item.sentByMe} />
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
                {text ? (
                  <Ionicons name="send" size={28} color="#fff" />
                ) : (
                  <Ionicons name="mic" size={28} color="#fff" />
                )}
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
  outerContainer:{
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
