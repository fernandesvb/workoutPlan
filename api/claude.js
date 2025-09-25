// api/claude.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { prompt } = req.body || {}

  // Sugestões fixas para teste
  const suggestions = {
    exercises: [
      { 
        name: 'Elevação Lateral', 
        series: '3x12', 
        type: 'weight', 
        category: 'normal', 
        day: 1, 
        notes: 'Mantenha cotovelos ligeiramente flexionados' 
      },
      { 
        name: 'Desenvolvimento Arnold', 
        series: '3x10', 
        type: 'weight', 
        category: 'normal', 
        day: 1, 
        notes: 'Movimento completo de rotação dos ombros' 
      },
      { 
        name: 'Remada Alta', 
        series: '3x12', 
        type: 'weight', 
        category: 'normal', 
        day: 2, 
        notes: 'Puxe até o peito mantendo cotovelos altos' 
      }
    ],
    explanation: `Sugeri exercícios complementares para "${prompt || 'seu treino'}". Estes exercícios fortalecem os grupos musculares solicitados.`
  }

  return res.status(200).json(suggestions)
}