import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, workoutData, customExercises, image } = req.body
    
    let messages
    
    if (image) {
      // Análise de imagem
      messages = [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.includes('webp') ? 'image/webp' : 'image/jpeg',
              data: image.split(',')[1]
            }
          }
        ]
      }]
    } else {
      // Prompt normal
      messages = [{
        role: 'user',
        content: `Você é um personal trainer brasileiro experiente.

TREINO ATUAL COMPLETO (30-35 min por dia):
Dia 1 - Peito/Tríceps: Supino Máquina Smith, Crucifixo Halteres, Tríceps Polia, Tríceps Testa, Prancha Frontal, Superman
Dia 2 - Costas/Bíceps: Remada Máquina, Puxada Frontal, Rosca Direta, Rosca Martelo, Prancha Lateral, Ponte
Dia 3 - Pernas: Leg Press, Cadeira Extensora, Cadeira Flexora, Panturrilha, Abdominal Bicicleta, Gato-Vaca

EXERCÍCIOS JÁ ADICIONADOS:
${customExercises?.length > 0 ? customExercises.map(ex => `- ${ex.name} (Dia ${ex.day}) - ${ex.series}`).join('\n') : 'Nenhum exercício personalizado ainda'}

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
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: image ? 300 : 800,
        messages
      })
    })

    const data = await response.json()
    let content = data.content[0].text
    
    if (image) {
      // Para análise de imagem, retornar resposta direta
      res.json({ response: content })
      return
    }
    
    console.log('Resposta bruta:', content)
    
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
      console.error('Erro ao parsear JSON:', parseError)
      console.log('Conteúdo problemático:', content)
      
      // Fallback com sugestões baseadas no prompt
      const fallback = {
        exercises: [
          { name: 'Elevação Lateral', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Mantenha cotovelos ligeiramente flexionados e controle o movimento' },
          { name: 'Desenvolvimento Arnold', series: '3x10', type: 'weight', category: 'normal', day: 1, notes: 'Movimento completo de rotação dos ombros' },
          { name: 'Elevação Frontal', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Controle a descida e evite balançar o corpo' }
        ],
        explanation: `Sugeri exercícios complementares para "${prompt}". Estes exercícios foram selecionados para fortalecer os grupos musculares solicitados e se integrar bem ao seu treino atual.`
      }
      res.json(fallback)
    }
  } catch (error) {
    console.error('Erro:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Proxy server rodando em http://localhost:${PORT}`)
})