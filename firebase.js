// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7G_C3GFGFDjb0kMTztZVfy4Xe-KlNJe4",
  authDomain: "cafekea-5aa9d.firebaseapp.com",
  projectId: "cafekea-5aa9d",
  storageBucket: "cafekea-5aa9d.appspot.com",
  messagingSenderId: "678105874412",
  appId: "1:678105874412:web:c8140d329bdcc280e9cac9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
