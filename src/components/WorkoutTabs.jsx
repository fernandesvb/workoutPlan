export default function WorkoutTabs({ activeDay, onDayChange }) {
  const days = [
    { id: 1, title: 'Dia 1', subtitle: 'Peito/Tri' },
    { id: 2, title: 'Dia 2', subtitle: 'Costas/Bi' },
    { id: 3, title: 'Dia 3', subtitle: 'Pernas' }
  ]

  return (
    <div className="tabs">
      {days.map(day => (
        <button
          key={day.id}
          className={`tab ${activeDay === day.id ? 'active' : ''}`}
          onClick={() => onDayChange(day.id)}
        >
          {day.title}
          <br />
          <small>{day.subtitle}</small>
        </button>
      ))}
    </div>
  )
}