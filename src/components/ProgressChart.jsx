import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'

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

  const getMinValue = (history) => {
    if (history.length === 0) return 0
    return Math.min(...history.map(h => parseFloat(h.value) || 0))
  }

  const getPercentageChange = (history) => {
    if (history.length < 2) return 0
    const recent = parseFloat(history[history.length - 1].value) || 0
    const first = parseFloat(history[0].value) || 0
    if (first === 0) return 0
    return (((recent - first) / first) * 100).toFixed(1)
  }

  const history = getHistory()
  const trend = getTrend(history)
  const maxValue = getMaxValue(history)
  const minValue = getMinValue(history)
  const percentageChange = getPercentageChange(history)

  if (history.length === 0) {
    return (
      <div className="progress-chart-modern">
        <div className="chart-empty">
          <Activity size={24} strokeWidth={1.5} />
          <span>Nenhum treino registrado</span>
        </div>
      </div>
    )
  }

  return (
    <div className="progress-chart-modern">
      <div className="chart-stats-grid">
        <div className="stat-card">
          <div className="stat-label">Atual</div>
          <div className="stat-value">{history[history.length - 1]?.value}</div>
          <div className="stat-unit">{getPlaceholder(exercise.type)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Máximo</div>
          <div className="stat-value highlight">{maxValue}</div>
          <div className="stat-unit">{getPlaceholder(exercise.type)}</div>
        </div>

        <div className="stat-card">
          <div className={`stat-label trend-${trend}`}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'stable' && <Minus size={12} />}
            Evolução
          </div>
          <div className={`stat-value trend-${trend}`}>
            {percentageChange > 0 ? '+' : ''}{percentageChange}%
          </div>
          <div className="stat-unit">{history.length} treinos</div>
        </div>
      </div>

      <div className="chart-visual">
        <div className="chart-line-container">
          <svg viewBox="0 0 300 80" className="chart-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={(() => {
                const range = maxValue - minValue || 1
                const points = history.map((entry, i) => {
                  const x = (i / Math.max(history.length - 1, 1)) * 300
                  const value = parseFloat(entry.value) || 0
                  const y = 70 - ((value - minValue) / range) * 60
                  return `${x},${y}`
                }).join(' L ')
                return `M ${points} L 300,80 L 0,80 Z`
              })()}
              fill="url(#areaGradient)"
            />

            {/* Line */}
            <path
              d={(() => {
                const range = maxValue - minValue || 1
                const points = history.map((entry, i) => {
                  const x = (i / Math.max(history.length - 1, 1)) * 300
                  const value = parseFloat(entry.value) || 0
                  const y = 70 - ((value - minValue) / range) * 60
                  return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                }).join(' ')
                return points
              })()}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {history.map((entry, i) => {
              const range = maxValue - minValue || 1
              const x = (i / Math.max(history.length - 1, 1)) * 300
              const value = parseFloat(entry.value) || 0
              const y = 70 - ((value - minValue) / range) * 60

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#fff"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="chart-point-hover"
                  />
                </g>
              )
            })}
          </svg>
        </div>

        <div className="chart-labels">
          {history.map((entry, i) => (
            <div key={i} className="chart-label-item">
              <span className="label-date">{entry.date.split('/')[0]}/{entry.date.split('/')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}