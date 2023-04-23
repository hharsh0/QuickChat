import { createContext } from "react";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  login: (token) => {},
  logout: () => {},
  uid: "",
  setUid: (uid) => {},
});

export default AuthContextProvider = ({children}) => {
  const [authToken, setAuthToken] = useState();
  const [uid, setUid] = useState();
  const userisLoggedIn = !!authToken;

  const login = (token) => {
    console.log("loggin in");
    setAuthToken(token);
    console.log(token);
    SecureStore.setItemAsync("token", token);
  };

  useEffect(() => {
    console.log("auth-ctx", userisLoggedIn);
  }, [userisLoggedIn]);

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      const uid = await SecureStore.getItemAsync("uid");
      if (token) {
        setAuthToken(token);
      }
      if(uid){
        setUid(uid);
      }
    };
    getToken();
  }, []);

  const logout = () => {
    setAuthToken(null);
  };
  
  const setId = (uid) => {
    setUid(uid);
    SecureStore.setItemAsync("uid", uid);
  }

  const value = {
    token: authToken,
    isAuthenticated: userisLoggedIn,
    login: login,
    logout: logout,
    uid: uid,
    setUid: setId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
