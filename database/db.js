import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBFEq4r2Ist0dfHb_29WgzRv8PYQqD2v-o",
  authDomain: "electronics-blog-dd74a.firebaseapp.com",
  projectId: "electronics-blog-dd74a",
  storageBucket: "electronics-blog-dd74a.appspot.com",
  messagingSenderId: "428696068099",
  appId: "1:428696068099:web:4135d66ceab36db852ee36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
