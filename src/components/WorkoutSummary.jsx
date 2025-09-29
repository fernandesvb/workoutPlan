import { Trophy, Star, TrendingUp, X, CheckCircle } from 'lucide-react'

export default function WorkoutSummary({
  show,
  onClose,
  completed,
  total,
  xpGained,
  leveledUp,
  newLevel,
  day
}) {
  if (!show) return null

  const completionRate = Math.round((completed / total) * 100)

  const getCompletionMessage = () => {
    if (completionRate === 100) return '🏆 Treino Perfeito!'
    if (completionRate >= 80) return '🔥 Excelente Treino!'
    if (completionRate >= 60) return '💪 Bom Treino!'
    if (completionRate >= 40) return '👍 Treino Válido!'
    return '⭐ Todo exercício conta!'
  }

  const getMotivationalMessage = () => {
    if (completionRate === 100) return 'Você completou todos os exercícios! Parabéns pela disciplina!'
    if (completionRate >= 80) return 'Ótimo progresso! Você está no caminho certo!'
    if (completionRate >= 60) return 'Bom trabalho! Consistência é a chave do sucesso!'
    if (completionRate >= 40) return 'Cada passo conta! Continue assim!'
    return 'Você começou e isso já é uma vitória!'
  }

  return (
    <div className="modal show">
      <div className="modal-content workout-summary-modal">
        <div className="summary-header">
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="summary-icon">
            {completionRate === 100 ? (
              <Trophy size={48} color="#f59e0b" />
            ) : (
              <CheckCircle size={48} color="#10b981" />
            )}
          </div>

          <h2>{getCompletionMessage()}</h2>
          <p className="summary-subtitle">
            Treino do Dia {day} finalizado
          </p>
        </div>

        <div className="summary-stats">
          <div className="stat-card main-stat">
            <div className="stat-value">{completed}/{total}</div>
            <div className="stat-label">Exercícios Completados</div>
            <div className="stat-percentage">{completionRate}%</div>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-icon">
                <Star size={24} color="#f59e0b" />
              </div>
              <div className="stat-value">+{xpGained}</div>
              <div className="stat-label">XP Ganho</div>
            </div>

            {leveledUp && (
              <div className="stat-card level-up-stat">
                <div className="stat-icon">
                  <TrendingUp size={24} color="#8b5cf6" />
                </div>
                <div className="stat-value">Nível {newLevel}</div>
                <div className="stat-label">LEVEL UP!</div>
              </div>
            )}
          </div>
        </div>

        <div className="summary-message">
          <p>{getMotivationalMessage()}</p>
        </div>

        <div className="summary-actions">
          <button className="btn-primary large" onClick={onClose}>
            <CheckCircle size={20} />
            Continuar
          </button>
        </div>

        {leveledUp && (
          <div className="level-up-effect">
            <div className="sparkles">✨</div>
            <div className="sparkles">⭐</div>
            <div className="sparkles">✨</div>
          </div>
        )}
      </div>
    </div>
  )
}