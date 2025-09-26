// Mapeamento de categorias para ícones e cores
export const getExerciseIcon = (category, type) => {
  const iconMap = {
    // Grupos musculares
    'chest': { icon: '💪', color: '#ef4444', name: 'Peito' },
    'back': { icon: '🏋️', color: '#3b82f6', name: 'Costas' },
    'shoulders': { icon: '🤸', color: '#f59e0b', name: 'Ombros' },
    'arms': { icon: '💪', color: '#10b981', name: 'Braços' },
    'biceps': { icon: '💪', color: '#10b981', name: 'Bíceps' },
    'triceps': { icon: '🔥', color: '#ef4444', name: 'Tríceps' },
    'legs': { icon: '🦵', color: '#8b5cf6', name: 'Pernas' },
    'glutes': { icon: '🍑', color: '#ec4899', name: 'Glúteos' },
    'core': { icon: '⚡', color: '#f59e0b', name: 'Core' },
    'abs': { icon: '⚡', color: '#f59e0b', name: 'Abdomen' },
    'cardio': { icon: '❤️', color: '#ef4444', name: 'Cardio' },
    
    // Tipos de exercício
    'weight': { icon: '🏋️', color: '#6b7280', name: 'Peso' },
    'bodyweight': { icon: '🤸', color: '#10b981', name: 'Peso Corporal' },
    'resistance': { icon: '🔗', color: '#8b5cf6', name: 'Resistência' },
    'flexibility': { icon: '🧘', color: '#06b6d4', name: 'Flexibilidade' },
    
    // Default
    'normal': { icon: '💪', color: '#6b7280', name: 'Exercício' },
    'default': { icon: '💪', color: '#6b7280', name: 'Exercício' }
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
      name.includes('chest') || name.includes('peito')) {
    return 'chest'
  }
  
  // Costas
  if (name.includes('remada') || name.includes('pulldown') || name.includes('barra fixa') ||
      name.includes('back') || name.includes('costas') || name.includes('pull')) {
    return 'back'
  }
  
  // Ombros
  if (name.includes('elevação') || name.includes('desenvolvimento') || name.includes('ombro') ||
      name.includes('shoulder') || name.includes('lateral')) {
    return 'shoulders'
  }
  
  // Bíceps
  if (name.includes('rosca') || name.includes('bíceps') || name.includes('bicep') ||
      name.includes('curl')) {
    return 'biceps'
  }
  
  // Tríceps
  if (name.includes('tríceps') || name.includes('tricep') || name.includes('mergulho') ||
      name.includes('extensão') && name.includes('braço')) {
    return 'triceps'
  }
  
  // Pernas
  if (name.includes('agachamento') || name.includes('squat') || name.includes('afundo') ||
      name.includes('lunge') || name.includes('perna') || name.includes('coxa') ||
      name.includes('leg')) {
    return 'legs'
  }
  
  // Core/Abs
  if (name.includes('abdominal') || name.includes('prancha') || name.includes('plank') ||
      name.includes('core') || name.includes('abs') || name.includes('crunch')) {
    return 'core'
  }
  
  // Cardio
  if (name.includes('corrida') || name.includes('esteira') || name.includes('bike') ||
      name.includes('cardio') || name.includes('burpee')) {
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