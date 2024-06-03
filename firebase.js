// Import the functions you need from the SDKs you need
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, updateDoc, doc, setDoc, getDoc, collection } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOqBlkcGBSqgTR6u1ky-3xt0nf63l-4Jc",
  authDomain: "nekustamaisipasums-7241c.firebaseapp.com",
  databaseURL: "https://nekustamaisipasums-7241c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nekustamaisipasums-7241c",
  storageBucket: "nekustamaisipasums-7241c.appspot.com",
  messagingSenderId: "365415160440",
  appId: "1:365415160440:web:6996f1db5568bfd22eab8d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth, createUserWithEmailAndPassword, updateDoc, doc, setDoc, getDoc, collection };