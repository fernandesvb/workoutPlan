// Plano do Vinicius — split AB (superior/inferior alternado), rodado em loop:
// A1 -> B1 -> A2 -> B2 -> A1... Sem vínculo com dia da semana.
//
// Por que AB: com cada músculo aparecendo 2x por ciclo em vez de 1x, o
// estímulo semanal é melhor distribuído. Em troca, cada sessão tem menos
// exercícios por grupo — o volume total não sobe, só se espalha.
//
// Metodologia: peso baixo, séries até a falha. Por isso não existe número de
// repetições alvo — o que se registra é quantas saíram de verdade, e é esse
// número (não a carga) que mostra a evolução.
// Exceção: o Stiff carrega a coluna, então para 2-3 reps antes da falha.
//
// NOTA sobre os ids: são os mesmos de antes da reestruturação (por isso os
// prefixos t1/t2/t3/t4 não batem mais com o treino atual). Isso é de
// propósito — o histórico de carga é indexado por id, e renomear apagaria a
// progressão já registrada. Não renomeie ids de exercícios existentes.

export const DEFAULT_SETS = 4

/** Séries de um exercício. A corrida é um bloco único. */
export function setsOf(exercise) {
  if (exercise.type === 'cardio') return 1
  return exercise.sets ?? DEFAULT_SETS
}

/** Bloco de corrida, idêntico nos 4 treinos. */
const CARDIO = {
  name: 'Corrida',
  exercises: [
    {
      id: 'cardio-corrida',
      name: 'Corrida na Esteira',
      type: 'cardio',
      minutes: 20,
      hr: [130, 140],
      speed: [5, 6],
    },
  ],
}

const ABDOMINAL = (id) => ({
  name: 'Abdômen',
  exercises: [{ id, name: 'Abdominal Máquina', sets: 3 }],
})

export const WORKOUTS = [
  {
    id: 1,
    badge: 'A1',
    name: 'Superior A1',
    focus: 'Peito · Costas · Ombro · Braço',
    groups: [
      {
        name: 'Peito',
        exercises: [
          { id: 't4-pei-1', name: 'Supino Reto' },
          { id: 't4-pei-2', name: 'Supino Inclinado' },
        ],
      },
      {
        name: 'Costas',
        exercises: [
          { id: 't2-cos-1', name: 'Puxada Frontal' },
          { id: 't2-cos-2', name: 'Remada Curvada' },
        ],
      },
      {
        name: 'Ombros',
        exercises: [{ id: 't1-omb-1', name: 'Desenvolvimento com Halteres' }],
      },
      {
        name: 'Bíceps',
        exercises: [{ id: 't2-bic-1', name: 'Rosca Direta' }],
      },
      {
        name: 'Tríceps',
        exercises: [{ id: 't4-tri-1', name: 'Tríceps Testa' }],
      },
      CARDIO,
    ],
  },
  {
    id: 2,
    badge: 'B1',
    name: 'Inferior B1',
    focus: 'Quadríceps · Posterior · Panturrilha',
    groups: [
      {
        name: 'Pernas',
        exercises: [
          { id: 't3-per-1', name: 'Leg Press' },
          { id: 't3-per-2', name: 'Agachamento no Aparelho' },
          // Stiff cedo, enquanto a lombar está descansada. Único exercício do
          // plano que NÃO vai à falha: falhar num hinge com carga na coluna é
          // onde a forma quebra e as costas se machucam.
          {
            id: 't3-per-6',
            name: 'Stiff',
            hint: 'posterior · não ir à falha',
            sets: 3,
          },
          { id: 't3-per-5', name: 'Panturrilha' },
          { id: 't1-per-1', name: 'Cadeira Abdutora', hint: 'abertura de pernas' },
        ],
      },
      ABDOMINAL('t1-abd-1'),
      CARDIO,
    ],
  },
  {
    id: 3,
    badge: 'A2',
    name: 'Superior A2',
    focus: 'Ombro · Trapézio · Peito · Costas',
    groups: [
      {
        name: 'Ombros',
        exercises: [
          { id: 't1-omb-2', name: 'Elevação Lateral' },
          { id: 't1-omb-3', name: 'Elevação Frontal' },
        ],
      },
      {
        name: 'Trapézio',
        exercises: [
          { id: 't1-trap-3', name: 'Remada Alta' },
          { id: 't1-trap-1', name: 'Encolhimento com Halteres' },
        ],
      },
      {
        name: 'Peito',
        exercises: [{ id: 't4-pei-3', name: 'Crucifixo' }],
      },
      {
        name: 'Costas',
        exercises: [{ id: 't2-cos-3', name: 'Remada Baixa' }],
      },
      {
        name: 'Bíceps',
        exercises: [{ id: 't2-bic-3', name: 'Rosca Martelo' }],
      },
      {
        name: 'Tríceps',
        exercises: [{ id: 't4-tri-2', name: 'Tríceps Corda' }],
      },
      CARDIO,
    ],
  },
  {
    id: 4,
    badge: 'B2',
    name: 'Inferior B2',
    focus: 'Glúteo · Posterior · Lombar',
    groups: [
      {
        name: 'Glúteo e Posterior',
        exercises: [
          { id: 't1-per-3', name: 'Elevação Pélvica', hint: 'glúteo' },
          { id: 't3-per-4', name: 'Mesa Flexora' },
        ],
      },
      {
        name: 'Quadríceps',
        exercises: [{ id: 't3-per-3', name: 'Cadeira Extensora' }],
      },
      {
        name: 'Adutores',
        exercises: [
          { id: 't1-per-2', name: 'Cadeira Adutora', hint: 'fechamento de pernas' },
        ],
      },
      {
        name: 'Lombar',
        exercises: [
          { id: 't2-lom-1', name: 'Banco Romano', hint: 'extensão lombar', sets: 3 },
        ],
      },
      ABDOMINAL('t3-abd-1'),
      CARDIO,
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
