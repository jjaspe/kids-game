import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Enable Firebase debugging in development
if (import.meta.env.DEV) {
  console.log("Firebase debugging enabled");
  // @ts-expect-error - This is a workaround to enable debugging in development
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  localStorage.debug = "*";
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // Realtime Database for battle mode
export const firestore = getFirestore(app); // Firestore for device auth
