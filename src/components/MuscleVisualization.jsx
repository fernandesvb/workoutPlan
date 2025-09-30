import { useMemo } from 'react'

// Componente de visualização muscular com SVG
export default function MuscleVisualization({ exerciseName }) {
  const muscleData = useMemo(() => {
    const name = exerciseName.toLowerCase().trim()

    // Mapear exercícios para grupos musculares específicos
    // ORDEM IMPORTA: termos mais específicos primeiro
    const muscleMap = {
      // Glúteos (antes de outros para evitar conflitos)
      'elevação pélvica': { targetMuscles: ['glutes'], primary: '#FF1493', secondary: '#FF69B4', label: 'GLÚTEOS' },
      'hip thrust': { targetMuscles: ['glutes'], primary: '#FF1493', secondary: '#FF69B4', label: 'GLÚTEOS' },
      'ponte': { targetMuscles: ['glutes'], primary: '#FF1493', secondary: '#FF69B4', label: 'GLÚTEOS' },
      'agachamento sumo': { targetMuscles: ['glutes', 'legs'], primary: '#FF1493', secondary: '#FF69B4', label: 'GLÚTEOS' },

      // Peito
      'supino': { targetMuscles: ['chest'], primary: '#FF4444', secondary: '#FF8888', label: 'PEITO' },
      'crucifixo': { targetMuscles: ['chest'], primary: '#FF4444', secondary: '#FF8888', label: 'PEITO' },
      'flexão': { targetMuscles: ['chest', 'triceps'], primary: '#FF4444', secondary: '#FF8888', label: 'PEITO' },

      // Costas
      'remada': { targetMuscles: ['back'], primary: '#4444FF', secondary: '#8888FF', label: 'COSTAS' },
      'puxada': { targetMuscles: ['back'], primary: '#4444FF', secondary: '#8888FF', label: 'COSTAS' },
      'barra fixa': { targetMuscles: ['back', 'biceps'], primary: '#4444FF', secondary: '#8888FF', label: 'COSTAS' },

      // Pernas
      'agachamento': { targetMuscles: ['legs', 'glutes'], primary: '#AA44FF', secondary: '#CC88FF', label: 'PERNAS' },
      'leg press': { targetMuscles: ['legs'], primary: '#AA44FF', secondary: '#CC88FF', label: 'PERNAS' },
      'stiff': { targetMuscles: ['legs', 'glutes'], primary: '#AA44FF', secondary: '#CC88FF', label: 'PERNAS' },
      'afundo': { targetMuscles: ['legs', 'glutes'], primary: '#AA44FF', secondary: '#CC88FF', label: 'PERNAS' },

      // Ombros (depois de elevação pélvica)
      'elevação lateral': { targetMuscles: ['shoulders'], primary: '#FF8800', secondary: '#FFBB44', label: 'OMBROS' },
      'elevação frontal': { targetMuscles: ['shoulders'], primary: '#FF8800', secondary: '#FFBB44', label: 'OMBROS' },
      'desenvolvimento': { targetMuscles: ['shoulders', 'triceps'], primary: '#FF8800', secondary: '#FFBB44', label: 'OMBROS' },
      'elevação': { targetMuscles: ['shoulders'], primary: '#FF8800', secondary: '#FFBB44', label: 'OMBROS' },

      // Bíceps
      'rosca': { targetMuscles: ['biceps'], primary: '#00CC88', secondary: '#44FFBB', label: 'BÍCEPS' },
      'curl': { targetMuscles: ['biceps'], primary: '#00CC88', secondary: '#44FFBB', label: 'BÍCEPS' },

      // Tríceps
      'tríceps': { targetMuscles: ['triceps'], primary: '#DC2626', secondary: '#EF4444', label: 'TRÍCEPS' },
      'mergulho': { targetMuscles: ['triceps', 'chest'], primary: '#DC2626', secondary: '#EF4444', label: 'TRÍCEPS' },

      // Core
      'abdominal': { targetMuscles: ['core'], primary: '#FFAA00', secondary: '#FFDD44', label: 'ABDOMEN' },
      'prancha': { targetMuscles: ['core'], primary: '#FFAA00', secondary: '#FFDD44', label: 'CORE' }
    }

    // Buscar por palavra-chave
    for (const [key, config] of Object.entries(muscleMap)) {
      if (name.includes(key)) {
        return config
      }
    }

    return { targetMuscles: [], primary: '#888888', secondary: '#BBBBBB', label: 'GERAL' }
  }, [exerciseName])

  // Função helper para verificar se um músculo está ativo
  const getMuscleColor = (muscleName, isPrimary = true) => {
    if (!muscleData.targetMuscles || muscleData.targetMuscles.length === 0) {
      return '#E5E7EB' // cor neutra
    }

    if (muscleData.targetMuscles.includes(muscleName)) {
      return isPrimary ? muscleData.primary : muscleData.secondary
    }

    return '#E5E7EB' // cor neutra para músculos não trabalhados
  }

  return (
    <div className="muscle-visualization">
      <svg viewBox="0 0 200 300" className="muscle-diagram">
        {/* Corpo humano simplificado */}

        {/* Cabeça */}
        <circle cx="100" cy="30" r="18" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>

        {/* Pescoço */}
        <rect x="95" y="45" width="10" height="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>

        {/* Peito/Tronco Superior */}
        <ellipse cx="100" cy="90" rx="32" ry="25" fill={getMuscleColor('chest')} stroke="#9CA3AF" strokeWidth="2" opacity="0.85"/>

        {/* Core/Abdomen */}
        <rect x="80" y="110" width="40" height="30" rx="5" fill={getMuscleColor('core')} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>

        {/* Costas (atrás - representado com elipse mais escura) */}
        <ellipse cx="100" cy="95" rx="28" ry="35" fill={getMuscleColor('back', false)} stroke="#9CA3AF" strokeWidth="1" opacity="0.5"/>

        {/* Ombros */}
        <circle cx="65" cy="75" r="15" fill={getMuscleColor('shoulders')} stroke="#9CA3AF" strokeWidth="2" opacity="0.8"/>
        <circle cx="135" cy="75" r="15" fill={getMuscleColor('shoulders')} stroke="#9CA3AF" strokeWidth="2" opacity="0.8"/>

        {/* Tríceps (parte traseira do braço) */}
        <rect x="45" y="85" width="15" height="50" rx="7" fill={getMuscleColor('triceps', false)} stroke="#9CA3AF" strokeWidth="2" opacity="0.7"/>
        <rect x="140" y="85" width="15" height="50" rx="7" fill={getMuscleColor('triceps', false)} stroke="#9CA3AF" strokeWidth="2" opacity="0.7"/>

        {/* Bíceps (parte frontal do braço) */}
        <ellipse cx="52" cy="110" rx="8" ry="25" fill={getMuscleColor('biceps')} stroke="#9CA3AF" strokeWidth="1" opacity="0.8"/>
        <ellipse cx="148" cy="110" rx="8" ry="25" fill={getMuscleColor('biceps')} stroke="#9CA3AF" strokeWidth="1" opacity="0.8"/>

        {/* Antebraços */}
        <rect x="47" y="130" width="11" height="40" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
        <rect x="142" y="130" width="11" height="40" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>

        {/* Glúteos */}
        <ellipse cx="100" cy="150" rx="28" ry="12" fill={getMuscleColor('glutes')} stroke="#9CA3AF" strokeWidth="1" opacity="0.75"/>

        {/* Coxas/Pernas */}
        <rect x="75" y="155" width="18" height="75" rx="9" fill={getMuscleColor('legs')} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>
        <rect x="107" y="155" width="18" height="75" rx="9" fill={getMuscleColor('legs')} stroke="#9CA3AF" strokeWidth="2" opacity="0.75"/>

        {/* Panturrilhas */}
        <rect x="78" y="230" width="12" height="50" rx="6" fill={getMuscleColor('calves', false)} stroke="#9CA3AF" strokeWidth="1" opacity="0.6"/>
        <rect x="110" y="230" width="12" height="50" rx="6" fill={getMuscleColor('calves', false)} stroke="#9CA3AF" strokeWidth="1" opacity="0.6"/>
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