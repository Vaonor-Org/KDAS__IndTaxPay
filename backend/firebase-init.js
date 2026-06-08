/* ──────────────────────────────────────────
   firebase-init.js
   Firebase CDN (compat) initialization
   ────────────────────────────────────────── */

const firebaseConfig = {
  apiKey: "AIzaSyBteTlKJi0onZqtE8JjVGkxl6FTj9OddLM",
  authDomain: "indtaxpay-8a6ed.firebaseapp.com",
  projectId: "indtaxpay-8a6ed",
  storageBucket: "indtaxpay-8a6ed.firebasestorage.app",
  messagingSenderId: "850498033854",
  appId: "1:850498033854:web:92a9bffaf3d48029a7e6ef",
  measurementId: "G-5D8MF0SNEC"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export services
const db = firebase.firestore();
const auth = firebase.auth();
