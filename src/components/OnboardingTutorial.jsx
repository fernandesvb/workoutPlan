import { useState } from 'react'
import { ArrowRight, ArrowLeft, X, Target, Sparkles, TrendingUp } from 'lucide-react'

export default function OnboardingTutorial({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "🎯 Bem-vindo ao FitTracker Pro!",
      content: "Seu personal trainer virtual está aqui! Vou te mostrar como criar seu primeiro treino profissional em menos de 2 minutos.",
      icon: <Target size={48} />,
      highlight: null
    },
    {
      title: "🤖 IA Personalizada",
      content: "Nossa IA cria treinos únicos baseados nos seus objetivos, equipamentos disponíveis e nível de experiência.",
      icon: <Sparkles size={48} />,
      highlight: ".btn-primary"
    },
    {
      title: "📊 Progresso Gamificado",
      content: "Ganhe XP, suba de nível e conquiste badges a cada exercício completado. Sua evolução nunca foi tão motivadora!",
      icon: <TrendingUp size={48} />,
      highlight: ".user-status"
    },
    {
      title: "⚡ Vamos começar!",
      content: "Clique em 'Criar Meu Treino' e em 6 passos você terá seu programa personalizado pronto para usar!",
      icon: <ArrowRight size={48} />,
      highlight: ".btn-primary"
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = steps[currentStep]

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <div className="tutorial-header">
          <button className="tutorial-close" onClick={onSkip}>
            <X size={20} />
          </button>

          <div className="tutorial-progress">
            <div className="progress-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="tutorial-step">
          <div className="step-icon">
            {step.icon}
          </div>

          <h2>{step.title}</h2>
          <p>{step.content}</p>

          <div className="tutorial-actions">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} />
                Anterior
              </button>
            )}

            <button className="btn-primary" onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Começar!' : 'Próximo'}
              <ArrowRight size={16} />
            </button>
          </div>

          {currentStep === 0 && (
            <div className="tutorial-footer">
              <button className="skip-button" onClick={onSkip}>
                Pular tutorial →
              </button>
            </div>
          )}
        </div>
      </div>

      {step.highlight && (
        <div className="tutorial-highlight" data-target={step.highlight}>
          <div className="highlight-pulse"></div>
        </div>
      )}
    </div>
  )
}