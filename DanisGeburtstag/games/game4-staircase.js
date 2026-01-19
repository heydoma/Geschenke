// ========================================
// MINIGAME 4: ROTIERENDE TREPPEN
// ========================================

let staircaseState = {
    grid: [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 1],
        [0, 0, 0, 0]
    ],
    playerPos: { x: 0, y: 0 },
    goalPos: { x: 3, y: 3 },
    moves: 0
};

function initStaircase() {
    staircaseState.playerPos = { x: 0, y: 0 };
    staircaseState.moves = 0;
    renderStaircase();
}

function renderStaircase() {
    // Isometric grid rendering
    const container = document.getElementById('staircaseGrid');
    container.innerHTML = '';

    staircaseState.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const tile = document.createElement('div');
            tile.className = `stair-tile ${cell ? 'active' : 'inactive'}`;
            tile.style.left = `${(x - y) * 50 + 200}px`;
            tile.style.top = `${(x + y) * 25 + 50}px`;

            if (x === staircaseState.playerPos.x && y === staircaseState.playerPos.y) {
                tile.classList.add('player');
            }
            if (x === staircaseState.goalPos.x && y === staircaseState.goalPos.y) {
                tile.classList.add('goal');
            }

            tile.onclick = () => movePlayer(x, y);
            container.appendChild(tile);
        });
    });
}

function movePlayer(x, y) {
    // Check if valid move
    const dx = Math.abs(x - staircaseState.playerPos.x);
    const dy = Math.abs(y - staircaseState.playerPos.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        if (staircaseState.grid[y][x] === 1) {
            staircaseState.playerPos = { x, y };
            staircaseState.moves++;
            rotateStairs();
            renderStaircase();

            if (x === staircaseState.goalPos.x && y === staircaseState.goalPos.y) {
                solveMinigame(4, '🪨 Stein-Token');
            }
        } else {
            showMessage('💀 Du fällst! Versuch es nochmal.', 'error');
            setTimeout(() => resetMinigame(4), 1000);
        }
    }
}

function rotateStairs() {
    // Rotate random stair 90°
    const x = Math.floor(Math.random() * 4);
    const y = Math.floor(Math.random() * 4);
    staircaseState.grid[y][x] = 1 - staircaseState.grid[y][x];
}
