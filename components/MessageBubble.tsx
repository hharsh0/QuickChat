import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

const MessageBubble = ({item, sentByMe}:any) => {
  return (
    <View
      style={[
        styles.messageContainer,
        sentByMe
          ? {
              alignSelf: "flex-end",
              borderBottomLeftRadius: theme.borderRadius.xl,
              backgroundColor: theme.colors.primary,
            }
          : {
              alignSelf: "flex-start",
              borderBottomRightRadius: theme.borderRadius.xl,
              backgroundColor: "#e9e9e9",
            },
      ]}
    >
      <Text
        style={[styles.message, sentByMe ? { color: theme.colors.white } : {color: "#000000"}]}
      >
        {item}
      </Text>
    </View>
  );
}

export default MessageBubble

const styles = StyleSheet.create({
  messageContainer: {
    borderTopRightRadius: theme.borderRadius.xl,
    borderTopLeftRadius: theme.borderRadius.xl,
    padding: 20,
    marginBottom: 10,
    maxWidth: "80%",
  },
  message: {
    fontSize: 18,
  },
});