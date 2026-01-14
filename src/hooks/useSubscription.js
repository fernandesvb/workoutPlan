import { useState, useEffect } from 'react'
import { getUserSubscription, PLANS } from '../services/subscriptionService'
import { checkRateLimit, incrementUsage, getUsageSummary } from '../services/rateLimitService'

export function useSubscription(userId) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState({})

  useEffect(() => {
    if (!userId) {
      setSubscription({ plan: PLANS.FREE, usage: {} })
      setLoading(false)
      return
    }

    loadSubscription()
  }, [userId])

  async function loadSubscription() {
    try {
      const data = await getUserSubscription(userId)
      setSubscription(data)
      
      // Load usage summary
      const usageSummary = await getUsageSummary(userId, data.plan.id)
      setUsage(usageSummary)
    } catch (error) {
      console.error('Error loading subscription:', error)
      setSubscription({ plan: PLANS.FREE, usage: {} })
    } finally {
      setLoading(false)
    }
  }

  async function canUseFeature(action) {
    if (!userId) return { allowed: false, reason: 'Login necessário' }
    
    const planId = subscription?.plan?.id || 'free'
    return await checkRateLimit(userId, action, planId)
  }

  async function useFeature(action) {
    if (!userId) return false
    
    const check = await canUseFeature(action)
    if (!check.allowed) return false
    
    const planId = subscription?.plan?.id || 'free'
    await incrementUsage(userId, action, planId)
    
    // Reload usage
    const usageSummary = await getUsageSummary(userId, planId)
    setUsage(usageSummary)
    
    return true
  }

  function isPremium() {
    return subscription?.plan?.id === 'premium' || subscription?.plan?.id === 'annual'
  }

  function isBasic() {
    return subscription?.plan?.id === 'basic'
  }

  function isFree() {
    return !subscription?.plan || subscription?.plan?.id === 'free'
  }

  return {
    subscription,
    usage,
    loading,
    canUseFeature,
    useFeature,
    isPremium,
    isBasic,
    isFree,
    reload: loadSubscription
  }
}
