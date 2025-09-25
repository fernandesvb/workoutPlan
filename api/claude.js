const fetch = require('node-fetch')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, workoutData, customExercises } = req.body
    
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

INSTRUÇÕES IMPORTANTES:
- SEMPRE analise os 3 dias completos do treino
- Se pedir exercícios específicos (ex: ombros): distribua entre os dias apropriados (ombros no Dia 1 com peito)
- Se pedir treino mais curto: sugira remoções
- Se pedir treino mais longo: sugira adições
- DISTRIBUA exercícios nos dias corretos: Dia 1=Peito/Tríceps/Ombros, Dia 2=Costas/Bíceps, Dia 3=Pernas
- Sugira pelo menos 2-3 exercícios distribuídos entre os dias
- SEMPRE inclua dicas detalhadas

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
    }
  ],
  "explanation": "Explicação de como distribuí os exercícios nos 3 dias"
}`
        }]
      })
    })

    const data = await response.json()
    let content = data.content[0].text
    
    // Limpar e extrair JSON
    content = content.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = jsonMatch[0]
    }
    
    // Tentar parsear JSON
    try {
      const result = JSON.parse(content)
      res.json(result)
    } catch (parseError) {
      // Fallback
      const fallback = {
        exercises: [
          { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Mantenha cotovelos ligeiramente flexionados' }
        ],
        explanation: `Sugeri exercícios para "${prompt}"`
      }
      res.json(fallback)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}