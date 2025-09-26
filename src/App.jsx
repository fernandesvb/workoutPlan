import { useState } from 'react'
import { Plus, Save, Download, Trash2 } from 'lucide-react'
import AuthSection from './components/AuthSection'
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
  
  const handleWorkoutComplete = (completed, total) => {
    const result = completeWorkout(completed, total)
    
    if (result.leveledUp) {
      // Disparar evento de level up
      window.dispatchEvent(new CustomEvent('levelUp', {
        detail: { newLevel: result.newLevel }
      }))
    }
    
    // Mostrar notificação de XP ganho
    console.log(`+${result.xpGained} XP - ${result.reason}`)
  }
  
  const handleBadgeEarned = (badges) => {
    console.log('Novas conquistas:', badges)
    // Aqui você pode adicionar notificações ou celebrações
  }

  // Função para remover exercício (para usar no modal)
  const handleRemoveExercise = (exerciseId) => {
    removeExercise(exerciseId)
  }

  const handleSave = async () => {
    const success = await saveData()
    if (success) {
      // Feedback visual será implementado no hook
    }
  }

  const handleExport = () => {
    exportData(customExercises)
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
    if (result.exercises) {
      console.log('=== CRIANDO NOVO TREINO ===')
      console.log('Exercícios recebidos da IA:', result.exercises.length)
      
      // LIMPEZA TOTAL - Remover TUDO relacionado a treinos
      console.log('Limpando localStorage...')
      const allKeys = Object.keys(localStorage)
      const keysToRemove = allKeys.filter(key => 
        key.includes('custom_') || 
        key === 'customExercises' || 
        key === 'treino' || 
        key === 'workoutMeta' ||
        key.includes('_current') ||
        key.includes('_w1') ||
        key.includes('_w2') ||
        key.includes('_w3') ||
        key.includes('_w4') ||
        key.includes('_history')
      )
      
      console.log('Removendo chaves:', keysToRemove)
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Criar novos exercícios com IDs únicos
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
      
      console.log('=== EXERCÍCIOS CRIADOS ===')
      console.log('Total:', exercises.length)
      exercises.forEach((ex, i) => {
        console.log(`${i+1}. Dia ${ex.day}: ${ex.name} (${ex.series})`)
      })
      
      // Salvar novos exercícios
      localStorage.setItem('customExercises', JSON.stringify(exercises))
      
      // Criar metadados do treino
      const workoutMeta = {
        createdAt: new Date().toISOString(),
        profile,
        welcomeCompleted: true,
        version: '3.0',
        exerciseCount: exercises.length
      }
      localStorage.setItem('workoutMeta', JSON.stringify(workoutMeta))
      
      console.log('=== TREINO SALVO ===')
      console.log('Recarregando página...')
      
      // Fechar wizard
      setShowWizard(false)
      
      // Forçar recarga completa
      setTimeout(() => {
        window.location.href = window.location.href
      }, 300)
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
      
      <WorkoutTabs activeDay={activeDay} onDayChange={setActiveDay} />
      
      <WorkoutDay 
        day={activeDay}
        workoutData={workoutData}
        customExercises={customExercises}
        onWorkoutChange={updateWorkout}
        onRemoveExercise={removeExercise}
      />

      <NotesSection notes={notes} onNotesChange={updateNotes} />
      
      <div className="action-buttons">
        <button className="btn-save" onClick={handleSave}>
          <Save size={16} /> Salvar
        </button>
        <button className="btn-export" onClick={handleExport}>
          <Download size={16} /> Exportar
        </button>
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