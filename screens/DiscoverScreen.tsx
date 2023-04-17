import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const DiscoverScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Discover" />
    </View>
  )
}

export default DiscoverScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})