import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTPgNT0gJG2eBRavTPuHR9O1TJIAUQChc",
  authDomain: "bookish-dig.firebaseapp.com",
  projectId: "bookish-dig",
  appId: "1:300438128537:web:f0bcf3eb5d7a8f57caf508",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);