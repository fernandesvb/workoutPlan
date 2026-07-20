import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, BarChart3, Download, Upload, X } from 'lucide-react'

import Home from './components/Home'
import Session from './components/Session'
import History from './components/History'
import { EXERCISE_INDEX, WORKOUT_BY_ID } from './data/workouts'
import { useWorkoutLog } from './hooks/useWorkoutLog'

/** Resumo da sessão: a corrida não conta como série, ela tem linha própria. */
function summarize(session) {
  let sets = 0
  let volume = 0
  let cardio = null
  for (const [exerciseId, list] of Object.entries(session.entries)) {
    const isCardio = EXERCISE_INDEX[exerciseId]?.type === 'cardio'
    for (const entry of list) {
      if (!entry) continue
      if (isCardio) {
        cardio = entry
      } else {
        sets += 1
        volume += (entry.weight || 0) * (entry.reps || 0)
      }
    }
  }
  return { sets, volume, cardio, workoutId: session.workoutId }
}

export default function App() {
  const log = useWorkoutLog()
  const [view, setView] = useState('home')
  const [summary, setSummary] = useState(null)
  const fileInput = useRef(null)

  // Retomar sessão em andamento (fechou o app no meio do treino).
  useEffect(() => {
    if (log.active) setView('session')
  }, [log.active])

  const handleStart = (workoutId) => {
    log.startSession(workoutId)
    setView('session')
  }

  const handleFinish = () => {
    const anything = Object.values(log.active.entries).flat().filter(Boolean).length

    if (anything === 0) {
      log.cancelSession()
      setView('home')
      return
    }

    const session = log.finishSession()
    if (session) setSummary(summarize(session))
    setView('home')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await log.importBackup(file)
      alert('Backup restaurado com sucesso.')
    } catch (err) {
      alert(`Não foi possível ler o backup: ${err.message}`)
    }
    event.target.value = ''
  }

  const inSession = view === 'session' && log.active

  return (
    <div className="app">
      <header className="app-header">
        {inSession ? (
          <>
            <button
              className="icon-btn"
              onClick={() => setView('home')}
              aria-label="Voltar"
            >
              <ArrowLeft size={22} />
            </button>
            <h1>
              {WORKOUT_BY_ID[log.active.workoutId]?.name}
              <span className="sub">Treino em andamento</span>
            </h1>
          </>
        ) : view === 'history' ? (
          <>
            <button
              className="icon-btn"
              onClick={() => setView('home')}
              aria-label="Voltar"
            >
              <ArrowLeft size={22} />
            </button>
            <h1>Histórico</h1>
            <button
              className="icon-btn"
              onClick={log.exportBackup}
              aria-label="Exportar backup"
            >
              <Download size={20} />
            </button>
            <button
              className="icon-btn"
              onClick={() => fileInput.current?.click()}
              aria-label="Importar backup"
            >
              <Upload size={20} />
            </button>
          </>
        ) : (
          <>
            <h1>
              Treino
              <span className="sub">
                {new Date().toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </h1>
            <button
              className="icon-btn"
              onClick={() => setView('history')}
              aria-label="Histórico"
            >
              <BarChart3 size={22} />
            </button>
          </>
        )}
      </header>

      <main className="app-main">
        {inSession ? (
          <Session
            active={log.active}
            onLogSet={log.logSet}
            onClearSet={log.clearSet}
            onFinish={handleFinish}
            lastPerformance={log.lastPerformance}
          />
        ) : view === 'history' ? (
          <History sessions={log.sessions} onDelete={log.deleteSession} />
        ) : (
          <Home
            sessions={log.sessions}
            lastDoneByWorkout={log.lastDoneByWorkout}
            suggestedWorkoutId={log.suggestedWorkoutId}
            onStart={handleStart}
          />
        )}
      </main>

      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        className="hidden-input"
        onChange={handleImport}
      />

      {summary && (
        <div className="overlay" onClick={() => setSummary(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <span className="emoji">💪</span>
            <h2>Treino concluído!</h2>
            <p>
              {summary.sets} séries · {summary.volume.toLocaleString('pt-BR')} kg
              de volume total.
              {summary.cardio && (
                <>
                  <br />
                  Corrida: {summary.cardio.minutes} min a {summary.cardio.hr} bpm.
                </>
              )}
            </p>
            <button className="btn btn-primary" onClick={() => setSummary(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
