import { AlertCircle, Crown, TrendingUp } from 'lucide-react'
import { useSubscription } from '../hooks/useSubscription'

export default function UsageLimits({ userId, onUpgrade }) {
  const { subscription, usage, loading, isPremium, isBasic } = useSubscription(userId)

  if (loading || !userId) return null

  const showLimits = !isPremium()

  return (
    <div className="usage-limits">
      <div className="usage-header">
        <div className="usage-title">
          {isPremium() && <Crown size={16} className="premium-badge" />}
          <span>Plano {subscription?.plan?.name || 'Gratuito'}</span>
        </div>
        {!isPremium() && (
          <button className="btn-upgrade-small" onClick={onUpgrade}>
            <TrendingUp size={14} />
            Upgrade
          </button>
        )}
      </div>

      {showLimits && usage && (
        <div className="usage-stats">
          {Object.entries(usage).map(([key, data]) => {
            const percentage = (data.used / data.limit) * 100
            const isNearLimit = percentage >= 80
            
            return (
              <div key={key} className="usage-item">
                <div className="usage-info">
                  <span className="usage-label">{getLabelForAction(key)}</span>
                  <span className="usage-count">
                    {data.used}/{data.limit}
                  </span>
                </div>
                <div className="usage-bar">
                  <div 
                    className={`usage-fill ${isNearLimit ? 'near-limit' : ''}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isNearLimit && (
                  <div className="usage-warning">
                    <AlertCircle size={12} />
                    <span>Limite próximo</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getLabelForAction(action) {
  const labels = {
    workoutGeneration: 'Treinos',
    photoAnalysis: 'Fotos',
    exerciseSuggestions: 'Sugestões'
  }
  return labels[action] || action
}
