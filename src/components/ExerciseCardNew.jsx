import { useState, useEffect } from 'react'
import { CheckCircle, Save, Loader2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function ExerciseCard({
  exercise,
  workoutData,
  onWorkoutChange,
  onRemoveExercise,
  week = 1
}) {
  const [values, setValues] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const isCompleted = workoutData[`${exercise.id}_completed`] === 'true'

  useEffect(() => {
    if (exercise.type === 'weight') {
      setValues({
        weight: workoutData[`${exercise.id}_w${week}`] || '',
        reps1: workoutData[`${exercise.id}_r1_w${week}`] || '',
        reps2: workoutData[`${exercise.id}_r2_w${week}`] || '',
        reps3: workoutData[`${exercise.id}_r3_w${week}`] || ''
      })
    } else if (exercise.type === 'time') {
      setValues({
        time1: workoutData[`${exercise.id}_t1_w${week}`] || '',
        time2: workoutData[`${exercise.id}_t2_w${week}`] || '',
        time3: workoutData[`${exercise.id}_t3_w${week}`] || ''
      })
    } else if (exercise.type === 'reps') {
      setValues({
        reps1: workoutData[`${exercise.id}_r1_w${week}`] || '',
        reps2: workoutData[`${exercise.id}_r2_w${week}`] || '',
        reps3: workoutData[`${exercise.id}_r3_w${week}`] || ''
      })
    }
  }, [exercise, workoutData, week])

  const handleInputChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Save all values
      Object.entries(values).forEach(([field, value]) => {
        let key
        if (field === 'weight') {
          key = `${exercise.id}_w${week}`
        } else if (field.startsWith('reps')) {
          const repNum = field.slice(-1)
          key = `${exercise.id}_r${repNum}_w${week}`
        } else if (field.startsWith('time')) {
          const timeNum = field.slice(-1)
          key = `${exercise.id}_t${timeNum}_w${week}`
        }

        if (key && value) {
          onWorkoutChange(key, value)
        }
      })

      // Mark as completed if has values
      const hasValues = Object.values(values).some(value => value && value.trim() !== '')
      if (hasValues) {
        onWorkoutChange(`${exercise.id}_completed`, 'true')

        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('exerciseCompleted', {
          detail: {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            week: week,
            values: values
          }
        }))
      }

      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500))

    } finally {
      setIsSaving(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      chest: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      back: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      arms: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      legs: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      core: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cardio: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
    return colors[category] || colors.normal
  }

  const renderInputFields = () => {
    if (exercise.type === 'weight') {
      return (
        <div className="grid gap-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Peso (kg)
            </label>
            <Input
              type="number"
              placeholder="Ex: 50"
              value={values.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="text-center"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Série 1
              </label>
              <Input
                type="number"
                placeholder="12"
                value={values.reps1 || ''}
                onChange={(e) => handleInputChange('reps1', e.target.value)}
                className="text-center text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Série 2
              </label>
              <Input
                type="number"
                placeholder="10"
                value={values.reps2 || ''}
                onChange={(e) => handleInputChange('reps2', e.target.value)}
                className="text-center text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Série 3
              </label>
              <Input
                type="number"
                placeholder="8"
                value={values.reps3 || ''}
                onChange={(e) => handleInputChange('reps3', e.target.value)}
                className="text-center text-sm"
              />
            </div>
          </div>
        </div>
      )
    } else if (exercise.type === 'time') {
      return (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Tempo 1
            </label>
            <Input
              type="text"
              placeholder="30s"
              value={values.time1 || ''}
              onChange={(e) => handleInputChange('time1', e.target.value)}
              className="text-center text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Tempo 2
            </label>
            <Input
              type="text"
              placeholder="30s"
              value={values.time2 || ''}
              onChange={(e) => handleInputChange('time2', e.target.value)}
              className="text-center text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Tempo 3
            </label>
            <Input
              type="text"
              placeholder="30s"
              value={values.time3 || ''}
              onChange={(e) => handleInputChange('time3', e.target.value)}
              className="text-center text-sm"
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Reps 1
            </label>
            <Input
              type="number"
              placeholder="15"
              value={values.reps1 || ''}
              onChange={(e) => handleInputChange('reps1', e.target.value)}
              className="text-center text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Reps 2
            </label>
            <Input
              type="number"
              placeholder="12"
              value={values.reps2 || ''}
              onChange={(e) => handleInputChange('reps2', e.target.value)}
              className="text-center text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Reps 3
            </label>
            <Input
              type="number"
              placeholder="10"
              value={values.reps3 || ''}
              onChange={(e) => handleInputChange('reps3', e.target.value)}
              className="text-center text-sm"
            />
          </div>
        </div>
      )
    }
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isCompleted && "ring-2 ring-green-200 dark:ring-green-800 bg-green-50/50 dark:bg-green-950/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{exercise.name}</CardTitle>
              {isCompleted && (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            {exercise.notes && (
              <CardDescription className="text-xs">
                {exercise.notes}
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2 ml-2">
            <Badge className={getCategoryColor(exercise.category)}>
              {exercise.category}
            </Badge>
            {onRemoveExercise && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveExercise(exercise.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderInputFields()}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
          size="sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}