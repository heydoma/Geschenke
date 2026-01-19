// ========================================
// MINIGAME SYSTEM - Die Verbotene Abteilung
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
        'Höre genau hin. Nur eine Stimme soll übrig bleiben.',
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

// ========================================
// MINIGAME 1: POLYJUICE LABOR
// ========================================

const polyjuiceGame = (() => {
    // Game State
    let state = 'idle'; // idle | placing | checking | success | reset

    // Solution (fixed, immutable)
    const SOLUTION = {
        copper: 'knotgrass',  // Fluxkraut NICHT in Kupfer → Knöterich
        iron: 'fluxweed',     // Blutegel rechts von Eisen → Eisen = Fluxkraut
        tin: 'leech',         // Blutegel rechts von Eisen → Zinn = Blutegel
        stone: 'lacewing'     // Florfliegen = höchste Temp → Stein
    };

    // Current placements
    const placements = {
        copper: null,
        iron: null,
        tin: null,
        stone: null
    };

    // DOM Elements
    let cauldrons, ingredients, checkBtn;
    let draggedIngredient = null;

    // Initialize
    function init() {
        cauldrons = document.querySelectorAll('#minigame1 .cauldron');
        ingredients = document.querySelectorAll('#minigame1 .ingredient');
        checkBtn = document.getElementById('checkPolyjuiceBtn');

        setupDragAndDrop();
        updateCheckButton();
    }

    // Setup Drag & Drop
    function setupDragAndDrop() {
        // Ingredient drag events
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('dragstart', (e) => {
                if (state === 'checking' || state === 'success') return;

                draggedIngredient = ingredient;
                ingredient.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            ingredient.addEventListener('dragend', () => {
                ingredient.classList.remove('dragging');
                draggedIngredient = null;
            });
        });

        // Cauldron drop events
        cauldrons.forEach(cauldron => {
            cauldron.addEventListener('dragover', (e) => {
                if (state === 'checking' || state === 'success') return;
                e.preventDefault();
                cauldron.classList.add('drop-target');
            });

            cauldron.addEventListener('dragleave', () => {
                cauldron.classList.remove('drop-target');
            });

            cauldron.addEventListener('drop', (e) => {
                e.preventDefault();
                cauldron.classList.remove('drop-target');

                if (!draggedIngredient || state === 'checking' || state === 'success') return;

                const cauldronType = cauldron.dataset.cauldron;
                const ingredientType = draggedIngredient.dataset.ingredient;

                // Check if cauldron already has ingredient
                if (placements[cauldronType] !== null) {
                    showMessage('Dieser Kessel ist bereits belegt!', 'error');
                    return;
                }

                // Place ingredient
                placeIngredient(cauldronType, ingredientType, draggedIngredient);
            });
        });
    }

    // Place ingredient in cauldron
    function placeIngredient(cauldronType, ingredientType, ingredientElement) {
        state = 'placing';

        // Update placements
        placements[cauldronType] = ingredientType;

        // Update UI
        const cauldron = document.querySelector(`#minigame1 [data-cauldron="${cauldronType}"]`);
        const icon = ingredientElement.querySelector('.ingredient-icon').textContent;

        const content = document.createElement('div');
        content.className = 'cauldron-content';
        content.textContent = icon;
        cauldron.appendChild(content);

        // Hide ingredient from ingredients area
        ingredientElement.classList.add('placed');

        state = 'idle';
        updateCheckButton();
    }

    // Update check button state
    function updateCheckButton() {
        if (!checkBtn) return;
        const allPlaced = Object.values(placements).every(p => p !== null);
        checkBtn.disabled = !allPlaced || state === 'checking' || state === 'success';
    }

    // Check solution
    function check() {
        if (state === 'checking' || state === 'success') return;

        const allPlaced = Object.values(placements).every(p => p !== null);
        if (!allPlaced) {
            showMessage('Platziere erst alle Zutaten!', 'error');
            return;
        }

        state = 'checking';
        checkBtn.disabled = true;

        // Check if solution is correct
        const isCorrect = Object.keys(SOLUTION).every(
            cauldron => placements[cauldron] === SOLUTION[cauldron]
        );

        if (isCorrect) {
            handleSuccess();
        } else {
            handleError();
        }
    }

    // Handle success
    function handleSuccess() {
        state = 'success';

        // Animate cauldrons
        cauldrons.forEach(cauldron => {
            cauldron.classList.add('success');
        });

        // Show success message
        setTimeout(() => {
            showMessage('✨ Perfekt! Der Vielsaft-Trank ist gelungen!', 'success');
            solveMinigame(1, '🧪 Beschriftete Phiole');
        }, 500);
    }

    // Handle error
    function handleError() {
        // Animate explosion
        cauldrons.forEach(cauldron => {
            cauldron.classList.add('error');
        });

        showMessage('💥 BOOM! Falsche Kombination!', 'error');

        // Reset after animation
        setTimeout(() => {
            reset();
        }, 1000);
    }

    // Reset game
    function reset() {
        state = 'reset';

        // Clear placements
        Object.keys(placements).forEach(key => {
            placements[key] = null;
        });

        // Clear cauldron contents
        cauldrons.forEach(cauldron => {
            cauldron.classList.remove('success', 'error', 'drop-target');
            const content = cauldron.querySelector('.cauldron-content');
            if (content) content.remove();
        });

        // Show all ingredients again
        ingredients.forEach(ingredient => {
            ingredient.classList.remove('placed', 'dragging');
        });

        state = 'idle';
        updateCheckButton();
    }

    // Public API
    return {
        init,
        check,
        reset
    };
})();

