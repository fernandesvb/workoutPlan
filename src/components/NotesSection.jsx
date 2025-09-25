export default function NotesSection({ notes, onNotesChange }) {
  return (
    <div className="notes-section">
      <div className="notes-title">📝 Observações</div>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Como se sentiu, dores, progressos..."
      />
    </div>
  )
}