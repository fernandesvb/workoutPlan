import { useState, useEffect, useRef } from 'react'
import { Trophy, Zap, Target, Clock, CheckCircle } from 'lucide-react'

export default function WorkoutProgress({
  day,
  workoutData,
  customExercises,
  onWorkoutComplete,
  onFinishWorkout
}) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
    estimatedTime: 0
  })

  const [autoFinished, setAutoFinished] = useState(false)
  const previousPercentageRef = useRef(0)

  useEffect(() => {
    calculateProgress()
  }, [day, workoutData, customExercises])

  // Resetar estado quando mudar de dia
  useEffect(() => {
    setAutoFinished(false)
    previousPercentageRef.current = 0
  }, [day])

  const calculateProgress = () => {
    const dayExercises = customExercises.filter(ex => ex.day === day)
    const total = dayExercises.length

    if (total === 0) {
      setProgress({ completed: 0, total: 0, percentage: 0, estimatedTime: 0 })
      return
    }

    let completed = 0
    let estimatedTime = 0

    dayExercises.forEach(exercise => {
      const isCompleted = workoutData[`${exercise.id}_completed`] === 'true'

      if (isCompleted) {
        completed++
      }
    })

    // Estimar tempo mais realista: 5-6 min por exercício (inclui descanso)
    estimatedTime = (total - completed) * 5

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Detectar se acabou de completar 100% dos exercícios
    const justCompleted = percentage === 100 && previousPercentageRef.current < 100

    setProgress({
      completed,
      total,
      percentage,
      estimatedTime
    })

    // Finalizar automaticamente quando completar todos os exercícios
    if (justCompleted && !autoFinished && onFinishWorkout) {
      setAutoFinished(true)
      // Delay pequeno para garantir que o último exercício foi salvo
      setTimeout(() => {
        onFinishWorkout(completed, total)
      }, 1000)
    }

    // Resetar flag se voltar a menos de 100%
    if (percentage < 100) {
      setAutoFinished(false)
    }

    // Atualizar referência da porcentagem anterior
    previousPercentageRef.current = percentage
  }

  const getProgressColor = () => {
    if (progress.percentage === 100) return '#10b981' // Verde
    if (progress.percentage >= 70) return '#f59e0b' // Amarelo
    if (progress.percentage >= 30) return '#3b82f6' // Azul
    return '#6b7280' // Cinza
  }

  const getMotivationalMessage = () => {
    if (progress.percentage === 100) return '🎉 Treino completo! Parabéns!'
    if (progress.percentage >= 70) return '🔥 Quase lá! Continue assim!'
    if (progress.percentage >= 30) return '💪 Bom ritmo! Mantenha o foco!'
    if (progress.percentage > 0) return '⚡ Começou bem! Vamos continuar!'
    return '🎯 Pronto para começar? Vamos treinar!'
  }

  if (progress.total === 0) {
    return (
      <div className="workout-progress empty">
        <div className="progress-icon">📝</div>
        <p>Nenhum exercício para hoje</p>
        <small>Adicione exercícios para começar</small>
      </div>
    )
  }

  return (
    <div className="workout-progress">
      <div className="progress-header">
        <div className="progress-title">
          <Target size={20} />
          <span>Progresso do Treino - Dia {day}</span>
        </div>
        <div className="progress-stats">
          {progress.completed}/{progress.total} exercícios
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress.percentage}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
        <span className="progress-percentage">{progress.percentage}%</span>
      </div>

      <div className="progress-info">
        <div className="info-item">
          <Clock size={16} />
          <span>
            {progress.estimatedTime > 0 
              ? `~${progress.estimatedTime} min restantes`
              : 'Treino finalizado!'
            }
          </span>
        </div>
        
        <div className="info-item">
          <Zap size={16} />
          <span>{getMotivationalMessage()}</span>
        </div>
      </div>

      <div className="workout-actions">
        {progress.completed > 0 && !autoFinished && (
          <button
            className="finish-workout-btn"
            onClick={() => onFinishWorkout && onFinishWorkout(progress.completed, progress.total)}
          >
            <CheckCircle size={20} />
            Finalizar Treino ({progress.completed}/{progress.total})
          </button>
        )}

        {progress.percentage === 100 && (
          <div className="completion-celebration">
            <Trophy size={24} />
            <span>
              {autoFinished
                ? '🎉 Treino finalizado automaticamente!'
                : 'Todos exercícios completados!'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}