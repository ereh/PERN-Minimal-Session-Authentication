// from https://usehooks.com/useAuth/

import React, { useState, useEffect, useContext, createContext } from "react";
import api from "./api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState();

  // This effect runs on refresh / component rendering
  // Saves user into AuthProvider context
  useEffect(() => {
    async function meQuery() {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
        console.log("Me query resulted in:");
        console.log(response.data);
      } catch (error) {
        setUser(null);
        return null;
      }
    }

    meQuery();

    // // localStorage Example
    // // note: To reduce server requests. (The user would then be saved into the storage on login.)
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (user) {
    //   setUser(user);
    // } else {
    //   setUser(null);
    // }
  }, []);

  // Logs in user
  const login = async (username, password) => {
    try {
      const response = await api.post("/users/login", {
        username: username,
        password: password,
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return null;
    }
  };

  // Register new user
  const register = (email, password) => {
    console.log("register() is NOT IMPLEMENTED");
    return null;
    //return user
  };

  //Logs out user
  const logout = async () => {
    try {
      await api.get("/users/logout");
      setUser(null);
    } catch (error) {
      return null;
    }
  };

  const auth = {
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
