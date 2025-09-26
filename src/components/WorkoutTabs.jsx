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
      const categories = [...new Set(dayExercises.map(ex => ex.category))]
      
      // Gerar subtítulo mais inteligente baseado nas categorias
      let subtitle = 'Treino'
      
      // Combinações específicas
      if (categories.includes('chest') && categories.includes('triceps')) {
        subtitle = 'Peito/Tri'
      } else if (categories.includes('back') && categories.includes('biceps')) {
        subtitle = 'Costas/Bi'
      } else if (categories.includes('legs') || categories.includes('glutes')) {
        subtitle = 'Pernas'
      } else if (categories.includes('shoulders')) {
        subtitle = 'Ombros'
      } else if (categories.includes('chest')) {
        subtitle = 'Peito'
      } else if (categories.includes('back')) {
        subtitle = 'Costas'
      } else if (categories.includes('biceps') && categories.includes('triceps')) {
        subtitle = 'Braços'
      } else if (categories.includes('core')) {
        subtitle = 'Core'
      } else if (categories.includes('cardio')) {
        subtitle = 'Cardio'
      } else if (categories.length > 3) {
        subtitle = 'Full Body'
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
          {day.title}
          <br />
          <small>{day.subtitle}</small>
        </button>
      ))}
    </div>
  )
}