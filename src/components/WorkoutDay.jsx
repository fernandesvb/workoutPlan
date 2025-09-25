import ExerciseCard from './ExerciseCard'

const defaultExercises = {
  1: [
    { id: 'supino', name: 'Supino Máquina Smith', series: '3x12', type: 'weight', category: 'normal', notes: 'Mantenha os pés firmes no chão, escapúla retraída e desça a barra até tocar o peito. Controle a descida e empurre com força.' },
    { id: 'crucifixo', name: 'Crucifixo Halteres', series: '3x12', type: 'weight', category: 'normal', notes: 'Cotovelos ligeiramente flexionados, abra os braços em arco até sentir alongamento no peito. Contraia o peitoral para subir.' },
    { id: 'triceps-polia', name: 'Tríceps Polia', series: '3x15', type: 'weight', category: 'normal', notes: 'Cotovelos colados ao corpo, empurre a barra para baixo contraindo o tríceps. Controle a subida sem mover os ombros.' },
    { id: 'triceps-testa', name: 'Tríceps Testa', series: '3x12', type: 'weight', category: 'normal', notes: 'Cotovelos fixos apontando para cima, desça o peso em direção à testa e estenda os braços contraindo o tríceps.' },
    { id: 'prancha1', name: 'Prancha Frontal', series: '3x30-45s', type: 'time', category: 'core', notes: 'Corpo alinhado da cabeça aos pés, cotovelos sob os ombros. Contraia abdome e glúteos, respire normalmente.' },
    { id: 'superman', name: 'Superman (Lombar)', series: '3x15', type: 'reps', category: 'core', notes: 'Deitado de brucos, levante peito e pernas simultaneamente contraindo a lombar. Segure 2 segundos no topo.' }
  ],
  2: [
    { id: 'remada', name: 'Remada Máquina', series: '3x12', type: 'weight', category: 'normal', notes: 'Peito estufado, puxe os cotovelos para trás aproximando as escapúla. Foque em contrair as costas, não os braços.' },
    { id: 'puxada', name: 'Puxada Frontal', series: '3x12', type: 'weight', category: 'normal', notes: 'Puxe a barra até a altura do peito, retraia as escapúla e mantenha o tronco estável. Controle a subida.' },
    { id: 'rosca-direta', name: 'Rosca Direta', series: '3x12', type: 'weight', category: 'normal', notes: 'Cotovelos colados ao corpo, flexione os braços contraindo o bíceps. Evite balançar o corpo.' },
    { id: 'rosca-martelo', name: 'Rosca Martelo', series: '3x12', type: 'weight', category: 'normal', notes: 'Pegada neutra (palmas se olhando), flexione alternadamente mantendo os cotovelos fixos. Movimento controlado.' },
    { id: 'prancha-lateral', name: 'Prancha Lateral', series: '3x20-30s cada', type: 'time', category: 'core', notes: 'Apoiado no cotovelo, corpo alinhado lateralmente. Contraia o core e mantenha os quadris elevados.' },
    { id: 'ponte', name: 'Ponte (Glúteo/Lombar)', series: '3x15', type: 'reps', category: 'core', notes: 'Deitado, pés apoiados, eleve os quadris contraindo glúteos. Segure 2 segundos no topo.' }
  ],
  3: [
    { id: 'leg-press', name: 'Leg Press', series: '3x12', type: 'weight', category: 'normal', notes: 'Pés na largura dos ombros, desça até 90° nos joelhos. Empurre com os calcanhares, não trave os joelhos no topo.' },
    { id: 'extensora', name: 'Cadeira Extensora', series: '3x12', type: 'weight', category: 'normal', notes: 'Costas apoiadas, estenda as pernas contraindo o quadríceps. Desça controladamente sem relaxar totalmente.' },
    { id: 'flexora', name: 'Cadeira Flexora', series: '3x12', type: 'weight', category: 'normal', notes: 'Quadril apoiado, flexione as pernas contraindo posterior da coxa. Movimento controlado na descida.' },
    { id: 'panturrilha', name: 'Panturrilha', series: '3x20', type: 'weight', category: 'normal', notes: 'Suba na ponta dos pés contraindo a panturrilha, segure 1 segundo no topo. Desça alongando bem.' },
    { id: 'bicicleta', name: 'Abdominal Bicicleta', series: '3x20 (10 cada)', type: 'reps', category: 'core', notes: 'Deitado, simule pedalar levando cotovelo ao joelho oposto. Mantenha lombar no chão.' },
    { id: 'gato-vaca', name: 'Gato-Vaca (Mobilidade)', series: '3x10 lento', type: 'reps', category: 'core', notes: 'De quatro, alterne entre arquear e flexionar a coluna lentamente. Respire profundamente em cada movimento.' }
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
          onRemove={onRemoveExercise}
          isCustom={true}
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
          isCustom={true}
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
              onRemove={onRemoveExercise}
              isCustom={true}
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
              isCustom={true}
            />
          ))}
        </>
      )}
    </div>
  )
}