import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const PeopleScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="People" />
    </View>
  )
}

export default PeopleScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})