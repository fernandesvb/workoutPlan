import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function TimerSection() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isCountdown, setIsCountdown] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (isCountdown) {
            if (prev <= 1) {
              setIsRunning(false)
              setIsCountdown(false)
              if (navigator.vibrate) navigator.vibrate(500)
              return 0
            }
            return prev - 1
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, isCountdown])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(Math.abs(totalSeconds) / 60)
    const secs = Math.abs(totalSeconds) % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getDisplayColor = () => {
    if (isCountdown) {
      if (seconds <= 0) return '#f56565'
      if (seconds <= 10) return '#ffc107'
      return '#48bb78'
    }
    return '#667eea'
  }

  const startTimer = () => setIsRunning(true)
  const stopTimer = () => setIsRunning(false)
  const resetTimer = () => {
    setIsRunning(false)
    setSeconds(0)
    setIsCountdown(false)
  }

  const setQuickTimer = (time) => {
    setIsRunning(false)
    setSeconds(time)
    setIsCountdown(true)
    setTimeout(() => setIsRunning(true), 100)
  }

  return (
    <div className="timer-section">
      <div className="timer-label">
        ⏱️ CRONÔMETRO
      </div>
      <div 
        className="timer-display" 
        style={{ color: getDisplayColor() }}
      >
        {formatTime(seconds)}
      </div>
      <div className="timer-buttons">
        <button className="timer-btn btn-start" onClick={startTimer}>
          <Play size={16} /> Start
        </button>
        <button className="timer-btn btn-stop" onClick={stopTimer}>
          <Pause size={16} /> Pause
        </button>
        <button className="timer-btn btn-reset" onClick={resetTimer}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="quick-timer">
        <button className="quick-btn" onClick={() => setQuickTimer(30)}>30s</button>
        <button className="quick-btn" onClick={() => setQuickTimer(45)}>45s</button>
        <button className="quick-btn" onClick={() => setQuickTimer(60)}>1min</button>
        <button className="quick-btn" onClick={() => setQuickTimer(90)}>1:30</button>
        <button className="quick-btn" onClick={() => setQuickTimer(120)}>2min</button>
      </div>
    </div>
  )
}