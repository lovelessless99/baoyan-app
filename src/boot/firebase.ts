// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYjPmmvGGBfkVX6RqANaDx9xMaGPFuNNU",
  authDomain: "memory-c25ea.firebaseapp.com",
  projectId: "memory-c25ea",
  storageBucket: "memory-c25ea.firebasestorage.app",
  messagingSenderId: "574829020936",
  appId: "1:574829020936:web:a50e0887f394a52d4c8ebd",
  measurementId: "G-VLGPK46ZEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore
const db = getFirestore(app);

export { db };