import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_REPS, DEFAULT_SETS } from '../data/workouts'

const STORAGE_KEY = 'treino.v2'

const EMPTY = { sessions: [], active: null }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      active: parsed.active ?? null,
    }
  } catch {
    // Dado corrompido não pode derrubar o app no meio do treino.
    return EMPTY
  }
}

/**
 * Fonte única de verdade do progresso. Tudo em localStorage:
 * funciona offline, sem login, e sobrevive a fechar o navegador.
 */
export function useWorkoutLog() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error('Falha ao salvar treino:', err)
    }
  }, [state])

  const startSession = useCallback((workoutId) => {
    setState((s) => ({
      ...s,
      active: {
        workoutId,
        startedAt: new Date().toISOString(),
        entries: {},
      },
    }))
  }, [])

  const cancelSession = useCallback(() => {
    setState((s) => ({ ...s, active: null }))
  }, [])

  /** Grava (ou regrava) uma série. setIndex é 0-based. */
  const logSet = useCallback((exerciseId, setIndex, { weight, reps }) => {
    setState((s) => {
      if (!s.active) return s
      const current = s.active.entries[exerciseId] ?? []
      const next = [...current]
      while (next.length <= setIndex) next.push(null)
      next[setIndex] = { weight, reps, at: new Date().toISOString() }
      return {
        ...s,
        active: {
          ...s.active,
          entries: { ...s.active.entries, [exerciseId]: next },
        },
      }
    })
  }, [])

  /** Desmarca uma série já registrada. */
  const clearSet = useCallback((exerciseId, setIndex) => {
    setState((s) => {
      if (!s.active) return s
      const current = s.active.entries[exerciseId]
      if (!current) return s
      const next = [...current]
      next[setIndex] = null
      return {
        ...s,
        active: {
          ...s.active,
          entries: { ...s.active.entries, [exerciseId]: next },
        },
      }
    })
  }, [])

  const finishSession = useCallback(() => {
    let saved = null
    setState((s) => {
      if (!s.active) return s
      const session = {
        ...s.active,
        id: `s_${Date.now()}`,
        finishedAt: new Date().toISOString(),
      }
      saved = session
      return { sessions: [session, ...s.sessions], active: null }
    })
    return saved
  }, [])

  const deleteSession = useCallback((sessionId) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.filter((x) => x.id !== sessionId),
    }))
  }, [])

  /**
   * Última execução registrada de um exercício (sessão mais recente que o
   * contenha). É o número que importa na academia: o que bater hoje.
   */
  const lastPerformance = useCallback(
    (exerciseId) => {
      for (const session of state.sessions) {
        const sets = (session.entries[exerciseId] ?? []).filter(Boolean)
        if (sets.length) {
          const top = Math.max(...sets.map((x) => x.weight || 0))
          return { date: session.finishedAt, sets, topWeight: top }
        }
      }
      return null
    },
    [state.sessions]
  )

  /** Data da última vez que cada treino foi concluído. */
  const lastDoneByWorkout = useMemo(() => {
    const map = {}
    for (const session of state.sessions) {
      if (map[session.workoutId] == null) {
        map[session.workoutId] = session.finishedAt
      }
    }
    return map
  }, [state.sessions])

  /** Sugestão de próximo treino: o que está há mais tempo sem ser feito. */
  const suggestedWorkoutId = useMemo(() => {
    const last = state.sessions[0]
    if (!last) return 1
    return (last.workoutId % 4) + 1
  }, [state.sessions])

  const exportBackup = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `treino-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }, [state])

  const importBackup = useCallback(async (file) => {
    const text = await file.text()
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed.sessions)) {
      throw new Error('Arquivo de backup inválido')
    }
    setState({ sessions: parsed.sessions, active: parsed.active ?? null })
  }, [])

  return {
    sessions: state.sessions,
    active: state.active,
    startSession,
    cancelSession,
    logSet,
    clearSet,
    finishSession,
    deleteSession,
    lastPerformance,
    lastDoneByWorkout,
    suggestedWorkoutId,
    exportBackup,
    importBackup,
    defaults: { sets: DEFAULT_SETS, reps: DEFAULT_REPS },
  }
}
