import { X } from 'lucide-react'
import ProgressChart from './ProgressChart'

export default function ExerciseCard({ exercise, workoutData, onWorkoutChange, onRemove, isCustom = false }) {
  const getPlaceholder = (type) => {
    switch (type) {
      case 'weight': return 'kg'
      case 'reps': return 'reps'
      case 'time': return 'seg'
      default: return 'valor'
    }
  }

  const getInputType = (type) => {
    return type === 'weight' ? 'number' : 'text'
  }

  const getStep = (type) => {
    return type === 'weight' ? '2.5' : undefined
  }

  const handleInputChange = (session, value) => {
    const key = session === 'current' ? `${exercise.id}_current` : `${exercise.id}_w${session}`
    onWorkoutChange(key, value)
  }

  const handleRemove = () => {
    if (confirm(`Remover exercício "${exercise.name}"?`)) {
      onRemove(exercise.id)
    }
  }

  return (
    <div className={`exercise-card ${exercise.category === 'core' ? 'core' : ''}`}>
      <div className="exercise-header">
        <div className="exercise-info">
          <div className="exercise-name">{exercise.name}</div>
          {exercise.notes && (
            <div className="exercise-notes">{exercise.notes}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="series-info">{exercise.series}</span>
          {isCustom && (
            <button
              onClick={handleRemove}
              className="remove-btn"
              title="Remover exercício"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="exercise-tracking">
        <div className="current-session">
          <label className="session-label">{exercise.name}</label>
          <div className="session-inputs">
            <input
              type={getInputType(exercise.type)}
              step={getStep(exercise.type)}
              placeholder={getPlaceholder(exercise.type)}
              value={workoutData[`${exercise.id}_current`] || ''}
              onChange={(e) => handleInputChange('current', e.target.value)}
              className="current-input"
            />
            <button 
              className="save-btn"
              onClick={() => {
                const currentValue = workoutData[`${exercise.id}_current`]
                if (currentValue) {
                  const today = new Date().toLocaleDateString('pt-BR')
                  const historyKey = `${exercise.id}_history`
                  const history = JSON.parse(workoutData[historyKey] || '[]')
                  history.unshift({ date: today, value: currentValue })
                  onWorkoutChange(historyKey, JSON.stringify(history.slice(0, 5)))
                  onWorkoutChange(`${exercise.id}_current`, '')
                  alert('✅ Treino salvo!')
                }
              }}
            >
              💾
            </button>
          </div>
        </div>
        
        <ProgressChart exercise={exercise} workoutData={workoutData} />
      </div>
    </div>
  )
}