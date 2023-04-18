import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const PeopleScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="People" />
    </SafeAreaView>
  )
}

export default PeopleScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})