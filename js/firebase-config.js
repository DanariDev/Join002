import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9E1VrPVQN6yOrmKyBj9XsqXH4OxqEJys",
  authDomain: "join002-26fa4.firebaseapp.com",
  projectId: "join002-26fa4",
  storageBucket: "join002-26fa4.appspot.com",
  messagingSenderId: "588453967455",
  appId: "1:588453967455:web:85ca999cef0309ddeb4dea",
  databaseURL: "https://join002-26fa4-default-rtdb.europe-west1.firebasedatabase.app" //Wichtig!
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
