import { useState, useEffect } from 'react'

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
        // Tentar fazer uma operação simples no Firebase
        if (window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
          setIsFirebaseConnected(true)
        } else {
          setIsFirebaseConnected(false)
        }
      } catch (error) {
        setIsFirebaseConnected(false)
      }
    }

    if (isOnline) {
      checkFirebaseConnection()
      // Verificar a cada 30 segundos quando online
      const interval = setInterval(checkFirebaseConnection, 30000)
      return () => clearInterval(interval)
    } else {
      setIsFirebaseConnected(false)
    }
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