// Game State
const gameState = {
    solved: [false, false, false, false, false, false, false, false],
    totalPuzzles: 8,
    solvedCount: 0,
    // Puzzle-spezifische States
    puzzle1Keys: [0, 0, 0], // Fliegende Schlüssel Richtungen
    puzzle3Ingredients: { snake: 5, valerian: 3, wormwood: 2, cauldron: 0 }, // Tränke
    puzzle4Order: [], // Alraunen Reihenfolge
    puzzle5Portraits: [0, 1, 2, 3], // Porträt Positionen
    puzzle6TelescopeX: 0,
    puzzle6TelescopeY: 0,
    puzzle7Pattern: [],
    puzzle8CollectedWords: [] // Gesammelte Wörter für finale
};

// ========================================
// BIBLIOTHEKS-ATMOSPHÄRE GENERIEREN
// ========================================

// Magische Lichtpunkte generieren (wie Glühwürmchen/kleine Kerzen)
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if(!container) return;

    // Große leuchtende Punkte (wie im Bild - auf Regalen, im Raum)
    for(let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'glow-large');
        // Mehr an den Seiten (bei den Regalen)
        if(i < 6) {
            particle.style.left = (5 + Math.random() * 20) + '%'; // Links
        } else {
            particle.style.left = (75 + Math.random() * 20) + '%'; // Rechts
        }
        particle.style.top = (15 + Math.random() * 60) + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(particle);
    }

    // Mittlere Lichtpunkte
    for(let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'glow-medium');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (10 + Math.random() * 70) + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(particle);
    }

    // Kleine Lichtpunkte (Staub/Magie) - viele!
    for(let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', 'glow-small');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 80 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (2 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// Bücherregale sind jetzt statisch im HTML - keine dynamische Generierung nötig

// Magisches Tagebuch öffnen (Story-Bridge)
function openDiary() {
    // TODO: Intro-Text Animation mit Schreibmaschinen-Effekt
    alert('📖 "Willkommen, Sucherin des Verborgenen..."\n\nDieses Tagebuch wird dich durch die Rätsel führen.');
}

// Puzzle öffnen
function openPuzzle(puzzleNum) {
    if(gameState.solved[puzzleNum - 1]) {
        return; // Bereits gelöst
    }

    const modal = document.getElementById('modal' + puzzleNum);
    if(modal) {
        modal.classList.add('active');

        // Puzzle-spezifische Initialisierung
        if(puzzleNum === 2) initPuzzle2();
        if(puzzleNum === 4) initPuzzle4();
        if(puzzleNum === 5) initPuzzle5();
        if(puzzleNum === 7) initPuzzle7();
        if(puzzleNum === 8) updateCollectedWords();
    }
}

// Modal schließen
function closeModal(puzzleNum) {
    const modal = document.getElementById('modal' + puzzleNum);
    if(modal) {
        modal.classList.remove('active');
    }
}

// Rätsel als gelöst markieren
function solvePuzzle(puzzleNum, secretWord = null) {
    if(gameState.solved[puzzleNum - 1]) return;
    
    gameState.solved[puzzleNum - 1] = true;
    gameState.solvedCount++;

    // Geheimwort sammeln für Finale
    if(secretWord) {
        gameState.puzzle8CollectedWords.push(secretWord);
    }

    // Visuelles Feedback
    const book = document.getElementById('book' + puzzleNum);
    if(book) {
        book.classList.add('solved');
    }

    // Progress aktualisieren
    updateProgress();

    // Brief-Schloss öffnen
    const letterLocks = document.getElementById('letterLocks');
    if(letterLocks && letterLocks.children[puzzleNum - 1]) {
        letterLocks.children[puzzleNum - 1].textContent = '🔓';
        letterLocks.children[puzzleNum - 1].classList.add('unlocked');
    }

    // Modal nach kurzer Verzögerung schließen
    setTimeout(() => {
        closeModal(puzzleNum);

        // Prüfen ob alle gelöst
        if(gameState.solvedCount >= gameState.totalPuzzles) {
            setTimeout(() => {
                document.getElementById('mainLetter').classList.add('glowing');
            }, 500);
        }
    }, 2000);
}

// Progress aktualisieren
function updateProgress() {
    // Progress-Schlösser oben aktualisieren
    const progressLocks = document.getElementById('progressLocks');
    if(progressLocks) {
        for(let i = 0; i < gameState.solved.length; i++) {
            if(gameState.solved[i] && progressLocks.children[i]) {
                progressLocks.children[i].textContent = '🔓';
                progressLocks.children[i].classList.add('unlocked');
            }
        }
    }

    // Seiten auf dem Buchständer (Ambo) aktualisieren
    for(let i = 0; i < gameState.solved.length; i++) {
        const pageSlot = document.getElementById('pageSlot' + (i + 1));
        if(pageSlot && gameState.solved[i]) {
            pageSlot.classList.add('filled');
        }
    }

    // Puzzle-Bücher als gelöst markieren
    for(let i = 0; i < gameState.solved.length; i++) {
        const book = document.getElementById('book' + (i + 1));
        if(book && gameState.solved[i]) {
            book.classList.add('solved');
        }
    }

    // Tagebuch reaktiv machen wenn Fortschritt
    if(gameState.solvedCount > 0) {
        const diary = document.getElementById('magicDiary');
        if(diary) {
            diary.classList.add('has-progress');
        }
    }
}

// Brief prüfen
function checkLetter() {
    if(gameState.solvedCount >= gameState.totalPuzzles) {
        // Alle Rätsel gelöst - Brief öffnen!
        showFinalReveal();
    } else {
        const remaining = gameState.totalPuzzles - gameState.solvedCount;
        alert(`Der Brief ist noch mit ${remaining} Schloss${remaining > 1 ? 'ern' : ''} versiegelt.\n\nLöse alle Rätsel in der Bibliothek!`);
    }
}

// Finale Enthüllung
function showFinalReveal() {
    document.getElementById('mainLibrary').style.filter = 'blur(10px)';
    document.getElementById('finalReveal').classList.add('active');
}

// Update gesammelte Wörter für Puzzle 8
function updateCollectedWords() {
    const wordsDisplay = document.getElementById('collected-words');
    if(wordsDisplay) {
        wordsDisplay.textContent = gameState.puzzle8CollectedWords.join(' ') || 'Noch keine Wörter gesammelt';
    }
}

// ========== PUZZLE 1: Fliegende Schlüssel ==========
function checkPuzzle1() {
    const key1 = parseInt(document.getElementById('key1').value);
    const key2 = parseInt(document.getElementById('key2').value);
    const key3 = parseInt(document.getElementById('key3').value);

    const feedback = document.getElementById('feedback1');

    // Lösung: Links (1), Oben (2), Rechts (3)
    if(key1 === 1 && key2 === 2 && key3 === 3) {
        feedback.textContent = '✨ Perfekt! Die Schlüssel öffnen die Truhe!';
        feedback.className = 'feedback success';
        solvePuzzle(1, 'Ich');
    } else {
        feedback.textContent = '❌ Die Flügel stimmen nicht mit den Vögeln überein. Versuch es nochmal!';
        feedback.className = 'feedback error';
    }
}

// ========== PUZZLE 2: Flohnetzwerk ==========
let puzzle2State = {
    path: [],
    correctPath: [0, 1, 4, 7, 8, 5, 2, 3, 6],
    grid: Array(9).fill(false)
};

function initPuzzle2() {
    const container = document.getElementById('puzzle2Container');
    if(!container) return;
    container.innerHTML = '';

    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 400px; margin: 0 auto;';

    for(let i = 0; i < 9; i++) {
        const fireplace = document.createElement('div');
        fireplace.id = 'fireplace-' + i;
        fireplace.style.cssText = 'width: 100px; height: 100px; background: linear-gradient(135deg, #3d2817 0%, #2a1810 100%); border: 3px solid #8b7355; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2.5em; cursor: pointer; transition: all 0.3s ease;';
        fireplace.textContent = i === 0 ? '🏁' : (i === 6 ? '🎯' : '🔥');
        fireplace.onclick = () => selectFireplace(i);
        gridDiv.appendChild(fireplace);
    }

    container.appendChild(gridDiv);
}

function selectFireplace(index) {
    if(puzzle2State.grid[index]) return; // Bereits besucht

    puzzle2State.path.push(index);
    puzzle2State.grid[index] = true;

    const fireplace = document.getElementById('fireplace-' + index);
    fireplace.style.background = 'linear-gradient(135deg, #2d5016 0%, #1a3010 100%)';
    fireplace.style.borderColor = '#4ade80';

    // Prüfen ob Ziel erreicht
    if(index === 6) {
        checkPuzzle2();
    }
}

function checkPuzzle2() {
    const feedback = document.getElementById('feedback2');

    if(JSON.stringify(puzzle2State.path) === JSON.stringify(puzzle2State.correctPath)) {
        feedback.textContent = '✨ Perfekt! Du hast den richtigen Weg gefunden!';
        feedback.className = 'feedback success';
        solvePuzzle(2, 'schwöre');
    } else {
        feedback.textContent = '❌ Das war nicht der richtige Weg. Versuch es nochmal!';
        feedback.className = 'feedback error';
        setTimeout(resetPuzzle2, 1500);
    }
}

function resetPuzzle2() {
    puzzle2State.path = [];
    puzzle2State.grid = Array(9).fill(false);
    initPuzzle2();
    document.getElementById('feedback2').textContent = '';
}

// ========== PUZZLE 3: Tränke ==========
function pourPotion(from, to) {
    const maxCapacity = { snake: 5, valerian: 3, wormwood: 2, cauldron: 10 };
    const current = gameState.puzzle3Ingredients;

    if(current[from] === 0) return; // Nichts zum Gießen

    const space = maxCapacity[to] - current[to];
    const amount = Math.min(current[from], space);

    current[from] -= amount;
    current[to] += amount;

    updatePotionDisplay();
    checkPuzzle3Auto();
}

function updatePotionDisplay() {
    const current = gameState.puzzle3Ingredients;
    document.getElementById('snake-amount').textContent = current.snake + 'ml';
    document.getElementById('valerian-amount').textContent = current.valerian + 'ml';
    document.getElementById('wormwood-amount').textContent = current.wormwood + 'ml';
    document.getElementById('cauldron-amount').textContent = current.cauldron + 'ml';
}

function checkPuzzle3Auto() {
    const feedback = document.getElementById('feedback3');

    if(gameState.puzzle3Ingredients.cauldron === 4) {
        feedback.textContent = '✨ Perfekt! Genau 4ml im Kessel! Der Schlaftrunk ist fertig!';
        feedback.className = 'feedback success';
        solvePuzzle(3, 'feierlich');
    }
}

function resetPuzzle3() {
    gameState.puzzle3Ingredients = { snake: 5, valerian: 3, wormwood: 2, cauldron: 0 };
    updatePotionDisplay();
    document.getElementById('feedback3').textContent = '';
}

// ========== PUZZLE 4: Alraunen ==========
const alraunenData = [
    { id: 0, pitch: 200, emoji: '🌱', name: 'Alraune A' },
    { id: 1, pitch: 300, emoji: '🌿', name: 'Alraune B' },
    { id: 2, pitch: 400, emoji: '🍀', name: 'Alraune C' },
    { id: 3, pitch: 500, emoji: '🌾', name: 'Alraune D' },
    { id: 4, pitch: 600, emoji: '🌵', name: 'Alraune E' }
];

function initPuzzle4() {
    const container = document.getElementById('puzzle4Container');
    if(!container) return;
    container.innerHTML = '';

    // Alraunen mischen
    const shuffled = [...alraunenData].sort(() => Math.random() - 0.5);
    gameState.puzzle4Order = shuffled.map(a => a.id);

    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;';

    shuffled.forEach((alraune, index) => {
        const pot = document.createElement('div');
        pot.style.cssText = 'text-align: center; cursor: pointer; padding: 15px; background: linear-gradient(135deg, #3d2817 0%, #2a1810 100%); border: 3px solid #8b7355; border-radius: 10px; transition: all 0.3s ease;';
        pot.innerHTML = `
            <div style="font-size: 3em;">${alraune.emoji}</div>
            <div style="font-size: 0.9em; color: #d4c5a9; margin-top: 5px;">${alraune.name}</div>
        `;
        pot.onclick = () => playAlrauneSound(alraune.pitch);
        pot.ondblclick = () => swapAlraune(index);
        pot.id = 'alraune-' + index;
        gridDiv.appendChild(pot);
    });

    container.appendChild(gridDiv);

    const hint = document.createElement('div');
    hint.style.cssText = 'text-align: center; margin-top: 20px; font-size: 0.9em; color: #c9b896;';
    hint.textContent = '💡 Klicke um den Ton zu hören, Doppelklick um zu tauschen';
    container.appendChild(hint);
}

function playAlrauneSound(pitch) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = pitch;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

let selectedAlraune = null;

function swapAlraune(index) {
    if(selectedAlraune === null) {
        selectedAlraune = index;
        document.getElementById('alraune-' + index).style.borderColor = '#ffd700';
    } else {
        // Tauschen
        const temp = gameState.puzzle4Order[selectedAlraune];
        gameState.puzzle4Order[selectedAlraune] = gameState.puzzle4Order[index];
        gameState.puzzle4Order[index] = temp;

        document.getElementById('alraune-' + selectedAlraune).style.borderColor = '#8b7355';
        selectedAlraune = null;

        initPuzzle4();
    }
}

function checkPuzzle4() {
    const feedback = document.getElementById('feedback4');
    const correctOrder = [0, 1, 2, 3, 4];

    if(JSON.stringify(gameState.puzzle4Order) === JSON.stringify(correctOrder)) {
        feedback.textContent = '✨ Perfekt! Die Alraunen sind richtig sortiert!';
        feedback.className = 'feedback success';
        solvePuzzle(4, 'ich');
    } else {
        feedback.textContent = '❌ Die Reihenfolge stimmt noch nicht. Hör dir die Töne nochmal an!';
        feedback.className = 'feedback error';
    }
}

function resetPuzzle4() {
    selectedAlraune = null;
    initPuzzle4();
    document.getElementById('feedback4').textContent = '';
}

// ========== PUZZLE 5: Porträts ==========
const portraits = [
    { id: 0, emoji: '🤴', name: 'Ritter' },
    { id: 1, emoji: '👸', name: 'Dame' },
    { id: 2, emoji: '🧙', name: 'Mönch' },
    { id: 3, emoji: '👻', name: 'Geist' }
];

function initPuzzle5() {
    const container = document.getElementById('puzzle5Container');
    if(!container) return;
    container.innerHTML = '';

    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display: flex; justify-content: center; gap: 20px; margin: 30px 0;';

    gameState.puzzle5Portraits.forEach((portraitId, position) => {
        const portrait = portraits[portraitId];
        const frame = document.createElement('div');
        frame.style.cssText = 'text-align: center; cursor: pointer; padding: 20px; background: linear-gradient(135deg, #3d2817 0%, #2a1810 100%); border: 4px solid #d4af37; border-radius: 10px; transition: all 0.3s ease; min-width: 100px;';
        frame.innerHTML = `
            <div style="font-size: 4em;">${portrait.emoji}</div>
            <div style="font-size: 1.1em; color: #d4c5a9; margin-top: 10px;">${portrait.name}</div>
            <div style="font-size: 0.8em; color: #c9b896; margin-top: 5px;">Position ${position + 1}</div>
        `;
        frame.onclick = () => selectPortrait(position);
        frame.id = 'portrait-' + position;
        gridDiv.appendChild(frame);
    });

    container.appendChild(gridDiv);
}

let selectedPortrait = null;

function selectPortrait(position) {
    if(selectedPortrait === null) {
        selectedPortrait = position;
        document.getElementById('portrait-' + position).style.borderColor = '#ffd700';
        document.getElementById('portrait-' + position).style.transform = 'scale(1.1)';
    } else {
        // Tauschen
        const temp = gameState.puzzle5Portraits[selectedPortrait];
        gameState.puzzle5Portraits[selectedPortrait] = gameState.puzzle5Portraits[position];
        gameState.puzzle5Portraits[position] = temp;

        document.getElementById('portrait-' + selectedPortrait).style.borderColor = '#d4af37';
        document.getElementById('portrait-' + selectedPortrait).style.transform = 'scale(1)';
        selectedPortrait = null;

        initPuzzle5();
    }
}

function checkPuzzle5() {
    const feedback = document.getElementById('feedback5');
    // Lösung: Dame (1), Ritter (0), Geist (3), Mönch (2)
    const correctOrder = [1, 0, 3, 2];

    if(JSON.stringify(gameState.puzzle5Portraits) === JSON.stringify(correctOrder)) {
        feedback.textContent = '✨ Perfekt! Die Porträts flüstern: "bin"';
        feedback.className = 'feedback success';
        solvePuzzle(5, 'bin');
    } else {
        feedback.textContent = '❌ Die Anordnung stimmt nicht mit den Hinweisen überein!';
        feedback.className = 'feedback error';
    }
}

function resetPuzzle5() {
    selectedPortrait = null;
    gameState.puzzle5Portraits = [0, 1, 2, 3];
    initPuzzle5();
    document.getElementById('feedback5').textContent = '';
}

// ========== PUZZLE 6: Teleskop ==========
function adjustTelescope(axis, direction) {
    if(axis === 'x') {
        gameState.puzzle6TelescopeX = Math.max(0, Math.min(24, gameState.puzzle6TelescopeX + direction));
        document.getElementById('telescope-x').textContent = gameState.puzzle6TelescopeX;
    } else {
        gameState.puzzle6TelescopeY = Math.max(0, Math.min(12, gameState.puzzle6TelescopeY + direction));
        document.getElementById('telescope-y').textContent = gameState.puzzle6TelescopeY;
    }

    // Prüfen ob richtiger Stern gefunden
    if(gameState.puzzle6TelescopeX === 12 && gameState.puzzle6TelescopeY === 5) {
        document.getElementById('star-found').textContent = '⭐';
    } else {
        document.getElementById('star-found').textContent = '';
    }
}

function checkPuzzle6() {
    const feedback = document.getElementById('feedback6');

    if(gameState.puzzle6TelescopeX === 12 && gameState.puzzle6TelescopeY === 5) {
        feedback.textContent = '✨ Du hast den magischen Stern gefunden! Er zeigt das Wort: "ein"';
        feedback.className = 'feedback success';
        solvePuzzle(6, 'ein');
    } else {
        feedback.textContent = '❌ Das ist nicht der richtige Stern. Prüfe die Koordinaten!';
        feedback.className = 'feedback error';
    }
}

// ========== PUZZLE 7: Duellier-Muster ==========
let puzzle7State = {
    pattern: [],
    playerInput: [],
    showing: false
};

function initPuzzle7() {
    // Zufälliges Muster generieren (4-6 Zauber)
    const length = Math.floor(Math.random() * 3) + 4;
    puzzle7State.pattern = [];
    for(let i = 0; i < length; i++) {
        puzzle7State.pattern.push(Math.floor(Math.random() * 6) + 1);
    }
    puzzle7State.playerInput = [];
}

function showPattern7() {
    if(puzzle7State.showing) return;
    puzzle7State.showing = true;
    puzzle7State.playerInput = [];

    const display = document.getElementById('pattern-display');
    const playerSeq = document.getElementById('player-sequence');
    playerSeq.textContent = '';

    display.textContent = 'Beobachte das Muster...';

    let index = 0;
    const interval = setInterval(() => {
        if(index >= puzzle7State.pattern.length) {
            clearInterval(interval);
            display.textContent = 'Jetzt bist du dran! Wiederhole das Muster!';
            puzzle7State.showing = false;
            return;
        }

        const spellNum = puzzle7State.pattern[index];
        const btn = document.getElementById('spell-' + spellNum);

        // Highlight
        btn.style.background = 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)';
        btn.style.transform = 'scale(1.2)';

        setTimeout(() => {
            btn.style.background = '';
            btn.style.transform = '';
        }, 500);

        index++;
    }, 800);
}

