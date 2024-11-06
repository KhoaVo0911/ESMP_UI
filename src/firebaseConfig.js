import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8nW1E9irwEdCUhI0npyPZ6JRvue2t4As",
  authDomain: "esms-df27d.firebaseapp.com",
  projectId: "esms-df27d",
  storageBucket: "esms-df27d.appspot.com",
  messagingSenderId: "87341463761",
  appId: "1:87341463761:web:ca02444ca4f4a96c65edf0",
  measurementId: "G-PRK8NQXSDS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, app, analytics };
