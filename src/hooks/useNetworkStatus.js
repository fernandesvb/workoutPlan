import { useState, useEffect } from 'react'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Verificar conectividade com Firebase apenas por estado de autenticação
    const checkFirebaseConnection = () => {
      try {
        if (!auth) {
          console.log('🔴 Firebase Auth não inicializado')
          setIsFirebaseConnected(false)
          return
        }

        // Se há usuário logado = Firebase funcionando
        if (auth.currentUser) {
          setIsFirebaseConnected(true)
        } else {
          // Firebase inicializado mas sem usuário = ainda consideramos conectado
          setIsFirebaseConnected(true)
        }
      } catch (error) {
        console.warn('❌ Firebase check failed:', error.message)
        setIsFirebaseConnected(false)
      }
    }

    if (isOnline) {
      checkFirebaseConnection()
    } else {
      setIsFirebaseConnected(false)
    }
  }, [isOnline])

  // Listener para mudanças de autenticação
  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Quando usuário faz login/logout, verificar conexão imediatamente
      if (isOnline) {
        const checkConnection = () => {
          try {
            if (user) {
              setIsFirebaseConnected(true)
            } else {
              setIsFirebaseConnected(true) // Firebase ainda está disponível
            }
          } catch (error) {
            console.warn('❌ Auth state check failed:', error.message)
            setIsFirebaseConnected(false)
          }
        }
        checkConnection()
      }
    })

    return () => unsubscribe()
  }, [isOnline])

  const getConnectionStatus = () => {
    if (!isOnline) return { status: 'offline', message: '🔴 Sem conexão com internet' }
    if (!isFirebaseConnected) return { status: 'firebase-offline', message: '🟡 Modo offline - dados salvos localmente' }
    return { status: 'online', message: '🟢 Conectado e sincronizado' }
  }

  return {
    isOnline,
    isFirebaseConnected,
    getConnectionStatus
  }
}