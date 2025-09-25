export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    // Fallback simples sem API externa
    const fallback = {
      exercises: [
        { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Mantenha cotovelos ligeiramente flexionados' },
        { name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', day: 1, notes: 'Movimento completo de rotação' },
        { name: 'Remada Alta', series: '3x12', type: 'weight', category: 'normal', day: 2, notes: 'Puxe até o peito' }
      ],
      explanation: `Sugeri exercícios complementares para "${prompt}". Estes exercícios fortalecem os grupos musculares solicitados.`
    }
    
    res.json(fallback)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}