import { useMemo, useState } from 'react'
import { DEFAULT_SETS, WORKOUT_BY_ID, exercisesOf } from '../data/workouts'
import ExerciseItem from './ExerciseItem'
import RestTimer from './RestTimer'

export default function Session({
  active,
  onLogSet,
  onClearSet,
  onFinish,
  lastPerformance,
}) {
  const workout = WORKOUT_BY_ID[active.workoutId]
  const all = useMemo(() => exercisesOf(workout), [workout])

  const [expandedId, setExpandedId] = useState(() => all[0]?.id ?? null)
  const [restStartedAt, setRestStartedAt] = useState(null)

  const setsOf = (id) => active.entries[id] ?? []
  const isComplete = (id) => setsOf(id).filter(Boolean).length >= DEFAULT_SETS

  const totalSets = all.length * DEFAULT_SETS
  const doneSets = all.reduce((n, e) => n + setsOf(e.id).filter(Boolean).length, 0)
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0

  const handleLogSet = (exerciseId, index, payload) => {
    onLogSet(exerciseId, index, payload)
    setRestStartedAt(Date.now())

    // Se essa foi a última série, já abre o próximo exercício pendente.
    const after = setsOf(exerciseId).filter(Boolean).length + 1
    if (after >= DEFAULT_SETS) {
      const next = all.find((e) => e.id !== exerciseId && !isComplete(e.id))
      setExpandedId(next ? next.id : null)
    }
  }

  // Agrupa mantendo a ordem definida no plano.
  const groups = workout.groups

  return (
    <>
      <div className="session-progress">
        <div className="session-progress-head">
          <p className="section-label" style={{ margin: 0 }}>
            {workout.focus}
          </p>
          <span className="count">
            {doneSets}/{totalSets} séries
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${pct === 100 ? 'complete' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.name}>
          <p className="group-heading">{group.name}</p>
          {group.exercises.map((ex) => (
            <ExerciseItem
              key={ex.id}
              exercise={ex}
              sets={setsOf(ex.id)}
              lastPerformance={lastPerformance(ex.id)}
              expanded={expandedId === ex.id}
              onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
              onLogSet={(i, payload) => handleLogSet(ex.id, i, payload)}
              onClearSet={(i) => onClearSet(ex.id, i)}
            />
          ))}
        </div>
      ))}

      {restStartedAt && (
        <RestTimer
          startedAt={restStartedAt}
          onDismiss={() => setRestStartedAt(null)}
        />
      )}

      <div className="action-bar">
        <button
          className={`btn ${doneSets > 0 ? 'btn-done' : 'btn-ghost'}`}
          onClick={onFinish}
        >
          {doneSets > 0 ? 'Finalizar treino' : 'Sair sem registrar'}
        </button>
      </div>
    </>
  )
}
