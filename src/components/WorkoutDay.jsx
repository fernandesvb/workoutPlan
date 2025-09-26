import ExerciseCard from './ExerciseCard'

export default function WorkoutDay({ day, workoutData, customExercises, onWorkoutChange, onRemoveExercise }) {
  const exercisesForDay = customExercises.filter(ex => ex.day === day)
  
  if (exercisesForDay.length === 0) {
    return (
      <div className="day-section active">
        <h2 className="section-title">DIA {day}</h2>
        <div className="no-exercises">
          <p>📝 Nenhum exercício para este dia</p>
          <small>Use "Novo Exercício com IA" para adicionar</small>
        </div>
      </div>
    )
  }
  
  // Separar exercícios por categoria
  const normalExercises = exercisesForDay.filter(ex => ex.category !== 'core')
  const coreExercises = exercisesForDay.filter(ex => ex.category === 'core')
  
  // Gerar título dinâmico baseado nas categorias
  const getDayTitle = () => {
    const categories = [...new Set(exercisesForDay.map(ex => ex.category))]
    
    if (categories.includes('chest') && categories.includes('triceps')) return 'PEITO E TRÍCEPS'
    if (categories.includes('back') && categories.includes('biceps')) return 'COSTAS E BÍCEPS'
    if (categories.includes('legs')) return 'PERNAS'
    if (categories.includes('shoulders')) return 'OMBROS'
    if (categories.includes('chest')) return 'PEITO'
    if (categories.includes('back')) return 'COSTAS'
    if (categories.includes('cardio')) return 'CARDIO'
    
    return `DIA ${day} - TREINO COMPLETO`
  }

  return (
    <div className="day-section active">
      <h2 className="section-title">{getDayTitle()}</h2>
      
      {/* Exercícios principais */}
      {normalExercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          workoutData={workoutData}
          onWorkoutChange={onWorkoutChange}
          onRemove={onRemoveExercise}
          isCustom={true}
        />
      ))}
      
      {/* Exercícios de core (se houver) */}
      {coreExercises.length > 0 && (
        <>
          <div className="section-title">🎯 CORE</div>
          {coreExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              workoutData={workoutData}
              onWorkoutChange={onWorkoutChange}
              onRemove={onRemoveExercise}
              isCustom={true}
            />
          ))}
        </>
      )}
    </div>
  )
}