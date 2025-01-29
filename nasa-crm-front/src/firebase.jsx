// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx74hGs55T4Z_44j9X29QB_KS63ZshTwI",
  authDomain: "hl-crm.firebaseapp.com",
  projectId: "hl-crm",
  storageBucket: "hl-crm.appspot.com",
  messagingSenderId: "332711024590",
  appId: "1:332711024590:web:cbef7a874357d21a40fd9f",
  measurementId: "G-1CRN8QEKH3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);