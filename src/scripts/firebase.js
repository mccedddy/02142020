// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyoXO0i0-uRZ6f1b163nQvSI01kHHMbEg",
  authDomain: "project-02142020.firebaseapp.com",
  projectId: "project-02142020",
  storageBucket: "project-02142020.appspot.com",
  messagingSenderId: "600278125683",
  appId: "1:600278125683:web:0c3b65e80ef71ba5ad6e06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Test Firestore
const getNotes = async () => {
  const notesRef = collection(db, "notes");
  const querySnapshot = await getDocs(notesRef);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

getNotes().catch((err) => console.error("Error getting documents", err));
