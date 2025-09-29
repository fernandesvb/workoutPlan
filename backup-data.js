// 🔒 Script de Backup - FitTracker Pro
// Execute no console do browser ANTES de aplicar novas regras Firebase

console.log('🔒 FitTracker Pro - Backup de Dados');
console.log('=====================================');

// Função para fazer backup completo
function backupAllData() {
    const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {}
    };

    // Coletar todos os dados do localStorage
    const keys = [
        'treino',
        'customExercises',
        'workoutMeta',
        'userStats',
        'hasSeenTutorial',
        'hasSeenUpgradeModal',
        'isPremium'
    ];

    keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            try {
                // Tentar parsear como JSON
                backup.data[key] = JSON.parse(value);
            } catch (e) {
                // Se não for JSON, salvar como string
                backup.data[key] = value;
            }
        }
    });

    console.log('📦 Backup gerado:', backup);

    // Salvar backup como arquivo
    const backupText = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fittracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Backup salvo como arquivo!');
    return backup;
}

// Função para restaurar backup
function restoreFromBackup(backupData) {
    if (!backupData || !backupData.data) {
        console.error('❌ Dados de backup inválidos');
        return false;
    }

    console.log('🔄 Restaurando backup...');

    Object.entries(backupData.data).forEach(([key, value]) => {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        console.log(`✅ Restaurado: ${key}`);
    });

    console.log('✅ Backup restaurado com sucesso!');
    console.log('🔄 Recarregue a página para aplicar as mudanças');

    return true;
}

// Função para verificar integridade dos dados
function verifyDataIntegrity() {
    console.log('🔍 Verificando integridade dos dados...');

    const checks = {
        treino: false,
        customExercises: false,
        userStats: false,
        auth: false
    };

    // Verificar dados de treino
    const treino = localStorage.getItem('treino');
    if (treino) {
        try {
            const parsed = JSON.parse(treino);
            checks.treino = !!(parsed.workoutData || parsed.customExercises);
        } catch (e) {
            console.warn('⚠️ Dados de treino corrompidos');
        }
    }

    // Verificar exercícios customizados
    const exercises = localStorage.getItem('customExercises');
    if (exercises) {
        try {
            const parsed = JSON.parse(exercises);
            checks.customExercises = Array.isArray(parsed);
        } catch (e) {
            console.warn('⚠️ Dados de exercícios corrompidos');
        }
    }

    // Verificar stats de usuário
    const stats = localStorage.getItem('userStats');
    if (stats) {
        try {
            const parsed = JSON.parse(stats);
            checks.userStats = !!(parsed.xp !== undefined && parsed.level !== undefined);
        } catch (e) {
            console.warn('⚠️ Dados de estatísticas corrompidos');
        }
    }

    // Verificar auth (Firebase)
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const user = firebase.auth().currentUser;
        checks.auth = !!user;
    }

    console.log('📊 Status da verificação:', checks);

    const hasData = Object.values(checks).some(Boolean);
    if (hasData) {
        console.log('✅ Dados encontrados - backup recomendado');
    } else {
        console.log('⚠️ Nenhum dado encontrado');
    }

    return checks;
}

// Expor funções globalmente
window.backupFitTracker = backupAllData;
window.restoreFitTracker = restoreFromBackup;
window.verifyFitTracker = verifyDataIntegrity;

// Executar verificação automática
verifyDataIntegrity();

console.log('');
console.log('📋 COMANDOS DISPONÍVEIS:');
console.log('========================');
console.log('backupFitTracker()     - Fazer backup completo');
console.log('restoreFitTracker(data) - Restaurar backup');
console.log('verifyFitTracker()     - Verificar integridade');
console.log('');
console.log('⚠️  IMPORTANTE: Faça backup ANTES de aplicar as novas regras Firebase!');
console.log('');

// Auto-backup se houver dados importantes
setTimeout(() => {
    const checks = verifyDataIntegrity();
    if (checks.treino || checks.customExercises || checks.userStats) {
        console.log('🤖 Auto-executando backup por segurança...');
        backupAllData();
    }
}, 2000);