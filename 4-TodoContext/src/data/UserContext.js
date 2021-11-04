import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState } from "react";
import fetchHelper from "./fetchHelper";

const USER_STORAGE_KEY = "USER_STORAGE_KEY";

const initialUser = {
  userId: null,
  userData: null,
  userLoading: true,
  getLocalUser: () => {},
  signUserIn: () => {},
  signUserOut: () => {},
  updateAvatar: () => {},
};

export const UserContext = createContext(initialUser);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const getLocalUser = async () => {
    try {
      const storageUser = await AsyncStorage.getItem(
        USER_STORAGE_KEY
      );
      if (storageUser) {
        // User is authenticated
        setUserId(storageUser);
        const serverUserData = await fetchHelper.getUser(storageUser);
        setUserData(serverUserData);
        return storageUser;
      } else {
        // User is anonymous
        return null;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  };

  const signUserIn = async (newUser) => {
    const serverUserData = await fetchHelper.getUser(newUser);
    setUserData(serverUserData);
    AsyncStorage.setItem(USER_STORAGE_KEY, newUser);
    setUserId(newUser);
  };

  const signUserOut = () => {
    AsyncStorage.removeItem(USER_STORAGE_KEY);
    setUserId(null);
    setUserData(null);
  };

  const updateAvatar = (newAvatar) => {
    setUserData({ ...userData, avatar: newAvatar });
    fetchHelper.updateAvatarForUser(userId, newAvatar);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        userData,
        userLoading,
        getLocalUser,
        signUserIn,
        signUserOut,
        updateAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
