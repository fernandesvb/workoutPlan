import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'

export function useWorkoutData(user) {
  const [workoutData, setWorkoutData] = useState({})
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      if (user && db) {
        const docRef = doc(db, 'workouts', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setWorkoutData(data.workoutData || {})
          setNotes(data.notes || '')
          localStorage.setItem('treino', JSON.stringify(data))
          return
        }
      }
      
      // Fallback para localStorage
      const saved = localStorage.getItem('treino')
      if (saved) {
        const data = JSON.parse(saved)
        setWorkoutData(data.workoutData || {})
        setNotes(data.notes || '')
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const saveData = async () => {
    const data = { workoutData, notes }
    
    try {
      // Sempre salva no localStorage
      localStorage.setItem('treino', JSON.stringify(data))
      
      // Salva no Firebase se disponível
      if (user && db) {
        const docRef = doc(db, 'workouts', user.uid)
        await setDoc(docRef, {
          ...data,
          lastUpdated: serverTimestamp(),
          version: Date.now()
        })
      }
      
      return true
    } catch (error) {
      console.error('Erro ao salvar:', error)
      return false
    }
  }

  const exportData = (customExercises = []) => {
    let csv = 'Exercício,Sem 1,Sem 2,Sem 3,Sem 4\\n'
    
    // Exercícios padrão
    const defaultExercises = [
      'Supino Smith,supino',
      'Crucifixo,crucifixo',
      'Tríceps Polia,triceps-polia',
      'Tríceps Testa,triceps-testa',
      'Prancha Frontal,prancha1',
      'Superman,superman',
      'Remada,remada',
      'Puxada,puxada',
      'Rosca Direta,rosca-direta',
      'Rosca Martelo,rosca-martelo',
      'Prancha Lateral,prancha-lateral',
      'Ponte,ponte',
      'Leg Press,leg-press',
      'Extensora,extensora',
      'Flexora,flexora',
      'Panturrilha,panturrilha',
      'Abdominal Bicicleta,bicicleta',
      'Gato-Vaca,gato-vaca'
    ]
    
    // Adicionar exercícios padrão
    defaultExercises.forEach(ex => {
      const [name, id] = ex.split(',')
      let row = name
      for (let w = 1; w <= 4; w++) {
        const key = `${id}_w${w}`
        row += ',' + (workoutData[key] || '')
      }
      csv += row + '\\n'
    })
    
    // Adicionar exercícios personalizados
    customExercises.forEach(exercise => {
      let row = exercise.name
      for (let w = 1; w <= 4; w++) {
        const key = `${exercise.id}_w${w}`
        row += ',' + (workoutData[key] || '')
      }
      csv += row + '\\n'
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'treino.csv'
    link.click()
  }

  const clearData = async () => {
    try {
      localStorage.removeItem('treino')
      
      if (user && db) {
        const docRef = doc(db, 'workouts', user.uid)
        await deleteDoc(docRef)
      }
      
      setWorkoutData({})
      setNotes('')
      return true
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      return false
    }
  }

  const updateWorkout = (key, value) => {
    setWorkoutData(prev => ({ ...prev, [key]: value }))
  }

  const updateNotes = (value) => {
    setNotes(value)
  }

  return {
    workoutData,
    notes,
    updateWorkout,
    updateNotes,
    saveData,
    exportData,
    clearData
  }
}