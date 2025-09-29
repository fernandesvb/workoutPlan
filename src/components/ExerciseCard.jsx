import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import ProgressChart from './ProgressChart'
import { getExerciseIconInfo, getExerciseImage } from '../utils/exerciseIcons'

// Função para explicar exercícios
const getExerciseExplanation = (exerciseName) => {
  const name = exerciseName.toLowerCase()
  
  const explanations = {
    'desenvolvimento': 'Exercício para ombros - empurrar peso acima da cabeça',
    'supino': 'Exercício para peito - empurrar peso deitado no banco',
    'agachamento': 'Exercício para pernas - descer e subir flexionando joelhos',
    'remada': 'Exercício para costas - puxar peso em direção ao corpo',
    'rosca': 'Exercício para bíceps - flexionar braços com peso',
    'tríceps': 'Exercício para tríceps - estender braços contra resistência',
    'prancha': 'Exercício para core - manter posição estática',
    'afundo': 'Exercício para pernas - dar passo à frente e flexionar',
    'crucifixo': 'Exercício para peito - abrir e fechar braços com peso',
    'elevação': 'Exercício para ombros - levantar peso lateralmente',
    'flexão': 'Exercício para peito - empurrar o próprio corpo do chão',
    'abdominal': 'Exercício para core - contrair músculos do abdome',
    'ponte': 'Exercício para glúteos - elevar quadril do chão',
    'burpee': 'Exercício cardío - combinação de movimentos dinâmicos',
    'leg press': 'Exercício para pernas - empurrar peso com as pernas',
    'puxada': 'Exercício para costas - puxar barra em direção ao peito',
    'stiff': 'Exercício para posterior de coxa - flexionar quadril',
    'panturrilha': 'Exercício para panturrilha - elevar-se na ponta dos pés'
  }
  
  for (const [key, explanation] of Object.entries(explanations)) {
    if (name.includes(key)) {
      return explanation
    }
  }
  
  return 'Exercício de força e condicionamento físico'
}

export default function ExerciseCard({ exercise, workoutData, onWorkoutChange, onRemove, isCustom = false }) {
  const isCompleted = workoutData[`${exercise.id}_completed`] === 'true'
  const [isSaving, setIsSaving] = useState(false)
  const [imageError, setImageError] = useState(false)
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleRemove = () => {
    setShowDeleteConfirm(true)
  }

  const confirmRemove = () => {
    onRemove(exercise.id)
    setShowDeleteConfirm(false)
  }

  const cancelRemove = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div
      className={`exercise-card ${exercise.category === 'core' ? 'core' : ''} ${isCompleted ? 'completed' : ''}`}
      data-exercise-id={exercise.id}
      style={{ transition: 'all 0.2s ease' }}
    >
      <div className="exercise-header">
        <div className="exercise-icon-info">
          <div className="exercise-image-container">
            {!imageError ? (
              <img
                src={getExerciseImage(exercise.name)}
                alt={exercise.name}
                className="exercise-image"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div
                className="exercise-icon-fallback"
                style={{ backgroundColor: getExerciseIconInfo(exercise).color }}
              >
                {getExerciseIconInfo(exercise).icon}
              </div>
            )}
            <div className="exercise-category-badge">
              {getExerciseIconInfo(exercise).name}
            </div>
          </div>
          <div className="exercise-info">
            <div className="exercise-name">{exercise.name}</div>
            <div className="exercise-explanation">{getExerciseExplanation(exercise.name)}</div>
            {exercise.notes && (
              <div className="exercise-notes">{exercise.notes}</div>
            )}
          </div>
        </div>
        <div className="series-container">
          <span className="series-info">{exercise.series}</span>
          {isCompleted && (
            <div className="completion-check" title="Exercício concluído!">
              ✅
            </div>
          )}
          {isCustom && (
            <button
              onClick={handleRemove}
              className="remove-btn ultra-modern-delete-btn"
              title="Remover exercício"
            >
              <div className="delete-icon-wrapper">
                <Trash2 size={14} />
              </div>
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
              disabled={isSaving || isCompleted}
              onClick={async () => {
                if (isSaving) return

                const currentValue = workoutData[`${exercise.id}_current`]
                if (!currentValue || currentValue.trim() === '') {
                  alert('⚠️ Digite um valor antes de salvar!')
                  return
                }

                setIsSaving(true)

                try {
                  const today = new Date().toLocaleDateString('pt-BR')
                  const historyKey = `${exercise.id}_history`
                  const history = JSON.parse(workoutData[historyKey] || '[]')
                  history.unshift({ date: today, value: currentValue })

                  // Salvar dados
                  onWorkoutChange(historyKey, JSON.stringify(history.slice(0, 5)))
                  onWorkoutChange(`${exercise.id}_completed`, 'true')
                  onWorkoutChange(`${exercise.id}_current`, '')

                  // Disparar evento após pequeno delay para evitar conflitos
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('exerciseCompleted', {
                      detail: { exerciseId: exercise.id, exerciseName: exercise.name }
                    }))
                  }, 100)

                  // Navegar automaticamente para o próximo exercício
                  setTimeout(() => {
                    const allExerciseCards = document.querySelectorAll('.exercise-card')
                    const currentIndex = Array.from(allExerciseCards).findIndex(card =>
                      card.querySelector('.exercise-name')?.textContent === exercise.name
                    )

                    // Procurar próximo exercício não completado
                    for (let i = currentIndex + 1; i < allExerciseCards.length; i++) {
                      const nextCard = allExerciseCards[i]
                      const isNextCompleted = nextCard.classList.contains('completed')

                      if (!isNextCompleted) {
                        // Scroll suave para o próximo exercício
                        nextCard.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center'
                        })

                        // Foco no input do próximo exercício após scroll
                        setTimeout(() => {
                          const nextInput = nextCard.querySelector('.workout-input')
                          if (nextInput) {
                            nextInput.focus()
                          }
                        }, 500)
                        break
                      }
                    }
                  }, 600)

                  // Mostrar feedback visual mais sutil (sem bloquear o fluxo)
                  const exerciseElement = document.querySelector(`[data-exercise-id="${exercise.id}"]`)
                  if (exerciseElement) {
                    exerciseElement.style.transform = 'scale(0.98)'
                    exerciseElement.style.opacity = '0.7'
                    setTimeout(() => {
                      exerciseElement.style.transform = 'scale(1)'
                      exerciseElement.style.opacity = '1'
                    }, 200)
                  }
                } catch (error) {
                  console.error('Erro ao salvar:', error)
                  alert('❌ Erro ao salvar. Tente novamente.')
                } finally {
                  setTimeout(() => setIsSaving(false), 500)
                }
              }}
            >
              {isSaving ? '⏳' : isCompleted ? '✅' : '💾'}
            </button>
          </div>
        </div>
        
        <ProgressChart exercise={exercise} workoutData={workoutData} />
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={cancelRemove}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <div className="warning-icon-container">
                <AlertTriangle size={24} />
              </div>
              <h3>Remover Exercício</h3>
            </div>
            <div className="delete-confirm-content">
              <p>Tem certeza que deseja remover o exercício <strong>"{exercise.name}"</strong>?</p>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="delete-confirm-actions">
              <button
                onClick={cancelRemove}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRemove}
                className="btn-delete"
              >
                <Trash2 size={16} />
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}