# 🏋️ Treino

App pessoal para controlar o treino na academia. Sem login, sem IA, sem
assinatura — abre e registra a carga.

## Metodologia

Peso baixo, **todas as séries até a falha**. Por isso o app não tem repetição
alvo: você registra quantas saíram de verdade, e é esse número que mostra a
evolução — não a carga.

Progressão: quando as repetições da primeira série passarem de ~30, suba a
carga no menor incremento possível e deixe as reps caírem de novo.

Cada treino fecha com **20 min de corrida** (130–140 bpm, 5–6 km/h). A corrida
fica no fim de propósito: correr antes derruba a força e corta o estímulo de
hipertrofia.

## O plano

Quatro treinos, 4 séries por exercício (3 no abdominal e no banco romano):

| Treino | Grupos                                                           |
| ------ | ---------------------------------------------------------------- |
| 1      | Trapézio · Ombros · Pernas (abdutora/adutora) · Abdominal        |
| 2      | Costas · Bíceps · Banco romano                                   |
| 3      | Pernas (leg press, agachamento, extensora, flexora, panturrilha) · Abdominal |
| 4      | Peito · Tríceps · Banco romano                                   |

Rodam em **loop** (1 → 2 → 3 → 4 → 1…), sem vínculo com dia da semana. O app
sugere o próximo com base no último feito.

Para mudar exercícios, séries ou repetições, edite **apenas**
[`src/data/workouts.js`](src/data/workouts.js). O resto do app se adapta.

## Como funciona

1. Abre no treino sugerido (o próximo da rotação 1 → 2 → 3 → 4).
2. Toca no treino para começar.
3. Cada exercício mostra a carga e **as reps de cada série da última vez** —
   os números a bater.
4. Ajusta carga (±2,5 kg) e reps (±1) e toca no chip da série para registrar.
5. O descanso de 90s começa sozinho e vibra no fim.
6. Ao completar as séries, o próximo exercício abre automaticamente.
7. Na corrida, registra duração e batimento médio; o app avisa se ficou fora
   da faixa de 130–140 bpm.
8. "Finalizar treino" salva no histórico.

Os dados ficam no `localStorage` do próprio celular: funciona offline e não
depende de servidor. O histórico tem botões de exportar/importar backup (JSON)
caso troque de aparelho ou limpe o navegador.

## Instalar no celular

Abra a URL no celular e use **Adicionar à tela de início**. O app roda em tela
cheia, com ícone próprio (PWA).

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run icons    # regera os ícones PWA em public/
```

Stack: React 18 + Vite. Sem framework de CSS — o design system vive em
[`src/index.css`](src/index.css).
