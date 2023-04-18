import { StyleSheet, View } from 'react-native'
import React,{useRef} from 'react'
import LottieView from "lottie-react-native";


const LoadingScreen = () => {
      const animation = useRef(null);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#fff",
        }}
        source={require("../assets/loading.json")}
      />
    </View>
  );
}

export default LoadingScreen

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});