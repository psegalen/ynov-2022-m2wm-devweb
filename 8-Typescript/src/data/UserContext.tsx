import { DocumentData } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useRef, useState } from "react";
import fetchHelper from "./fetchHelper";
import { listenToProfile } from "./firestoreHelper";
import { User } from "./todoTypes";

const USER_STORAGE_KEY = "USER_STORAGE_KEY";

interface UserContextType {
  userId: string | null;
  userData: User | null;
  userLoading: boolean;
  getLocalUser: () => Promise<string | null>;
  signUserIn: (userId?: string) => Promise<void>;
  signUserOut: () => void;
  updateAvatar: (newAvatar?: string) => void;
}

const initialUser: UserContextType = {
  userId: null,
  userData: null,
  userLoading: true,
  getLocalUser: () => Promise.resolve(null),
  signUserIn: () => Promise.resolve(),
  signUserOut: () => {},
  updateAvatar: () => {},
};

export const UserContext = createContext<UserContextType>(initialUser);

export const UserProvider: React.FC = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const unsubscriber = useRef<() => void>();

  useEffect(() => {
    console.log("UserContext useEffect", userId);
    if (userId) {
      if (unsubscriber.current) unsubscriber.current();
      unsubscriber.current = listenToProfile(userId, (user?: DocumentData) => {
        console.log("listenToProfile >>> ", user);
        if (user) {
          setUserData(user);
        }
      });
    } else {
      if (unsubscriber.current) unsubscriber.current();
    }
    return unsubscriber.current;
  }, [userId]);

  const getLocalUser = async (): Promise<string | null> => {
    try {
      const storageUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
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
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  const signUserIn = async (newUser?: string): Promise<void> => {
    if (newUser) {
      const serverUserData = await fetchHelper.getUser(newUser);
      setUserData(serverUserData);
      AsyncStorage.setItem(USER_STORAGE_KEY, newUser);
      setUserId(newUser);
    }
  };

  const signUserOut = () => {
    AsyncStorage.removeItem(USER_STORAGE_KEY);
    setUserId(null);
    setUserData(null);
  };

  const updateAvatar = (newAvatar?: string) => {
    setUserData({ ...userData, avatar: newAvatar });
    if (userId && newAvatar) {
      fetchHelper.updateAvatarForUser(userId, newAvatar);
    }
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
