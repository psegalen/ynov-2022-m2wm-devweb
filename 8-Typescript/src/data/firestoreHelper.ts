import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { DocumentData } from "@firebase/firestore";

export const listenToProfile = (
  userId: string,
  onUserChanged: (data?: DocumentData) => void
) => {
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
