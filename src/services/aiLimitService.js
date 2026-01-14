import { checkRateLimit, incrementUsage } from '../services/rateLimitService'

export async function analyzePhotoWithLimit(userId, planId, imageBase64, prompt) {
  const check = await checkRateLimit(userId, 'photoAnalysis', planId)
  
  if (!check.allowed) {
    return {
      success: false,
      error: check.reason,
      limit: check.limit,
      used: check.used
    }
  }

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt,
        image: imageBase64
      })
    })
    
    if (!response.ok) {
      return { success: false, error: 'Erro na análise' }
    }

    const result = await response.json()
    
    await incrementUsage(userId, 'photoAnalysis', planId)
    
    return {
      success: true,
      data: result,
      remaining: check.remaining - 1
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getSuggestionWithLimit(userId, planId, prompt) {
  const check = await checkRateLimit(userId, 'exerciseSuggestions', planId)
  
  if (!check.allowed) {
    return {
      success: false,
      error: check.reason,
      limit: check.limit,
      used: check.used
    }
  }

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    
    if (!response.ok) {
      return { success: false, error: 'Erro ao gerar sugestão' }
    }

    const result = await response.json()
    
    await incrementUsage(userId, 'exerciseSuggestions', planId)
    
    return {
      success: true,
      data: result,
      remaining: check.remaining - 1
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
