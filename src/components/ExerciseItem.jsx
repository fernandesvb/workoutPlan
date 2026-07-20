import { useEffect, useState } from 'react'
import { Check, Minus, Plus, TrendingUp } from 'lucide-react'
import { repsOf, setsOf } from '../data/workouts'

const STEP = 2.5

function formatWeight(w) {
  return Number.isInteger(w) ? String(w) : w.toFixed(1).replace('.', ',')
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

/**
 * Um exercício da sessão. Fechado mostra só o resumo; aberto mostra a carga
 * da última vez, o seletor de peso e as séries. Registrar = 1 toque no chip.
 */
export default function ExerciseItem({
  exercise,
  sets,
  lastPerformance,
  expanded,
  onToggle,
  onLogSet,
  onClearSet,
}) {
  const totalSets = setsOf(exercise)
  const reps = repsOf(exercise)
  const filled = sets.filter(Boolean)
  const isDone = filled.length >= totalSets

  // Peso corrente: continua de onde parou na sessão, senão repete a última vez.
  const [weight, setWeight] = useState(() => {
    const lastInSession = [...filled].pop()
    if (lastInSession) return lastInSession.weight
    return lastPerformance?.topWeight ?? 0
  })

  useEffect(() => {
    const lastInSession = [...sets].filter(Boolean).pop()
    if (lastInSession) setWeight(lastInSession.weight)
  }, [sets])

  const bump = (delta) => setWeight((w) => Math.max(0, Math.round((w + delta) * 10) / 10))

  const handleSetTap = (index) => {
    if (sets[index]) {
      onClearSet(index)
    } else {
      onLogSet(index, { weight, reps })
    }
  }

  return (
    <div className={`exercise ${isDone ? 'done' : ''}`}>
      <button className="exercise-head" onClick={onToggle}>
        <span className="exercise-check">
          <Check size={15} strokeWidth={3.5} />
        </span>
        <span className="exercise-title">
          <span className="name">{exercise.name}</span>
          {exercise.hint && <span className="hint">{exercise.hint}</span>}
        </span>
        <span className="exercise-summary">
          {filled.length}/{totalSets}
        </span>
      </button>

      {expanded && (
        <div className="exercise-body">
          {lastPerformance && (
            <div className="last-time">
              <TrendingUp size={15} />
              <span>
                Última vez ({formatDate(lastPerformance.date)}):{' '}
                <strong>{formatWeight(lastPerformance.topWeight)} kg</strong>
              </span>
            </div>
          )}

          <div className="weight-control">
            <button
              className="step-btn"
              onClick={() => bump(-STEP)}
              aria-label="Diminuir carga"
            >
              <Minus size={22} strokeWidth={2.5} />
            </button>
            <div className="weight-display">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0)}
                onFocus={(e) => e.target.select()}
                aria-label="Carga em quilos"
              />
              <span className="unit">kg · {reps} reps</span>
            </div>
            <button
              className="step-btn"
              onClick={() => bump(STEP)}
              aria-label="Aumentar carga"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="sets-row">
            {Array.from({ length: totalSets }, (_, i) => {
              const set = sets[i]
              return (
                <button
                  key={i}
                  className={`set-chip ${set ? 'filled' : ''}`}
                  onClick={() => handleSetTap(i)}
                >
                  <span className="idx">{i + 1}ª</span>
                  <span className="val">
                    {set ? `${formatWeight(set.weight)}kg` : '—'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
