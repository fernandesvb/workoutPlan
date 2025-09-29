import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function WorkoutTabs({ activeDay, onDayChange, customExercises }) {
  const days = [1, 2, 3, 4, 5, 6, 7]

  const getExerciseCount = (day) => {
    return customExercises.filter(ex => ex.day === day).length
  }

  const getDayName = (day) => {
    const names = {
      1: 'Segunda',
      2: 'Terça',
      3: 'Quarta',
      4: 'Quinta',
      5: 'Sexta',
      6: 'Sábado',
      7: 'Domingo'
    }
    return names[day]
  }

  return (
    <div className="w-full">
      <Tabs value={activeDay.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 h-auto p-1">
          {days.map(day => {
            const exerciseCount = getExerciseCount(day)

            return (
              <TabsTrigger
                key={day}
                value={day.toString()}
                className="flex flex-col gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-xs font-medium">
                  {getDayName(day)}
                </span>
                <span className="text-lg font-bold">
                  {day}
                </span>
                {exerciseCount > 0 && (
                  <Badge variant={activeDay === day ? "secondary" : "outline"} className="h-4 px-1 text-xs">
                    {exerciseCount}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}