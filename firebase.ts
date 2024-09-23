import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";

let firebaseApp;
export let firebaseStorage: FirebaseStorage;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (firebaseConfig.apiKey) {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseStorage = getStorage(firebaseApp);
} else {
  alert("error accessing firebase");
  window.location.reload();
}