function showExplosion() {
    showMessage('💥 BOOM! Falsche Kombination!', 'error');
}

// ========================================
// MINIGAME 2: MUFFLIATO - AUDIO BALANCE
// ========================================
let audioState = {
    tracks: [
        { name: 'Wind', volume: 50, target: 0 },
        { name: 'Schritte', volume: 50, target: 0 },
        { name: 'Flüstern', volume: 50, target: 100 },
        { name: 'Rauschen', volume: 50, target: 0 },
        { name: 'Glocken', volume: 50, target: 0 }
    ],
    secretNumber: 427
};

function initAudioBalance() {
    audioState.tracks.forEach(t => t.volume = 50);
    renderAudioSliders();
}

function renderAudioSliders() {
    const container = document.getElementById('audioSliders');
    container.innerHTML = '';

    audioState.tracks.forEach((track, i) => {
        const slider = document.createElement('div');
        slider.className = 'audio-track';
        slider.innerHTML = `
            <label>${track.name}</label>
            <input type="range" min="0" max="100" value="${track.volume}"
                   oninput="updateAudioTrack(${i}, this.value)">
            <span class="volume-display">${track.volume}%</span>
            <canvas class="waveform" id="wave${i}" width="200" height="40"></canvas>
        `;
        container.appendChild(slider);
        drawWaveform(i);
    });
}

function updateAudioTrack(index, value) {
    audioState.tracks[index].volume = parseInt(value);
    document.querySelectorAll('.volume-display')[index].textContent = value + '%';
    drawWaveform(index);
    checkAudioBalance();
}

