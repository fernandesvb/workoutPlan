import { Plus, RefreshCw, Calendar, TrendingUp } from 'lucide-react'
import AuthSection from './AuthSection'

export default function WelcomeScreen({ 
  hasExistingWorkout, 
  workoutAge, 
  onCreateNew, 
  onRenewWorkout, 
  onContinueExisting,
  user,
  onSignIn,
  onSignOut,
  onEnableOffline 
}) {
  const shouldSuggestRenewal = workoutAge && workoutAge > 42 // 6 semanas

  const getMotivationalQuote = () => {
    const today = new Date().getDay() // 0-6
    const quotes = [
      '💪 Domingo é dia de planejamento! Prepare-se para uma semana incrível!',
      '🔥 Segunda-feira, dia de começar com tudo! Vamos treinar!',
      '⚡ Terça-feira de energia! Seu corpo agradece cada movimento!',
      '🎯 Quarta-feira, metade da semana! Mantenha o foco nos seus objetivos!',
      '🚀 Quinta-feira de superação! Você é mais forte que imagina!',
      '🎆 Sexta-feira de finalização! Termine a semana com chave de ouro!',
      '🌟 Sábado de conquistas! Cada treino te aproxima do seu melhor!'
    ]
    return quotes[today]
  }

  const getCurrentWorkoutDay = () => {
    const today = new Date().getDay()
    if (today === 1 || today === 4) return 'Dia 1 - Peito/Tríceps'
    if (today === 2 || today === 5) return 'Dia 2 - Costas/Bíceps'
    if (today === 3 || today === 6) return 'Dia 3 - Pernas'
    return 'Dia de descanso ou escolha livre'
  }

  if (!hasExistingWorkout) {
    // Novo usuário
    return (
      <div className="welcome-screen">
        <AuthSection 
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          onEnableOffline={onEnableOffline}
        />
        
        <div className="motivational-quote">
          <p>{getMotivationalQuote()}</p>
        </div>
        
        <div className="welcome-hero">
          <div className="hero-icon">🎯</div>
          <h1>Bem-vindo ao FitTracker Pro!</h1>
          <p>Para começar, você precisa criar seu treino personalizado com IA</p>
          <div className="hero-alert">
            ⚠️ <strong>Primeiro passo:</strong> Clique em "Criar Meu Treino" abaixo
          </div>
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
          <button 
            className="btn-primary large" 
            onClick={() => {
              console.log('Botão Criar Treino clicado!')
              onCreateNew()
            }}
          >
            <Plus size={20} />
            Criar Meu Treino
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={() => {
              console.log('Forçando modo existente')
              onContinueExisting()
            }}
            style={{ marginTop: '12px' }}
          >
            Já tenho treino - Pular
          </button>
        </div>
      </div>
    )
  }

  // Usuário existente
  return (
    <div className="welcome-screen existing">
      <AuthSection 
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onEnableOffline={onEnableOffline}
      />
      
      <div className="motivational-quote">
        <p>{getMotivationalQuote()}</p>
      </div>
      
      <div className="current-workout-info">
        <div className="workout-day">
          <strong>Treino de hoje:</strong>
          <span>{getCurrentWorkoutDay()}</span>
        </div>
      </div>
      
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
        <button 
          className="btn-primary" 
          onClick={() => {
            console.log('Botão Continuar clicado!')
            onContinueExisting()
          }}
        >
          <TrendingUp size={16} />
          Continuar Treino
        </button>
        
        <button 
          className={`btn-secondary ${shouldSuggestRenewal ? 'highlighted' : ''}`}
          onClick={() => {
            console.log('Botão Renovar clicado!')
            onRenewWorkout()
          }}
        >
          <RefreshCw size={16} />
          {shouldSuggestRenewal ? 'Renovar Treino' : 'Criar Novo Treino'}
        </button>
      </div>
    </div>
  )
}