import { useState } from 'react'
import { Plus, RefreshCw, Calendar, TrendingUp } from 'lucide-react'

export default function WelcomeScreen({ 
  hasExistingWorkout, 
  workoutAge, 
  onCreateNew, 
  onRenewWorkout, 
  onContinueExisting 
}) {
  const shouldSuggestRenewal = workoutAge && workoutAge > 42 // 6 semanas

  if (!hasExistingWorkout) {
    // Novo usuário
    return (
      <div className="welcome-screen">
        <div className="welcome-hero">
          <div className="hero-icon">🎯</div>
          <h1>Bem-vindo ao FitTracker Pro!</h1>
          <p>Vamos criar seu treino personalizado com IA</p>
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <div className="feature-text">
              <strong>IA Personalizada</strong>
              <span>Treino adaptado ao seu perfil</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-text">
              <strong>Acompanhamento</strong>
              <span>Progresso visual e detalhado</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⏱️</div>
            <div className="feature-text">
              <strong>Flexível</strong>
              <span>Adapta ao seu tempo disponível</span>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn-primary large" onClick={onCreateNew}>
            <Plus size={20} />
            Criar Meu Treino
          </button>
        </div>
      </div>
    )
  }

  // Usuário existente
  return (
    <div className="welcome-screen existing">
      <div className="workout-status">
        <div className="status-header">
          <h2>Seu Treino Atual</h2>
          <div className="workout-age">
            <Calendar size={16} />
            {workoutAge} dias
          </div>
        </div>

        {shouldSuggestRenewal && (
          <div className="renewal-suggestion">
            <div className="suggestion-icon">💡</div>
            <div className="suggestion-content">
              <strong>Hora de renovar!</strong>
              <p>Seu treino tem mais de 6 semanas. Que tal evoluir para o próximo nível?</p>
            </div>
          </div>
        )}
      </div>

      <div className="welcome-actions">
        <button className="btn-primary" onClick={onContinueExisting}>
          <TrendingUp size={16} />
          Continuar Treino
        </button>
        
        <button 
          className={`btn-secondary ${shouldSuggestRenewal ? 'highlighted' : ''}`}
          onClick={onRenewWorkout}
        >
          <RefreshCw size={16} />
          {shouldSuggestRenewal ? 'Renovar Treino' : 'Criar Novo Treino'}
        </button>
      </div>
    </div>
  )
}