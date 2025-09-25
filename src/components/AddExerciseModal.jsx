import { useState } from 'react'
import { X, Sparkles, Trash2 } from 'lucide-react'
import { generateAISuggestions } from '../services/aiSuggestions'

export default function AddExerciseModal({ show, onClose, onAddExercise }) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.day || !formData.type || !formData.series) {
      return
    }
    
    onAddExercise(formData)
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

  const handleGetSuggestions = async () => {
    if (!aiPrompt.trim()) {
      alert('Digite uma descrição do exercício que você precisa!')
      return
    }

    setIsLoading(true)
    try {
      const aiSuggestions = await generateAISuggestions(aiPrompt)
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

  if (!show) return null

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">➕ Novo Exercício</h2>
          <span className="close" onClick={onClose}>
            <X size={24} />
          </span>
        </div>
        
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
            placeholder="Ex: exercício para fortalecer ombros, exercício de core para iniciantes..."
          />
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
          
          {showSuggestions && (
            <div className="ai-suggestions show">
              {suggestions.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Nenhuma sugestão encontrada. Tente uma descrição diferente.
                </p>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <div className="suggestion-name">{suggestion.name}</div>
                    <div className="suggestion-desc">
                      {suggestion.series} - {suggestion.notes}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome do Exercício *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Supino Inclinado"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Dia do Treino *</label>
            <select
              className="form-select"
              value={formData.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
              required
            >
              <option value="">Selecione o dia</option>
              <option value="1">Dia 1 - Peito/Tríceps</option>
              <option value="2">Dia 2 - Costas/Bíceps</option>
              <option value="3">Dia 3 - Pernas</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Tipo de Exercício *</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="weight">Com Peso (kg)</option>
              <option value="reps">Repetições</option>
              <option value="time">Tempo (segundos)</option>
              <option value="text">Texto Livre</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Séries e Repetições *</label>
            <input
              type="text"
              className="form-input"
              value={formData.series}
              onChange={(e) => handleInputChange('series', e.target.value)}
              placeholder="Ex: 3x12, 3x30s, 4x8-10"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="normal">Exercício Normal</option>
              <option value="core">Core/Funcional</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Dicas de execução, cuidados especiais..."
            />
          </div>
          
          <div className="modal-buttons">
            <button type="button" className="modal-btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn btn-primary">
              ➕ Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}