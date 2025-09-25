export async function generateAISuggestions(prompt) {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const suggestions = []
  const lowerPrompt = prompt.toLowerCase()
  
  // Sugestões baseadas em palavras-chave
  if (lowerPrompt.includes('ombro') || lowerPrompt.includes('deltoid')) {
    suggestions.push(
      { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', notes: 'Manter cotovelos ligeiramente flexionados' },
      { name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', notes: 'Movimento completo de rotação' },
      { name: 'Elevação Frontal', series: '3x12', type: 'weight', category: 'normal', notes: 'Controlar a descida' }
    )
  }
  
  if (lowerPrompt.includes('core') || lowerPrompt.includes('abdom') || lowerPrompt.includes('prancha')) {
    suggestions.push(
      { name: 'Prancha com Elevação', series: '3x30s', type: 'time', category: 'core', notes: 'Alternar elevação de braços e pernas' },
      { name: 'Dead Bug', series: '3x10 cada', type: 'reps', category: 'core', notes: 'Manter lombar no chão' },
      { name: 'Mountain Climber', series: '3x20', type: 'reps', category: 'core', notes: 'Ritmo controlado' }
    )
  }
  
  if (lowerPrompt.includes('perna') || lowerPrompt.includes('quadr') || lowerPrompt.includes('glut')) {
    suggestions.push(
      { name: 'Agachamento Búlgaro', series: '3x12 cada', type: 'weight', category: 'normal', notes: 'Pé traseiro elevado' },
      { name: 'Stiff', series: '3x12', type: 'weight', category: 'normal', notes: 'Manter joelhos levemente flexionados' },
      { name: 'Afundo', series: '3x10 cada', type: 'weight', category: 'normal', notes: 'Descer até 90 graus' }
    )
  }
  
  if (lowerPrompt.includes('costas') || lowerPrompt.includes('dorsal') || lowerPrompt.includes('lat')) {
    suggestions.push(
      { name: 'Pulldown Neutro', series: '3x12', type: 'weight', category: 'normal', notes: 'Pegada neutra, puxar até o peito' },
      { name: 'Remada Unilateral', series: '3x12 cada', type: 'weight', category: 'normal', notes: 'Apoiar joelho e mão no banco' },
      { name: 'Face Pull', series: '3x15', type: 'weight', category: 'normal', notes: 'Puxar até a face, cotovelos altos' }
    )
  }
  
  if (lowerPrompt.includes('peito') || lowerPrompt.includes('peitoral')) {
    suggestions.push(
      { name: 'Supino Inclinado', series: '3x10', type: 'weight', category: 'normal', notes: 'Inclinação de 30-45 graus' },
      { name: 'Flexão Diamante', series: '3x8-12', type: 'reps', category: 'normal', notes: 'Mãos formando diamante' },
      { name: 'Crossover', series: '3x12', type: 'weight', category: 'normal', notes: 'Movimento de abraço' }
    )
  }
  
  if (lowerPrompt.includes('braço') || lowerPrompt.includes('bícep') || lowerPrompt.includes('trícep')) {
    suggestions.push(
      { name: 'Rosca 21', series: '3x21', type: 'weight', category: 'normal', notes: '7 reps parciais baixo + 7 alto + 7 completas' },
      { name: 'Tríceps Francês', series: '3x12', type: 'weight', category: 'normal', notes: 'Cotovelos fixos' },
      { name: 'Rosca Concentrada', series: '3x12 cada', type: 'weight', category: 'normal', notes: 'Apoiar cotovelo na coxa' }
    )
  }
  
  if (lowerPrompt.includes('iniciante') || lowerPrompt.includes('começar')) {
    suggestions.push(
      { name: 'Agachamento Livre', series: '3x15', type: 'reps', category: 'normal', notes: 'Começar sem peso' },
      { name: 'Flexão de Joelhos', series: '3x8-12', type: 'reps', category: 'normal', notes: 'Flexão modificada' },
      { name: 'Prancha Básica', series: '3x20-30s', type: 'time', category: 'core', notes: 'Manter alinhamento' }
    )
  }
  
  // Se não encontrou sugestões específicas, adiciona algumas genéricas
  if (suggestions.length === 0) {
    suggestions.push(
      { name: 'Exercício Funcional', series: '3x12', type: 'reps', category: 'normal', notes: 'Adapte conforme necessário' },
      { name: 'Mobilidade Articular', series: '3x10', type: 'reps', category: 'core', notes: 'Movimento lento e controlado' }
    )
  }
  
  return suggestions.slice(0, 4) // Máximo 4 sugestões
}