import { useState } from 'react'
import { X, Sparkles, Trash2 } from 'lucide-react'
import { generateExerciseSuggestions } from '../services/openaiService'

export default function AddExerciseModal({ show, onClose, onAddExercise, addExerciseDirectly, onRemoveExercise, workoutData, customExercises }) {
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    type: '',
    series: '',
    category: 'normal',
    notes: ''
  })
  const [aiPrompt, setAiPrompt] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e, customData = null) => {
    e.preventDefault()
    const dataToUse = customData || formData
    
    if (!dataToUse.name || !dataToUse.day || !dataToUse.type || !dataToUse.series) {
      return
    }
    
    onAddExercise(dataToUse, !!customData)
    
    if (!customData) {
      setFormData({
        name: '',
        day: '',
        type: '',
        series: '',
        category: 'normal',
        notes: ''
      })
      setAiPrompt('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleGetSuggestions = async () => {
    if (!aiPrompt.trim()) {
      alert('Digite uma descrição do exercício que você precisa!')
      return
    }

    setIsLoading(true)
    try {
      const aiSuggestions = await generateExerciseSuggestions(aiPrompt, workoutData, customExercises)
      setSuggestions(aiSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Erro ao obter sugestões:', error)
      alert('Erro ao gerar sugestões. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const applySuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      day: suggestion.day.toString(),
      type: suggestion.type,
      series: suggestion.series,
      category: suggestion.category,
      notes: suggestion.notes
    }))
  }

  const clearSuggestions = () => {
    setAiPrompt('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleAddAllSuggestions = () => {
    if (!suggestions || suggestions.length === 0) {
      alert('⚠️ Nenhuma sugestão para adicionar!')
      return
    }
    
    // Testar chamada direta
    suggestions.forEach((suggestion, index) => {
      console.log(`Adicionando exercício ${index + 1}:`, suggestion)
      
      const exerciseData = {
        name: suggestion.name,
        day: suggestion.day,
        type: suggestion.type,
        series: suggestion.series,
        category: suggestion.category || 'normal',
        notes: suggestion.notes || ''
      }
      
      // Chamar addExercise diretamente
      addExerciseDirectly(exerciseData)
    })
    
    alert(`✅ ${suggestions.length} exercícios processados!`)
    setSuggestions([])
    setShowSuggestions(false)
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">➕ Novo Exercício</h2>
          <button className="close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
        
        {/* Seção de IA */}
        <div className="ai-section">
          <div className="ai-title">
            <Sparkles size={16} />
            Sugestão com IA
          </div>
          <input
            type="text"
            className="ai-input"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleGetSuggestions()
              }
            }}
            placeholder="Ex: exercício para fortalecer ombros, exercício de core para iniciantes..."
          />
          <div className="ai-buttons">
            <button
              className="ai-btn"
              onClick={handleGetSuggestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span> Gerando...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Gerar Sugestões
                </>
              )}
            </button>
            <button className="ai-btn" onClick={clearSuggestions}>
              <Trash2 size={14} /> Limpar
            </button>
          </div>
          
          {showSuggestions && (
            <div className="ai-suggestions show">
              {suggestions.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Nenhuma sugestão encontrada. Tente uma descrição diferente.
                </p>
              ) : (
                <>
                  <div className="suggestions-header">
                    <h4>Sugestões da IA</h4>
                    <div className="add-buttons">
                      <button 
                        className="add-all-btn"
                        onClick={handleAddAllSuggestions}
                      >
                        ➕ Adicionar Todos
                      </button>
                      

                    </div>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <div className="suggestion-content" onClick={() => applySuggestion(suggestion)}>
                        <div className="suggestion-name">{suggestion.name}</div>
                        <div className="suggestion-desc">
                          Dia {suggestion.day} - {suggestion.series} - {suggestion.notes}
                        </div>
                      </div>
                      <button 
                        className="suggestion-add-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          const exerciseData = {
                            name: suggestion.name,
                            day: suggestion.day,
                            type: suggestion.type,
                            series: suggestion.series,
                            category: suggestion.category || 'normal',
                            notes: suggestion.notes || ''
                          }
                          console.log('Adicionando exercício:', exerciseData)
                          onAddExercise(exerciseData)
                          alert(`✅ ${suggestion.name} adicionado ao Dia ${suggestion.day}!`)
                        }}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        </div>
        
        <div className="modal-buttons">
          <button type="button" className="modal-btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}