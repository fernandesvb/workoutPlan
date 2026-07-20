import { ChevronRight } from 'lucide-react'
import { WORKOUTS, exercisesOf } from '../data/workouts'

function relativeDate(iso) {
  if (!iso) return 'nunca feito'
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  if (days < 14) return 'há 1 semana'
  return `há ${Math.floor(days / 7)} semanas`
}

/** Volume total: kg até 1 tonelada, depois toneladas com 1 casa. */
function formatVolume(kg) {
  if (kg < 1000) return `${Math.round(kg)}kg`
  return `${(kg / 1000).toFixed(1).replace('.', ',')}t`
}

function startOfWeek() {
  const d = new Date()
  const day = (d.getDay() + 6) % 7 // segunda = 0
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function Home({ sessions, lastDoneByWorkout, suggestedWorkoutId, onStart }) {
  const weekStart = startOfWeek()
  const thisWeek = sessions.filter((s) => new Date(s.finishedAt) >= weekStart).length

  const totalVolume = sessions.reduce((sum, s) => {
    for (const sets of Object.values(s.entries)) {
      for (const set of sets) {
        if (set) sum += (set.weight || 0) * (set.reps || 0)
      }
    }
    return sum
  }, 0)

  return (
    <>
      <div className="stats-row">
        <div className="stat">
          <span className="value">{thisWeek}</span>
          <span className="label">esta semana</span>
        </div>
        <div className="stat">
          <span className="value">{sessions.length}</span>
          <span className="label">no total</span>
        </div>
        <div className="stat">
          <span className="value">{formatVolume(totalVolume)}</span>
          <span className="label">volume</span>
        </div>
      </div>

      <p className="section-label">Escolha o treino</p>
      <div className="workout-list">
        {WORKOUTS.map((w) => {
          const count = exercisesOf(w).length
          const isNext = w.id === suggestedWorkoutId
          return (
            <button
              key={w.id}
              className={`workout-card ${isNext ? 'suggested' : ''}`}
              onClick={() => onStart(w.id)}
            >
              <span className="workout-badge">{w.id}</span>
              <span className="workout-info">
                <h3>
                  {w.name}
                  {isNext && <span className="tag-next">Próximo</span>}
                </h3>
                <p className="focus">{w.focus}</p>
                <p className="meta">
                  {count} exercícios · {relativeDate(lastDoneByWorkout[w.id])}
                </p>
              </span>
              <ChevronRight size={20} color="var(--text-dim)" />
            </button>
          )
        })}
      </div>
    </>
  )
}
