import { useState, useEffect } from 'react'
import { Timer, Plus, Save, Download, Trash2 } from 'lucide-react'
import FirebaseStatus from './components/FirebaseStatus'
import AuthSection from './components/AuthSection'
import TimerSection from './components/TimerSection'
import WorkoutTabs from './components/WorkoutTabs'
import WorkoutDay from './components/WorkoutDay'
import NotesSection from './components/NotesSection'
import AddExerciseModal from './components/AddExerciseModal'
import { useFirebase } from './hooks/useFirebase'
import { useWorkoutData } from './hooks/useWorkoutData'
import { useExerciseManager } from './hooks/useExerciseManager'

function App() {
  const [activeDay, setActiveDay] = useState(1)
  const [showModal, setShowModal] = useState(false)
  
  const { firebaseStatus, user, signIn, signOut, enableOffline } = useFirebase()
  const { workoutData, notes, updateWorkout, updateNotes, saveData, exportData, clearData } = useWorkoutData(user)
  const { customExercises, addExercise, removeExercise } = useExerciseManager()

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

  const handleAddExercise = (exercise) => {
    addExercise(exercise)
    setShowModal(false)
  }

  return (
    <div className="container">
      <h1>💪 Meu Treino + Core</h1>
      <p className="subtitle">30-35 min/dia com fortalecimento</p>

      <FirebaseStatus status={firebaseStatus} />
      
      <AuthSection 
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onEnableOffline={enableOffline}
      />
      
      <div className="info-box">
        <p>💡 <strong>Dica:</strong> Core forte = costas sem dor!</p>
        <p>⚠️ <strong>Ombro:</strong> Se doer, reduza o peso.</p>
      </div>
      
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
          <Plus size={16} /> Novo Exercício
        </button>
        <button className="btn-clear" onClick={handleClear}>
          <Trash2 size={16} /> Limpar
        </button>
      </div>

      <AddExerciseModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddExercise={handleAddExercise}
      />
    </div>
  )
}

export default App