// src/firebase/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, onValue } from 'firebase/database';

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAI1E-dLD7iHXpp2XbA6q0MtGLnlYyAzO8",
  authDomain: "todolist-react-c1ecb.firebaseapp.com",
  databaseURL: "https://todolist-react-c1ecb-default-rtdb.europe-west1.firebasedatabase.app/", // Realtime DB URL
  projectId: "todolist-react-c1ecb",
  storageBucket: "todolist-react-c1ecb.appspot.com",
  messagingSenderId: "1003502188214",
  appId: "1:1003502188214:web:31c921a18ad4bc7d4dd817"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export necessary functions for interacting with the Realtime Database
export { db, ref, set, get, update, remove, onValue };
