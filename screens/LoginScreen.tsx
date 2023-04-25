import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { projectAuth } from "../firebase/config";
import { AuthContext } from "../store/auth-context";
import LoadingScreen from "./LoadingScreen";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const userData: any = await signInWithEmailAndPassword(
        projectAuth,
        email,
        password
      );      
      if(userData._tokenResponse.idToken){
        // console.log(userData)
        authCtx.setUid(userData.user.uid);
        authCtx.login(userData._tokenResponse.idToken);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error signing in: ", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("signup")}
        style={{ marginTop: 16 }}
      >
        <Text>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
