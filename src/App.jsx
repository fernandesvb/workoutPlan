import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import TimerSection from './components/TimerSection'
import WorkoutTabs from './components/WorkoutTabs'
import WorkoutDay from './components/WorkoutDay'
import NotesSection from './components/NotesSection'
import AddExerciseModal from './components/AddExerciseModal'
import WelcomeScreen from './components/WelcomeScreen'
import WorkoutWizard from './components/WorkoutWizard'
import { useFirebase } from './hooks/useFirebase'
import { useWorkoutData } from './hooks/useWorkoutData'
import { useExerciseManager } from './hooks/useExerciseManager'
import { useWorkoutState } from './hooks/useWorkoutState'
import { useGamification } from './hooks/useGamification'
import UserStatus from './components/UserStatus'
import WorkoutProgress from './components/WorkoutProgress'
import OnboardingTutorial from './components/OnboardingTutorial'
import PremiumUpgrade from './components/PremiumUpgrade'
import ConnectionStatus from './components/ConnectionStatus'
import WorkoutSummary from './components/WorkoutSummary'

function App() {
  const [activeDay, setActiveDay] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [workoutSummary, setWorkoutSummary] = useState(null)
  
  const { user, signIn, signOut, enableOffline } = useFirebase()
  const { workoutData, notes, updateWorkout, updateNotes, saveData, exportData, clearData } = useWorkoutData(user)
  const { customExercises, addExercise, removeExercise } = useExerciseManager()
  const { workoutState, createNewWorkout, renewWorkout, continueExistingWorkout, getWorkoutAge } = useWorkoutState()
  const { completeWorkout, addExerciseXp } = useGamification()

  // Verificar se é primeira vez do usuário
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial && !workoutState.hasWorkout) {
      setIsFirstTime(true)
      setShowTutorial(true)
    }
  }, [workoutState.hasWorkout])
  
  // Expor função de salvamento para hooks
  useEffect(() => {
    window.saveToFirebase = saveData
    return () => {
      delete window.saveToFirebase
    }
  }, [saveData])

  // Listener para exercícios concluídos individuais (sem gamificação imediata)
  useEffect(() => {
    const handleExerciseCompleted = (event) => {
      // Apenas atualizar dados, sem gamificação (log reduzido para debug)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Exercício concluído:', event.detail.exerciseName)
      }
    }

    window.addEventListener('exerciseCompleted', handleExerciseCompleted)
    return () => {
      window.removeEventListener('exerciseCompleted', handleExerciseCompleted)
    }
  }, []) // Removidas dependências que causam loops
  
  const handleFinishWorkout = (completed, total) => {
    // Calcular XP baseado nos exercícios completados
    const result = completeWorkout(completed, total)

    // Mostrar modal de resumo
    setWorkoutSummary({
      completed,
      total,
      xpGained: result.xpGained,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      day: activeDay
    })

    // Disparar eventos de gamificação DEPOIS que o modal de resumo fechar
    setTimeout(() => {
      if (result.leveledUp) {
        window.dispatchEvent(new CustomEvent('levelUp', {
          detail: { newLevel: result.newLevel }
        }))
      }
    }, 1500) // Delay para modal aparecer primeiro
  }
  
  const handleBadgeEarned = (badges) => {
    // Badges processados
  }

  // Função para remover exercício (para usar no modal)
  const handleRemoveExercise = (exerciseId) => {
    removeExercise(exerciseId)
  }



  const handleClear = async () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      await clearData()
    }
  }

  const handleAddExercise = (exercise, keepModalOpen = false) => {
    addExercise(exercise)
    if (!keepModalOpen) {
      setShowModal(false)
    }
  }

  const handleWorkoutGenerated = (result, profile) => {
    if (result.exercises && result.exercises.length > 0) {
      // Criar exercícios com IDs únicos
      const timestamp = Date.now()
      const exercises = result.exercises.map((ex, index) => ({
        id: `custom_${timestamp}_${index}_${Math.random().toString(36).substr(2, 5)}`,
        name: ex.name,
        day: parseInt(ex.day),
        type: ex.type || 'weight',
        series: ex.series,
        category: ex.category || 'normal',
        notes: ex.notes || '',
        created: new Date().toISOString()
      }))
      
      // Usar o hook para criar o treino (ele já faz a limpeza)
      const success = createNewWorkout(exercises, profile)
      
      if (success) {
        setShowWizard(false)

        // Se não estiver logado, mostrar aviso sobre sincronização
        if (!user) {
          setSaveStatus({
            type: 'warning',
            message: '✅ Treino criado localmente! Faça login para sincronizar na nuvem e não perder seus dados.'
          })
          setTimeout(() => setSaveStatus(null), 8000) // 8 segundos para ler
        }

        // Não fazer reload - apenas continuar para o treino
      } else {
        alert('Erro ao criar treino. Tente novamente.')
      }
    } else {
      alert('Erro: Nenhum exercício foi gerado. Tente novamente.')
    }
  }

  const handleCreateNew = () => {
    setShowWizard(true)
  }

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setShowTutorial(false)
    setShowWizard(true)
  }

  const handleTutorialSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setShowTutorial(false)
  }

  const handleUpgrade = (plan) => {
    if (plan === 'pro' || plan === 'premium') {
      // Marcar como premium (simulação)
      localStorage.setItem('isPremium', 'true')
      alert(`✅ Upgrade realizado para ${plan}! Agora você tem acesso completo!`)
    } else {
      alert(`Upgrade para ${plan} - Em breve integração com pagamento!`)
    }
    setShowPremiumUpgrade(false)
  }

  // Função para resetar flags de debug (desenvolvimento)
  const resetDebugFlags = () => {
    localStorage.removeItem('hasSeenUpgradeModal')
    localStorage.removeItem('isPremium')
    localStorage.removeItem('hasSeenTutorial')
    console.log('🔧 Debug flags resetados')
  }

  // Expor função no console para debug
  useEffect(() => {
    window.resetDebugFlags = resetDebugFlags
    return () => {
      delete window.resetDebugFlags
    }
  }, [])

  // Listener para status de salvamento
  useEffect(() => {
    const handleDataSaved = (event) => {
      const { detail } = event
      if (detail.success) {
        if (detail.cloudError || detail.notLoggedIn) {
          setSaveStatus({
            type: 'warning',
            message: detail.notLoggedIn
              ? '⚠️ Dados salvos localmente. Faça login para sincronizar na nuvem.'
              : '⚠️ Dados salvos localmente. Problema de conexão com a nuvem.'
          })
        } else if (detail.location === 'cloud') {
          setSaveStatus({
            type: 'success',
            message: '✅ Dados sincronizados na nuvem com sucesso!'
          })
        }
      } else {
        setSaveStatus({
          type: 'error',
          message: `❌ Erro ao salvar dados: ${detail.error}`
        })
      }

      // Limpar status após 5 segundos
      setTimeout(() => setSaveStatus(null), 5000)
    }

    window.addEventListener('dataSaved', handleDataSaved)
    return () => window.removeEventListener('dataSaved', handleDataSaved)
  }, [])

  // Detectar quando mostrar upgrade (limite de exercícios atingido)
  useEffect(() => {
    const freeExerciseLimit = 5
    const hasSeenUpgradeModal = localStorage.getItem('hasSeenUpgradeModal')
    const isPremium = localStorage.getItem('isPremium')

    if (customExercises.length >= freeExerciseLimit && !isPremium && !hasSeenUpgradeModal) {
      // Mostrar upgrade após limite atingido (apenas uma vez)
      localStorage.setItem('hasSeenUpgradeModal', 'true')
      setTimeout(() => setShowPremiumUpgrade(true), 1000)
    }
  }, [customExercises.length]) // Usar .length específico para evitar loops

  const handleRenewWorkout = () => {
    setShowWizard(true)
  }

  const handleContinueExisting = () => {
    continueExistingWorkout()
  }

  // Mostrar welcome screen se necessário
  if (workoutState.showWelcome) {
    return (
      <div className="container">
        <div className="header">
          <h1>🏋️ FitTracker Pro</h1>
          <p className="subtitle">Seu treino personalizado com IA</p>
        </div>
        <div className="content">
          <WelcomeScreen 
            hasExistingWorkout={workoutState.hasWorkout}
            workoutAge={getWorkoutAge}
            onCreateNew={handleCreateNew}
            onRenewWorkout={handleRenewWorkout}
            onContinueExisting={handleContinueExisting}
            user={user}
            onSignIn={signIn}
            onSignOut={signOut}
            onEnableOffline={enableOffline}
          />
        </div>
        
        {showWizard && (
          <div className="modal show">
            <div className="modal-content wizard-modal">
              <WorkoutWizard 
                onWorkoutGenerated={handleWorkoutGenerated}
                onClose={() => setShowWizard(false)}
              />
            </div>
          </div>
        )}

        {showTutorial && (
          <OnboardingTutorial
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )}
      </div>
    )
  }

  // App principal
  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="header-title">
            <h1>🏋️ FitTracker Pro</h1>
            <p className="subtitle">Seu treino personalizado com IA</p>
          </div>
          <ConnectionStatus user={user} />
        </div>
      </div>
      <div className="content">
        <div className="back-to-home">
          <button
            className="btn-back"
            onClick={() => {
              renewWorkout()
            }}
          >
            ← Voltar ao Início
          </button>
        </div>

        <UserStatus onBadgeEarned={handleBadgeEarned} />

        <WorkoutProgress
          day={activeDay}
          workoutData={workoutData}
          customExercises={customExercises}
          onFinishWorkout={handleFinishWorkout}
        />

        <TimerSection />

        <WorkoutTabs
          activeDay={activeDay}
          onDayChange={setActiveDay}
          customExercises={customExercises}
        />

        <WorkoutDay
          day={activeDay}
          workoutData={workoutData}
          customExercises={customExercises}
          onWorkoutChange={updateWorkout}
          onRemoveExercise={removeExercise}
        />

        <NotesSection notes={notes} onNotesChange={updateNotes} />

        <div className="action-buttons">
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Novo Exercício com IA
          </button>
          <button className="btn-clear" onClick={handleClear}>
            <Trash2 size={16} /> Limpar
          </button>
        </div>
      </div>

      <AddExerciseModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddExercise={handleAddExercise}
        addExerciseDirectly={addExercise}
        onRemoveExercise={handleRemoveExercise}
        workoutData={workoutData}
        customExercises={customExercises}
      />

      {showPremiumUpgrade && (
        <PremiumUpgrade
          show={showPremiumUpgrade}
          onClose={() => setShowPremiumUpgrade(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      {saveStatus && (
        <div className={`save-notification ${saveStatus.type}`}>
          <div className="save-notification-content">
            {saveStatus.message}
            <button
              className="close-notification"
              onClick={() => setSaveStatus(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {workoutSummary && (
        <WorkoutSummary
          show={!!workoutSummary}
          onClose={() => setWorkoutSummary(null)}
          completed={workoutSummary.completed}
          total={workoutSummary.total}
          xpGained={workoutSummary.xpGained}
          leveledUp={workoutSummary.leveledUp}
          newLevel={workoutSummary.newLevel}
          day={workoutSummary.day}
        />
      )}
    </div>
  )
}

export default App