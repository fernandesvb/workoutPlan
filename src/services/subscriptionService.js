import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: {
      workoutGeneration: 1,
      photoAnalysis: 0,
      exerciseSuggestions: 0,
      historyDays: 7,
      cloudSync: false
    }
  },
  BASIC: {
    id: 'basic',
    name: 'Básico',
    price: 9.90,
    features: {
      workoutGenerationPerMonth: 1,
      photoAnalysis: 0,
      exerciseSuggestionsPerMonth: 5,
      historyDays: 30,
      cloudSync: true
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 14.90,
    features: {
      workoutGenerationPerWeek: 2,
      photoAnalysisPerWorkout: 10,
      exerciseSuggestionsPerDay: 3,
      historyDays: 365,
      cloudSync: true,
      advancedAnalytics: true
    }
  },
  ANNUAL: {
    id: 'annual',
    name: 'Anual',
    price: 119.90,
    pricePerMonth: 9.99,
    features: {
      workoutGenerationPerWeek: 2,
      photoAnalysisPerWorkout: 10,
      exerciseSuggestionsPerDay: 3,
      historyDays: 365,
      cloudSync: true,
      advancedAnalytics: true,
      prioritySupport: true
    }
  }
}

export async function getUserSubscription(userId) {
  if (!userId) return { plan: PLANS.FREE, usage: {} }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return { plan: PLANS.FREE, usage: {} }
    }
    
    const data = userDoc.data()
    const planId = data.subscription?.planId || 'free'
    const plan = PLANS[planId.toUpperCase()] || PLANS.FREE
    
    return {
      plan,
      subscription: data.subscription,
      usage: data.usage || {}
    }
  } catch (error) {
    console.error('Error getting subscription:', error)
    return { plan: PLANS.FREE, usage: {} }
  }
}

export async function updateSubscription(userId, planId, paymentData = {}) {
  if (!userId) throw new Error('User ID required')
  
  const plan = PLANS[planId.toUpperCase()]
  if (!plan) throw new Error('Invalid plan')
  
  const subscription = {
    planId: plan.id,
    startDate: new Date().toISOString(),
    status: 'active',
    ...paymentData
  }
  
  await setDoc(doc(db, 'users', userId), {
    subscription,
    updatedAt: new Date().toISOString()
  }, { merge: true })
  
  return subscription
}

export async function cancelSubscription(userId) {
  if (!userId) throw new Error('User ID required')
  
  await updateDoc(doc(db, 'users', userId), {
    'subscription.status': 'cancelled',
    'subscription.cancelledAt': new Date().toISOString()
  })
}
