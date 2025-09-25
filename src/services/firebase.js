import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBLZwcbCRqahZj1SXP7Zr9tlqhsoTYg7qg",
  authDomain: "meu-treino-app-668e5.firebaseapp.com",
  projectId: "meu-treino-app-668e5",
  storageBucket: "meu-treino-app-668e5.firebasestorage.app",
  messagingSenderId: "441652448957",
  appId: "1:441652448957:web:e72cc230975f229faeb1d4"
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