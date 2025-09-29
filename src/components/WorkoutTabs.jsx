export default function WorkoutTabs({ activeDay, onDayChange, customExercises }) {
  // Gerar dias dinamicamente baseado nos exercícios
  const getDynamicDays = () => {
    if (!customExercises || customExercises.length === 0) {
      return [{ id: 1, title: 'Dia 1', subtitle: 'Sem exercícios' }]
    }
    
    const daysSet = new Set(customExercises.map(ex => ex.day))
    const sortedDays = Array.from(daysSet).sort((a, b) => a - b)
    
    return sortedDays.map(dayNum => {
      const dayExercises = customExercises.filter(ex => ex.day === dayNum)

      // Detectar categorias tanto pela propriedade category quanto pelo nome
      let detectedCategories = []
      dayExercises.forEach(ex => {
        // Categoria explícita
        if (ex.category && ex.category !== 'normal') {
          detectedCategories.push(ex.category)
        }

        // Detectar por nome do exercício
        const name = ex.name.toLowerCase()
        if (name.includes('supino') || name.includes('crucifixo') || name.includes('flexão') || name.includes('peito')) {
          detectedCategories.push('chest')
        }
        if (name.includes('tríceps') || name.includes('tricep') || name.includes('extensão') || name.includes('mergulho')) {
          detectedCategories.push('triceps')
        }
        if (name.includes('remada') || name.includes('pulldown') || name.includes('barra fixa') || name.includes('costas') || name.includes('puxada')) {
          detectedCategories.push('back')
        }
        if (name.includes('rosca') || name.includes('bíceps') || name.includes('bicep') || name.includes('curl')) {
          detectedCategories.push('biceps')
        }
        if (name.includes('agachamento') || name.includes('leg press') || name.includes('afundo') || name.includes('perna') || name.includes('coxa')) {
          detectedCategories.push('legs')
        }
        if (name.includes('desenvolvimento') || name.includes('elevação') || name.includes('ombro') || name.includes('lateral') || name.includes('frontal')) {
          detectedCategories.push('shoulders')
        }
      })

      const categories = [...new Set(detectedCategories)]

      // Gerar subtítulo baseado nas categorias detectadas
      let subtitle = 'Treino'

      // Combinações específicas por dia
      if (dayNum === 1) {
        subtitle = 'Peito/Tri'
      } else if (dayNum === 2) {
        subtitle = 'Costas/Bi'
      } else if (dayNum === 3) {
        subtitle = 'Pernas'
      } else if (dayNum === 4) {
        subtitle = 'Ombros'
      } else {
        // Fallback para detecção automática
        if (categories.includes('chest') && categories.includes('triceps')) {
          subtitle = 'Peito/Tri'
        } else if (categories.includes('back') && categories.includes('biceps')) {
          subtitle = 'Costas/Bi'
        } else if (categories.includes('legs')) {
          subtitle = 'Pernas'
        } else if (categories.includes('shoulders')) {
          subtitle = 'Ombros'
        } else if (categories.includes('chest')) {
          subtitle = 'Peito'
        } else if (categories.includes('back')) {
          subtitle = 'Costas'
        } else if (categories.includes('biceps') && categories.includes('triceps')) {
          subtitle = 'Braços'
        } else if (categories.length > 2) {
          subtitle = 'Full Body'
        }
      }
      
      return {
        id: dayNum,
        title: `Dia ${dayNum}`,
        subtitle: subtitle
      }
    })
  }
  
  const days = getDynamicDays()

  return (
    <div className="tabs">
      {days.map(day => (
        <button
          key={day.id}
          className={`tab ${activeDay === day.id ? 'active' : ''}`}
          onClick={() => onDayChange(day.id)}
        >
          <span className="tab-title">{day.title}</span>
          <small className="tab-subtitle">{day.subtitle}</small>
        </button>
      ))}
    </div>
  )
}