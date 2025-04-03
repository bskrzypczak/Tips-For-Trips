import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return user; // Zwracamy dane użytkownika po udanym logowaniu
  
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };