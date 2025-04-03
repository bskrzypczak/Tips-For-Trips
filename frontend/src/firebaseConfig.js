import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUAlHw-hCFB3okvjLQwjVr9-IuLCA1t_o",
  authDomain: "tipsfortrips-cddf2.firebaseapp.com",
  projectId: "tipsfortrips-cddf2",
  storageBucket: "tipsfortrips-cddf2.firebasestorage.app",
  messagingSenderId: "198476688547",
  appId: "1:198476688547:web:3edb9e07445430d629a316",
  measurementId: "G-313S346DK0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };