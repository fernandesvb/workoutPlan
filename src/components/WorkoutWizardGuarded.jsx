import { useState } from 'react'
import WorkoutWizard from './WorkoutWizard'
import { useSubscription } from '../hooks/useSubscription'
import { AlertCircle, Crown } from 'lucide-react'

export default function WorkoutWizardGuarded({ userId, onWorkoutGenerated, onClose, onUpgrade }) {
  const { canUseFeature, useFeature, isPremium } = useSubscription(userId)
  const [limitError, setLimitError] = useState(null)
  const [canProceed, setCanProceed] = useState(null)

  useState(() => {
    checkLimit()
  }, [])

  async function checkLimit() {
    const check = await canUseFeature('workoutGeneration')
    setCanProceed(check.allowed)
    if (!check.allowed) {
      setLimitError(check.reason)
    }
  }

  async function handleWorkoutGenerated(workout, formData) {
    const success = await useFeature('workoutGeneration')
    if (success) {
      onWorkoutGenerated(workout, formData)
    } else {
      setLimitError('Limite de treinos atingido')
    }
  }

  if (canProceed === null) {
    return (
      <div className="modal show">
        <div className="modal-content">
          <div className="loading-state">
            <span className="loading"></span>
            <p>Verificando limites...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!canProceed) {
    return (
      <div className="modal show">
        <div className="modal-content limit-modal">
          <div className="limit-header">
            <AlertCircle size={48} className="limit-icon" />
            <h2>Limite Atingido</h2>
            <p>{limitError}</p>
          </div>

          <div className="limit-upgrade">
            <div className="upgrade-benefits">
              <h3>Faça upgrade e tenha:</h3>
              <ul>
                <li>✨ 2 treinos novos por semana</li>
                <li>📷 10 fotos de equipamentos por treino</li>
                <li>💡 3 sugestões de IA por dia</li>
                <li>📊 Histórico ilimitado</li>
              </ul>
            </div>

            <div className="upgrade-actions">
              <button className="btn-secondary" onClick={onClose}>
                Voltar
              </button>
              <button className="btn-primary" onClick={onUpgrade}>
                <Crown size={20} />
                Ver Planos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WorkoutWizard
      onWorkoutGenerated={handleWorkoutGenerated}
      onClose={onClose}
    />
  )
}
