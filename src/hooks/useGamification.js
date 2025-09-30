import { useState, useEffect } from 'react'

export function useGamification() {
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    totalWorkouts: 0,
    badges: [],
    lastWorkoutDate: null
  })

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = () => {
    try {
      const saved = localStorage.getItem('userStats')
      if (saved) {
        setUserStats(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const saveUserStats = (stats) => {
    try {
      localStorage.setItem('userStats', JSON.stringify(stats))
      setUserStats(stats)
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error)
    }
  }

  const getLevelInfo = (level) => {
    const levels = [
      { level: 1, name: 'Iniciante', xpRequired: 0, color: '#10b981' },
      { level: 2, name: 'Dedicado', xpRequired: 100, color: '#3b82f6' },
      { level: 3, name: 'Intermediário', xpRequired: 300, color: '#8b5cf6' },
      { level: 4, name: 'Avançado', xpRequired: 600, color: '#f59e0b' },
      { level: 5, name: 'Expert', xpRequired: 1000, color: '#ef4444' },
      { level: 6, name: 'Mestre', xpRequired: 1500, color: '#ec4899' },
      { level: 7, name: 'Lenda', xpRequired: 2500, color: '#6366f1' }
    ]
    
    return levels.find(l => l.level === level) || levels[0]
  }

  const getXpForNextLevel = () => {
    const currentLevel = getLevelInfo(userStats.level)
    const nextLevel = getLevelInfo(userStats.level + 1)
    
    if (!nextLevel) return 0
    
    return nextLevel.xpRequired - currentLevel.xpRequired
  }

  const getCurrentLevelProgress = () => {
    const currentLevel = getLevelInfo(userStats.level)
    const nextLevel = getLevelInfo(userStats.level + 1)
    
    if (!nextLevel) return 100
    
    const currentLevelXp = userStats.xp - currentLevel.xpRequired
    const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired
    
    return Math.min(100, (currentLevelXp / xpNeeded) * 100)
  }

  const addExerciseXp = (exerciseName) => {
    const xpAmount = 5 // XP por exercício individual
    return addXp(xpAmount, `Exercício concluído: ${exerciseName}`)
  }

  const addXp = (amount, reason = 'Treino completado') => {
    const newXp = userStats.xp + amount
    let newLevel = userStats.level
    
    // Verificar se subiu de nível
    while (true) {
      const nextLevelInfo = getLevelInfo(newLevel + 1)
      if (nextLevelInfo && newXp >= nextLevelInfo.xpRequired) {
        newLevel++
      } else {
        break
      }
    }

    const newStats = {
      ...userStats,
      xp: newXp,
      level: newLevel
    }

    saveUserStats(newStats)
    
    return {
      leveledUp: newLevel > userStats.level,
      newLevel,
      xpGained: amount,
      reason
    }
  }

  const completeWorkout = (exercisesCompleted, totalExercises) => {
    const today = new Date().toDateString()
    const lastWorkout = userStats.lastWorkoutDate
    
    // Calcular XP baseado na completude
    const completionRate = exercisesCompleted / totalExercises
    let xpGained = Math.floor(completionRate * 50) // Base: 50 XP por treino completo
    
    // Bonus por treino completo
    if (completionRate === 1) {
      xpGained += 25
    }
    
    // Calcular streak
    let newStreak = userStats.streak
    if (lastWorkout) {
      const lastDate = new Date(lastWorkout)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        newStreak += 1
      } else if (diffDays > 1) {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }
    
    // Bonus por streak
    if (newStreak >= 7) xpGained += 20
    if (newStreak >= 30) xpGained += 50
    
    const newStats = {
      ...userStats,
      totalWorkouts: userStats.totalWorkouts + 1,
      streak: newStreak,
      lastWorkoutDate: today
    }
    
    saveUserStats(newStats)
    
    // Verificar badges
    checkBadges(newStats)
    
    return addXp(xpGained, `Treino ${Math.floor(completionRate * 100)}% completo`)
  }

  const checkBadges = (stats) => {
    const availableBadges = [
      { id: 'first_workout', name: 'Primeiro Treino', icon: '🎯', condition: stats.totalWorkouts >= 1 },
      { id: 'week_streak', name: '7 Dias Seguidos', icon: '🔥', condition: stats.streak >= 7 },
      { id: 'month_streak', name: '30 Dias Seguidos', icon: '💎', condition: stats.streak >= 30 },
      { id: 'level_5', name: 'Nível 5', icon: '⭐', condition: stats.level >= 5 },
      { id: 'hundred_workouts', name: '100 Treinos', icon: '💯', condition: stats.totalWorkouts >= 100 }
    ]
    
    const newBadges = availableBadges.filter(badge => 
      badge.condition && !stats.badges.includes(badge.id)
    )
    
    if (newBadges.length > 0) {
      const updatedStats = {
        ...stats,
        badges: [...stats.badges, ...newBadges.map(b => b.id)]
      }
      saveUserStats(updatedStats)
      return newBadges
    }
    
    return []
  }

  const getBadgeInfo = (badgeId) => {
    const badges = {
      'first_workout': { name: 'Primeiro Treino', icon: '🎯', desc: 'Completou o primeiro treino' },
      'week_streak': { name: '7 Dias Seguidos', icon: '🔥', desc: 'Treinou 7 dias consecutivos' },
      'month_streak': { name: '30 Dias Seguidos', icon: '💎', desc: 'Treinou 30 dias consecutivos' },
      'level_5': { name: 'Nível 5', icon: '⭐', desc: 'Alcançou o nível 5' },
      'hundred_workouts': { name: '100 Treinos', icon: '💯', desc: 'Completou 100 treinos' }
    }
    
    return badges[badgeId] || { name: 'Badge', icon: '🏆', desc: 'Conquista desbloqueada' }
  }

  const resetStats = () => {
    const initialStats = {
      xp: 0,
      level: 1,
      streak: 0,
      totalWorkouts: 0,
      badges: [],
      lastWorkoutDate: null
    }
    saveUserStats(initialStats)
  }

  return {
    userStats,
    getLevelInfo,
    getXpForNextLevel,
    getCurrentLevelProgress,
    addXp,
    addExerciseXp,
    completeWorkout,
    getBadgeInfo,
    resetStats,
    refreshStats: loadUserStats
  }
}