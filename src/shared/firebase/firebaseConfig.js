// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB86j2JMHPWb9HMJDu-X7HvZyONe8CIuW0",
  authDomain: "esmp-6a0c7.firebaseapp.com",
  projectId: "esmp-6a0c7",
  storageBucket: "esmp-6a0c7.firebasestorage.app",
  messagingSenderId: "812830442043",
  appId: "1:812830442043:web:85b2687b74b58d08bad21e",
  measurementId: "G-WK6FWWDHCM",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
