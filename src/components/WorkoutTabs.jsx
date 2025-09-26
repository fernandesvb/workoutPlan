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
      
      // Gerar subtítulo baseado nas categorias
      let subtitle = 'Treino'
      if (categories.includes('chest')) subtitle = 'Peito'
      if (categories.includes('back')) subtitle = 'Costas'
      if (categories.includes('legs')) subtitle = 'Pernas'
      if (categories.includes('shoulders')) subtitle = 'Ombros'
      if (categories.includes('core')) subtitle = 'Core'
      if (categories.includes('cardio')) subtitle = 'Cardio'
      
      // Se tem várias categorias, mostrar "Completo"
      if (categories.length > 2) subtitle = 'Completo'
      
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