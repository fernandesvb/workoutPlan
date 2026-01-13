import { useState, useEffect, useRef } from 'react'
import { Trophy, Zap, Target, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function WorkoutProgress({
  day,
  workoutData,
  customExercises,
  onWorkoutComplete,
  onFinishWorkout
}) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
    estimatedTime: 0
  })

  const [autoFinished, setAutoFinished] = useState(false)
  const previousPercentageRef = useRef(0)

  useEffect(() => {
    calculateProgress()
  }, [day, workoutData, customExercises])

  // Reset state when changing day
  useEffect(() => {
    setAutoFinished(false)
    previousPercentageRef.current = 0
  }, [day])

  const calculateProgress = () => {
    const dayExercises = customExercises.filter(ex => ex.day === day)
    const total = dayExercises.length

    if (total === 0) {
      setProgress({ completed: 0, total: 0, percentage: 0, estimatedTime: 0 })
      return
    }

    let completed = 0
    let estimatedTime = 0
    const today = new Date().toLocaleDateString('pt-BR')

    dayExercises.forEach(exercise => {
      // Verificar se tem registro para hoje no histórico
      const history = JSON.parse(workoutData[`${exercise.id}_history`] || '[]')
      const hasRecordToday = history.length > 0 && history[0].date === today

      if (hasRecordToday) {
        completed++
      } else {
        // Calculate more accurate time per exercise
        let exerciseTime = 0

        // Parse series (e.g., "3x12" -> 3 sets)
        const seriesMatch = exercise.series?.match(/^(\d+)/)
        const sets = seriesMatch ? parseInt(seriesMatch[1]) : 3

        // Base time per set based on exercise type
        if (exercise.type === 'weight') {
          // Weight exercises: ~45-60s per set + 60-90s rest
          exerciseTime = sets * 1.75 // ~1.75 min per set (45s work + 90s rest)
        } else if (exercise.type === 'time') {
          // Time-based exercises: variable duration + shorter rest
          exerciseTime = sets * 1.25 // ~1.25 min per set (30s work + 45s rest)
        } else {
          // Bodyweight/reps: ~30-45s per set + 45-60s rest
          exerciseTime = sets * 1.5 // ~1.5 min per set (40s work + 50s rest)
        }

        estimatedTime += exerciseTime
      }
    })

    // Round to nearest minute
    estimatedTime = Math.ceil(estimatedTime)

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Detect if just completed 100% of exercises
    const justCompleted = percentage === 100 && previousPercentageRef.current < 100

    setProgress({
      completed,
      total,
      percentage,
      estimatedTime
    })

    // Auto finish when all exercises are completed
    if (justCompleted && !autoFinished && onFinishWorkout) {
      setAutoFinished(true)
      // Small delay to ensure last exercise was saved
      setTimeout(() => {
        onFinishWorkout(completed, total)
      }, 1000)
    }

    // Reset flag if back to less than 100%
    if (percentage < 100) {
      setAutoFinished(false)
    }

    // Update previous percentage reference
    previousPercentageRef.current = percentage
  }

  const getProgressVariant = () => {
    if (progress.percentage === 100) return 'default'
    if (progress.percentage >= 70) return 'default'
    return 'default'
  }

  const getMotivationalMessage = () => {
    if (progress.percentage === 100) return '🎉 Treino completo! Parabéns!'
    if (progress.percentage >= 70) return '🔥 Quase lá! Continue assim!'
    if (progress.percentage >= 30) return '💪 Bom ritmo! Mantenha o foco!'
    if (progress.percentage > 0) return '⚡ Começou bem! Vamos continuar!'
    return '🎯 Pronto para começar? Vamos treinar!'
  }

  if (progress.total === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <CardTitle className="text-lg mb-2">Nenhum exercício para hoje</CardTitle>
          <CardDescription>Adicione exercícios para começar</CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Progresso do Treino - Dia {day}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-sm">
            {progress.completed}/{progress.total} exercícios
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress.percentage}%</span>
          </div>
          <Progress
            value={progress.percentage}
            className="h-2"
          />
        </div>

        <Separator />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {progress.estimatedTime > 0
                ? `~${progress.estimatedTime} min restantes`
                : 'Treino finalizado!'
              }
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">{getMotivationalMessage()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {progress.completed > 0 && !autoFinished && (
            <Button
              onClick={() => onFinishWorkout && onFinishWorkout(progress.completed, progress.total)}
              className="w-full"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Treino ({progress.completed}/{progress.total})
            </Button>
          )}

          {progress.percentage === 100 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {autoFinished
                  ? '🎉 Treino finalizado automaticamente!'
                  : 'Todos exercícios completados!'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}