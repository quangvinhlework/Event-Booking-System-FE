
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";





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


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
