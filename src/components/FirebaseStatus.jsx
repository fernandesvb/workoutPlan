import { Cloud, Wifi, WifiOff } from 'lucide-react'

export default function FirebaseStatus({ status }) {
  if (status === 'connecting') return null

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Cloud size={16} />,
          text: '☁️ Firebase Conectado',
          className: 'connected'
        }
      case 'offline':
        return {
          icon: <WifiOff size={16} />,
          text: '💾 Modo Local',
          className: 'offline'
        }
      default:
        return {
          icon: <Wifi size={16} />,
          text: '🔄 Conectando...',
          className: ''
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`firebase-status ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  )
}