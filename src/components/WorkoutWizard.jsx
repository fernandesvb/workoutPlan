import { useState } from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Target, Clock, Dumbbell, Calendar } from 'lucide-react'

export default function WorkoutWizard({ onWorkoutGenerated, onClose }) {
  const [step, setStep] = useState(1)
  const totalSteps = 6
  const [formData, setFormData] = useState({
    goals: [],
    daysPerWeek: '',
    experience: '',
    timeAvailable: '',
    equipment: '',
    limitations: ''
  })
  const [previewWorkout, setPreviewWorkout] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customEquipments, setCustomEquipments] = useState('')
  const [equipmentPhotos, setEquipmentPhotos] = useState([])
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false)

  const goals = [
    { id: 'lose_weight', label: 'Emagrecer', icon: '🔥', desc: 'Queimar gordura e definir' },
    { id: 'gain_muscle', label: 'Ganhar Massa', icon: '💪', desc: 'Hipertrofia muscular' },
    { id: 'tone', label: 'Definir', icon: '✨', desc: 'Tonificar e esculpir' },
    { id: 'fitness', label: 'Condicionamento', icon: '⚡', desc: 'Melhorar resistência' },
    { id: 'strength', label: 'Força', icon: '🏋️', desc: 'Aumentar força máxima' },
    { id: 'flexibility', label: 'Flexibilidade', icon: '🧘', desc: 'Melhorar mobilidade' }
  ]

  const daysOptions = [
    { id: '2', label: '2 dias', desc: 'Iniciante ou pouco tempo' },
    { id: '3', label: '3 dias', desc: 'Padrão recomendado' },
    { id: '4', label: '4 dias', desc: 'Intermediário' },
    { id: '5', label: '5 dias', desc: 'Avançado' },
    { id: '6', label: '6 dias', desc: 'Máximo recomendado' }
  ]

  const experiences = [
    { id: 'beginner', label: 'Iniciante', desc: 'Pouca ou nenhuma experiência' },
    { id: 'intermediate', label: 'Intermediário', desc: '6 meses a 2 anos' },
    { id: 'advanced', label: 'Avançado', desc: 'Mais de 2 anos' }
  ]

  const times = [
    { id: '20', label: '20 min', desc: 'Treino rápido' },
    { id: '30', label: '30 min', desc: 'Treino padrão' },
    { id: '45', label: '45 min', desc: 'Treino completo' },
    { id: '60', label: '60 min', desc: 'Treino intenso' }
  ]

  const equipments = [
    { id: 'gym', label: 'Academia', desc: 'Acesso completo' },
    { id: 'home_full', label: 'Casa Completa', desc: 'Halteres, barras, etc' },
    { id: 'home_basic', label: 'Casa Básica', desc: 'Poucos equipamentos' },
    { id: 'bodyweight', label: 'Peso Corporal', desc: 'Sem equipamentos' },
    { id: 'custom', label: 'Personalizado', desc: 'Descrever ou fotografar' }
  ]

  const handleSelect = (field, value) => {
    if (field === 'goals') {
      setFormData(prev => {
        const currentGoals = prev.goals || []
        const isSelected = currentGoals.includes(value)
        const newGoals = isSelected 
          ? currentGoals.filter(g => g !== value)
          : [...currentGoals, value]
        return { ...prev, goals: newGoals }
      })
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const nextStep = async () => {
    if (step === 5) {
      // Gerar preview antes do último step
      await generatePreview()
    }
    if (step < totalSteps) setStep(step + 1)
  }

  const generatePreview = async () => {
    setIsGenerating(true)
    try {
      const goalLabels = formData.goals.map(g => goals.find(goal => goal.id === g)?.label).join(' + ')
      
      const exerciseCount = getExerciseCount()
      
      const getDayPlan = () => {
        const days = parseInt(formData.daysPerWeek)
        if (days === 2) return 'Dia 1: Corpo Superior | Dia 2: Corpo Inferior'
        if (days === 3) return 'Dia 1: Peito/Tríceps | Dia 2: Costas/Bíceps | Dia 3: Pernas/Glúteos'
        if (days === 4) return 'Dia 1: Peito/Tríceps | Dia 2: Costas/Bíceps | Dia 3: Pernas/Glúteos | Dia 4: Ombros/Core'
        if (days === 5) return 'Dia 1: Peito/Tríceps | Dia 2: Costas/Bíceps | Dia 3: Pernas | Dia 4: Ombros | Dia 5: Braços/Core'
        return 'Dia 1: Peito/Tríceps | Dia 2: Costas/Bíceps | Dia 3: Pernas | Dia 4: Ombros | Dia 5: Braços | Dia 6: Core/Cardio'
      }
      
      const prompt = `Você é um personal trainer. Crie um treino:

Objetivos: ${goalLabels}
Experiência: ${experiences.find(e => e.id === formData.experience)?.label}
Tempo: ${formData.timeAvailable}min
Dias: ${formData.daysPerWeek}

Responda APENAS JSON:
{
  "workoutPlan": {"name": "Programa", "description": "Treino", "explanation": "Breve", "tips": ["Dica1"]},
  "exercises": [{"name": "Ex", "day": 1, "series": "3x12", "type": "weight", "category": "chest", "notes": "Nota"}]
}`

      // Logs removidos para produção
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('Erro na API')

      const result = await response.json()
      
      // Se a IA não retornou exercícios suficientes, gerar manualmente
      if (!result.exercises || result.exercises.length < parseInt(formData.daysPerWeek) * exerciseCount) {
        result.exercises = generateFallbackExercises()
        
        // Adicionar explicação manual se IA não gerou
        if (!result.workoutPlan) {
          result.workoutPlan = {
            name: `Programa ${goalLabels}`,
            description: `Treino profissional ${formData.daysPerWeek}x por semana`,
            explanation: 'Estruturei seu treino com base nos seus objetivos, dividindo os grupos musculares para otimizar recuperação e resultados.',
            tips: ['Descanse 24h entre treinos do mesmo grupo', 'Aumente carga progressivamente', 'Foque na execução correta']
          }
        }
      }
      
      setPreviewWorkout(result)
      
    } catch (error) {
      alert('Erro ao gerar preview. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const analyzeEquipmentPhotos = async (files) => {
    setAnalyzingPhoto(true)
    try {
      let allEquipments = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const base64 = await convertToBase64(file)
        
        const prompt = `Liste apenas: Nome do equipamento - Exercícios possíveis (separados por vírgula)`

        try {
          const response = await fetch('/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              prompt,
              image: base64
            })
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.response && result.response.trim() && !result.response.includes('identificados na imagem')) {
              allEquipments.push(`Foto ${i + 1}: ${result.response.trim()}`)
            } else {
              allEquipments.push(`Foto ${i + 1}: Não foi possível identificar equipamentos`)
            }
          } else {
            allEquipments.push(`Foto ${i + 1}: Erro na análise`)
          }
        } catch (error) {
          console.error('Erro na foto', i + 1, ':', error)
          allEquipments.push(`Foto ${i + 1}: Erro ao processar - descreva manualmente`)
        }
      }
      
      const combinedEquipments = allEquipments.join('\n')
      setCustomEquipments(combinedEquipments || 'Descreva manualmente seus equipamentos no campo acima')
      
    } catch (error) {
      alert('Erro ao analisar fotos. Tente descrever manualmente.')
    } finally {
      setAnalyzingPhoto(false)
    }
  }
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setEquipmentPhotos(prev => [...prev, ...files])
      analyzeEquipmentPhotos([...equipmentPhotos, ...files])
    }
  }
  
  const getPortugueseGroupName = (group) => {
    const translations = {
      'chest': 'Foco no peito - força e definição',
      'back': 'Foco nas costas - postura e força',
      'legs': 'Foco nas pernas - potência e resistência',
      'shoulders': 'Foco nos ombros - estabilidade e força',
      'biceps': 'Foco no bíceps - definição dos braços',
      'triceps': 'Foco no tríceps - força dos braços',
      'glutes': 'Foco nos glúteos - potência e forma',
      'core': 'Foco no core - estabilidade e equilíbrio'
    }
    return translations[group] || 'Exercício de força'
  }
  
  const generateFallbackExercises = () => {
    const exerciseCount = getExerciseCount()
    const daysCount = parseInt(formData.daysPerWeek)
    
    // Planos de treino por número de dias
    const workoutPlans = {
      2: [
        { day: 1, focus: ['chest', 'shoulders', 'triceps', 'core'] },
        { day: 2, focus: ['back', 'legs', 'biceps', 'glutes'] }
      ],
      3: [
        { day: 1, focus: ['chest', 'triceps', 'shoulders'] },
        { day: 2, focus: ['back', 'biceps', 'core'] },
        { day: 3, focus: ['legs', 'glutes', 'core'] }
      ],
      4: [
        { day: 1, focus: ['chest', 'triceps'] },
        { day: 2, focus: ['back', 'biceps'] },
        { day: 3, focus: ['legs', 'glutes'] },
        { day: 4, focus: ['shoulders', 'core'] }
      ],
      5: [
        { day: 1, focus: ['chest', 'triceps'] },
        { day: 2, focus: ['back', 'biceps'] },
        { day: 3, focus: ['legs', 'glutes'] },
        { day: 4, focus: ['shoulders', 'core'] },
        { day: 5, focus: ['biceps', 'triceps', 'core'] }
      ],
      6: [
        { day: 1, focus: ['chest', 'triceps'] },
        { day: 2, focus: ['back', 'biceps'] },
        { day: 3, focus: ['legs', 'glutes'] },
        { day: 4, focus: ['shoulders', 'core'] },
        { day: 5, focus: ['biceps', 'triceps'] },
        { day: 6, focus: ['core', 'legs'] }
      ]
    }
    
    const exerciseBank = {
      chest: ['Supino Reto', 'Flexão de Braço', 'Crucifixo', 'Supino Inclinado'],
      back: ['Remada Curvada', 'Puxada Frontal', 'Remada Unilateral', 'Pull-up'],
      legs: ['Agachamento', 'Leg Press', 'Afundo', 'Stiff'],
      shoulders: ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Remada Alta'],
      biceps: ['Rosca Direta', 'Rosca Martelo', 'Rosca Concentrada', 'Rosca 21'],
      triceps: ['Tríceps Pulley', 'Tríceps Testa', 'Mergulho', 'Tríceps Coice'],
      glutes: ['Ponte Glúteo', 'Hip Thrust', 'Agachamento Sumo', 'Elevação Pélvica'],
      core: ['Prancha', 'Abdominal', 'Russian Twist', 'Mountain Climber']
    }
    
    const plan = workoutPlans[daysCount] || workoutPlans[3]
    const exercises = []
    
    plan.forEach(dayPlan => {
      const focusGroups = dayPlan.focus
      let exercisesAdded = 0
      
      // Distribuir exercícios pelos grupos focais
      focusGroups.forEach((group, index) => {
        if (exercisesAdded < exerciseCount) {
          const exercisesPerGroup = Math.ceil((exerciseCount - exercisesAdded) / (focusGroups.length - index))
          const groupExercises = exerciseBank[group] || ['Exercício Genérico']
          
          for (let i = 0; i < exercisesPerGroup && exercisesAdded < exerciseCount; i++) {
            const exerciseName = groupExercises[i % groupExercises.length]
            exercises.push({
              name: exerciseName,
              day: dayPlan.day,
              series: group === 'core' ? '3x30s' : '3x12',
              type: formData.equipment === 'gym' ? 'weight' : 'bodyweight',
              category: group,
              notes: getPortugueseGroupName(group)
            })
            exercisesAdded++
          }
        }
      })
    })
    
    return exercises
  }
  
  const getExerciseCount = () => {
    const timeMinutes = parseInt(formData.timeAvailable)
    const experience = formData.experience
    
    let baseCount = 4
    
    if (timeMinutes >= 60) baseCount = 8
    else if (timeMinutes >= 45) baseCount = 7
    else if (timeMinutes >= 30) baseCount = 6
    else if (timeMinutes >= 20) baseCount = 5
    
    if (experience === 'beginner') baseCount = Math.max(4, baseCount - 1)
    else if (experience === 'advanced') baseCount = Math.min(8, baseCount + 1)
    
    return baseCount
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.goals.length > 0
      case 2: return formData.daysPerWeek
      case 3: return formData.experience
      case 4: return formData.timeAvailable
      case 5: return formData.equipment && (formData.equipment !== 'custom' || customEquipments.trim())
      case 6: return previewWorkout
      default: return false
    }
  }

  return (
    <div className="workout-wizard">
      <div className="wizard-header">
        <h2>🎯 Criar Seu Treino Personalizado</h2>
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <span>Etapa {step} de {totalSteps}</span>
        </div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <div className="wizard-step">
            <div className="step-icon"><Target size={32} /></div>
            <h3>Quais são seus objetivos? (pode escolher vários)</h3>
            <div className="options-grid">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  className={`option-card ${formData.goals.includes(goal.id) ? 'selected' : ''}`}
                  onClick={() => handleSelect('goals', goal.id)}
                >
                  <div className="option-icon">{goal.icon}</div>
                  <div className="option-label">{goal.label}</div>
                  <div className="option-desc">{goal.desc}</div>
                </button>
              ))}
            </div>
            {formData.goals.length > 0 && (
              <div className="selected-goals">
                <strong>Selecionados:</strong> {formData.goals.map(g => goals.find(goal => goal.id === g)?.label).join(', ')}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <div className="step-icon"><Calendar size={32} /></div>
            <h3>Quantos dias por semana você quer treinar?</h3>
            <div className="options-grid days-grid">
              {daysOptions.map(day => (
                <button
                  key={day.id}
                  className={`option-card ${formData.daysPerWeek === day.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('daysPerWeek', day.id)}
                >
                  <div className="option-label">{day.label}</div>
                  <div className="option-desc">{day.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <div className="step-icon"><Dumbbell size={32} /></div>
            <h3>Qual sua experiência com treinos?</h3>
            <div className="options-grid experience-grid">
              {experiences.map(exp => (
                <button
                  key={exp.id}
                  className={`option-card ${formData.experience === exp.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('experience', exp.id)}
                >
                  <div className="option-label">{exp.label}</div>
                  <div className="option-desc">{exp.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step">
            <div className="step-icon"><Clock size={32} /></div>
            <h3>Quanto tempo você tem por dia?</h3>
            <div className="options-grid">
              {times.map(time => (
                <button
                  key={time.id}
                  className={`option-card ${formData.timeAvailable === time.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('timeAvailable', time.id)}
                >
                  <div className="option-label">{time.label}</div>
                  <div className="option-desc">{time.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-step">
            <div className="step-icon"><Dumbbell size={32} /></div>
            <h3>Quais equipamentos você tem?</h3>
            <div className="options-grid">
              {equipments.map(eq => (
                <button
                  key={eq.id}
                  className={`option-card ${formData.equipment === eq.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('equipment', eq.id)}
                >
                  <div className="option-label">{eq.label}</div>
                  <div className="option-desc">{eq.desc}</div>
                </button>
              ))}
            </div>

            {formData.equipment === 'custom' && (
              <div className="custom-equipment-section">
                <div className="equipment-options">
                  <div className="option-method">
                    <h4>📝 Descrever equipamentos:</h4>
                    <textarea
                      value={customEquipments}
                      onChange={(e) => setCustomEquipments(e.target.value)}
                      placeholder="Ex: 2 halteres de 10kg, barra fixa, tapete de yoga, faixa elástica..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="option-divider">OU</div>
                  
                  <div className="option-method">
                    <h4>📷 Fotografar equipamentos:</h4>
                    <div className="photo-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        id="equipment-photo"
                        style={{ display: 'none' }}
                        multiple
                      />
                      <label htmlFor="equipment-photo" className="upload-btn">
                        {analyzingPhoto ? (
                          <>
                            <span className="loading"></span>
                            Analisando foto...
                          </>
                        ) : (
                          <>
                            📷 Adicionar Fotos ({equipmentPhotos.length})
                          </>
                        )}
                      </label>
                      {equipmentPhotos.length > 0 && (
                        <div className="photo-preview">
                          <div className="photos-grid">
                            {equipmentPhotos.map((photo, index) => (
                              <div key={index} className="photo-item">
                                <img 
                                  src={URL.createObjectURL(photo)} 
                                  alt={`Equipamento ${index + 1}`}
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = equipmentPhotos.filter((_, i) => i !== index)
                                    setEquipmentPhotos(newPhotos)
                                    if (newPhotos.length > 0) {
                                      analyzeEquipmentPhotos(newPhotos)
                                    } else {
                                      setCustomEquipments('')
                                    }
                                  }}
                                  className="remove-photo"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="limitations-section">
              <label>Limitações, preferências ou treino personalizado:</label>
              <textarea
                value={formData.limitations}
                onChange={(e) => handleSelect('limitations', e.target.value)}
                placeholder="Ex: problemas no joelho, não gosto de agachamento, quero focar em ombros, ou cole seu treino completo aqui..."
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="wizard-step">
            <div className="step-icon"><Sparkles size={32} /></div>
            <h3>Seu Treino Personalizado</h3>
            {previewWorkout ? (
              <div className="workout-preview">
                <div className="preview-header">
                  <h4>{previewWorkout.workoutPlan?.name || 'Seu Treino'}</h4>
                  <p>{previewWorkout.workoutPlan?.description}</p>
                  
                  {previewWorkout.workoutPlan?.explanation && (
                    <div className="ai-explanation">
                      <h5>🤖 Explicação do Personal Trainer IA:</h5>
                      <p>{previewWorkout.workoutPlan.explanation}</p>
                    </div>
                  )}
                  
                  {previewWorkout.workoutPlan?.tips && (
                    <div className="ai-tips">
                      <h5>💡 Dicas importantes:</h5>
                      <ul>
                        {previewWorkout.workoutPlan.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="preview-days">
                  {Array.from({length: parseInt(formData.daysPerWeek)}, (_, i) => i + 1).map(day => {
                    const dayExercises = previewWorkout.exercises?.filter(ex => ex.day === day) || []
                    
                    // Detectar grupo muscular principal
                    const getMainMuscleGroup = (exercises) => {
                      const categories = exercises.map(ex => ex.category)
                      if (categories.includes('chest')) return 'Peito'
                      if (categories.includes('back')) return 'Costas'
                      if (categories.includes('legs')) return 'Pernas'
                      if (categories.includes('shoulders')) return 'Ombros'
                      if (categories.includes('biceps') && categories.includes('triceps')) return 'Braços'
                      return 'Completo'
                    }
                    
                    // Detectar equipamentos necessários para o dia
                    const getDayEquipments = (exercises) => {
                      const equipmentMap = {
                        'Supino': 'Banco + Barra olímpica',
                        'Crucifixo': 'Banco + Halteres',
                        'Desenvolvimento': 'Banco + Halteres',
                        'Puxada': 'Estação MOVEMENT',
                        'Remada': 'Estação MOVEMENT',
                        'Extensora': 'Cadeira extensora',
                        'Flexora': 'Cadeira flexora',
                        'Adutora': 'Cadeira adutora',
                        'Abdutora': 'Cadeira abdutora',
                        'Rosca': 'Halteres',
                        'Tríceps': 'Estação MOVEMENT',
                        'Prancha': 'Colchonete',
                        'Abdominal': 'Banco abdominal',
                        'Agachamento': 'Barra + Rack',
                        'Leg Press': 'Leg Press',
                        'Panturrilha': 'Halteres'
                      }
                      
                      const equipments = new Set()
                      exercises.forEach(ex => {
                        const exerciseName = ex.name
                        for (const [key, equipment] of Object.entries(equipmentMap)) {
                          if (exerciseName.includes(key)) {
                            equipments.add(equipment)
                            break
                          }
                        }
                      })
                      
                      return Array.from(equipments)
                    }
                    
                    const dayEquipments = getDayEquipments(dayExercises)
                    
                    return (
                      <div key={day} className="preview-day">
                        <h5>Dia {day} - {getMainMuscleGroup(dayExercises)}</h5>
                        {dayEquipments.length > 0 && (
                          <div className="day-equipments">
                            <strong>🏋️ Equipamentos:</strong> {dayEquipments.join(', ')}
                          </div>
                        )}
                        <div className="day-exercises">
                          {dayExercises.map((ex, idx) => (
                            <div key={idx} className="preview-exercise">
                              <div className="ex-info">
                                <span className="ex-name">{ex.name}</span>
                                {ex.equipment && ex.equipment.length > 0 && (
                                  <span className="ex-equipment">🏋️ {ex.equipment.join(' ou ')}</span>
                                )}
                              </div>
                              <span className="ex-series">{ex.series}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="preview-actions">
                  <button className="btn-secondary" onClick={() => setStep(5)}>
                    ← Ajustar
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setPreviewWorkout(null)
                      generatePreview()
                    }}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="loading"></span>
                        Gerando...
                      </>
                    ) : (
                      <>
                        🔄 Nova Sugestão
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="generating-preview">
                <span className="loading"></span>
                <p>Gerando seu treino personalizado...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button 
          className="btn-secondary" 
          onClick={step === 1 ? onClose : prevStep}
        >
          <ArrowLeft size={16} />
          {step === 1 ? 'Cancelar' : 'Voltar'}
        </button>

        {step < totalSteps ? (
          <button 
            className="btn-primary" 
            onClick={nextStep}
            disabled={!canProceed() || (step === 5 && isGenerating)}
          >
            {step === 5 && isGenerating ? (
              <>
                <span className="loading"></span>
                Gerando Preview...
              </>
            ) : (
              <>
                {step === 5 ? 'Gerar Preview' : 'Próximo'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={() => onWorkoutGenerated(previewWorkout, formData)}
            disabled={!previewWorkout}
          >
            <Sparkles size={16} />
            Confirmar Treino
          </button>
        )}
      </div>
    </div>
  )
}
