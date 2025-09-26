import { useState, useEffect } from 'react'
import { Trophy, Zap, Target, Clock } from 'lucide-react'

export default function WorkoutProgress({ 
  day, 
  workoutData, 
  customExercises, 
  onWorkoutComplete 
}) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
    estimatedTime: 0
  })

  useEffect(() => {
    calculateProgress()
  }, [day, workoutData, customExercises])

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
      const exerciseData = workoutData[`${exercise.id}_current`] // Dados atuais
      
      if (exerciseData && exerciseData.trim() !== '') {
        completed++
      }
    })
    
    // Estimar tempo apenas para exercícios restantes (3 min por exercício)
    estimatedTime = (total - completed) * 3

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    setProgress({
      completed,
      total,
      percentage,
      estimatedTime
    })

    // Notificar se treino foi completado
    if (completed === total && total > 0 && onWorkoutComplete) {
      onWorkoutComplete(completed, total)
    }
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

      {progress.percentage === 100 && (
        <div className="completion-celebration">
          <Trophy size={24} />
          <span>Treino do Dia {day} Completo!</span>
        </div>
      )}
    </div>
  )
}