// ========================================
// MINIGAME 5: INVISIBLE INK
// ========================================

let inkState = {
    heatMap: Array(20).fill(0).map(() => Array(20).fill(0)),
    pattern: [ // Musical note pattern
        [0,0,1,1,0,0],
        [0,1,0,0,1,0],
        [1,0,0,0,0,1],
        [1,0,0,0,0,1],
        [0,1,0,0,1,0],
        [0,0,1,1,0,0]
    ],
    secretNumber: 851,
    burnThreshold: 150,
    revealThreshold: 80
};

function initInvisibleInk() {
    inkState.heatMap = Array(20).fill(0).map(() => Array(20).fill(0));
    renderParchment();
}

function renderParchment() {
    const canvas = document.getElementById('parchmentCanvas');
    const ctx = canvas.getContext('2d');

    // Draw parchment background
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(0, 0, 400, 400);

    // Draw heat map
    inkState.heatMap.forEach((row, y) => {
        row.forEach((heat, x) => {
            if (heat > inkState.revealThreshold) {
                const alpha = Math.min((heat - inkState.revealThreshold) / 70, 1);
                ctx.fillStyle = `rgba(60, 40, 20, ${alpha})`;
                ctx.fillRect(x * 20, y * 20, 20, 20);
            }
            if (heat > inkState.burnThreshold) {
                ctx.fillStyle = '#2a1810';
                ctx.fillRect(x * 20, y * 20, 20, 20);
            }
        });
    });
}

function heatParchment(x, y) {
    const gridX = Math.floor(x / 20);
    const gridY = Math.floor(y / 20);

    if (gridX >= 0 && gridX < 20 && gridY >= 0 && gridY < 20) {
        inkState.heatMap[gridY][gridX] += 5;

        // Check for burn
        if (inkState.heatMap[gridY][gridX] > inkState.burnThreshold) {
            showMessage('🔥 Das Pergament verbrennt!', 'error');
            setTimeout(() => resetMinigame(5), 1000);
            return;
        }

        renderParchment();
        checkInkPattern();
    }
}

function checkInkPattern() {
    // Check if pattern is revealed
    let revealed = true;
    inkState.pattern.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                const heat = inkState.heatMap[y + 7]?.[x + 7] || 0;
                if (heat < inkState.revealThreshold) revealed = false;
            }
        });
    });

    if (revealed) {
        showMessage(`🎵 Ein Notenschlüssel erscheint! Die Zahl ist ${inkState.secretNumber}`, 'success');
        setTimeout(() => solveMinigame(5, '🎼 Notenblatt', inkState.secretNumber), 2000);
    }
}
