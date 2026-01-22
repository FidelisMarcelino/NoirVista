import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Cegah double initialize (INI KUNCI NYA)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

  
if (!firebaseConfig.apiKey) {
  throw new Error("Firebase API Key is missing");
}

export const auth = getAuth(app);
export const db = getFirestore(app);