import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA724wEtV2CYrHdiKSdVkjZpvbjnNtYjR0",
  authDomain: "time-management-d4d2d.firebaseapp.com",
  projectId: "time-management-d4d2d",
  storageBucket: "time-management-d4d2d.appspot.com",
  messagingSenderId: "88955279100",
  appId: "1:88955279100:web:57c38541f9b922ff6f6979"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);