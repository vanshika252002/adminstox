import { initializeApp } from "firebase/app";
import { getFirestore }  from '@firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDlcE6CdSyxwkWH-3D19j155OyUZ1bZpLo",
  authDomain: "bid4style-4a24f.firebaseapp.com",
  projectId: "bid4style-4a24f",
  storageBucket: "bid4style-4a24f.firebasestorage.app",
  messagingSenderId: "685864287302",
  appId: "1:685864287302:web:106cfb36866edb75301e47",
  databaseURL: "https://bid4style-4a24f-default-rtdb.firebaseio.com/",
};
 
 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
const realdb = getDatabase(app);
const provider = new GoogleAuthProvider();

export {db, auth, realdb, provider}