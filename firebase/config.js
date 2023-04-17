// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsjD4FG3fas-Z6mQJAbLwoBMg3a5HaPcU",
  authDomain: "projectchat-b7a75.firebaseapp.com",
  projectId: "projectchat-b7a75",
  storageBucket: "projectchat-b7a75.appspot.com",
  messagingSenderId: "519768246885",
  appId: "1:519768246885:web:cf45fd710564b13676548c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const projectFirestore = getFirestore(app);
const projectAuth = getAuth(app);

export { projectFirestore, projectAuth };
