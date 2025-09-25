import ExerciseCard from './ExerciseCard'

const defaultExercises = {
  1: [
    { id: 'supino', name: 'Supino Máquina Smith', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'crucifixo', name: 'Crucifixo Halteres', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'triceps-polia', name: 'Tríceps Polia', series: '3x15', type: 'weight', category: 'normal' },
    { id: 'triceps-testa', name: 'Tríceps Testa', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'prancha1', name: 'Prancha Frontal', series: '3x30-45s', type: 'time', category: 'core' },
    { id: 'superman', name: 'Superman (Lombar)', series: '3x15', type: 'reps', category: 'core' }
  ],
  2: [
    { id: 'remada', name: 'Remada Máquina', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'puxada', name: 'Puxada Frontal', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'rosca-direta', name: 'Rosca Direta', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'rosca-martelo', name: 'Rosca Martelo', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'prancha-lateral', name: 'Prancha Lateral', series: '3x20-30s cada', type: 'time', category: 'core' },
    { id: 'ponte', name: 'Ponte (Glúteo/Lombar)', series: '3x15', type: 'reps', category: 'core' }
  ],
  3: [
    { id: 'leg-press', name: 'Leg Press', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'extensora', name: 'Cadeira Extensora', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'flexora', name: 'Cadeira Flexora', series: '3x12', type: 'weight', category: 'normal' },
    { id: 'panturrilha', name: 'Panturrilha', series: '3x20', type: 'weight', category: 'normal' },
    { id: 'bicicleta', name: 'Abdominal Bicicleta', series: '3x20 (10 cada)', type: 'reps', category: 'core' },
    { id: 'gato-vaca', name: 'Gato-Vaca (Mobilidade)', series: '3x10 lento', type: 'reps', category: 'core' }
  ]
}

const dayTitles = {
  1: 'PEITO E TRÍCEPS',
  2: 'COSTAS E BÍCEPS', 
  3: 'PERNAS'
}

export default function WorkoutDay({ day, workoutData, customExercises, onWorkoutChange, onRemoveExercise }) {
  const exercises = defaultExercises[day] || []
  const customExercisesForDay = customExercises.filter(ex => ex.day === day)
  
  const normalExercises = exercises.filter(ex => ex.category === 'normal')
  const coreExercises = exercises.filter(ex => ex.category === 'core')
  const customNormalExercises = customExercisesForDay.filter(ex => ex.category === 'normal')
  const customCoreExercises = customExercisesForDay.filter(ex => ex.category === 'core')

  return (
    <div className="day-section active">
      <h2 className="section-title">{dayTitles[day]}</h2>
      
      {/* Exercícios normais padrão */}
      {normalExercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          workoutData={workoutData}
          onWorkoutChange={onWorkoutChange}
        />
      ))}
      
      {/* Exercícios normais personalizados */}
      {customNormalExercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          workoutData={workoutData}
          onWorkoutChange={onWorkoutChange}
          onRemove={onRemoveExercise}
          isCustom
        />
      ))}
      
      {(coreExercises.length > 0 || customCoreExercises.length > 0) && (
        <>
          <div className="section-title">🎯 CORE</div>
          
          {/* Exercícios core padrão */}
          {coreExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              workoutData={workoutData}
              onWorkoutChange={onWorkoutChange}
            />
          ))}
          
          {/* Exercícios core personalizados */}
          {customCoreExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              workoutData={workoutData}
              onWorkoutChange={onWorkoutChange}
              onRemove={onRemoveExercise}
              isCustom
            />
          ))}
        </>
      )}
    </div>
  )
}