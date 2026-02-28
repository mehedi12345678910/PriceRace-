// important
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  authDomain:import.meta.env.VITE_AUTHDOMAIN,
  apiKey:import.meta.env.VITE_PROJECTID,
  projectId:import.meta.env.VITE_STORAGEBUCKET,
  storageBucket:import.meta.env.VITE_MESSAGINGSENDERID,
  messagingSenderId:import.meta.env.VITE_APIKEY,
  appId:import.meta.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)