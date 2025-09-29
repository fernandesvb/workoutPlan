// Mapeamento de categorias para ícones e cores
export const getExerciseIcon = (category, type) => {
  const iconMap = {
    // Grupos musculares com ícones mais específicos
    'chest': { icon: '🦾', color: '#dc2626', name: 'PEITO' },
    'back': { icon: '🏋️‍♂️', color: '#1d4ed8', name: 'COSTAS' },
    'shoulders': { icon: '🤸‍♂️', color: '#ea580c', name: 'OMBROS' },
    'arms': { icon: '💪', color: '#059669', name: 'BRAÇOS' },
    'biceps': { icon: '💪', color: '#10b981', name: 'BÍCEPS' },
    'triceps': { icon: '🔥', color: '#dc2626', name: 'TRÍCEPS' },
    'legs': { icon: '🦵', color: '#7c3aed', name: 'PERNAS' },
    'glutes': { icon: '🍑', color: '#be185d', name: 'GLÚTEOS' },
    'core': { icon: '⚡', color: '#d97706', name: 'CORE' },
    'abs': { icon: '🎯', color: '#d97706', name: 'ABDOMEN' },
    'cardio': { icon: '❤️‍🔥', color: '#dc2626', name: 'CARDIO' },

    // Tipos de exercício
    'weight': { icon: '🏋️', color: '#6366f1', name: 'Peso' },
    'bodyweight': { icon: '🤸', color: '#10b981', name: 'Peso Corporal' },
    'resistance': { icon: '🎪', color: '#8b5cf6', name: 'Resistência' },
    'flexibility': { icon: '🧘', color: '#06b6d4', name: 'Flexibilidade' },
    'time': { icon: '⏱️', color: '#f59e0b', name: 'Tempo' },
    'reps': { icon: '🔢', color: '#14b8a6', name: 'Repetições' },

    // Exercícios específicos (nome exato)
    'supino': { icon: '🦾', color: '#dc2626', name: 'SUPINO' },
    'agachamento': { icon: '🦵', color: '#7c3aed', name: 'AGACHAMENTO' },
    'deadlift': { icon: '🏋️‍♀️', color: '#1d4ed8', name: 'LEVANTAMENTO' },
    'pullup': { icon: '🔝', color: '#1d4ed8', name: 'BARRA FIXA' },
    'pushup': { icon: '⬆️', color: '#dc2626', name: 'FLEXÃO' },
    'plank': { icon: '⚡', color: '#d97706', name: 'PRANCHA' },
    'burpee': { icon: '💥', color: '#dc2626', name: 'BURPEE' },
    'jump': { icon: '🤸‍♀️', color: '#f59e0b', name: 'SALTO' },

    // Default
    'normal': { icon: '💪', color: '#6b7280', name: 'EXERCÍCIO' },
    'default': { icon: '🏃‍♂️', color: '#6366f1', name: 'EXERCÍCIO' }
  }

  // Tentar encontrar por categoria primeiro
  if (category && iconMap[category.toLowerCase()]) {
    return iconMap[category.toLowerCase()]
  }

  // Tentar encontrar por tipo
  if (type && iconMap[type.toLowerCase()]) {
    return iconMap[type.toLowerCase()]
  }

  // Retornar default
  return iconMap.default
}

// Função para detectar categoria por nome do exercício
export const detectExerciseCategory = (exerciseName) => {
  const name = exerciseName.toLowerCase()
  
  // Peito
  if (name.includes('supino') || name.includes('crucifixo') || name.includes('flexão') || 
      name.includes('chest') || name.includes('peito') || name.includes('press')) {
    return 'chest'
  }
  
  // Costas
  if (name.includes('remada') || name.includes('pulldown') || name.includes('barra fixa') ||
      name.includes('back') || name.includes('costas') || name.includes('pull') ||
      name.includes('puxada')) {
    return 'back'
  }
  
  // Ombros
  if (name.includes('elevação') || name.includes('desenvolvimento') || name.includes('ombro') ||
      name.includes('shoulder') || name.includes('lateral') || name.includes('frontal') ||
      name.includes('militar') || name.includes('arnold')) {
    return 'shoulders'
  }
  
  // Bíceps
  if (name.includes('rosca') || name.includes('bíceps') || name.includes('bicep') ||
      name.includes('curl') || name.includes('martelo')) {
    return 'biceps'
  }
  
  // Tríceps
  if (name.includes('tríceps') || name.includes('tricep') || name.includes('mergulho') ||
      name.includes('extensão') || name.includes('testa') || name.includes('pulley') ||
      name.includes('coice')) {
    return 'triceps'
  }
  
  // Pernas
  if (name.includes('agachamento') || name.includes('squat') || name.includes('afundo') ||
      name.includes('lunge') || name.includes('perna') || name.includes('coxa') ||
      name.includes('leg') || name.includes('stiff') || name.includes('extensora') ||
      name.includes('flexora')) {
    return 'legs'
  }
  
  // Glúteos
  if (name.includes('glúteo') || name.includes('ponte') || name.includes('hip thrust') ||
      name.includes('elevação pélvica') || name.includes('sumo')) {
    return 'glutes'
  }
  
  // Core/Abs
  if (name.includes('abdominal') || name.includes('prancha') || name.includes('plank') ||
      name.includes('core') || name.includes('abs') || name.includes('crunch') ||
      name.includes('mountain') || name.includes('russian')) {
    return 'core'
  }
  
  // Cardio
  if (name.includes('corrida') || name.includes('esteira') || name.includes('bike') ||
      name.includes('cardio') || name.includes('burpee') || name.includes('polichinelo')) {
    return 'cardio'
  }
  
  return 'normal'
}

// Função para obter ícone completo do exercício
export const getExerciseIconInfo = (exercise) => {
  // Primeiro tentar pela categoria definida
  let category = exercise.category || 'normal'
  
  // Se categoria é 'normal', tentar detectar pelo nome
  if (category === 'normal') {
    category = detectExerciseCategory(exercise.name)
  }
  
  return getExerciseIcon(category, exercise.type)
}