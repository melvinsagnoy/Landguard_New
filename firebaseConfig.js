
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Adjust this import path if necessary


const firebaseConfig = {
  apiKey: "AIzaSyCWONfxbxfZNYY7dhidjXlMinotfwP3spk",
  authDomain: "languard-18ec2.firebaseapp.com",
  projectId: "languard-18ec2",
  storageBucket: "languard-18ec2.appspot.com",
  messagingSenderId: "423510387855",
  appId: "1:423510387855:web:3da7651ab53807779fd4fa",
  measurementId: "G-QXPE8MN55Q"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export Auth and Google Provider
export { auth, googleProvider };