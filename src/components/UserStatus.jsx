import { useState, useEffect } from 'react'
import { Star, Award, Flame, TrendingUp, X } from 'lucide-react'
import { useGamification } from '../hooks/useGamification'

export default function UserStatus({ onBadgeEarned }) {
  const { 
    userStats, 
    getLevelInfo, 
    getCurrentLevelProgress, 
    getXpForNextLevel,
    getBadgeInfo 
  } = useGamification()
  
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showNewBadges, setShowNewBadges] = useState([])

  const currentLevel = getLevelInfo(userStats.level)
  const nextLevel = getLevelInfo(userStats.level + 1)
  const progressPercentage = getCurrentLevelProgress()
  const xpForNext = getXpForNextLevel()

  useEffect(() => {
    // Escutar eventos de level up e badges
    const handleLevelUp = (event) => {
      setShowLevelUp(true)
      // Auto-fechar após 10 segundos se usuário não interagir
      setTimeout(() => setShowLevelUp(false), 10000)
    }

    const handleNewBadge = (event) => {
      setShowNewBadges(event.detail.badges)
      // Auto-fechar após 12 segundos se usuário não interagir
      setTimeout(() => setShowNewBadges([]), 12000)
      if (onBadgeEarned) onBadgeEarned(event.detail.badges)
    }

    window.addEventListener('levelUp', handleLevelUp)
    window.addEventListener('newBadges', handleNewBadge)

    return () => {
      window.removeEventListener('levelUp', handleLevelUp)
      window.removeEventListener('newBadges', handleNewBadge)
    }
  }, [onBadgeEarned])

  // Adicionar suporte para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showLevelUp) setShowLevelUp(false)
        if (showNewBadges.length > 0) setShowNewBadges([])
      }
    }

    if (showLevelUp || showNewBadges.length > 0) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showLevelUp, showNewBadges])

  return (
    <div className="user-status">
      <div className="status-header">
        <div className="level-info">
          <div className="level-badge" style={{ backgroundColor: currentLevel.color }}>
            <Star size={16} />
            <span>Nível {userStats.level}</span>
          </div>
          <div className="level-name">{currentLevel.name}</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-item">
            <Flame size={16} />
            <div className="stat-content">
              <span className="stat-value">{userStats.streak}</span>
              <span className="stat-label">Sequência</span>
            </div>
          </div>
          
          <div className="stat-item">
            <TrendingUp size={16} />
            <div className="stat-content">
              <span className="stat-value">{userStats.totalWorkouts}</span>
              <span className="stat-label">Treinos</span>
            </div>
          </div>
          
          <div className="stat-item">
            <Award size={16} />
            <div className="stat-content">
              <span className="stat-value">{userStats.badges.length}</span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="xp-progress">
        <div className="xp-info">
          <span className="xp-current">{userStats.xp} XP</span>
          {nextLevel && (
            <span className="xp-next">
              {xpForNext - Math.floor(progressPercentage * xpForNext / 100)} XP para {nextLevel.name}
            </span>
          )}
        </div>
        
        <div className="xp-bar">
          <div 
            className="xp-fill" 
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: currentLevel.color
            }}
          />
        </div>
      </div>

      {userStats.badges.length > 0 && (
        <div className="badges-preview">
          <h4>Conquistas Recentes</h4>
          <div className="badges-list">
            {userStats.badges.slice(-3).map(badgeId => {
              const badge = getBadgeInfo(badgeId)
              return (
                <div key={badgeId} className="badge-item" title={badge.desc}>
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Animações de conquistas */}
      {showLevelUp && (
        <div className="level-up-animation" onClick={() => setShowLevelUp(false)}>
          <div className="level-up-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-achievement"
              onClick={() => setShowLevelUp(false)}
              title="Fechar"
            >
              <X size={16} />
            </button>
            <Star size={32} />
            <h3>LEVEL UP!</h3>
            <p>Nível {userStats.level} - {currentLevel.name}</p>
            <button
              className="achievement-ok-btn"
              onClick={() => setShowLevelUp(false)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {showNewBadges.length > 0 && (
        <div className="badge-animation" onClick={() => setShowNewBadges([])}>
          <div className="badge-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-achievement"
              onClick={() => setShowNewBadges([])}
              title="Fechar"
            >
              <X size={16} />
            </button>
            <Award size={32} />
            <h3>Nova Conquista!</h3>
            {showNewBadges.map(badge => (
              <div key={badge.id} className="new-badge">
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
            <button
              className="achievement-ok-btn"
              onClick={() => setShowNewBadges([])}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}