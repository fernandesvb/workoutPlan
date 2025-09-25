# 🏋️ FitTracker Pro

**Seu treino personalizado com IA**

Um aplicativo moderno de treino que combina planejamento inteligente com sugestões de IA para criar o programa de exercícios perfeito.

## ✨ Funcionalidades

### 🤖 **IA Integrada**
- Sugestões inteligentes de exercícios baseadas em suas necessidades
- Análise completa do seu treino atual
- Distribuição automática entre os dias de treino
- Dicas detalhadas de execução para cada exercício

### 📊 **Tracking Avançado**
- Sistema moderno de registro de pesos e repetições
- Histórico dos últimos treinos
- Progresso visual por exercício
- Salvamento automático na nuvem

### 🎯 **Treino Estruturado**
- Programa de 3 dias: Peito/Tríceps, Costas/Bíceps, Pernas
- Exercícios de core integrados
- Cronômetro para descanso entre séries
- Interface intuitiva e responsiva

### ☁️ **Sincronização**
- Backup automático no Firebase
- Acesso offline
- Sincronização entre dispositivos
- Exportação de dados

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+
- Conta no Firebase (opcional)
- Chave da API Claude (para IA)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/fittracker-pro.git
cd fittracker-pro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
CLAUDE_API_KEY=sua_chave_claude_aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Servidor IA
node proxy-server.js
```

5. **Acesse o aplicativo**
```
http://localhost:5173
```

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite, Lucide Icons
- **Backend**: Node.js, Express
- **IA**: Claude 3 Haiku (Anthropic)
- **Database**: Firebase Firestore
- **Styling**: CSS3 com variáveis customizadas
- **Deploy**: Vercel/Netlify ready

## 📱 Funcionalidades da IA

### Comandos Suportados
- `"exercícios para ombros"` → Sugere exercícios específicos
- `"treino de 20 minutos"` → Adapta duração do treino
- `"exercícios de core"` → Foco em fortalecimento
- `"treino mais intenso"` → Aumenta dificuldade

### Exemplos de Uso
```
🤖 "Preciso de exercícios para fortalecer os ombros"
→ IA sugere: Elevação Lateral (Dia 1), Desenvolvimento Arnold (Dia 1)

🤖 "Quero um treino de 45 minutos"
→ IA sugere exercícios adicionais para todos os dias

🤖 "Exercícios para melhorar a postura"
→ IA sugere exercícios de costas e core distribuídos
```

## 🎨 Design

- **Interface moderna** com design sóbrio e profissional
- **Responsivo** para desktop e mobile
- **Tema escuro/claro** automático
- **Animações suaves** e feedback visual
- **Acessibilidade** completa

## 📊 Estrutura do Projeto

```
fittracker-pro/
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços (Firebase, IA)
│   └── index.css          # Estilos globais
├── proxy-server.js        # Servidor IA
├── package.json
└── README.md
```

## 🔧 Configuração Avançada

### Firebase Setup
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Firestore Database
3. Configure as regras de segurança
4. Adicione as credenciais no código

### Claude API
1. Obtenha uma chave em [Anthropic](https://console.anthropic.com)
2. Adicione no arquivo `.env`
3. Configure os limites de uso

## 🚀 Deploy

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
# Configure as variáveis de ambiente
# Deploy o proxy-server.js
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎯 Roadmap

- [ ] App mobile (React Native)
- [ ] Mais modelos de IA
- [ ] Planos de treino pré-definidos
- [ ] Integração com wearables
- [ ] Comunidade de usuários
- [ ] Nutrição integrada

## 📞 Suporte

- 📧 Email: suporte@fittracker.com
- 💬 Discord: [FitTracker Community](https://discord.gg/fittracker)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/fittracker-pro/issues)

---

**Desenvolvido com ❤️ para revolucionar seus treinos**