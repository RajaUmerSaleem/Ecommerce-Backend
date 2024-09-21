// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSLVJ6mqNl4Q0TOUDgHbnWtrJP6_fiEYk",
  authDomain: "ecommerce-images-2f65d.firebaseapp.com",
  projectId: "ecommerce-images-2f65d",
  storageBucket: "ecommerce-images-2f65d.appspot.com",
  messagingSenderId: "441729068906",
  appId: "1:441729068906:web:688275800c0f48e7f9ff13",
  measurementId: "G-2PW1QDF37S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, storage };