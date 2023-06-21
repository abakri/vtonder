import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpJFuTtqzzeFViIFIYqoIS1BUDcXAND5I",
  authDomain: "vtonder-45e0f.firebaseapp.com",
  projectId: "vtonder-45e0f",
  storageBucket: "vtonder-45e0f.appspot.com",
  messagingSenderId: "817240154009",
  appId: "1:817240154009:web:43dea8372c8d8536947d08",
  measurementId: "G-7WWH98PELX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
