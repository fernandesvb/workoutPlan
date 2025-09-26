export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, customExercises = [] } = req.body

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Você é um personal trainer brasileiro experiente.

TREINO ATUAL COMPLETO (30-35 min por dia):
Dia 1 - Peito/Tríceps: Supino Máquina Smith, Crucifixo Halteres, Tríceps Polia, Tríceps Testa, Prancha Frontal, Superman
Dia 2 - Costas/Bíceps: Remada Máquina, Puxada Frontal, Rosca Direta, Rosca Martelo, Prancha Lateral, Ponte
Dia 3 - Pernas: Leg Press, Cadeira Extensora, Cadeira Flexora, Panturrilha, Abdominal Bicicleta, Gato-Vaca

EXERCÍCIOS JÁ ADICIONADOS:
${customExercises.length > 0 ? customExercises.map(ex => `- ${ex.name} (Dia ${ex.day}) - ${ex.series}`).join('\n') : 'Nenhum exercício personalizado ainda'}

SOLICITAÇÃO: "${prompt}"

INSTRUÇÕES OBRIGATÓRIAS:
- SEMPRE analise os 3 dias completos do treino
- OBRIGATÓRIO: Distribua exercícios nos 3 dias (pelo menos 1 exercício por dia)
- Dia 1=Peito/Tríceps/Ombros, Dia 2=Costas/Bíceps, Dia 3=Pernas
- Para treinos mais longos (40+ min): sugira 4-6 exercícios total
- Para treinos mais curtos: sugira remoções
- SEMPRE inclua dicas detalhadas de execução

Responda APENAS com JSON válido:
{
  "exercises": [
    {
      "name": "Exercício Dia 1",
      "series": "3x12",
      "type": "weight",
      "category": "normal",
      "day": 1,
      "notes": "Dica detalhada"
    },
    {
      "name": "Exercício Dia 2",
      "series": "3x12",
      "type": "weight",
      "category": "normal",
      "day": 2,
      "notes": "Dica detalhada"
    },
    {
      "name": "Exercício Dia 3",
      "series": "3x12",
      "type": "weight",
      "category": "normal",
      "day": 3,
      "notes": "Dica detalhada"
    }
  ],
  "explanation": "Explicação de como distribuí nos 3 dias"
}`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    let content = data.content[0].text
    
    // Clean and extract JSON
    content = content.replace(/```json/g, '').replace(/```/g, '').trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = jsonMatch[0]
    }
    
    try {
      const result = JSON.parse(content)
      res.json(result)
    } catch (parseError) {
      // Fallback
      const fallback = {
        exercises: [
          { name: 'Exercício Sugerido', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Dica de execução' }
        ],
        explanation: `Baseado em "${prompt}", sugeri exercícios complementares.`
      }
      res.json(fallback)
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}