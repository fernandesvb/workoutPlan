import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLZwcbCRqahZj1SXP7Zr9tlqhsoTYg7qg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meu-treino-app-668e5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meu-treino-app-668e5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meu-treino-app-668e5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "441652448957",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:441652448957:web:e72cc230975f229faeb1d4"
}

let app, db, auth, provider

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
  provider = new GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export { db, auth, provider }