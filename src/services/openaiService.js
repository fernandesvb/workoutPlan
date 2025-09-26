export async function analyzeWorkoutAndSuggest(workoutData, customExercises) {

  // Preparar dados do treino atual
  const workoutSummary = prepareWorkoutSummary(workoutData, customExercises)
  
  const prompt = `
Analise este treino de musculação e forneça sugestões específicas de melhoria:

TREINO ATUAL:
${workoutSummary}

Por favor, analise e forneça:
1. Pontos fortes do treino atual
2. Lacunas ou desequilíbrios identificados
3. 3-4 exercícios específicos para adicionar (com séries/reps)
4. Sugestões de progressão
5. Recomendações de frequência

Responda em português brasileiro, seja específico e prático.
`

  // Esta função não é mais usada - usar generateExerciseSuggestions
  return 'Função descontinuada'
}

function prepareWorkoutSummary(workoutData, customExercises) {
  const days = {
    1: 'Dia 1 - Peito/Tríceps',
    2: 'Dia 2 - Costas/Bíceps', 
    3: 'Dia 3 - Pernas'
  }

  let summary = ''
  
  // Exercícios padrão por dia
  const defaultExercises = {
    1: [
      { id: 'supino', name: 'Supino Máquina Smith', series: '3x12' },
      { id: 'crucifixo', name: 'Crucifixo Halteres', series: '3x12' },
      { id: 'triceps-polia', name: 'Tríceps Polia', series: '3x15' },
      { id: 'triceps-testa', name: 'Tríceps Testa', series: '3x12' },
      { id: 'prancha1', name: 'Prancha Frontal', series: '3x30-45s' },
      { id: 'superman', name: 'Superman', series: '3x15' }
    ],
    2: [
      { id: 'remada', name: 'Remada Máquina', series: '3x12' },
      { id: 'puxada', name: 'Puxada Frontal', series: '3x12' },
      { id: 'rosca-direta', name: 'Rosca Direta', series: '3x12' },
      { id: 'rosca-martelo', name: 'Rosca Martelo', series: '3x12' },
      { id: 'prancha-lateral', name: 'Prancha Lateral', series: '3x20-30s' },
      { id: 'ponte', name: 'Ponte', series: '3x15' }
    ],
    3: [
      { id: 'leg-press', name: 'Leg Press', series: '3x12' },
      { id: 'extensora', name: 'Cadeira Extensora', series: '3x12' },
      { id: 'flexora', name: 'Cadeira Flexora', series: '3x12' },
      { id: 'panturrilha', name: 'Panturrilha', series: '3x20' },
      { id: 'bicicleta', name: 'Abdominal Bicicleta', series: '3x20' },
      { id: 'gato-vaca', name: 'Gato-Vaca', series: '3x10' }
    ]
  }

  for (let day = 1; day <= 3; day++) {
    summary += `\n${days[day]}:\n`
    
    // Exercícios padrão
    defaultExercises[day].forEach(exercise => {
      const weights = []
      for (let week = 1; week <= 4; week++) {
        const key = `${exercise.id}_w${week}`
        const value = workoutData[key] || '-'
        weights.push(value)
      }
      summary += `- ${exercise.name} (${exercise.series}): ${weights.join(', ')}\n`
    })
    
    // Exercícios personalizados
    const customForDay = customExercises.filter(ex => ex.day === day)
    customForDay.forEach(exercise => {
      const weights = []
      for (let week = 1; week <= 4; week++) {
        const key = `${exercise.id}_w${week}`
        const value = workoutData[key] || '-'
        weights.push(value)
      }
      summary += `- ${exercise.name} (${exercise.series}): ${weights.join(', ')} [PERSONALIZADO]\n`
    })
  }

  return summary
}

export async function generateExerciseSuggestions(prompt, workoutData, customExercises) {
  console.log('🤖 Iniciando geração de sugestões de IA...')
  console.log('📝 Prompt:', prompt)

  const workoutContext = prepareWorkoutSummary(workoutData, customExercises)
  
  const fullPrompt = `
Baseado no treino atual do usuário:
${workoutContext}

O usuário está pedindo: "${prompt}"

Sugira 3-4 exercícios específicos que complementem bem o treino atual. Para cada exercício, forneça:
- Nome do exercício
- Séries e repetições recomendadas
- Breve descrição da execução
- Em qual dia seria melhor incluir (1=Peito/Tri, 2=Costas/Bi, 3=Pernas)

Responda em formato JSON:
[
  {
    "name": "Nome do Exercício",
    "series": "3x12",
    "type": "weight|reps|time|text",
    "category": "normal|core", 
    "day": 1,
    "notes": "Dica de execução"
  }
]
`

  try {
    console.log('🌐 Fazendo chamada para Claude API...')
    
    // IA Mock - sugestões inteligentes baseadas no prompt
    console.log('🤖 Usando IA Mock...')
    
    const result = generateMockSuggestions(prompt, customExercises)
    console.log('✅ Resposta recebida:', result)
    
    // Se tiver explicação, mostrar para o usuário
    if (result.explanation && typeof result.explanation === 'string') {
      console.log('💬 Explicação:', result.explanation)
      // Mostrar explicação em alert temporário
      setTimeout(() => {
        alert(`🤖 IA explica:\n\n${result.explanation}`)
      }, 500)
    }
    
    return result.exercises || result
  } catch (error) {
    console.error('❌ Erro geral ao chamar Claude:', error)
    throw error
  }
}

function generateMockSuggestions(prompt, customExercises) {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('ombro')) {
    return {
      exercises: [
        { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Mantenha cotovelos ligeiramente flexionados' },
        { name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', day: 1, notes: 'Movimento completo de rotação' }
      ],
      explanation: 'Sugeri exercícios de ombros para o Dia 1 pois complementam o treino de peito.'
    }
  }
  
  if (lowerPrompt.includes('core')) {
    return {
      exercises: [
        { name: 'Prancha com Elevação', series: '3x30s', type: 'time', category: 'core', day: 1, notes: 'Alterne elevando braços e pernas' },
        { name: 'Russian Twist', series: '3x20', type: 'reps', category: 'core', day: 2, notes: 'Gire o tronco mantendo pés elevados' }
      ],
      explanation: 'Exercícios de core distribuídos para fortalecer toda região abdominal.'
    }
  }
  
  if (lowerPrompt.includes('perna') || lowerPrompt.includes('coxa') || lowerPrompt.includes('glúteo')) {
    return {
      exercises: [
        { name: 'Afundo Alternado', series: '3x12', type: 'weight', category: 'normal', day: 3, notes: 'Descer até 90°, manter tronco ereto' },
        { name: 'Stiff', series: '3x12', type: 'weight', category: 'normal', day: 3, notes: 'Descer halteres mantendo pernas semi-flexionadas' },
        { name: 'Agachamento Livre', series: '3x15', type: 'weight', category: 'normal', day: 3, notes: 'Descer até coxas paralelas ao chão' }
      ],
      explanation: 'Exercícios de pernas adicionais para o Dia 3, focando em quadríceps, posterior e glúteos.'
    }
  }
  
  return {
    exercises: [
      { name: 'Desenvolvimento Halteres', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Movimento completo até linha do peito' },
      { name: 'Puxada Triângulo', series: '3x12', type: 'weight', category: 'normal', day: 2, notes: 'Puxe até o peito' }
    ],
    explanation: `Exercícios complementares para "${prompt}" distribuídos nos dias apropriados.`
  }
}

