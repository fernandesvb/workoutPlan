import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Cloud, CloudOff, User, UserX } from 'lucide-react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

export default function ConnectionStatus({ user }) {
  const { isOnline, isFirebaseConnected, getConnectionStatus } = useNetworkStatus()
  const [showDetails, setShowDetails] = useState(false)

  const status = getConnectionStatus()

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />
    if (!user) return <UserX size={16} />
    if (!isFirebaseConnected) return <CloudOff size={16} />
    return <Cloud size={16} />
  }

  const getStatusColor = () => {
    if (!isOnline || !user) return '#ef4444' // Vermelho
    if (!isFirebaseConnected) return '#f59e0b' // Amarelo
    return '#10b981' // Verde
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (!user) return 'Não logado'
    if (!isFirebaseConnected) return 'Local'
    return 'Conectado'
  }

  const getDetailedStatus = () => {
    if (!isOnline) {
      return {
        title: '🔴 Sem Internet',
        description: 'Dados salvos apenas localmente',
        action: 'Conecte-se à internet para sincronizar'
      }
    }

    if (!user) {
      return {
        title: '🟡 Não Autenticado',
        description: 'Dados salvos apenas localmente',
        action: 'Faça login para sincronizar na nuvem'
      }
    }

    if (!isFirebaseConnected) {
      return {
        title: '🟡 Modo Offline',
        description: 'Dados salvos localmente',
        action: 'Verificando conexão com servidor...'
      }
    }

    return {
      title: '🟢 Totalmente Conectado',
      description: 'Dados sincronizados na nuvem',
      action: 'Todos os dados estão seguros'
    }
  }

  const details = getDetailedStatus()

  return (
    <div className="connection-status">
      <div
        className="status-indicator"
        style={{ backgroundColor: getStatusColor() }}
        onClick={() => setShowDetails(!showDetails)}
        title="Clique para ver detalhes da conexão"
      >
        {getStatusIcon()}
        <span className="status-text">{getStatusText()}</span>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="status-details-content">
            <h4>{details.title}</h4>
            <p>{details.description}</p>
            <small>{details.action}</small>

            <div className="connection-info">
              <div className="info-item">
                <Wifi size={14} />
                <span>Internet: {isOnline ? 'Conectado' : 'Desconectado'}</span>
              </div>
              <div className="info-item">
                <User size={14} />
                <span>Login: {user ? user.email || 'Logado' : 'Não logado'}</span>
              </div>
              <div className="info-item">
                <Cloud size={14} />
                <span>Nuvem: {isFirebaseConnected ? 'Sincronizado' : 'Offline'}</span>
              </div>
            </div>

            <button
              className="close-details"
              onClick={() => setShowDetails(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}