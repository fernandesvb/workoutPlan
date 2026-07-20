import { Trash2 } from 'lucide-react'
import { WORKOUT_BY_ID } from '../data/workouts'

function sessionStats(session) {
  let sets = 0
  let volume = 0
  for (const list of Object.values(session.entries)) {
    for (const set of list) {
      if (!set) continue
      sets += 1
      volume += (set.weight || 0) * (set.reps || 0)
    }
  }
  return { sets, volume }
}

export default function History({ sessions, onDelete }) {
  if (!sessions.length) {
    return (
      <div className="empty">
        <span className="emoji">📋</span>
        <h3>Nenhum treino registrado</h3>
        <p>Assim que você finalizar o primeiro treino, ele aparece aqui.</p>
      </div>
    )
  }

  return (
    <>
      <p className="section-label">
        {sessions.length === 1
          ? '1 treino registrado'
          : `${sessions.length} treinos registrados`}
      </p>
      {sessions.map((s) => {
        const workout = WORKOUT_BY_ID[s.workoutId]
        const { sets, volume } = sessionStats(s)
        const date = new Date(s.finishedAt)
        return (
          <div key={s.id} className="history-item">
            <span className="day">{s.workoutId}</span>
            <span className="info">
              <div className="title">
                {workout?.name ?? `Treino ${s.workoutId}`}
              </div>
              <div className="detail">
                {date.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                })}{' '}
                · {sets} séries · {volume.toLocaleString('pt-BR')} kg
              </div>
            </span>
            <button
              className="icon-btn"
              onClick={() => {
                if (confirm('Apagar este treino do histórico?')) onDelete(s.id)
              }}
              aria-label="Apagar treino"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )
      })}
    </>
  )
}
