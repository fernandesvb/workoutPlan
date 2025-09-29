// Mapeamento de exercícios para imagens reais
const exerciseImages = {
  // Peito
  'supino': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'supino reto': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'supino inclinado': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'flexão': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'crucifixo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',

  // Costas
  'remada': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'puxada': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'barra fixa': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop&crop=center',
  'pulldown': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',

  // Pernas
  'agachamento': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'leg press': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'afundo': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'stiff': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'extensora': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',

  // Ombros
  'desenvolvimento': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'elevação lateral': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'elevação frontal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',

  // Braços
  'rosca': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'tríceps': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'martelo': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',

  // Core
  'abdominal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'prancha': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',

  // Cardio
  'burpee': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'corrida': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center',

  // Default/Fallback
  'default': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center'
}

// Função para obter imagem do exercício
export const getExerciseImage = (exerciseName) => {
  const name = exerciseName.toLowerCase()

  // Buscar por nome exato primeiro
  if (exerciseImages[name]) {
    return exerciseImages[name]
  }

  // Buscar por palavras-chave
  for (const [key, image] of Object.entries(exerciseImages)) {
    if (name.includes(key) || key.includes(name)) {
      return image
    }
  }

  return exerciseImages.default
}

// Mapeamento de categorias para ícones e cores (mantido como fallback)
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