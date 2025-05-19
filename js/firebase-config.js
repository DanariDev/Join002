// Firebase v9 Modular Syntax
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9E1VrPV6Nyo0rmKyBj9SxqH4X0xqEJys",
  authDomain: "join002-26fa4.firebaseapp.com",
  projectId: "join002-26fa4",
  storageBucket: "join002-26fa4.appspot.com",
  messagingSenderId: "588453967455",
  appId: "1:588453967455:web:85ca999cef839ddeb4dea",
  measurementId: "G-PHNGZQZS4Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