function drawWaveform(index) {
    const canvas = document.getElementById(`wave${index}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const track = audioState.tracks[index];
    const amplitude = (track.volume / 100) * 15;

    ctx.clearRect(0, 0, 200, 40);
    ctx.strokeStyle = track.volume === track.target ? '#4ade80' : '#8b7355';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < 200; x++) {
        const y = 20 + Math.sin(x * 0.1 + Date.now() * 0.001) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function checkAudioBalance() {
    const correct = audioState.tracks.every(t => Math.abs(t.volume - t.target) < 5);

    if (correct) {
        setTimeout(() => {
            showMessage(`Die Stimme flüstert: "${audioState.secretNumber}"`, 'success');
            setTimeout(() => solveMinigame(2, '🔊 Flüsternde Erinnerung', audioState.secretNumber), 2000);
        }, 500);
    }
}

// ========================================
// MINIGAME 3: BIBLIOTHEKARS-CHIFFRE
// ========================================
let cipherState = {
    runeAlphabet: {
        'ᚠ': 'H', 'ᚢ': 'A', 'ᚦ': 'M', 'ᚨ': 'B', 'ᚱ': 'U', 'ᚲ': 'R', 'ᚷ': 'G', 'ᚹ': null,
        'ᚺ': null, 'ᚾ': null, 'ᛁ': null, 'ᛃ': null, 'ᛇ': null, 'ᛈ': null, 'ᛉ': null, 'ᛊ': null
    },
    encryptedText: 'ᚠᚢᚦᚨᚱᚲᚷ', // HAMBURG
    contextHints: [
        'Die Stadt an der Elbe: _ _ M _ _ _ _',
        'Wo das Musical spielt: H _ _ _ U _ _'
    ],
    secretNumber: 193
};

function initCipher() {
    renderCipher();
}

function renderCipher() {
    const container = document.getElementById('cipherGrid');
    container.innerHTML = '';

    Object.keys(cipherState.runeAlphabet).forEach(rune => {
        const cell = document.createElement('div');
        cell.className = 'cipher-cell';
        cell.innerHTML = `
            <div class="rune">${rune}</div>
            <input type="text" maxlength="1" class="letter-input"
                   value="${cipherState.runeAlphabet[rune] || ''}"
                   oninput="updateCipher('${rune}', this.value.toUpperCase())">
        `;
        container.appendChild(cell);
    });

    updateDecryptedText();
}

function updateCipher(rune, letter) {
    cipherState.runeAlphabet[rune] = letter || null;
    updateDecryptedText();
}

function updateDecryptedText() {
    const decrypted = cipherState.encryptedText.split('').map(r =>
        cipherState.runeAlphabet[r] || '_'
    ).join('');

    document.getElementById('decryptedText').textContent = decrypted;

    if (decrypted === 'HAMBURG') {
        setTimeout(() => {
            showMessage(`Das Passwort lautet: HAMBURG. Die Zahl ist ${cipherState.secretNumber}`, 'success');
            setTimeout(() => solveMinigame(3, '📜 Pergament mit Zahl', cipherState.secretNumber), 2000);
        }, 500);
    }
}

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

// ========================================
// MINIGAME 7: DEEP-DIVE BÜCHERREGAL
// ========================================
let bookState = {
    books: [
        { id: 1, quote: 'Der Stein der Weisen', order: 1 },
        { id: 2, quote: 'Die Kammer des Schreckens', order: 2 },
        { id: 3, quote: 'Der Gefangene von Askaban', order: 3 },
        { id: 4, quote: 'Der Feuerkelch', order: 4 },
        { id: 5, quote: 'Der Orden des Phönix', order: 5 },
        { id: 6, quote: 'Der Halbblutprinz', order: 6 },
        { id: 7, quote: 'Die Heiligtümer des Todes', order: 7 }
    ],
    currentOrder: []
};

function initBookSort() {
    bookState.currentOrder = [...bookState.books].sort(() => Math.random() - 0.5);
    renderBooks();
}

function renderBooks() {
    const shelf = document.getElementById('bookShelf');
    shelf.innerHTML = '';

    bookState.currentOrder.forEach((book, i) => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-spine';
        bookDiv.textContent = book.quote;
        bookDiv.draggable = true;
        bookDiv.dataset.index = i;

        bookDiv.ondragstart = (e) => e.dataTransfer.setData('index', i);
        bookDiv.ondragover = (e) => e.preventDefault();
        bookDiv.ondrop = (e) => {
            const fromIndex = parseInt(e.dataTransfer.getData('index'));
            swapBooks(fromIndex, i);
        };

        shelf.appendChild(bookDiv);
    });
}

function swapBooks(from, to) {
    [bookState.currentOrder[from], bookState.currentOrder[to]] =
    [bookState.currentOrder[to], bookState.currentOrder[from]];
    renderBooks();
    checkBookOrder();
}

function checkBookOrder() {
    const correct = bookState.currentOrder.every((book, i) => book.order === i + 1);

    if (correct) {
        solveMinigame(7, '📚 Sortierte Bände');
    }
}

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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Attach slot click handlers
    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('click', () => openMinigame(slot.id));
    });
});


