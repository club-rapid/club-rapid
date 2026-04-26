import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 환경 변수 문제 가능성을 차단하기 위해 직접 하드코딩 (QA 단계)
const firebaseConfig = {
  apiKey: "AIzaSyAAt94Pd-MqCFVWrg3-Rej69QjXY3mYEwQ",
  authDomain: "club-rapid-mjc.firebaseapp.com",
  projectId: "club-rapid-mjc",
  storageBucket: "club-rapid-mjc.firebasestorage.app",
  messagingSenderId: "336428178712",
  appId: "1:336428178712:web:94f180cfa0d25f2aa8926d",
  measurementId: "G-ZWKFGCLYR7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
