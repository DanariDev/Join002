// firebase/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Configuration object for Firebase initialization.
 * Stores all project credentials and connection details.
 */
const firebaseConfig = {
  apiKey: "AIzaSyC9E1VrPVQN6yOrmKyBj9XsqXH4OxqEJys",
  authDomain: "join002-26fa4.firebaseapp.com",
  databaseURL: "https://join002-26fa4-default-rtdb.firebaseio.com",
  projectId: "join002-26fa4",
  storageBucket: "join002-26fa4.appspot.com",
  messagingSenderId: "588453967455",
  appId: "1:588453967455:web:85ca999cef0309ddeb4dea"
};

/**
 * Initializes the Firebase app with the provided configuration.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance, used for all user authentication actions.
 */
export const auth = getAuth(app);

/**
 * Firebase Realtime Database instance, used for all app data storage and queries.
 */
export const db = getDatabase(app);
