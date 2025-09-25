# 💪 Workout Plan - React Version

Aplicativo de controle de treino moderno construído com **React + Vite**, mantendo todas as funcionalidades da versão anterior com arquitetura mais robusta e escalável.

## 🚀 Funcionalidades

- ⏱️ **Cronômetro integrado** com presets rápidos
- 📱 **Design responsivo** otimizado para mobile
- ☁️ **Sincronização Firebase** com modo offline
- 🔐 **Autenticação Google** opcional
- 🤖 **IA para sugestões** de exercícios personalizados
- ➕ **Exercícios customizáveis** por dia de treino
- 📊 **Controle de progressão** semanal
- 📥 **Exportação CSV** dos dados
- 💾 **Auto-save** e backup local

## 🛠️ Tecnologias

- **React 18** - Interface moderna e reativa
- **Vite** - Build tool rápido e otimizado
- **Firebase** - Autenticação e banco de dados
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização responsiva com dark mode

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy para GitHub Pages
npm run deploy
```

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── FirebaseStatus.jsx
│   ├── AuthSection.jsx
│   ├── TimerSection.jsx
│   ├── WorkoutTabs.jsx
│   ├── WorkoutDay.jsx
│   ├── ExerciseCard.jsx
│   ├── NotesSection.jsx
│   └── AddExerciseModal.jsx
├── hooks/              # Custom hooks para lógica de estado
│   ├── useFirebase.js
│   ├── useWorkoutData.js
│   └── useExerciseManager.js
├── services/           # Serviços externos
│   ├── firebase.js
│   └── aiSuggestions.js
├── App.jsx            # Componente principal
├── main.jsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🔧 Configuração Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Google) e Firestore
3. Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workouts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Deploy GitHub Pages

1. Configure o `base` no `vite.config.js` com o nome do seu repositório
2. Execute: `npm run deploy`
3. Ative GitHub Pages nas configurações do repositório

## 🎯 Melhorias da Versão React

- **Componentização**: Código organizado em componentes reutilizáveis
- **Hooks customizados**: Lógica de estado isolada e testável
- **Performance**: Re-renders otimizados e lazy loading
- **Manutenibilidade**: Separação clara de responsabilidades
- **Escalabilidade**: Fácil adição de novas funcionalidades
- **TypeScript ready**: Estrutura preparada para migração

## 📱 PWA Features

- Instalável como app nativo
- Funciona offline
- Notificações push (futuro)
- Sincronização em background

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.