// Mapeamento de exercícios para imagens reais e específicas
const exerciseImages = {
  // === PEITO ===
  'supino': 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=150&h=150&fit=crop&crop=center',
  'supino reto': 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=150&h=150&fit=crop&crop=center',
  'supino inclinado': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'supino declinado': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'flexão': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'push up': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'crucifixo': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'voador': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',

  // === COSTAS ===
  'remada': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=150&h=150&fit=crop&crop=center',
  'remada curvada': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=150&h=150&fit=crop&crop=center',
  'remada baixa': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'puxada': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'lat pulldown': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'pulldown': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop&crop=center',
  'barra fixa': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop&crop=center',
  'pull up': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop&crop=center',
  'chin up': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop&crop=center',

  // === PERNAS ===
  'agachamento': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'squat': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'agachamento livre': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',
  'leg press': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
  'afundo': 'https://images.unsplash.com/photo-1616803140441-c0b88c8ee2d7?w=150&h=150&fit=crop&crop=center',
  'lunge': 'https://images.unsplash.com/photo-1616803140441-c0b88c8ee2d7?w=150&h=150&fit=crop&crop=center',
  'stiff': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=150&h=150&fit=crop&crop=center',
  'deadlift': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=150&h=150&fit=crop&crop=center',
  'terra': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=150&h=150&fit=crop&crop=center',
  'extensora': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
  'flexora': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
  'panturrilha': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',

  // === OMBROS ===
  'desenvolvimento': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'militar': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'shoulder press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',
  'elevação lateral': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'lateral raise': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'elevação frontal': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'arnold press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=center',

  // === BÍCEPS ===
  'rosca': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'rosca direta': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'bicep curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',
  'martelo': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'hammer curl': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'rosca 21': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=center',

  // === TRÍCEPS ===
  'tríceps': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'tríceps testa': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'tricep extension': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'extensão': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',
  'mergulho': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'dips': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'coice': 'https://images.unsplash.com/photo-1434608519512-0c7d59dcafaa?w=150&h=150&fit=crop&crop=center',

  // === CORE/ABS ===
  'abdominal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'sit up': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'crunch': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
  'prancha': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'plank': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'mountain climber': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'russian twist': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',

  // === GLÚTEOS ===
  'ponte': 'https://images.unsplash.com/photo-1616803140441-c0b88c8ee2d7?w=150&h=150&fit=crop&crop=center',
  'hip thrust': 'https://images.unsplash.com/photo-1616803140441-c0b88c8ee2d7?w=150&h=150&fit=crop&crop=center',
  'elevação pélvica': 'https://images.unsplash.com/photo-1616803140441-c0b88c8ee2d7?w=150&h=150&fit=crop&crop=center',
  'agachamento sumo': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&h=150&fit=crop&crop=center',

  // === CARDIO ===
  'burpee': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'corrida': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center',
  'polichinelo': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'jumping jack': 'https://images.unsplash.com/photo-1599058918762-3c8ec0daf63b?w=150&h=150&fit=crop&crop=center',
  'esteira': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center',
  'bike': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center',

  // === DEFAULT ===
  'default': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center'
}

// Função para obter imagem do exercício
export const getExerciseImage = (exerciseName) => {
  const name = exerciseName.toLowerCase().trim()

  // Buscar por nome exato primeiro
  if (exerciseImages[name]) {
    return exerciseImages[name]
  }

  // Buscar por palavras-chave mais específicas (ordenadas por prioridade)
  const searchPriority = [
    // Exercícios específicos primeiro
    'supino reto', 'supino inclinado', 'supino declinado',
    'remada curvada', 'remada baixa', 'lat pulldown',
    'agachamento livre', 'agachamento sumo', 'leg press',
    'rosca direta', 'hammer curl', 'tricep extension',
    'shoulder press', 'elevação lateral', 'elevação frontal',
    'hip thrust', 'mountain climber', 'russian twist',

    // Depois exercícios mais gerais
    'supino', 'remada', 'agachamento', 'rosca', 'desenvolvimento',
    'flexão', 'crucifixo', 'puxada', 'pulldown', 'barra fixa',
    'afundo', 'stiff', 'deadlift', 'extensora', 'flexora',
    'tríceps', 'extensão', 'mergulho', 'elevação', 'abdominal',
    'prancha', 'ponte', 'burpee', 'corrida'
  ]

  // Buscar na ordem de prioridade
  for (const key of searchPriority) {
    if (name.includes(key)) {
      return exerciseImages[key] || exerciseImages.default
    }
  }

  // Buscar por palavras-chave em inglês
  const englishTerms = {
    'push up': 'flexão',
    'pull up': 'barra fixa',
    'squat': 'agachamento',
    'lunge': 'afundo',
    'plank': 'prancha',
    'curl': 'rosca',
    'press': 'desenvolvimento',
    'row': 'remada',
    'fly': 'crucifixo',
    'crunch': 'abdominal',
    'dips': 'mergulho'
  }

  for (const [english, portuguese] of Object.entries(englishTerms)) {
    if (name.includes(english) && exerciseImages[portuguese]) {
      return exerciseImages[portuguese]
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