import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider from "./store/auth-context";
import Navigation from "./navigation";

export default function App() {
  return (
    <AuthContextProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <Navigation />
        </SafeAreaView>
      </NavigationContainer>
    </AuthContextProvider>
  );
}

