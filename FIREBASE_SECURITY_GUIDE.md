# 🔒 Guia de Segurança Firebase - FitTracker Pro

## ⚠️ AÇÃO URGENTE NECESSÁRIA

Seu Firebase está em **Test Mode** e **expirará em 1 dia**. Siga este guia para corrigir:

---

## 🚀 SOLUÇÃO RÁPIDA (5 minutos)

### **1. Abrir Firebase Console**
1. Acesse: https://console.firebase.google.com/
2. Selecione projeto: **meu-treino-app-668e5**

### **2. Navegar para Firestore**
1. Menu lateral → **Firestore Database**
2. Clique na aba **"Regras"**

### **3. Aplicar Regras de Segurança**
Copie e cole uma das regras abaixo:

#### **OPÇÃO A: Regras Simples (Recomendada)**
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Regra para treinos - apenas usuário autenticado pode acessar seus dados
    match /workouts/{userId} {
      allow read, write: if request.auth != null
                        && request.auth.uid == userId;
    }

    // Regra para dados de usuário (futuro)
    match /users/{userId} {
      allow read, write: if request.auth != null
                        && request.auth.uid == userId;
    }

    // Negar todo o resto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### **OPÇÃO B: Regras Avançadas (Produção)**
Use o conteúdo do arquivo `firestore-secure.rules` para máxima segurança.

### **4. Publicar Regras**
1. Clique em **"Publicar"**
2. Confirmar a publicação

### **5. Testar**
1. Abra seu app: http://localhost:5173
2. Faça login com Google
3. Crie/salve um treino
4. ✅ Deve funcionar normalmente

---

## 🛡️ O QUE AS REGRAS FAZEM

### **Segurança Implementada:**
- ✅ **Autenticação obrigatória** - Apenas usuários logados
- ✅ **Isolamento de dados** - Cada usuário acessa apenas seus dados
- ✅ **Prevenção de vazamentos** - Dados de outros usuários protegidos
- ✅ **Negação padrão** - Tudo que não é explicitamente permitido é negado

### **Estrutura de Dados Protegida:**
```
/workouts/{userId}
├── workoutData: {} (dados dos exercícios)
├── notes: "string" (anotações)
├── customExercises: [] (exercícios personalizados)
├── workoutMeta: {} (metadados)
├── lastUpdated: timestamp
└── version: number
```

---

## 🔧 TROUBLESHOOTING

### **❌ Erro: "Missing or insufficient permissions"**
**Causa:** Usuário não autenticado ou regras mal aplicadas

**Solução:**
1. Verificar se login Google está funcionando
2. Verificar se as regras foram publicadas corretamente
3. Tentar fazer logout/login novamente

### **❌ App não salva dados no Firebase**
**Causa:** Regras muito restritivas ou erro de validação

**Solução:**
1. Usar OPÇÃO A (regras simples) primeiro
2. Verificar console do browser para erros
3. Testar com dados limpos (clear localStorage)

### **❌ "Error updating document"**
**Causa:** Validação de dados falhando (apenas regras avançadas)

**Solução:**
1. Usar OPÇÃO A temporariamente
2. Verificar estrutura dos dados no console
3. Ajustar validações conforme necessário

---

## 📊 PRÓXIMOS PASSOS

### **Imediato (hoje):**
- [ ] Aplicar regras de segurança
- [ ] Testar funcionamento completo
- [ ] Verificar se não há erros no console

### **Curto prazo (1 semana):**
- [ ] Implementar backup/restore de dados
- [ ] Adicionar logs de auditoria
- [ ] Configurar alertas de segurança

### **Médio prazo (1 mês):**
- [ ] Implementar regras avançadas com validação
- [ ] Adicionar rate limiting
- [ ] Configurar monitoramento de uso

---

## ⚡ COMANDOS DE EMERGÊNCIA

### **Resetar dados de teste:**
```javascript
// No console do browser:
localStorage.clear()
window.resetDebugFlags()
```

### **Verificar status das regras:**
```javascript
// No console do browser:
console.log('Auth status:', firebase.auth().currentUser)
console.log('Local data:', localStorage.getItem('treino'))
```

### **Backup manual:**
```javascript
// No console do browser:
const backup = {
  treino: localStorage.getItem('treino'),
  customExercises: localStorage.getItem('customExercises'),
  userStats: localStorage.getItem('userStats')
}
console.log('BACKUP:', JSON.stringify(backup))
// Copiar output para arquivo seguro
```

---

## 📞 SUPORTE

Em caso de problemas:

1. **Verificar console do browser** para erros
2. **Testar com dados limpos** (localStorage.clear())
3. **Usar regras simples** (OPÇÃO A) primeiro
4. **Documentar erros** específicos para debugging

**Status atual:** ⚠️ AÇÃO NECESSÁRIA EM 1 DIA

**Após aplicar:** ✅ SEGURO INDEFINIDAMENTE