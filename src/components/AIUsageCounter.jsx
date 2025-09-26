import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp } from 'lucide-react'

export default function AIUsageCounter() {
  const [usage, setUsage] = useState({
    totalTokensIn: 13574,
    totalTokensOut: 19889,
    todayQueries: 0,
    totalQueries: 0
  })

  useEffect(() => {
    loadUsage()
  }, [])

  const loadUsage = () => {
    try {
      const saved = localStorage.getItem('aiUsage')
      if (saved) {
        const data = JSON.parse(saved)
        setUsage(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Erro ao carregar uso da IA:', error)
    }
  }

  const saveUsage = (newUsage) => {
    try {
      localStorage.setItem('aiUsage', JSON.stringify(newUsage))
      setUsage(newUsage)
    } catch (error) {
      console.error('Erro ao salvar uso da IA:', error)
    }
  }

  const incrementUsage = () => {
    const today = new Date().toDateString()
    const lastDate = localStorage.getItem('aiUsageDate')
    
    const newUsage = {
      ...usage,
      totalQueries: usage.totalQueries + 1,
      todayQueries: lastDate === today ? usage.todayQueries + 1 : 1,
      totalTokensIn: usage.totalTokensIn + 500, // Estimativa
      totalTokensOut: usage.totalTokensOut + 650 // Estimativa
    }
    
    localStorage.setItem('aiUsageDate', today)
    saveUsage(newUsage)
  }

  // Expor função globalmente para ser chamada quando usar IA
  useEffect(() => {
    window.incrementAIUsage = incrementUsage
  }, [usage])

  const calculateCost = () => {
    const inputCost = (usage.totalTokensIn / 1000000) * 0.25
    const outputCost = (usage.totalTokensOut / 1000000) * 1.25
    return (inputCost + outputCost).toFixed(4)
  }

  const todayCost = () => {
    const avgTokensIn = 500
    const avgTokensOut = 650
    const inputCost = (avgTokensIn * usage.todayQueries / 1000000) * 0.25
    const outputCost = (avgTokensOut * usage.todayQueries / 1000000) * 1.25
    return (inputCost + outputCost).toFixed(4)
  }

  return (
    <div className="ai-usage-counter">
      <div className="usage-header">
        <Sparkles size={16} />
        <span>Uso da IA</span>
      </div>
      <div className="usage-stats">
        <div className="usage-item">
          <span className="usage-label">Hoje:</span>
          <span className="usage-value">{usage.todayQueries} consultas (~${todayCost()})</span>
        </div>
        <div className="usage-item">
          <span className="usage-label">Total:</span>
          <span className="usage-value">{usage.totalQueries} consultas (~${calculateCost()})</span>
        </div>
        <div className="usage-item">
          <span className="usage-label">Tokens:</span>
          <span className="usage-value">{(usage.totalTokensIn + usage.totalTokensOut).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}