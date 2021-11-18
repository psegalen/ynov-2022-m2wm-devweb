import { doc, onSnapshot, getFirestore } from "firebase/firestore";

export const listenToProfile = (userId, onUserChanged) => {
  console.log("Listening to profile update", userId);
  const user = doc(getFirestore(), "users", userId);
  const unsubscribe = onSnapshot(
    user,
    (arg) => {
      onUserChanged(arg.data());
    },
    (e) => console.error(e)
  );
  return unsubscribe;
};
