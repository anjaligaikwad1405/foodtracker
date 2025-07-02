// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace with YOUR config from Step 2
const firebaseConfig = {
  apiKey: "AIzaSyBKgvHnYU1bojs242E9vsbg5gj8BRKLiY0",
  authDomain: "deliveryapp-67212.firebaseapp.com",
  projectId: "deliveryapp-67212",
  storageBucket: "deliveryapp-67212.firebasestorage.app",
  messagingSenderId: "211294575478",
  appId: "1:211294575478:web:8d98ba931e8541816ff857"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);