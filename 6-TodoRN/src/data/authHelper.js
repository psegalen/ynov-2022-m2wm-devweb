import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB1xLksThm1NBVcDmoxEyT74bYudDTXWWI",
  authDomain: "ynov-todos.firebaseapp.com",
  projectId: "ynov-todos",
  storageBucket: "ynov-todos.appspot.com",
  messagingSenderId: "659421845328",
  appId: "1:659421845328:web:a0f0a38ee6536c1aad3e55",
  measurementId: "G-PNNSYB0H7X",
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

const authHelper = {
  signInOnFirebase: async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return result.user.email;
  },
};

export default authHelper;
