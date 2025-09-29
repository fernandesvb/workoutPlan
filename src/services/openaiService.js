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
    
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        workoutData,
        customExercises
      })
    })

    console.log('📡 Status da resposta:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na API Claude:', response.status, errorText)
      throw new Error(`Erro na API: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Resposta recebida:', result)
    
    // Incrementar contador de uso da IA
    if (window.incrementAIUsage) {
      window.incrementAIUsage()
    }
    
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
  
  // Analisar exercícios já adicionados
  const exercisesDay1 = customExercises.filter(ex => ex.day === 1).map(ex => ex.name.toLowerCase())
  const exercisesDay2 = customExercises.filter(ex => ex.day === 2).map(ex => ex.name.toLowerCase())
  const exercisesDay3 = customExercises.filter(ex => ex.day === 3).map(ex => ex.name.toLowerCase())
  
  if (lowerPrompt.includes('ombro')) {
    const hasLateral = exercisesDay1.some(name => name.includes('lateral'))
    const hasArnold = exercisesDay1.some(name => name.includes('arnold'))
    
    const suggestions = []
    if (!hasLateral) suggestions.push({ name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Mantenha cotovelos ligeiramente flexionados' })
    if (!hasArnold) suggestions.push({ name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', day: 1, notes: 'Movimento completo de rotação' })
    
    // Se já tem esses, sugerir outros
    if (suggestions.length === 0) {
      suggestions.push({ name: 'Elevação Posterior', series: '3x15', type: 'weight', category: 'normal', day: 1, notes: 'Incline o tronco e eleve lateralmente' })
    }
    
    return {
      exercises: suggestions,
      explanation: `Analisei seu treino atual. Você já tem ${customExercises.length} exercícios personalizados. Sugeri ombros para complementar o Dia 1 (Peito/Tríceps).`
    }
  }
  
  if (lowerPrompt.includes('core') || lowerPrompt.includes('barriga') || lowerPrompt.includes('abdomen') || lowerPrompt.includes('trincar') || lowerPrompt.includes('tanquinho')) {
    const coreExercises = customExercises.filter(ex => ex.category === 'core')
    
    const suggestions = [
      { name: 'Prancha com Elevação', series: '3x45s', type: 'time', category: 'core', day: 1, notes: 'Alterne elevando braços e pernas, mantém core ativado' },
      { name: 'Russian Twist', series: '3x25', type: 'reps', category: 'core', day: 2, notes: 'Gire o tronco com peso, pés elevados' },
      { name: 'Mountain Climber', series: '3x30s', type: 'time', category: 'core', day: 3, notes: 'Movimento rápido, queima gordura abdominal' },
      { name: 'Abdominal V-Up', series: '3x15', type: 'reps', category: 'core', day: 1, notes: 'Suba tronco e pernas simultaneamente' }
    ]
    
    return {
      exercises: suggestions.slice(0, 3),
      explanation: `Para "trincar a barriga" precisa: 1) Exercícios de core (sugeri 3), 2) Cardio (já tem bicicleta), 3) Dieta (fundamental!). Você já tem ${coreExercises.length} exercícios de core. Distribuí nos 3 dias para trabalhar toda região abdominal.`
    }
  }
  
  if (lowerPrompt.includes('perna') || lowerPrompt.includes('coxa') || lowerPrompt.includes('glúteo')) {
    const hasAfundo = exercisesDay3.some(name => name.includes('afundo'))
    const hasStiff = exercisesDay3.some(name => name.includes('stiff'))
    const hasAgachamento = exercisesDay3.some(name => name.includes('agachamento'))
    
    const suggestions = []
    if (!hasAfundo) suggestions.push({ name: 'Afundo Alternado', series: '3x12', type: 'weight', category: 'normal', day: 3, notes: 'Descer até 90°, manter tronco ereto' })
    if (!hasStiff) suggestions.push({ name: 'Stiff', series: '3x12', type: 'weight', category: 'normal', day: 3, notes: 'Trabalha posterior de coxa e glúteos' })
    if (!hasAgachamento) suggestions.push({ name: 'Agachamento Livre', series: '3x15', type: 'weight', category: 'normal', day: 3, notes: 'Exercício completo para pernas' })
    
    if (suggestions.length === 0) {
      suggestions.push({ name: 'Cadeira Abdutora', series: '3x15', type: 'weight', category: 'normal', day: 3, notes: 'Fortalece glúteo médio' })
    }
    
    return {
      exercises: suggestions,
      explanation: `Seu treino atual já tem: Leg Press, Extensora, Flexora, Panturrilha. Você adicionou ${exercisesDay3.length} exercícios no Dia 3. Sugeri complementos para pernas.`
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

