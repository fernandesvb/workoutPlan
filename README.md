# 🏋️ Treino

App pessoal para controlar o treino na academia. Sem login, sem IA, sem
assinatura — abre e registra a carga.

## O plano

Quatro treinos, 4 séries de 5 repetições em cada exercício:

| Treino | Grupos                                            |
| ------ | ------------------------------------------------- |
| 1      | Trapézio · Ombros · Pernas (abdutora/adutora)     |
| 2      | Costas · Bíceps · Banco romano                    |
| 3      | Pernas (leg press, agachamento, extensora, flexora, panturrilha) |
| 4      | Peito · Bíceps · Banco romano                     |

Para mudar exercícios, séries ou repetições, edite **apenas**
[`src/data/workouts.js`](src/data/workouts.js). O resto do app se adapta.

## Como funciona

1. Abre no treino sugerido (o próximo da rotação 1 → 2 → 3 → 4).
2. Toca no treino para começar.
3. Cada exercício mostra a carga da última vez — o número a bater.
4. Ajusta o peso (±2,5 kg) e toca no chip da série para registrar.
5. O descanso de 90s começa sozinho e vibra no fim.
6. Ao completar as 4 séries, o próximo exercício abre automaticamente.
7. "Finalizar treino" salva no histórico.

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
