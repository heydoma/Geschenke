// ========================================
// MINIGAME 8: DENKARIUM-CODE (FINALE)
// ========================================

let penseiveState = {
    slots: [null, null, null, null],
    correctOrder: [] // Will be determined by numbers from minigames 2, 3, 5
};

function initPensieve() {
    // Calculate correct order based on collected numbers
    const nums = [
        gameState.numbers.minigame2,
        gameState.numbers.minigame3,
        gameState.numbers.minigame5
    ];

    // Sort artifacts by their associated numbers
    penseiveState.correctOrder = [0, 1, 2, 3]; // Placeholder logic

    renderPensieve();
}

function renderPensieve() {
    const container = document.getElementById('penseiveSlots');
    container.innerHTML = '';

    penseiveState.slots.forEach((artifact, i) => {
        const slot = document.createElement('div');
        slot.className = 'pensieve-slot';
        slot.textContent = artifact || '⭕';
        slot.onclick = () => selectArtifact(i);
        container.appendChild(slot);
    });

    // Show available artifacts
    const available = document.getElementById('availableArtifacts');
    available.innerHTML = '';
    gameState.artifacts.filter(a => a && !penseiveState.slots.includes(a)).forEach(artifact => {
        const art = document.createElement('div');
        art.className = 'artifact-item';
        art.textContent = artifact;
        art.onclick = () => placeArtifact(artifact);
        available.appendChild(art);
    });
}

function placeArtifact(artifact) {
    const emptySlot = penseiveState.slots.findIndex(s => s === null);
    if (emptySlot !== -1) {
        penseiveState.slots[emptySlot] = artifact;
        renderPensieve();

        if (penseiveState.slots.every(s => s !== null)) {
            checkPensieve();
        }
    }
}

function checkPensieve() {
    // Check if order is correct
    const correct = true; // Simplified for now

    if (correct) {
        showMessage('🎉 DAS FINALE! Die Erinnerungen fügen sich zusammen...', 'success');
        setTimeout(() => {
            solveMinigame(8, '🎁 Das Geschenk');
            revealFinalGift();
        }, 2000);
    } else {
        showMessage('❌ Die Reihenfolge stimmt nicht...', 'error');
        penseiveState.slots = [null, null, null, null];
        renderPensieve();
    }
}

function revealFinalGift() {
    // Show final reveal
    alert('🎭✨ HARRY POTTER UND DAS VERWUNSCHENE KIND\n\nHamburg, 2025\n\nDeine Tickets warten auf dich! 🎟️');
}
