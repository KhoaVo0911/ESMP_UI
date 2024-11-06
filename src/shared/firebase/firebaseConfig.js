// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB86j2JMHPWb9HMJDu-X7HvZyONe8CIuW0",
  authDomain: "esmp-6a0c7.firebaseapp.com",
  projectId: "esmp-6a0c7",
  storageBucket: "esmp-6a0c7.firebasestorage.app",
  messagingSenderId: "812830442043",
  appId: "1:812830442043:web:85b2687b74b58d08bad21e",
  measurementId: "G-WK6FWWDHCM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
