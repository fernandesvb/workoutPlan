import { useState, useEffect } from 'react'

export function useExerciseManager() {
  const [customExercises, setCustomExercises] = useState([])

  useEffect(() => {
    loadCustomExercises()
    
    // Escutar mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'customExercises') {
        loadCustomExercises()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Polling para detectar mudanças na mesma aba
    const interval = setInterval(() => {
      const current = localStorage.getItem('customExercises')
      const currentParsed = current ? JSON.parse(current) : []
      
      if (JSON.stringify(currentParsed) !== JSON.stringify(customExercises)) {
        setCustomExercises(currentParsed)
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [customExercises])

  const loadCustomExercises = () => {
    try {
      const saved = localStorage.getItem('customExercises')
      setCustomExercises(saved ? JSON.parse(saved) : [])
    } catch (error) {
      console.error('Erro ao carregar exercícios personalizados:', error)
    }
  }

  const saveCustomExercises = (exercises) => {
    try {
      localStorage.setItem('customExercises', JSON.stringify(exercises))
    } catch (error) {
      console.error('Erro ao salvar exercícios personalizados:', error)
    }
  }

  const addExercise = (exercise) => {
    const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    const newExercise = {
      id,
      name: exercise.name,
      day: parseInt(exercise.day),
      type: exercise.type,
      series: exercise.series,
      category: exercise.category || 'normal',
      notes: exercise.notes || '',
      created: new Date().toISOString()
    }
    
    setCustomExercises(prev => {
      const updated = [...prev, newExercise]
      saveCustomExercises(updated)
      return updated
    })
    
    return newExercise
  }

  const removeExercise = (id) => {
    const updated = customExercises.filter(ex => ex.id !== id)
    setCustomExercises(updated)
    saveCustomExercises(updated)
    
    // Remove dados salvos do exercício
    try {
      const data = JSON.parse(localStorage.getItem('treino') || '{}')
      for (let week = 1; week <= 4; week++) {
        const key = `${id}_w${week}`
        delete data[key]
      }
      localStorage.setItem('treino', JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao remover dados do exercício:', error)
    }
  }

  return {
    customExercises,
    addExercise,
    removeExercise
  }
}