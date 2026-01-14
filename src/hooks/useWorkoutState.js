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

    // Escutar evento de dados carregados do Firebase
    const handleDataLoaded = () => {
      loadWorkoutState()
    }

    window.addEventListener('dataLoaded', handleDataLoaded)

    return () => {
      window.removeEventListener('dataLoaded', handleDataLoaded)
    }
  }, [])

  const loadWorkoutState = () => {
    try {
      const customExercises = JSON.parse(localStorage.getItem('customExercises') || '[]')
      const workoutMeta = JSON.parse(localStorage.getItem('workoutMeta') || '{}')
      
      const hasWorkout = customExercises.length > 0
      const workoutCreatedAt = workoutMeta.createdAt
      const workoutProfile = workoutMeta.profile
      
      // Estado carregado

      setWorkoutState({
        hasWorkout,
        workoutCreatedAt,
        workoutProfile,
        showWelcome: true // Sempre mostrar welcome screen ao abrir o app
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

      // PRESERVAR dados do usuário antes da limpeza
      const userStats = localStorage.getItem('userStats')
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')

      // LIMPEZA TOTAL PRIMEIRO (exceto dados do usuário)
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

      keysToRemove.forEach(key => localStorage.removeItem(key))

      // RESTAURAR dados do usuário
      if (userStats) localStorage.setItem('userStats', userStats)
      if (hasSeenTutorial) localStorage.setItem('hasSeenTutorial', hasSeenTutorial)
      
      // Salvar novos exercícios
      localStorage.setItem('customExercises', JSON.stringify(exercises))
      
      // Salvar metadados
      const workoutMeta = {
        createdAt: now,
        profile,
        welcomeCompleted: true,
        version: '3.0',
        exerciseCount: exercises.length
      }
      localStorage.setItem('workoutMeta', JSON.stringify(workoutMeta))
      
      // Atualizar estado IMEDIATAMENTE
      setWorkoutState({
        hasWorkout: true,
        workoutCreatedAt: now,
        workoutProfile: profile,
        showWelcome: false
      })
      
      // Salvar no Firebase se logado (após atualizar estado)
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.saveToFirebase) {
          window.saveToFirebase()
        }
      }, 100)
      
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