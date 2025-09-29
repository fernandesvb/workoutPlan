import { Trophy, Star, TrendingUp, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WorkoutSummary({
  show,
  onClose,
  completed,
  total,
  xpGained,
  leveledUp,
  newLevel,
  day
}) {
  const completionRate = Math.round((completed / total) * 100)

  const getCompletionMessage = () => {
    if (completionRate === 100) return '🏆 Treino Perfeito!'
    if (completionRate >= 80) return '🔥 Excelente Treino!'
    if (completionRate >= 60) return '💪 Bom Treino!'
    if (completionRate >= 40) return '👍 Treino Válido!'
    return '⭐ Todo exercício conta!'
  }

  const getMotivationalMessage = () => {
    if (completionRate === 100) return 'Você completou todos os exercícios! Parabéns pela disciplina!'
    if (completionRate >= 80) return 'Ótimo progresso! Você está no caminho certo!'
    if (completionRate >= 60) return 'Bom trabalho! Consistência é a chave do sucesso!'
    if (completionRate >= 40) return 'Cada passo conta! Continue assim!'
    return 'Você começou e isso já é uma vitória!'
  }

  const getCompletionColor = () => {
    if (completionRate === 100) return 'text-green-600 dark:text-green-400'
    if (completionRate >= 80) return 'text-blue-600 dark:text-blue-400'
    if (completionRate >= 60) return 'text-purple-600 dark:text-purple-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with Icon */}
        <div className="text-center p-6 pb-0">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            {completionRate === 100 ? (
              <Trophy className="h-8 w-8 text-white" />
            ) : (
              <CheckCircle className="h-8 w-8 text-white" />
            )}
          </div>

          <DialogHeader className="space-y-2">
            <DialogTitle className={`text-2xl font-bold ${getCompletionColor()}`}>
              {getCompletionMessage()}
            </DialogTitle>
            <DialogDescription className="text-base">
              Treino do Dia {day} finalizado
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 space-y-6">
          {/* Main Completion Stats */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">
                {completed}/{total}
              </div>
              <div className="text-sm opacity-90 mb-3">
                Exercícios Completados
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1 bg-white/20 text-white border-0">
                {completionRate}%
              </Badge>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-primary">+{xpGained}</div>
                <div className="text-xs text-muted-foreground">XP Ganho</div>
              </CardContent>
            </Card>

            {leveledUp && (
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">Nível {newLevel}</div>
                  <div className="text-xs opacity-90">LEVEL UP!</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Motivational Message */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {getMotivationalMessage()}
              </p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="pb-6">
            <Button
              onClick={onClose}
              className="w-full h-12 text-base font-medium"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Continuar
            </Button>
          </div>
        </div>

        {/* Level Up Effect */}
        {leveledUp && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-2xl animate-bounce delay-0">✨</div>
            <div className="absolute top-6 right-6 text-2xl animate-bounce delay-100">⭐</div>
            <div className="absolute bottom-8 left-6 text-2xl animate-bounce delay-200">✨</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}