import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { projectAuth, projectFirestore } from "../firebase/config";
import { AuthContext } from "../store/auth-context";
import { collection, doc, setDoc } from "firebase/firestore";
import LoadingScreen from "./LoadingScreen";

const SignUpScreen = ({ navigation }: any) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      // auth
      const userData: any = await createUserWithEmailAndPassword(
        projectAuth,
        email,
        password
      );
      console.log("user id", userData.user.uid);
      authCtx.setUid(userData.user.uid);
      await updateProfile(userData.user, {
        displayName: displayName,
      });

      //saving to firestore
      const usersCollectionRef = collection(projectFirestore, "users");
      //creating doc with same id as uid
      const userDocRef = doc(usersCollectionRef, userData.user.uid);
      await setDoc(userDocRef, {
        displayName: displayName,
        email: email,
        photoURL:
          "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492__340.jpg",
        uid: userData.user.uid,
      });

      if (userData._tokenResponse.idToken) {
        authCtx.login(userData._tokenResponse.idToken);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error signing up: ", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="none"
      />
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
      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("login")}
        style={{ marginTop: 16 }}
      >
        <Text>Already have an account? Log In</Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;

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
