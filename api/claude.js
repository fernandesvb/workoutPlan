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
    const { prompt, customExercises = [], image } = req.body

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
      // Prompt direto sem cache
      messages = [{
        role: 'user',
        content: prompt
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
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: image ? 250 : 450,
        messages
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    let content = data.content[0].text
    
    if (image) {
      // Para análise de imagem, retornar resposta direta
      res.json({ response: content })
      return
    }
    
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
      console.error('Erro ao parsear JSON:', parseError)
      console.log('Conteúdo problemático:', content)
      
      // Tentar extrair exercícios do texto mesmo sem JSON válido
      const fallback = {
        exercises: [
          { name: 'Desenvolvimento com Halteres', series: '3x12', type: 'weight', category: 'normal', day: 1, notes: 'Para treino de 45min, adicione este exercício completo' },
          { name: 'Remada Curvada', series: '3x12', type: 'weight', category: 'normal', day: 2, notes: 'Fortalece toda região das costas' },
          { name: 'Agachamento Livre', series: '3x15', type: 'weight', category: 'normal', day: 3, notes: 'Exercício fundamental para pernas' }
        ],
        explanation: `Para "${prompt}", sugeri exercícios distribuídos nos 3 dias para aumentar a duração do treino. A IA teve dificuldade para processar, mas estas são sugestões válidas.`
      }
      res.json(fallback)
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}