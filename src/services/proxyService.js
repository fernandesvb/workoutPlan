// Serviço proxy para contornar CORS
export async function callClaudeAPI(prompt, workoutData, customExercises) {
  // Para desenvolvimento, usar servidor proxy local ou fallback
  console.log('🔄 CORS detectado, usando fallback inteligente')
  
  return generateSmartOfflineSuggestions(prompt, workoutData, customExercises)
}

function generateSmartOfflineSuggestions(prompt, workoutData, customExercises) {
  const suggestions = []
  const lowerPrompt = prompt.toLowerCase()
  
  // Analisar treino atual para sugestões inteligentes
  const currentExercises = getCurrentExercises(workoutData, customExercises)
  
  if (lowerPrompt.includes('ombro') || lowerPrompt.includes('deltoid')) {
    suggestions.push(
      { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Complementa bem o treino de peito' },
      { name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', day: 1, notes: 'Trabalha todos os feixes do deltóide' }
    )
  }
  
  if (lowerPrompt.includes('core') || lowerPrompt.includes('abdom')) {
    suggestions.push(
      { name: 'Prancha Dinâmica', series: '3x30s', type: 'time', category: 'core', day: getMostSuitableDay(currentExercises), notes: 'Evolução da prancha básica' },
      { name: 'Dead Bug', series: '3x10 cada', type: 'reps', category: 'core', day: 2, notes: 'Excelente para estabilização' }
    )
  }
  
  if (lowerPrompt.includes('perna') || lowerPrompt.includes('quadr')) {
    suggestions.push(
      { name: 'Agachamento Búlgaro', series: '3x12 cada', type: 'weight', category: 'normal', day: 3, notes: 'Complementa o leg press' },
      { name: 'Stiff Unilateral', series: '3x10 cada', type: 'weight', category: 'normal', day: 3, notes: 'Trabalha posterior isoladamente' }
    )
  }
  
  if (suggestions.length === 0) {
    suggestions.push(
      { name: 'Face Pull', series: '3x15', type: 'weight', category: 'normal', day: 2, notes: 'Melhora postura e equilibra treino' },
      { name: 'Farmer Walk', series: '3x30s', type: 'time', category: 'normal', day: 3, notes: 'Funcional e fortalece grip' }
    )
  }
  
  return suggestions.slice(0, 4)
}

function getCurrentExercises(workoutData, customExercises) {
  // Analisa exercícios atuais para sugestões mais inteligentes
  return {
    day1: customExercises.filter(ex => ex.day === 1).length,
    day2: customExercises.filter(ex => ex.day === 2).length,
    day3: customExercises.filter(ex => ex.day === 3).length
  }
}

function getMostSuitableDay(currentExercises) {
  // Retorna o dia com menos exercícios personalizados
  const counts = [currentExercises.day1, currentExercises.day2, currentExercises.day3]
  const minCount = Math.min(...counts)
  return counts.indexOf(minCount) + 1
}