import { useState, useEffect } from 'react'
import { auth, db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'
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
    // Verificar conectividade com Firebase
    const checkFirebaseConnection = async () => {
      try {
        if (!auth || !db) {
          setIsFirebaseConnected(false)
          return
        }

        // Verificar se há usuário logado e tentar uma operação simples no Firestore
        if (auth.currentUser) {
          // Tentar fazer uma operação simples no Firestore para testar conectividade
          const testDoc = doc(db, 'test', 'connection')
          await getDoc(testDoc)
          setIsFirebaseConnected(true)
        } else {
          // Se não há usuário logado, mas Firebase está inicializado, considerar conectado
          setIsFirebaseConnected(!!auth && !!db)
        }
      } catch (error) {
        console.warn('Firebase connection check failed:', error.message)
        setIsFirebaseConnected(false)
      }
    }

    if (isOnline) {
      checkFirebaseConnection()
      // Verificar a cada 60 segundos quando online (reduzido frequência)
      const interval = setInterval(checkFirebaseConnection, 60000)
      return () => clearInterval(interval)
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
        const checkConnection = async () => {
          try {
            if (user && db) {
              const testDoc = doc(db, 'test', 'connection')
              await getDoc(testDoc)
              setIsFirebaseConnected(true)
            } else {
              setIsFirebaseConnected(!!auth && !!db)
            }
          } catch (error) {
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