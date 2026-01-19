// ========================================
// MINIGAME 6: GLOCKENSPIEL DER HAUSELFEN
// ========================================

let bellState = {
    bells: ['🔔', '🔔', '🔔', '🔔', '🔔'],
    melody: [0, 2, 1, 3, 2],
    playerSequence: [],
    phase: 'forward', // 'forward' or 'backward'
    level: 1
};

function initBellGame() {
    bellState.playerSequence = [];
    bellState.phase = 'forward';
    bellState.level = 1;
    renderBells();
    playMelody();
}

function renderBells() {
    const container = document.getElementById('bellContainer');
    container.innerHTML = '';

    bellState.bells.forEach((bell, i) => {
        const bellDiv = document.createElement('div');
        bellDiv.className = 'bell';
        bellDiv.textContent = bell;
        bellDiv.onclick = () => ringBell(i);
        container.appendChild(bellDiv);
    });
}

function playMelody() {
    showMessage('🎵 Höre gut zu...', 'info');
    bellState.melody.forEach((bellIndex, i) => {
        setTimeout(() => {
            highlightBell(bellIndex);
        }, i * 600);
    });
}

function highlightBell(index) {
    const bells = document.querySelectorAll('.bell');
    bells[index].classList.add('ringing');
    setTimeout(() => bells[index].classList.remove('ringing'), 400);
}

function ringBell(index) {
    highlightBell(index);
    bellState.playerSequence.push(index);

    const targetSequence = bellState.phase === 'forward'
        ? bellState.melody
        : [...bellState.melody].reverse();

    // Check if correct so far
    const currentIndex = bellState.playerSequence.length - 1;
    if (bellState.playerSequence[currentIndex] !== targetSequence[currentIndex]) {
        showMessage('❌ Falsche Reihenfolge!', 'error');
        setTimeout(() => resetMinigame(6), 1000);
        return;
    }

    // Check if complete
    if (bellState.playerSequence.length === bellState.melody.length) {
        if (bellState.phase === 'forward') {
            showMessage('✅ Richtig! Jetzt rückwärts...', 'success');
            bellState.phase = 'backward';
            bellState.playerSequence = [];
        } else {
            solveMinigame(6, '🔔 Glocken-Erinnerung');
        }
    }
}
