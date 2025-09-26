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
    { id: 'bodyweight', label: 'Peso Corporal', desc: 'Sem equipamentos' }
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
      
      const prompt = `Crie um treino de ${formData.daysPerWeek} dias baseado no perfil:
      
PERFIL:
- Objetivos: ${goalLabels}
- Experiência: ${experiences.find(e => e.id === formData.experience)?.label}
- Tempo: ${formData.timeAvailable}min/dia
- Equipamentos: ${equipments.find(e => e.id === formData.equipment)?.label}
- Limitações: ${formData.limitations || 'Nenhuma'}

IMPORTANTE:
- Crie EXATAMENTE ${formData.daysPerWeek} dias de treino
- Cada dia deve ter 6-8 exercícios diferentes
- Distribua os exercícios equilibradamente entre os dias
- Use day: 1, day: 2, day: 3, etc.

Responda APENAS com JSON válido:
{
  "workoutPlan": {
    "name": "Treino ${goalLabels}",
    "description": "Programa de ${formData.daysPerWeek} dias focado em ${goalLabels.toLowerCase()}",
    "duration": "6-8 semanas"
  },
  "exercises": [
    {"name": "Supino Reto", "day": 1, "series": "3x12", "type": "weight", "category": "chest", "notes": "Controle a descida"},
    {"name": "Crucifixo", "day": 1, "series": "3x12", "type": "weight", "category": "chest", "notes": "Foco na contração"},
    {"name": "Remada Curvada", "day": 2, "series": "3x12", "type": "weight", "category": "back", "notes": "Mantenha as costas retas"}
  ]
}`

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('Erro na API')

      const result = await response.json()
      setPreviewWorkout(result)
      
    } catch (error) {
      console.error('Erro ao gerar preview:', error)
      alert('Erro ao gerar preview. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.goals.length > 0
      case 2: return formData.daysPerWeek
      case 3: return formData.experience
      case 4: return formData.timeAvailable
      case 5: return formData.equipment
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
            <div className="options-list">
              {daysOptions.map(day => (
                <button
                  key={day.id}
                  className={`option-item ${formData.daysPerWeek === day.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('daysPerWeek', day.id)}
                >
                  <div className="option-content">
                    <div className="option-label">{day.label}</div>
                    <div className="option-desc">{day.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <div className="step-icon"><Dumbbell size={32} /></div>
            <h3>Qual sua experiência com treinos?</h3>
            <div className="options-list">
              {experiences.map(exp => (
                <button
                  key={exp.id}
                  className={`option-item ${formData.experience === exp.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('experience', exp.id)}
                >
                  <div className="option-content">
                    <div className="option-label">{exp.label}</div>
                    <div className="option-desc">{exp.desc}</div>
                  </div>
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
            <div className="options-list">
              {equipments.map(eq => (
                <button
                  key={eq.id}
                  className={`option-item ${formData.equipment === eq.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('equipment', eq.id)}
                >
                  <div className="option-content">
                    <div className="option-label">{eq.label}</div>
                    <div className="option-desc">{eq.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="limitations-section">
              <label>Limitações ou preferências (opcional):</label>
              <textarea
                value={formData.limitations}
                onChange={(e) => handleSelect('limitations', e.target.value)}
                placeholder="Ex: problemas no joelho, não gosto de agachamento..."
                rows={3}
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
                </div>
                <div className="preview-days">
                  {Array.from({length: parseInt(formData.daysPerWeek)}, (_, i) => i + 1).map(day => {
                    const dayExercises = previewWorkout.exercises?.filter(ex => ex.day === day) || []
                    return (
                      <div key={day} className="preview-day">
                        <h5>Dia {day}</h5>
                        <div className="day-exercises">
                          {dayExercises.map((ex, idx) => (
                            <div key={idx} className="preview-exercise">
                              <span className="ex-name">{ex.name}</span>
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