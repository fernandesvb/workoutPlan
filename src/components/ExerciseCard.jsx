import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import ProgressChart from './ProgressChart'
import MuscleVisualization from './MuscleVisualization'
import { getExerciseIconInfo, getExerciseImage } from '../utils/exerciseIcons'

// Função para explicar exercícios
const getExerciseExplanation = (exerciseName) => {
  const name = exerciseName.toLowerCase()

  const explanations = {
    'elevação pélvica': 'Elevar quadril do chão - ativação e volume dos glúteos',
    'hip thrust': 'Empurrar quadril para cima - força nos glúteos',
    'ponte': 'Elevar quadril do chão - ativação dos glúteos',
    'supino reto': 'Empurrar peso no banco reto - força e definição',
    'supino inclinado': 'Empurrar peso no banco inclinado - parte superior',
    'supino declinado': 'Empurrar peso no banco declinado - parte inferior',
    'desenvolvimento': 'Empurrar peso acima da cabeça - força nos deltoides',
    'supino': 'Empurrar peso deitado no banco',
    'agachamento': 'Descer e subir flexionando joelhos - força nas pernas',
    'remada': 'Puxar peso em direção ao corpo - espessura das costas',
    'rosca': 'Flexionar braços com peso - volume dos bíceps',
    'tríceps testa': 'Estender braços acima da cabeça - cabeça lateral',
    'tríceps pulley': 'Empurrar cabo para baixo - definição',
    'tríceps': 'Estender braços contra resistência',
    'prancha': 'Manter posição estática - resistência do core',
    'afundo': 'Dar passo à frente e flexionar - equilíbrio e força',
    'crucifixo': 'Abrir e fechar braços com peso - abertura do peitoral',
    'elevação lateral': 'Levantar peso pelos lados - deltoides laterais',
    'elevação frontal': 'Levantar peso à frente - deltoides anteriores',
    'elevação': 'Levantar peso lateralmente',
    'flexão': 'Empurrar o próprio corpo do chão - força funcional',
    'abdominal': 'Contrair músculos do abdome - definição',
    'burpee': 'Exercício cardio completo - resistência',
    'leg press': 'Empurrar peso com as pernas - força e volume',
    'puxada': 'Puxar barra em direção ao peito - largura das costas',
    'stiff': 'Flexionar quadril com pernas retas - posterior de coxa',
    'panturrilha': 'Elevar-se na ponta dos pés - força nas panturrilhas'
  }

  for (const [key, explanation] of Object.entries(explanations)) {
    if (name.includes(key)) {
      return explanation
    }
  }

  return 'Movimento de força e condicionamento'
}

export default function ExerciseCard({ exercise, workoutData, onWorkoutChange, onRemove, isCustom = false }) {
  // Verificar se foi completado hoje
  const today = new Date().toLocaleDateString('pt-BR')
  const history = JSON.parse(workoutData[`${exercise.id}_history`] || '[]')
  const isCompletedToday = history.length > 0 && history[0].date === today
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
      className={`exercise-card ${exercise.category === 'core' ? 'core' : ''} ${isCompletedToday ? 'completed' : ''}`}
      data-exercise-id={exercise.id}
      style={{ transition: 'all 0.2s ease' }}
    >
      <div className="exercise-header">
        <div className="exercise-title-row">
          <div className="exercise-name">{exercise.name}</div>
          <div className="series-container">
            <span className="series-info">{exercise.series}</span>
            {isCompletedToday && (
              <div className="completion-check" title="Exercício concluído hoje!">
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

        <div className="exercise-details">
          <div className="exercise-image-container">
            <MuscleVisualization exerciseName={exercise.name} />
            <div className="exercise-category-badge">
              {getExerciseIconInfo(exercise).name}
            </div>
          </div>
          <div className="exercise-info">
            <div className="exercise-explanation">{getExerciseExplanation(exercise.name)}</div>
            {exercise.equipment && exercise.equipment.length > 0 && (
              <div className="exercise-equipment">
                <strong>🏋️ Equipamento:</strong> {exercise.equipment.join(' ou ')}
              </div>
            )}
            {exercise.notes && (
              <div className="exercise-notes">{exercise.notes}</div>
            )}
          </div>
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
              disabled={isSaving}
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
                  const existingHistory = JSON.parse(workoutData[historyKey] || '[]')
                  
                  // Verificar se já existe registro para hoje
                  const todayIndex = existingHistory.findIndex(entry => entry.date === today)
                  
                  let updatedHistory
                  if (todayIndex >= 0) {
                    // Atualizar registro existente de hoje
                    updatedHistory = [...existingHistory]
                    updatedHistory[todayIndex] = { date: today, value: currentValue }
                  } else {
                    // Adicionar novo registro
                    updatedHistory = [{ date: today, value: currentValue }, ...existingHistory]
                  }

                  // Salvar dados (histórico ilimitado)
                  onWorkoutChange(historyKey, JSON.stringify(updatedHistory))
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
                          const nextInput = nextCard.querySelector('.current-input')
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
              {isSaving ? '⏳' : isCompletedToday ? '✅' : '💾'}
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