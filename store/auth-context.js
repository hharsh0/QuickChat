import { createContext } from "react";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  login: (token) => {},
  logout: () => {},
});

export default AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState();
  const userisLoggedIn = !!authToken;

  const login = (token) => {
    console.log("loggin in")
    setAuthToken(token);
    console.log(token)
    SecureStore.setItemAsync("token", token);
  };

  useEffect(()=>{console.log("auth-ctx", userisLoggedIn)},[userisLoggedIn])

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setAuthToken(token);
      }
    };
    getToken();
  }, []);

  const logout = () => {
    setAuthToken(null);
  };

  const value = {
    token: authToken,
    isAuthenticated: userisLoggedIn,
    login: login,
    logout: logout,
  };

  

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
