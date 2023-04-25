import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const DiscoverScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Discover" />
    </SafeAreaView>
  )
}

export default DiscoverScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
});