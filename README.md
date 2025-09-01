# 💪 Meu Treino - Aplicativo de Controle de Exercícios

Um aplicativo web simples e eficiente para controlar seus treinos de musculação com cronômetro integrado e sincronização na nuvem.

## ✨ Funcionalidades

### 🏋️ Controle de Treino
- **3 dias de treino**: Peito/Tríceps, Costas/Bíceps, Pernas
- **Exercícios de Core** incluídos em cada dia
- **Controle de peso** por semana (4 semanas)
- **Anotações** personalizadas

### ⏱️ Cronômetro Integrado
- Cronômetro progressivo e regressivo
- Tempos pré-definidos (30s, 45s, 1min, 1:30, 2min)
- Vibração no celular ao finalizar
- Cores dinâmicas baseadas no tempo

### ☁️ Sincronização de Dados
- **Firebase**: Backup automático na nuvem
- **localStorage**: Fallback offline
- **Auto-save**: Salva automaticamente enquanto digita
- **Multi-dispositivo**: Acesse de qualquer lugar

### 📱 Design Responsivo
- Otimizado para celular e desktop
- Interface clean e intuitiva
- Suporte a PWA (Progressive Web App)
- Acessibilidade completa (ARIA)

## 🚀 Como Usar

### Modo Básico (Local)
1. Abra o arquivo `index.html` no navegador
2. Seus dados serão salvos localmente no navegador
3. Use o cronômetro durante os exercícios
4. Exporte seus dados em CSV quando quiser

### Modo Avançado (Firebase)
1. Siga o guia em [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)
2. Configure seu projeto Firebase
3. Tenha seus dados sincronizados na nuvem
4. Acesse de qualquer dispositivo

## 📊 Exportação de Dados

- **CSV Export**: Baixe seus dados em planilha
- **Backup Local**: Dados sempre salvos no navegador
- **Sincronização**: Firebase mantém histórico completo

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com CSS Grid/Flexbox
- **JavaScript ES6+**: Código modular e moderno
- **Firebase**: Backend como serviço
- **PWA**: Funciona offline e pode ser instalado

## 📝 Estrutura do Projeto

```
workoutPlan/
├── index.html          # Aplicação principal
├── README.md           # Este arquivo
└── FIREBASE_SETUP.md   # Guia de configuração Firebase
```

## 🎯 Exercícios Incluídos

### Dia 1 - Peito e Tríceps
- Supino Máquina Smith (3x12)
- Crucifixo Halteres (3x12)
- Tríceps Polia (3x15)
- Tríceps Testa (3x12)
- **Core**: Prancha Frontal + Superman

### Dia 2 - Costas e Bíceps
- Remada Máquina (3x12)
- Puxada Frontal (3x12)
- Rosca Direta (3x12)
- Rosca Martelo (3x12)
- **Core**: Prancha Lateral + Ponte

### Dia 3 - Pernas
- Leg Press (3x12)
- Cadeira Extensora (3x12)
- Cadeira Flexora (3x12)
- Panturrilha (3x20)
- **Core**: Abdominal Bicicleta + Gato-Vaca

## 🔧 Configuração

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para Firebase)

### Instalação
1. Baixe ou clone este repositório
2. Abra `index.html` no navegador
3. (Opcional) Configure Firebase seguindo o guia

## 🤝 Contribuições

Este é um projeto pessoal, mas sugestões são bem-vindas!

## 📄 Licença

Projeto pessoal de uso livre.

---

💪 **Bons treinos!** Mantenha a consistência e os resultados virão!
