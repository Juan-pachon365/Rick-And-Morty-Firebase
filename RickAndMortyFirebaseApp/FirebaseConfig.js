import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyCUym4qlxbxskBEiJR9vbdhhlWK6BpigoY",
  authDomain: "rickandmortyexpo.firebaseapp.com",
  projectId: "rickandmortyexpo",
  storageBucket: "rickandmortyexpo.firebasestorage.app",
  messagingSenderId: "1:995150808467:web:6f1b9b7c134901bfd59466",
  appId: "TU_APP_ID_AQUÍ"
};

const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en el dispositivo
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };