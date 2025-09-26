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

function App() {
  const [activeDay, setActiveDay] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  
  const { user, signIn, signOut, enableOffline } = useFirebase()
  const { workoutData, notes, updateWorkout, updateNotes, saveData, exportData, clearData } = useWorkoutData(user)
  const { customExercises, addExercise, removeExercise } = useExerciseManager()
  const { workoutState, createNewWorkout, renewWorkout, continueExistingWorkout, getWorkoutAge } = useWorkoutState()
  const { completeWorkout } = useGamification()
  
  // Expor função de salvamento para hooks
  useEffect(() => {
    window.saveToFirebase = saveData
    return () => {
      delete window.saveToFirebase
    }
  }, [saveData])
  
  const handleWorkoutComplete = (completed, total) => {
    const result = completeWorkout(completed, total)
    
    if (result.leveledUp) {
      // Disparar evento de level up
      window.dispatchEvent(new CustomEvent('levelUp', {
        detail: { newLevel: result.newLevel }
      }))
    }
    
    // XP ganho processado
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
        setTimeout(() => {
          window.location.reload()
        }, 500)
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
      </div>
    )
  }

  // App principal
  return (
    <div className="container">
      <div className="header">
        <h1>🏋️ FitTracker Pro</h1>
        <p className="subtitle">Seu treino personalizado com IA</p>
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
        onWorkoutComplete={handleWorkoutComplete}
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

      <AddExerciseModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddExercise={handleAddExercise}
        addExerciseDirectly={addExercise}
        onRemoveExercise={handleRemoveExercise}
        workoutData={workoutData}
        customExercises={customExercises}
      />
      </div>
    </div>
  )
}

export default App