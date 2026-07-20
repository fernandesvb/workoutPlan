import { useMemo, useState } from 'react'
import { WORKOUT_BY_ID, exercisesOf, setsOf } from '../data/workouts'
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

  const loggedOf = (id) => active.entries[id] ?? []
  const isComplete = (ex) => loggedOf(ex.id).filter(Boolean).length >= setsOf(ex)

  const totalSets = all.reduce((n, e) => n + setsOf(e), 0)
  const doneSets = all.reduce((n, e) => n + loggedOf(e.id).filter(Boolean).length, 0)
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0

  const handleLogSet = (exercise, index, payload) => {
    onLogSet(exercise.id, index, payload)
    setRestStartedAt(Date.now())

    // Se essa foi a última série, já abre o próximo exercício pendente.
    const after = loggedOf(exercise.id).filter(Boolean).length + 1
    if (after >= setsOf(exercise)) {
      const next = all.find((e) => e.id !== exercise.id && !isComplete(e))
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
              sets={loggedOf(ex.id)}
              lastPerformance={lastPerformance(ex.id)}
              expanded={expandedId === ex.id}
              onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
              onLogSet={(i, payload) => handleLogSet(ex, i, payload)}
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
