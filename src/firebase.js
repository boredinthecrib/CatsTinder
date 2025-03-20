// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDG_exm3tZaQ0pO5QvGFEHzxOZhT4GcVFY",
  authDomain: "cats-app-e0ef1.firebaseapp.com",
  projectId: "cats-app-e0ef1",
  storageBucket: "cats-app-e0ef1.firebasestorage.app",
  messagingSenderId: "374687401362",
  appId: "1:374687401362:web:c5373def51e0092bb22d4b",
  measurementId: "G-ZX6RDLS1K6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app); // Firestore database instance

export {
  auth,
  provider,
  signInWithPopup,
  db,
  signOut,
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
};
