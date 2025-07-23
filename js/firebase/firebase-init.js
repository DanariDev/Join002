// firebase/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Configuration object for Firebase initialization
 * @constant {Object} firebaseConfig
 * @property {string} apiKey - Firebase API key
 * @property {string} authDomain - Firebase authentication domain
 * @property {string} databaseURL - Firebase Realtime Database URL
 * @property {string} projectId - Firebase project ID
 * @property {string} storageBucket - Firebase storage bucket
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase app ID
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
 * Initializes the Firebase app with the provided configuration
 * @constant {Object} app
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance
 * @constant {Object} auth
 */
export const auth = getAuth(app);

/**
 * Firebase Realtime Database instance
 * @constant {Object} db
 */
export const db = getDatabase(app);
