import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { PLANS } from './subscriptionService'

const RATE_LIMITS = {
  FREE: {
    workoutGeneration: { total: 1, period: 'lifetime' },
    photoAnalysis: { total: 0, period: 'lifetime' },
    exerciseSuggestions: { total: 0, period: 'lifetime' }
  },
  BASIC: {
    workoutGeneration: { total: 1, period: 'month' },
    photoAnalysis: { total: 0, period: 'month' },
    exerciseSuggestions: { total: 5, period: 'month' }
  },
  PREMIUM: {
    workoutGeneration: { total: 2, period: 'week' },
    photoAnalysis: { total: 10, period: 'workout' },
    exerciseSuggestions: { total: 3, period: 'day' }
  },
  ANNUAL: {
    workoutGeneration: { total: 2, period: 'week' },
    photoAnalysis: { total: 10, period: 'workout' },
    exerciseSuggestions: { total: 3, period: 'day' }
  }
}

function getResetDate(period) {
  const now = new Date()
  
  switch (period) {
    case 'day':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
    case 'week':
      const nextWeek = new Date(now)
      nextWeek.setDate(now.getDate() + (7 - now.getDay()))
      return new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate()).toISOString()
    case 'month':
      return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
    case 'workout':
      return null // Reset on new workout
    case 'lifetime':
      return null
    default:
      return null
  }
}

function shouldResetUsage(lastReset, period) {
  if (!lastReset || period === 'lifetime') return false
  return new Date() >= new Date(lastReset)
}

export async function checkRateLimit(userId, action, planId = 'free') {
  if (!userId) {
    return { allowed: false, reason: 'User not authenticated' }
  }
  
  const limits = RATE_LIMITS[planId.toUpperCase()] || RATE_LIMITS.FREE
  const limit = limits[action]
  
  if (!limit) {
    return { allowed: true }
  }
  
  try {
    const usageDoc = await getDoc(doc(db, 'users', userId, 'usage', action))
    let usage = usageDoc.exists() ? usageDoc.data() : { count: 0 }
    
    // Reset if period expired
    if (shouldResetUsage(usage.resetAt, limit.period)) {
      usage = { count: 0 }
    }
    
    // Check limit
    if (usage.count >= limit.total) {
      return {
        allowed: false,
        reason: `Limite atingido: ${limit.total} ${action} por ${limit.period}`,
        limit: limit.total,
        used: usage.count,
        resetAt: usage.resetAt
      }
    }
    
    return {
      allowed: true,
      limit: limit.total,
      used: usage.count,
      remaining: limit.total - usage.count
    }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return { allowed: true } // Fail open
  }
}

export async function incrementUsage(userId, action, planId = 'free') {
  if (!userId) return
  
  const limits = RATE_LIMITS[planId.toUpperCase()] || RATE_LIMITS.FREE
  const limit = limits[action]
  
  if (!limit) return
  
  try {
    const usageRef = doc(db, 'users', userId, 'usage', action)
    const usageDoc = await getDoc(usageRef)
    let usage = usageDoc.exists() ? usageDoc.data() : { count: 0 }
    
    // Reset if period expired
    if (shouldResetUsage(usage.resetAt, limit.period)) {
      usage = { count: 0 }
    }
    
    const newCount = usage.count + 1
    const resetAt = getResetDate(limit.period)
    
    await setDoc(usageRef, {
      count: newCount,
      resetAt,
      lastUsed: new Date().toISOString()
    })
    
    return { count: newCount, resetAt }
  } catch (error) {
    console.error('Error incrementing usage:', error)
  }
}

export async function resetWorkoutPhotoUsage(userId) {
  if (!userId) return
  
  try {
    await setDoc(doc(db, 'users', userId, 'usage', 'photoAnalysis'), {
      count: 0,
      resetAt: null,
      lastUsed: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error resetting photo usage:', error)
  }
}

export async function getUsageSummary(userId, planId = 'free') {
  if (!userId) return {}
  
  const limits = RATE_LIMITS[planId.toUpperCase()] || RATE_LIMITS.FREE
  const summary = {}
  
  for (const action of Object.keys(limits)) {
    const check = await checkRateLimit(userId, action, planId)
    summary[action] = {
      limit: check.limit,
      used: check.used || 0,
      remaining: check.remaining || check.limit,
      resetAt: check.resetAt
    }
  }
  
  return summary
}
