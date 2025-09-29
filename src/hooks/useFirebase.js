import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, provider } from '../services/firebase'

export function useFirebase() {
  const [user, setUser] = useState(null)
  const [firebaseStatus, setFirebaseStatus] = useState('connecting')

  useEffect(() => {
    if (!auth) {
      setFirebaseStatus('offline')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setFirebaseStatus(user ? 'connected' : 'ready')
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    if (!auth || !provider) {
      enableOffline()
      return
    }

    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login error:', error)
      if (error.code === 'auth/popup-blocked') {
        alert('Popup bloqueado! Permita popups para este site.')
      } else if (error.code !== 'auth/popup-closed-by-user') {
        enableOffline()
      }
    }
  }

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }

  const enableOffline = () => {
    setFirebaseStatus('offline')
  }

  return {
    user,
    firebaseStatus,
    signIn,
    signOut,
    enableOffline
  }
}