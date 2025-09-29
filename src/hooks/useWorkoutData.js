import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'

export function useWorkoutData(user) {
  const [workoutData, setWorkoutData] = useState({})
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadData()
  }, [user])
  
  // Salvamento automático quando dados mudam
  useEffect(() => {
    const autoSave = async () => {
      if (Object.keys(workoutData).length > 0 || notes.trim()) {
        try {
          const customExercises = JSON.parse(localStorage.getItem('customExercises') || '[]')
          const workoutMeta = JSON.parse(localStorage.getItem('workoutMeta') || '{}')

          const data = { workoutData, notes, customExercises, workoutMeta }

          // Sempre salvar localmente primeiro
          localStorage.setItem('treino', JSON.stringify(data))

          // Tentar salvar na nuvem se logado
          if (user && db) {
            try {
              const docRef = doc(db, 'workouts', user.uid)
              await setDoc(docRef, {
                ...data,
                lastUpdated: serverTimestamp(),
                version: Date.now()
              })
              // Disparar evento de sucesso para UI
              window.dispatchEvent(new CustomEvent('dataSaved', {
                detail: { location: 'cloud', success: true }
              }))
            } catch (error) {
              // Falha na nuvem, mas salvo localmente
              window.dispatchEvent(new CustomEvent('dataSaved', {
                detail: { location: 'local', success: true, cloudError: true }
              }))
            }
          } else {
            // Não logado, apenas local
            window.dispatchEvent(new CustomEvent('dataSaved', {
              detail: { location: 'local', success: true, notLoggedIn: true }
            }))
          }
        } catch (error) {
          // Erro total
          window.dispatchEvent(new CustomEvent('dataSaved', {
            detail: { success: false, error: error.message }
          }))
        }
      }
    }

    const timeoutId = setTimeout(autoSave, 2000)
    return () => clearTimeout(timeoutId)
  }, [workoutData, notes, user])

  const loadData = async () => {
    try {
      if (user && db) {
        const docRef = doc(db, 'workouts', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setWorkoutData(data.workoutData || {})
          setNotes(data.notes || '')
          
          // Restaurar exercícios personalizados
          if (data.customExercises) {
            localStorage.setItem('customExercises', JSON.stringify(data.customExercises))
          }
          
          // Restaurar metadados do treino
          if (data.workoutMeta) {
            localStorage.setItem('workoutMeta', JSON.stringify(data.workoutMeta))
          }
          
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
      // Erro silencioso - fallback para localStorage
    }
  }

  const saveData = async () => {
    try {
      // Coletar todos os dados
      const customExercises = JSON.parse(localStorage.getItem('customExercises') || '[]')
      const workoutMeta = JSON.parse(localStorage.getItem('workoutMeta') || '{}')
      
      const data = { 
        workoutData, 
        notes,
        customExercises,
        workoutMeta
      }
      
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