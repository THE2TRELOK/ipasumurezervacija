// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOqBlkcGBSqgTR6u1ky-3xt0nf63l-4Jc",
  authDomain: "nekustamaisipasums-7241c.firebaseapp.com",
  databaseURL:
    "https://nekustamaisipasums-7241c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nekustamaisipasums-7241c",
  storageBucket: "nekustamaisipasums-7241c.appspot.com",
  messagingSenderId: "365415160440",
  appId: "1:365415160440:web:6996f1db5568bfd22eab8d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth, createUserWithEmailAndPassword };

export const getUserRole = async (userId) => {
  try {
    const userDocRef = doc(db, "Users", userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists() && userDocSnapshot.data().Role) {
      return userDocSnapshot.data().Role;
    } else {
      console.log("Данные пользователя не найдены или отсутствует роль");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении данных пользователя", error);
    return null;
  }
};