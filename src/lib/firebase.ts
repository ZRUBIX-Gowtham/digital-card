import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQZdR7sANk4EkT5e-r13NmxrZDNT-eUmI",
  authDomain: "digital-card-zrubix.firebaseapp.com",
  projectId: "digital-card-zrubix",
  storageBucket: "digital-card-zrubix.firebasestorage.app",
  messagingSenderId: "467915779621",
  appId: "1:467915779621:web:07833807ec9191e74a59cc",
  measurementId: "G-QX6LRVLYHN"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