function playerPattern(spellNum) {
    if(puzzle7State.showing) return;

    puzzle7State.playerInput.push(spellNum);

    const emojis = ['', '🔥', '⚡', '❄️', '🌟', '💫', '✨'];
    document.getElementById('player-sequence').textContent =
        'Deine Eingabe: ' + puzzle7State.playerInput.map(n => emojis[n]).join(' ');

    // Prüfen ob falsch
    for(let i = 0; i < puzzle7State.playerInput.length; i++) {
        if(puzzle7State.playerInput[i] !== puzzle7State.pattern[i]) {
            const feedback = document.getElementById('feedback7');
            feedback.textContent = '❌ Falsch! Das Muster war anders. Versuch es nochmal!';
            feedback.className = 'feedback error';
            setTimeout(resetPuzzle7, 1500);
            return;
        }
    }

    // Prüfen ob komplett richtig
    if(puzzle7State.playerInput.length === puzzle7State.pattern.length) {
        const feedback = document.getElementById('feedback7');
        feedback.textContent = '✨ Perfekt! Du hast das Muster gemeistert! Das Wort lautet: "Tunichtgut"';
        feedback.className = 'feedback success';
        solvePuzzle(7, 'Tunichtgut');
    }
}

function resetPuzzle7() {
    puzzle7State.playerInput = [];
    puzzle7State.showing = false;
    document.getElementById('pattern-display').textContent = 'Klicke auf "Muster zeigen" um zu starten!';
    document.getElementById('player-sequence').textContent = '';
    document.getElementById('feedback7').textContent = '';
}

// ========== PUZZLE 8: Die Karte ==========
function checkPuzzle8() {
    const input = document.getElementById('map-password').value.toLowerCase().trim();
    const feedback = document.getElementById('feedback8');

    // Akzeptiere verschiedene Varianten
    const validAnswers = [
        'ich schwöre feierlich ich bin ein tunichtgut',
        'ich schwöre feierlich, ich bin ein tunichtgut',
        'tunichtgut'
    ];

    if(validAnswers.some(answer => input.includes(answer))) {
        feedback.textContent = '✨ Die Karte erwacht zum Leben! "Unheil gestiftet!"';
        feedback.className = 'feedback success';
        solvePuzzle(8);
    } else {
        feedback.textContent = '❌ Das sind nicht die richtigen Worte. Hast du alle Wörter gesammelt?';
        feedback.className = 'feedback error';
    }
}

// ========== INITIALISIERUNG ==========
document.addEventListener('DOMContentLoaded', () => {
    // Magische Partikel erstellen
    createParticles();

    // Fortschrittsanzeige initialisieren
    updateProgress();
});

