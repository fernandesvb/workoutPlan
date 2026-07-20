import { useEffect, useRef, useState } from 'react'

const DEFAULT_REST = 90

function format(total) {
  const m = Math.floor(Math.abs(total) / 60)
  const s = Math.abs(total) % 60
  return `${total < 0 ? '-' : ''}${m}:${String(s).padStart(2, '0')}`
}

/**
 * Descanso entre séries. Dispara sozinho ao registrar uma série e continua
 * contando (negativo) depois do zero, para não sumir da tela sem o usuário ver.
 */
export default function RestTimer({ startedAt, onDismiss }) {
  const [remaining, setRemaining] = useState(DEFAULT_REST)
  const [bonus, setBonus] = useState(0)
  const alerted = useRef(false)

  useEffect(() => {
    alerted.current = false
    setBonus(0)
  }, [startedAt])

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      setRemaining(DEFAULT_REST + bonus - elapsed)
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [startedAt, bonus])

  useEffect(() => {
    if (remaining <= 0 && !alerted.current) {
      alerted.current = true
      if (navigator.vibrate) navigator.vibrate([180, 80, 180])
    }
  }, [remaining])

  const done = remaining <= 0

  return (
    <div className={`rest-timer ${done ? 'done' : ''}`}>
      <span className="time">{format(remaining)}</span>
      <span className="label">
        {done ? 'Descanso completo — bora!' : 'Descanso entre séries'}
      </span>
      <div className="rest-actions">
        <button onClick={() => setBonus((b) => b + 30)}>+30s</button>
        <button onClick={onDismiss}>OK</button>
      </div>
    </div>
  )
}
