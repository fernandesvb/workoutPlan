import { useMemo } from 'react'

// Componente de visualização muscular com SVG
export default function MuscleVisualization({ exerciseName }) {
  const muscleData = useMemo(() => {
    const name = exerciseName.toLowerCase().trim()

    // Mapear exercícios para grupos musculares
    const muscleMap = {
      // Peito
      'supino': { primary: '#FF4444', secondary: '#FF8888', label: 'Peitorais, Tríceps, Ombros' },
      'crucifixo': { primary: '#FF4444', secondary: '#FF8888', label: 'Peitorais' },
      'flexão': { primary: '#FF4444', secondary: '#FF8888', label: 'Peitorais, Tríceps' },

      // Costas
      'remada': { primary: '#4444FF', secondary: '#8888FF', label: 'Dorsais, Bíceps, Trapézio' },
      'puxada': { primary: '#4444FF', secondary: '#8888FF', label: 'Dorsais, Bíceps' },
      'barra fixa': { primary: '#4444FF', secondary: '#8888FF', label: 'Dorsais, Bíceps' },

      // Pernas
      'agachamento': { primary: '#AA44FF', secondary: '#CC88FF', label: 'Quadríceps, Glúteos, Posterior' },
      'leg press': { primary: '#AA44FF', secondary: '#CC88FF', label: 'Quadríceps, Glúteos' },
      'stiff': { primary: '#AA44FF', secondary: '#CC88FF', label: 'Posterior, Glúteos' },
      'afundo': { primary: '#AA44FF', secondary: '#CC88FF', label: 'Quadríceps, Glúteos' },

      // Ombros
      'desenvolvimento': { primary: '#FF8800', secondary: '#FFBB44', label: 'Deltoides, Tríceps' },
      'elevação': { primary: '#FF8800', secondary: '#FFBB44', label: 'Deltoides' },

      // Bíceps
      'rosca': { primary: '#00CC88', secondary: '#44FFBB', label: 'Bíceps, Antebraços' },
      'curl': { primary: '#00CC88', secondary: '#44FFBB', label: 'Bíceps' },

      // Tríceps
      'tríceps': { primary: '#FF4444', secondary: '#FF8888', label: 'Tríceps' },
      'mergulho': { primary: '#FF4444', secondary: '#FF8888', label: 'Tríceps, Peitorais' },

      // Core
      'abdominal': { primary: '#FFAA00', secondary: '#FFDD44', label: 'Abdominais' },
      'prancha': { primary: '#FFAA00', secondary: '#FFDD44', label: 'Core Completo' },

      // Glúteos
      'ponte': { primary: '#FF1493', secondary: '#FF69B4', label: 'Glúteos, Posterior' },
      'hip thrust': { primary: '#FF1493', secondary: '#FF69B4', label: 'Glúteos' }
    }

    // Buscar por palavra-chave
    for (const [key, colors] of Object.entries(muscleMap)) {
      if (name.includes(key)) {
        return colors
      }
    }

    return { primary: '#888888', secondary: '#BBBBBB', label: 'Corpo Completo' }
  }, [exerciseName])

  return (
    <div className="muscle-visualization">
      <svg viewBox="0 0 200 300" className="muscle-diagram">
        {/* Corpo humano simplificado */}

        {/* Cabeça */}
        <circle cx="100" cy="30" r="18" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>

        {/* Pescoço */}
        <rect x="95" y="45" width="10" height="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>

        {/* Tronco (peito + abdomen) */}
        <ellipse cx="100" cy="100" rx="35" ry="45" fill={muscleData.primary} stroke="#9CA3AF" strokeWidth="2" opacity="0.85"/>

        {/* Cintura/Core */}
        <rect x="80" y="135" width="40" height="25" rx="5" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>

        {/* Ombros */}
        <circle cx="65" cy="75" r="15" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="2" opacity="0.8"/>
        <circle cx="135" cy="75" r="15" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="2" opacity="0.8"/>

        {/* Braços superiores */}
        <rect x="45" y="85" width="15" height="50" rx="7" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="2" opacity="0.7"/>
        <rect x="140" y="85" width="15" height="50" rx="7" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="2" opacity="0.7"/>

        {/* Antebraços */}
        <rect x="47" y="130" width="11" height="40" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
        <rect x="142" y="130" width="11" height="40" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>

        {/* Coxas */}
        <rect x="75" y="160" width="18" height="70" rx="9" fill={muscleData.primary} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>
        <rect x="107" y="160" width="18" height="70" rx="9" fill={muscleData.primary} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>

        {/* Panturrilhas */}
        <rect x="78" y="230" width="12" height="50" rx="6" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="1" opacity="0.6"/>
        <rect x="110" y="230" width="12" height="50" rx="6" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="1" opacity="0.6"/>

        {/* Glúteos (indicativo) */}
        <ellipse cx="100" cy="162" rx="25" ry="15" fill={muscleData.secondary} stroke="#9CA3AF" strokeWidth="1" opacity="0.6"/>
      </svg>

      <div className="muscle-label">
        <div className="label-indicator">
          <span className="color-primary" style={{ backgroundColor: muscleData.primary }}></span>
          <span className="label-text">Primário</span>
        </div>
        <div className="label-indicator">
          <span className="color-secondary" style={{ backgroundColor: muscleData.secondary }}></span>
          <span className="label-text">Secundário</span>
        </div>
      </div>

      <div className="muscle-info">
        {muscleData.label}
      </div>
    </div>
  )
}