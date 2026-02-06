// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0RdjBog7T1QIMVXKNpjatrZSdVHkFI-Q",
  authDomain: "installments-e4139.firebaseapp.com",
  databaseURL: "https://installments-e4139-default-rtdb.firebaseio.com",
  projectId: "installments-e4139",
  storageBucket: "installments-e4139.firebasestorage.app",
  messagingSenderId: "640639457619",
  appId: "1:640639457619:web:c99818d5e0134c6817e9a6",
  measurementId: "G-5R1J8BQS0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

export { app, analytics, db, realtimeDb };
