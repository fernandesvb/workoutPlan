# 📊 ANÁLISE DE CUSTOS - FitTracker Pro

## 🔍 Chamadas à API Claude Identificadas

### 1. **Geração de Treino Completo** (WorkoutWizard)
- **Quando**: Usuário cria novo treino no wizard
- **Frequência**: 1x por usuário (ou quando renova treino)
- **Tokens**: ~200 input + 450 output = 650 tokens
- **Custo**: $0.007 por treino

### 2. **Análise de Fotos de Equipamentos** (WorkoutWizard)
- **Quando**: Usuário fotografa equipamentos
- **Frequência**: 1-10 fotos por usuário (média 5)
- **Tokens**: ~100 input + 250 output = 350 tokens por foto
- **Custo**: $0.00375 por foto × 5 = $0.01875

### 3. **Sugestões de Exercícios Extras** (AddExerciseModal)
- **Quando**: Usuário pede sugestões de exercícios via IA
- **Frequência**: 2-5x por usuário (média 3)
- **Tokens**: ~300 input + 450 output = 750 tokens
- **Custo**: $0.0105 por sugestão × 3 = $0.0315

---

## 💰 CUSTO POR USUÁRIO

### Cenário Conservador (uso básico)
- Geração de treino: $0.007
- Análise de 3 fotos: $0.011
- 2 sugestões extras: $0.021
- **TOTAL: $0.039 (~R$ 0.20)**

### Cenário Médio (uso normal)
- Geração de treino: $0.007
- Análise de 5 fotos: $0.019
- 3 sugestões extras: $0.032
- **TOTAL: $0.058 (~R$ 0.30)**

### Cenário Alto (uso intenso)
- Geração de treino: $0.007
- Análise de 10 fotos: $0.038
- 5 sugestões extras: $0.053
- Renovação de treino 1x: $0.007
- **TOTAL: $0.105 (~R$ 0.53)**

---

## 📈 PROJEÇÕES MENSAIS

### 100 usuários/mês
- Conservador: $3.90 (R$ 19.50)
- Médio: $5.80 (R$ 29.00)
- Alto: $10.50 (R$ 52.50)

### 500 usuários/mês
- Conservador: $19.50 (R$ 97.50)
- Médio: $29.00 (R$ 145.00)
- Alto: $52.50 (R$ 262.50)

### 1.000 usuários/mês
- Conservador: $39.00 (R$ 195.00)
- Médio: $58.00 (R$ 290.00)
- Alto: $105.00 (R$ 525.00)

### 5.000 usuários/mês
- Conservador: $195.00 (R$ 975.00)
- Médio: $290.00 (R$ 1.450.00)
- Alto: $525.00 (R$ 2.625.00)

### 10.000 usuários/mês
- Conservador: $390.00 (R$ 1.950.00)
- Médio: $580.00 (R$ 2.900.00)
- Alto: $1.050.00 (R$ 5.250.00)

---

## 🏗️ OUTROS CUSTOS DE INFRAESTRUTURA

### Firebase (Banco de Dados + Auth)
- **Plano Gratuito**: Até 50k leituras/dia, 20k escritas/dia
- **Plano Blaze (Pay-as-you-go)**:
  - 10k usuários ativos: ~$25-50/mês
  - 50k usuários ativos: ~$100-200/mês

### Vercel (Hosting + Serverless)
- **Plano Gratuito**: 100GB bandwidth, 100 horas serverless
- **Plano Pro ($20/mês)**: 1TB bandwidth, 1000 horas serverless
- **Estimativa**: Até 5k usuários no gratuito, depois Pro

### Apple Developer ($99/ano)
- Necessário para publicar no iOS

### Google Play ($25 única vez)
- Necessário para publicar no Android

---

## 💵 SUGESTÃO DE PRECIFICAÇÃO

### Modelo Freemium
**Plano Gratuito:**
- 1 geração de treino
- Sem análise de fotos
- 1 sugestão de exercício por mês
- Custo: $0.017/usuário

**Plano Premium ($4.99/mês ou R$ 24.90/mês):**
- Treinos ilimitados
- Análise de fotos ilimitada
- Sugestões ilimitadas
- Custo médio: $0.10/usuário/mês
- **Margem: 98% ($4.89 lucro)**

**Plano Anual ($39.99/ano ou R$ 199.90/ano):**
- Todos os recursos Premium
- Economia de 33% vs mensal
- Custo: $1.20/usuário/ano
- **Margem: 97% ($38.79 lucro)**

### Modelo Único (Compra Única)
**Preço: $19.99 ou R$ 99.90**
- Acesso vitalício
- Custo por usuário: $0.10 (primeiro mês) + $0.02/mês (manutenção)
- Break-even: Após 1 ano
- **Margem: 95% no primeiro ano**

---

## 🎯 RECOMENDAÇÃO FINAL

### Estratégia Híbrida:
1. **Freemium** para aquisição de usuários
2. **Premium Mensal** ($4.99) para usuários ativos
3. **Premium Anual** ($39.99) com desconto para fidelização

### Projeção Realista (12 meses):
- 10.000 downloads
- 5% conversão Premium = 500 assinantes
- Receita: 500 × $4.99 = $2.495/mês
- Custos IA: $29/mês (cenário médio)
- Custos Infra: $70/mês (Firebase + Vercel)
- **Lucro Líquido: $2.396/mês (R$ 11.980/mês)**

### ROI:
- Investimento inicial: $124 (Apple + Google)
- Break-even: Mês 1
- Margem de lucro: 96%

---

## ⚡ OTIMIZAÇÕES PARA REDUZIR CUSTOS

### Já Implementadas:
✅ max_tokens otimizado (450 vs 1000+)
✅ Prompts concisos e diretos
✅ Fallback local quando IA falha
✅ Cache de respostas no localStorage

### Futuras:
🔄 Rate limiting por usuário (ex: 10 sugestões/dia)
🔄 Cache de análises de equipamentos similares
🔄 Usar modelo mais barato para tarefas simples
🔄 Batch processing para múltiplas fotos

---

## 📱 CUSTOS MOBILE (iOS/Android)

### Desenvolvimento:
- Usar React Native ou Capacitor (reutilizar código web)
- Custo adicional: ~$0 (mesmo código)

### Publicação:
- Apple: $99/ano
- Google: $25 única vez

### Manutenção:
- Mesma infraestrutura (Firebase + Vercel)
- Sem custos adicionais significativos

---

**Conclusão**: O app é EXTREMAMENTE lucrativo com margem de 96%+. 
Custos de IA são mínimos (~$0.06/usuário). 
Principal custo será marketing/aquisição de usuários.
