import { useState, useEffect } from 'react'

export function useWorkoutState() {
  const [workoutState, setWorkoutState] = useState({
    hasWorkout: false,
    workoutCreatedAt: null,
    workoutProfile: null,
    showWelcome: true
  })

  useEffect(() => {
    loadWorkoutState()
  }, [])

  const loadWorkoutState = () => {
    try {
      const customExercises = JSON.parse(localStorage.getItem('customExercises') || '[]')
      const workoutMeta = JSON.parse(localStorage.getItem('workoutMeta') || '{}')
      
      const hasWorkout = customExercises.length > 0
      const workoutCreatedAt = workoutMeta.createdAt
      const workoutProfile = workoutMeta.profile
      
      console.log('=== CARREGANDO ESTADO DO TREINO ===')
      console.log('Exercícios encontrados:', customExercises.length)
      console.log('Tem treino:', hasWorkout)
      console.log('Meta:', workoutMeta)
      console.log('Mostrar welcome:', !hasWorkout || !workoutMeta.welcomeCompleted)
      
      if (customExercises.length > 0) {
        console.log('Exercícios por dia:')
        const byDay = {}
        customExercises.forEach(ex => {
          if (!byDay[ex.day]) byDay[ex.day] = []
          byDay[ex.day].push(ex.name)
        })
        Object.keys(byDay).forEach(day => {
          console.log(`Dia ${day}: ${byDay[day].length} exercícios - ${byDay[day].join(', ')}`)
        })
      }

      setWorkoutState({
        hasWorkout,
        workoutCreatedAt,
        workoutProfile,
        showWelcome: !hasWorkout || !workoutMeta.welcomeCompleted
      })
    } catch (error) {
      console.error('Erro ao carregar estado do treino:', error)
      // Em caso de erro, limpar dados corrompidos
      localStorage.removeItem('customExercises')
      localStorage.removeItem('workoutMeta')
      setWorkoutState({
        hasWorkout: false,
        workoutCreatedAt: null,
        workoutProfile: null,
        showWelcome: true
      })
    }
  }

  const createNewWorkout = (exercises, profile) => {
    try {
      const now = new Date().toISOString()
      
      // Salvar exercícios
      localStorage.setItem('customExercises', JSON.stringify(exercises))
      
      // Salvar metadados
      const workoutMeta = {
        createdAt: now,
        profile,
        welcomeCompleted: true,
        version: '2.0'
      }
      localStorage.setItem('workoutMeta', JSON.stringify(workoutMeta))
      
      // Limpar dados antigos de treino
      localStorage.removeItem('treino')
      
      setWorkoutState({
        hasWorkout: true,
        workoutCreatedAt: now,
        workoutProfile: profile,
        showWelcome: false
      })
      
      return true
    } catch (error) {
      console.error('Erro ao criar novo treino:', error)
      return false
    }
  }

  const renewWorkout = () => {
    // Manter histórico mas permitir novo treino
    setWorkoutState(prev => ({
      ...prev,
      showWelcome: true
    }))
  }

  const continueExistingWorkout = () => {
    setWorkoutState(prev => ({
      ...prev,
      showWelcome: false
    }))
  }

  const getWorkoutAge = () => {
    if (!workoutState.workoutCreatedAt) return null
    
    const created = new Date(workoutState.workoutCreatedAt)
    const now = new Date()
    const diffTime = Math.abs(now - created)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  return {
    workoutState,
    setWorkoutState,
    createNewWorkout,
    renewWorkout,
    continueExistingWorkout,
    getWorkoutAge: getWorkoutAge(),
    refreshState: loadWorkoutState
  }
}