import { useEffect, useState } from 'react'
import { Check, Footprints, Minus, Plus, TrendingUp } from 'lucide-react'
import { setsOf } from '../data/workouts'

const WEIGHT_STEP = 2.5
const START_REPS = 12

function formatWeight(w) {
  return Number.isInteger(w) ? String(w) : w.toFixed(1).replace('.', ',')
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

/** Stepper genérico: rótulo, valor grande e dois botões grandes. */
function Stepper({ label, value, onChange, step, suffix }) {
  return (
    <div className="control">
      <span className="control-label">{label}</span>
      <div className="control-row">
        <button
          className="step-btn"
          onClick={() => onChange(Math.max(0, Math.round((value - step) * 10) / 10))}
          aria-label={`Diminuir ${label}`}
        >
          <Minus size={20} strokeWidth={2.5} />
        </button>
        <div className="control-value">
          <input
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            aria-label={label}
          />
          <span className="unit">{suffix}</span>
        </div>
        <button
          className="step-btn"
          onClick={() => onChange(Math.round((value + step) * 10) / 10)}
          aria-label={`Aumentar ${label}`}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

/** Bloco de corrida: alvos fixos, registra o que foi feito de verdade. */
function CardioBody({ exercise, logged, onLog, onClear }) {
  const done = logged?.[0]
  const [minutes, setMinutes] = useState(done?.minutes ?? exercise.minutes)
  const [hr, setHr] = useState(
    done?.hr ?? Math.round((exercise.hr[0] + exercise.hr[1]) / 2)
  )

  const inRange = hr >= exercise.hr[0] && hr <= exercise.hr[1]

  return (
    <div className="exercise-body">
      <div className="last-time">
        <Footprints size={15} />
        <span>
          Alvo: <strong>{exercise.minutes} min</strong> ·{' '}
          <strong>
            {exercise.hr[0]}–{exercise.hr[1]} bpm
          </strong>{' '}
          ·{' '}
          <strong>
            {exercise.speed[0]}–{exercise.speed[1]} km/h
          </strong>
        </span>
      </div>

      <div className="controls-row">
        <Stepper
          label="Duração"
          value={minutes}
          onChange={setMinutes}
          step={1}
          suffix="min"
        />
        <Stepper
          label="Batimentos"
          value={hr}
          onChange={setHr}
          step={5}
          suffix="bpm"
        />
      </div>

      {!inRange && (
        <p className="warn">
          Fora da faixa alvo de {exercise.hr[0]}–{exercise.hr[1]} bpm.
        </p>
      )}

      <button
        className={`btn ${done ? 'btn-ghost' : 'btn-done'}`}
        onClick={() => (done ? onClear(0) : onLog(0, { minutes, hr }))}
      >
        {done ? 'Desfazer registro' : 'Registrar corrida'}
      </button>
    </div>
  )
}

/** Exercício de carga: peso baixo, séries até a falha, reps é o progresso. */
function StrengthBody({ exercise, sets, lastPerformance, onLog, onClear }) {
  const total = setsOf(exercise)
  const filled = sets.filter(Boolean)

  const [weight, setWeight] = useState(
    () => filled.at(-1)?.weight ?? lastPerformance?.sets.at(-1)?.weight ?? 0
  )
  const [reps, setReps] = useState(
    () => filled.at(-1)?.reps ?? lastPerformance?.sets[0]?.reps ?? START_REPS
  )

  // Ao registrar uma série, o peso segue; as reps caem naturalmente na falha,
  // então mantemos o último valor como ponto de partida da próxima.
  useEffect(() => {
    const last = sets.filter(Boolean).at(-1)
    if (last) {
      setWeight(last.weight)
      setReps(last.reps)
    }
  }, [sets])

  return (
    <div className="exercise-body">
      {lastPerformance && (
        <div className="last-time">
          <TrendingUp size={15} />
          <span>
            Última vez ({formatDate(lastPerformance.date)}):{' '}
            <strong>{formatWeight(lastPerformance.topWeight)} kg</strong> ·{' '}
            <strong>{lastPerformance.sets.map((s) => s.reps).join(', ')}</strong>{' '}
            reps
          </span>
        </div>
      )}

      <div className="controls-row">
        <Stepper
          label="Carga"
          value={weight}
          onChange={setWeight}
          step={WEIGHT_STEP}
          suffix="kg"
        />
        <Stepper
          label="Reps até a falha"
          value={reps}
          onChange={setReps}
          step={1}
          suffix="reps"
        />
      </div>

      <div className="sets-row">
        {Array.from({ length: total }, (_, i) => {
          const set = sets[i]
          return (
            <button
              key={i}
              className={`set-chip ${set ? 'filled' : ''}`}
              onClick={() => (set ? onClear(i) : onLog(i, { weight, reps }))}
            >
              <span className="idx">{i + 1}ª</span>
              <span className="val">{set ? set.reps : '—'}</span>
              {set && <span className="sub-val">{formatWeight(set.weight)}kg</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ExerciseItem({
  exercise,
  sets,
  lastPerformance,
  expanded,
  onToggle,
  onLogSet,
  onClearSet,
}) {
  const isCardio = exercise.type === 'cardio'
  const total = setsOf(exercise)
  const filled = sets.filter(Boolean)
  const isDone = filled.length >= total

  return (
    <div className={`exercise ${isDone ? 'done' : ''}`}>
      <button className="exercise-head" onClick={onToggle}>
        <span className="exercise-check">
          <Check size={15} strokeWidth={3.5} />
        </span>
        <span className="exercise-title">
          <span className="name">{exercise.name}</span>
          {exercise.hint && <span className="hint">{exercise.hint}</span>}
          {isCardio && (
            <span className="hint">
              {exercise.minutes} min · {exercise.hr[0]}–{exercise.hr[1]} bpm
            </span>
          )}
        </span>
        <span className="exercise-summary">
          {isCardio ? (isDone ? 'feito' : '—') : `${filled.length}/${total}`}
        </span>
      </button>

      {expanded &&
        (isCardio ? (
          <CardioBody
            exercise={exercise}
            logged={sets}
            onLog={onLogSet}
            onClear={onClearSet}
          />
        ) : (
          <StrengthBody
            exercise={exercise}
            sets={sets}
            lastPerformance={lastPerformance}
            onLog={onLogSet}
            onClear={onClearSet}
          />
        ))}
    </div>
  )
}
