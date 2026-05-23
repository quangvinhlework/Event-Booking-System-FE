// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAw75Fo3ghe8Zj210Jy2Fn-fXvmd4uKNM",
  authDomain: "event-booking-online.firebaseapp.com",
  projectId: "event-booking-online",
  storageBucket: "event-booking-online.firebasestorage.app",
  messagingSenderId: "449361618134",
  appId: "1:449361618134:web:eab249524751a41ba4d577",
  measurementId: "G-GZ8ES7Z7MN",
  databaseURL: "https://event-booking-online-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
