// Plano fixo do Vinicius — 4 treinos, 5 repetições por série.
// Para mudar exercícios, séries ou repetições, edite apenas este arquivo.

export const DEFAULT_SETS = 4
export const DEFAULT_REPS = 5

export const WORKOUTS = [
  {
    id: 1,
    name: 'Treino 1',
    focus: 'Trapézio · Ombros · Pernas',
    groups: [
      {
        name: 'Trapézio',
        exercises: [
          { id: 't1-trap-1', name: 'Encolhimento com Halteres' },
          { id: 't1-trap-2', name: 'Encolhimento na Barra' },
          { id: 't1-trap-3', name: 'Remada Alta' },
        ],
      },
      {
        name: 'Ombros',
        exercises: [
          { id: 't1-omb-1', name: 'Desenvolvimento com Halteres' },
          { id: 't1-omb-2', name: 'Elevação Lateral' },
          { id: 't1-omb-3', name: 'Elevação Frontal' },
        ],
      },
      {
        name: 'Pernas',
        exercises: [
          { id: 't1-per-1', name: 'Cadeira Abdutora', hint: 'abertura de pernas' },
          { id: 't1-per-2', name: 'Cadeira Adutora', hint: 'fechamento de pernas' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Treino 2',
    focus: 'Costas · Bíceps · Lombar',
    groups: [
      {
        name: 'Costas',
        exercises: [
          { id: 't2-cos-1', name: 'Puxada Frontal' },
          { id: 't2-cos-2', name: 'Remada Curvada' },
          { id: 't2-cos-3', name: 'Remada Baixa' },
        ],
      },
      {
        name: 'Bíceps',
        exercises: [
          { id: 't2-bic-1', name: 'Rosca Direta' },
          { id: 't2-bic-2', name: 'Rosca Alternada' },
          { id: 't2-bic-3', name: 'Rosca Martelo' },
        ],
      },
      {
        name: 'Lombar',
        exercises: [
          { id: 't2-lom-1', name: 'Banco Romano', hint: 'extensão lombar' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Treino 3',
    focus: 'Pernas completo',
    groups: [
      {
        name: 'Pernas',
        exercises: [
          { id: 't3-per-1', name: 'Leg Press' },
          { id: 't3-per-2', name: 'Agachamento no Aparelho' },
          { id: 't3-per-3', name: 'Cadeira Extensora' },
          { id: 't3-per-4', name: 'Mesa Flexora' },
          { id: 't3-per-5', name: 'Panturrilha' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Treino 4',
    focus: 'Peito · Bíceps · Lombar',
    groups: [
      {
        name: 'Peito',
        exercises: [
          { id: 't4-pei-1', name: 'Supino Reto' },
          { id: 't4-pei-2', name: 'Supino Inclinado' },
          { id: 't4-pei-3', name: 'Crucifixo' },
        ],
      },
      {
        name: 'Bíceps',
        exercises: [
          { id: 't4-bic-1', name: 'Rosca Scott' },
          { id: 't4-bic-2', name: 'Rosca Concentrada' },
          { id: 't4-bic-3', name: 'Rosca Inversa' },
        ],
      },
      {
        name: 'Lombar',
        exercises: [
          { id: 't4-lom-1', name: 'Banco Romano', hint: 'extensão lombar' },
        ],
      },
    ],
  },
]

export const WORKOUT_BY_ID = Object.fromEntries(WORKOUTS.map((w) => [w.id, w]))

/** Lista plana de exercícios de um treino, na ordem de execução. */
export function exercisesOf(workout) {
  return workout.groups.flatMap((g) =>
    g.exercises.map((e) => ({ ...e, group: g.name }))
  )
}

/** Índice global id -> exercício (com treino e grupo), para o histórico. */
export const EXERCISE_INDEX = Object.fromEntries(
  WORKOUTS.flatMap((w) =>
    exercisesOf(w).map((e) => [e.id, { ...e, workoutId: w.id, workoutName: w.name }])
  )
)
