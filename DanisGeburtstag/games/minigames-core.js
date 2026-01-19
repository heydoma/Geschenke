// ========================================
// MINIGAME SYSTEM - Die Verbotene Abteilung
// Core System (State, Modal, Messages)
// ========================================

// Game State
const gameState = {
    solved: [false, false, false, false, false, false, false, false],
    artifacts: [null, null, null, null, null, null, null, null],
    numbers: { // Zahlen aus Minigames für Finale
        minigame2: null, // Audio-Balance
        minigame3: null, // Bibliothekars-Chiffre
        minigame5: null  // Invisible Ink
    }
};

// Modal System
function openMinigame(slotId) {
    const slotIndex = parseInt(slotId.replace(/slot[LR]/, '')) - 1;
    const minigameNum = slotId.startsWith('slotL') ? slotIndex : slotIndex + 4;
    
    if (gameState.solved[minigameNum]) {
        showMessage('Dieses Rätsel wurde bereits gelöst! ✨');
        return;
    }
    
    const modal = document.getElementById(`minigame${minigameNum + 1}`);
    if (modal) {
        modal.classList.add('active');
        document.getElementById('mainLibrary').classList.add('dimmed');
        initMinigame(minigameNum + 1);
    }
}

function closeMinigame(minigameNum) {
    const modal = document.getElementById(`minigame${minigameNum}`);
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('mainLibrary').classList.remove('dimmed');
    }
}

function resetMinigame(minigameNum) {
    showMessage('Rätsel wird zurückgesetzt...', 'warning');
    setTimeout(() => {
        if (minigameNum === 1) {
            polyjuiceGame.reset();
        } else {
            initMinigame(minigameNum);
        }
    }, 500);
}

function showHint(minigameNum) {
    const hints = [
        'Logik ist der Schlüssel. Schließe aus, was nicht sein kann.',
        'Beobachte die Übereinstimmungen. Farbe, Dauer, Symbol – was verbindet sie?',
        'Der Kontext verrät die Bedeutung. Welches Wort passt?',
        'Plane voraus. Jede Bewegung hat Konsequenzen.',
        'Geduld und sanfte Bewegungen. Zu viel Hitze zerstört.',
        'Erst vorwärts, dann rückwärts. Die Zeit kehrt sich um.',
        'Vom Stein zum Tod. Die Reihenfolge der Bände.',
        'Die Erinnerungen müssen in der richtigen Reihenfolge sein.'
    ];
    showMessage(`💡 Hinweis: ${hints[minigameNum - 1]}`, 'hint');
}

function showMessage(text, type = 'info') {
    const msg = document.createElement('div');
    msg.className = `game-message ${type}`;
    msg.textContent = text;
    document.body.appendChild(msg);
    
    setTimeout(() => msg.classList.add('show'), 10);
    setTimeout(() => {
        msg.classList.remove('show');
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

function solveMinigame(minigameNum, artifact, number = null) {
    gameState.solved[minigameNum - 1] = true;
    gameState.artifacts[minigameNum - 1] = artifact;
    
    if (number !== null) {
        if (minigameNum === 2) gameState.numbers.minigame2 = number;
        if (minigameNum === 3) gameState.numbers.minigame3 = number;
        if (minigameNum === 5) gameState.numbers.minigame5 = number;
    }
    
    // Update HUD
    const lock = document.getElementById(`hudLock${minigameNum}`);
    if (lock) {
        lock.classList.add('unlocked');
        lock.querySelector('text').textContent = '🔓';
    }
    
    // Update Orb Progress
    const segment = document.getElementById(`seg${minigameNum}`);
    if (segment) {
        segment.classList.add('active');
    }
    
    // Success animation
    showMessage(`✨ Rätsel ${minigameNum} gelöst! Artefakt erhalten: ${artifact}`, 'success');
    
    setTimeout(() => closeMinigame(minigameNum), 2000);
    
    // Check if all solved
    if (gameState.solved.every(s => s)) {
        setTimeout(() => showMessage('Alle Rätsel gelöst! Das Finale wartet...', 'success'), 3000);
    }
}

// Initialize specific minigame
function initMinigame(num) {
    switch(num) {
        case 1: polyjuiceGame.init(); break;
        case 2: initAudioBalance(); break;
        case 3: initCipher(); break;
        case 4: initStaircase(); break;
        case 5: initInvisibleInk(); break;
        case 6: initBellGame(); break;
        case 7: initBookSort(); break;
        case 8: initPensieve(); break;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Attach slot click handlers
    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('click', () => openMinigame(slot.id));
    });
});
