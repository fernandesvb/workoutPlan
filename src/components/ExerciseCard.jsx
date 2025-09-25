import { X } from 'lucide-react'

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

  const handleInputChange = (week, value) => {
    const key = `${exercise.id}_w${week}`
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
        <span className="exercise-name">{exercise.name}</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="series-info">{exercise.series}</span>
          {isCustom && (
            <button
              onClick={handleRemove}
              style={{
                background: '#f56565',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '0.7em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Remover exercício"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      
      {exercise.notes && (
        <div style={{
          fontSize: '0.8em',
          color: '#666',
          marginBottom: '8px',
          fontStyle: 'italic'
        }}>
          {exercise.notes}
        </div>
      )}
      
      <div className="weight-tracking">
        {[1, 2, 3, 4].map(week => (
          <div key={week} className="week-input">
            <label className="week-label">Sem {week}</label>
            <input
              type={getInputType(exercise.type)}
              step={getStep(exercise.type)}
              placeholder={getPlaceholder(exercise.type)}
              value={workoutData[`${exercise.id}_w${week}`] || ''}
              onChange={(e) => handleInputChange(week, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}