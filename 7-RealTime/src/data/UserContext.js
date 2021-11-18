import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import fetchHelper from "./fetchHelper";
import { listenToProfile } from "./firestoreHelper";

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
  const unsubscriber = useRef();

  useEffect(() => {
    console.log("UserContext useEffect", userId);
    if (userId) {
      if (unsubscriber.current) unsubscriber.current();
      unsubscriber.current = listenToProfile(userId, (user) => {
        console.log("listenToProfile >>> ", user);
        setUserData(user);
      });
    } else {
      if (unsubscriber.current) unsubscriber.current();
    }
    return unsubscriber.current;
  }, [userId]);

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
