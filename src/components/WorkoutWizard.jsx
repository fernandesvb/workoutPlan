import { useState } from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Target, Clock, Dumbbell } from 'lucide-react'

export default function WorkoutWizard({ onWorkoutGenerated, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    goal: '',
    experience: '',
    timeAvailable: '',
    equipment: '',
    limitations: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const goals = [
    { id: 'lose_weight', label: 'Emagrecer', icon: '🔥', desc: 'Queimar gordura e definir' },
    { id: 'gain_muscle', label: 'Ganhar Massa', icon: '💪', desc: 'Hipertrofia muscular' },
    { id: 'tone', label: 'Definir', icon: '✨', desc: 'Tonificar e esculpir' },
    { id: 'fitness', label: 'Condicionamento', icon: '⚡', desc: 'Melhorar resistência' }
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const generateWorkout = async () => {
    setIsGenerating(true)
    try {
      // Chamar IA para gerar treino completo
      const prompt = `Crie um treino completo de 3 dias baseado no perfil:
      
PERFIL DO USUÁRIO:
- Objetivo: ${goals.find(g => g.id === formData.goal)?.label}
- Experiência: ${experiences.find(e => e.id === formData.experience)?.label}
- Tempo disponível: ${formData.timeAvailable} minutos por dia
- Equipamentos: ${equipments.find(e => e.id === formData.equipment)?.label}
- Limitações: ${formData.limitations || 'Nenhuma'}

INSTRUÇÕES:
- Crie um programa de 3 dias (Dia 1, Dia 2, Dia 3)
- Distribua exercícios apropriados para cada dia
- Considere o nível de experiência para séries/repetições
- Adapte aos equipamentos disponíveis
- Inclua 6-8 exercícios por dia

Responda APENAS com JSON:
{
  "workoutPlan": {
    "name": "Nome do Treino",
    "description": "Descrição do programa",
    "duration": "X semanas"
  },
  "exercises": [
    {"name": "Nome", "day": 1, "series": "3x12", "type": "weight", "category": "normal", "notes": "Dica"}
  ]
}`

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('Erro na API')

      const result = await response.json()
      onWorkoutGenerated(result, formData)
      
    } catch (error) {
      console.error('Erro ao gerar treino:', error)
      alert('Erro ao gerar treino. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.goal
      case 2: return formData.experience
      case 3: return formData.timeAvailable
      case 4: return formData.equipment
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
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <span>Etapa {step} de 4</span>
        </div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <div className="wizard-step">
            <div className="step-icon"><Target size={32} /></div>
            <h3>Qual é o seu objetivo?</h3>
            <div className="options-grid">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  className={`option-card ${formData.goal === goal.id ? 'selected' : ''}`}
                  onClick={() => handleSelect('goal', goal.id)}
                >
                  <div className="option-icon">{goal.icon}</div>
                  <div className="option-label">{goal.label}</div>
                  <div className="option-desc">{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
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

        {step === 3 && (
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

        {step === 4 && (
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
      </div>

      <div className="wizard-footer">
        <button 
          className="btn-secondary" 
          onClick={step === 1 ? onClose : prevStep}
        >
          <ArrowLeft size={16} />
          {step === 1 ? 'Cancelar' : 'Voltar'}
        </button>

        {step < 4 ? (
          <button 
            className="btn-primary" 
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Próximo
            <ArrowRight size={16} />
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={generateWorkout}
            disabled={!canProceed() || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="loading"></span>
                Gerando...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Gerar Treino
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}