import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function ProgressChart({ exercise, workoutData }) {
  const getHistory = () => {
    const history = JSON.parse(workoutData[`${exercise.id}_history`] || '[]')
    return history.slice(0, 5).reverse() // Últimos 5, ordem cronológica
  }

  const getPlaceholder = (type) => {
    switch (type) {
      case 'weight': return 'kg'
      case 'reps': return 'reps'
      case 'time': return 's'
      default: return ''
    }
  }

  const getTrend = (history) => {
    if (history.length < 2) return 'stable'
    
    const recent = parseFloat(history[history.length - 1].value) || 0
    const previous = parseFloat(history[history.length - 2].value) || 0
    
    if (recent > previous) return 'up'
    if (recent < previous) return 'down'
    return 'stable'
  }

  const getMaxValue = (history) => {
    if (history.length === 0) return 0
    return Math.max(...history.map(h => parseFloat(h.value) || 0))
  }

  const history = getHistory()
  const trend = getTrend(history)
  const maxValue = getMaxValue(history)

  if (history.length === 0) {
    return (
      <div className="progress-chart">
        <div className="chart-header">
          <span className="chart-title">📈 Progresso</span>
        </div>
        <div className="no-data">Nenhum treino registrado</div>
      </div>
    )
  }

  return (
    <div className="progress-chart">
      <div className="chart-header">
        <span className="chart-title">📈 Progresso</span>
        <div className={`trend-indicator ${trend}`}>
          {trend === 'up' && <TrendingUp size={14} />}
          {trend === 'down' && <TrendingDown size={14} />}
          {trend === 'stable' && <Minus size={14} />}
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-bars">
          {history.map((entry, index) => {
            const value = parseFloat(entry.value) || 0
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0
            
            return (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${entry.date}: ${entry.value} ${getPlaceholder(exercise.type)}`}
                >
                  <span className="bar-value">{entry.value}</span>
                </div>
                <span className="bar-date">{entry.date.split('/')[0]}/{entry.date.split('/')[1]}</span>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="chart-summary">
        <span className="summary-text">
          {history.length} treino{history.length > 1 ? 's' : ''} • 
          Último: {history[history.length - 1]?.value} {getPlaceholder(exercise.type)}
        </span>
      </div>
    </div>
  )
}