# 🛠️ Guia de Desenvolvimento - FitTracker Pro

## 🚀 Setup Rápido

### 1. Instalação
```bash
git clone https://github.com/seu-usuario/fittracker-pro.git
cd fittracker-pro
npm install
```

### 2. Configuração
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas chaves
CLAUDE_API_KEY=sua_chave_claude_aqui
```

### 3. Execução
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Servidor IA
npm run server
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AddExerciseModal.jsx    # Modal de adicionar exercícios
│   ├── AuthSection.jsx         # Autenticação Firebase
│   ├── ExerciseCard.jsx        # Card individual de exercício
│   ├── TimerSection.jsx        # Cronômetro de descanso
│   ├── WorkoutDay.jsx          # Dia específico de treino
│   └── WorkoutTabs.jsx         # Navegação entre dias
├── hooks/
│   ├── useExerciseManager.js   # Gerenciamento de exercícios
│   ├── useFirebase.js          # Integração Firebase
│   └── useWorkoutData.js       # Dados do treino
├── services/
│   ├── firebase.js             # Configuração Firebase
│   └── openaiService.js        # Integração com IA
├── App.jsx                     # Componente principal
├── main.jsx                    # Entry point
└── index.css                   # Estilos globais
```

## 🤖 Sistema de IA

### Como Funciona
1. **Prompt Engineering**: `proxy-server.js` constrói prompts contextuais
2. **API Claude**: Processa solicitações e retorna JSON estruturado
3. **Parsing**: Frontend processa e exibe sugestões
4. **Integração**: Exercícios são adicionados ao treino

### Exemplos de Prompts
```javascript
// Exercícios específicos
"exercícios para ombros" → Distribui entre dias apropriados

// Duração de treino
"treino de 20 minutos" → Sugere remoções/reduções

// Intensidade
"treino mais intenso" → Adiciona exercícios/aumenta séries
```

## 🎨 Sistema de Estilos

### Variáveis CSS
```css
:root {
  --primary: #1e293b;
  --success: #059669;
  --danger: #ef4444;
  --bg-card: #ffffff;
  --text-primary: #0f172a;
  /* ... */
}
```

### Componentes Estilizados
- **Cards**: `.exercise-card` com hover effects
- **Botões**: `.btn-*` com gradientes e animações
- **Modal**: `.modal` com backdrop blur
- **Forms**: `.form-*` com validação visual

## 🔥 Firebase Integration

### Configuração
```javascript
// src/services/firebase.js
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "projeto.firebaseapp.com",
  projectId: "projeto-id"
}
```

### Funcionalidades
- **Auth**: Login/logout com Google
- **Firestore**: Backup automático de dados
- **Offline**: Funciona sem conexão
- **Sync**: Sincronização entre dispositivos

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### Adaptações Mobile
- Grid responsivo para exercícios
- Botões maiores para touch
- Modal fullscreen em mobile
- Navegação otimizada

## 🧪 Testing

### Testes Manuais
1. **IA**: Teste diferentes prompts
2. **Responsivo**: Teste em diferentes telas
3. **Offline**: Desconecte e teste funcionalidades
4. **Performance**: Verifique carregamento

### Checklist de QA
- [ ] IA responde corretamente
- [ ] Exercícios são adicionados
- [ ] Dados são salvos
- [ ] Interface responsiva
- [ ] Funciona offline

## 🚀 Deploy

### Frontend (Vercel)
```bash
# Conecte o repositório no Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### Backend (Railway)
```bash
# Faça deploy do proxy-server.js
# Configure CLAUDE_API_KEY
# Configure domínio personalizado
```

## 🔧 Troubleshooting

### Problemas Comuns

**IA não responde**
- Verifique CLAUDE_API_KEY
- Confirme se proxy-server está rodando
- Verifique logs no console

**Firebase não conecta**
- Verifique configuração em firebase.js
- Confirme regras do Firestore
- Teste autenticação

**Build falha**
- Limpe node_modules: `rm -rf node_modules && npm install`
- Verifique versões das dependências
- Confirme sintaxe ES6

## 📈 Performance

### Otimizações
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoization**: React.memo em componentes pesados
- **Bundle Splitting**: Vite otimiza automaticamente
- **Image Optimization**: Ícones SVG otimizados

### Métricas
- **First Paint**: < 1s
- **Interactive**: < 2s
- **Bundle Size**: < 500KB
- **Lighthouse Score**: > 90

## 🤝 Contribuição

### Workflow
1. Fork → Branch → Develop → Test → PR
2. Siga convenções de commit
3. Teste em diferentes dispositivos
4. Documente mudanças importantes

### Convenções
- **Commits**: `feat:`, `fix:`, `docs:`, `style:`
- **Branches**: `feature/nome`, `bugfix/nome`
- **Code Style**: Prettier + ESLint
- **Components**: PascalCase, hooks: camelCase

---

**Happy Coding! 🚀**