import { LogIn, LogOut, HardDrive } from 'lucide-react'

export default function AuthSection({ user, onSignIn, onSignOut, onEnableOffline }) {
  return (
    <div className="auth-section">
      <div className="auth-info">
        <span id="user-info">
          👤 {user ? (user.displayName || user.email) : 'Modo Local'}
        </span>
        <div className="auth-buttons">
          {!user && (
            <button className="auth-btn login" onClick={onSignIn}>
              <LogIn size={14} /> Login Google
            </button>
          )}
          {user && (
            <button className="auth-btn logout" onClick={onSignOut}>
              <LogOut size={14} /> Sair
            </button>
          )}
          <button className="auth-btn offline" onClick={onEnableOffline}>
            <HardDrive size={14} /> Offline
          </button>
        </div>
      </div>
    </div>
  )
}