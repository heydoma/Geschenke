// ========================================
// MINIGAME 3: DIE BIBLIOTHEKARS-CHIFFRE
// Ein ruhiges Entschlüsselungsrätsel
// ========================================

const librarianCipher = (() => {
    // === STATE ===
    let state = 'reading'; // reading | editingRune | success
    let selectedRune = null;
    let selectedRuneElement = null;
    let assignments = {}; // { rune: letter }
    
    // === RUNEN-ALPHABET ===
    // Die Zuordnung: Rune → korrekter Buchstabe
    const SOLUTION = {
        'ᚢ': 'U',
        'ᚺ': 'H',
        'ᚱ': 'R',
        'ᛁ': 'I',
        'ᚾ': 'N',
        'ᚷ': 'G',
        'ᛉ': 'Z',
        'ᚨ': 'A',
        'ᛒ': 'B',
        'ᛇ': 'E',
        'ᛊ': 'S',
        'ᛏ': 'T',
        'ᛚ': 'L',
        'ᚲ': 'C'
    };
    
    // Vorgegebene Zuordnungen (diese sind bereits bekannt)
    const GIVEN_ASSIGNMENTS = {
        'ᚨ': 'A',
        'ᛇ': 'E',
        'ᚱ': 'R',
        'ᚾ': 'N',
        'ᛊ': 'S'
    };
    
    // Zu entdeckende Runen
    const HIDDEN_RUNES = ['ᚢ', 'ᚺ', 'ᛁ', 'ᚷ', 'ᛉ', 'ᛒ', 'ᛏ', 'ᛚ', 'ᚲ'];
    
    // === SÄTZE MIT RUNEN ===
    // Jeder Satz enthält ein Wort, das durch Kontext klar ist
    const SENTENCES = [
        {
            template: 'Der {ᚢᚺᚢ} flog lautlos durch die Nacht.',
            word: 'UHU',
            runes: 'ᚢᚺᚢ',
            hint: 'Ein nachtaktiver Vogel...'
        },
        {
            template: 'Am Finger {ᚷᛚᛁᛏᛉᛇᚱᛏᛇ} ein goldener {ᚱᛁᚾᚷ}.',
            word: 'GLITZERTE|RING',
            runes: 'ᚷᛚᛁᛏᛉᛇᚱᛏᛇ|ᚱᛁᚾᚷ',
            hint: 'Schmuck am Finger...'
        },
        {
            template: 'Der {ᛉᚨᚢᛒᛇᚱᛇᚱ} hob seinen {ᛊᛏᚨᛒ}.',
            word: 'ZAUBERER|STAB',
            runes: 'ᛉᚨᚢᛒᛇᚱᛇᚱ|ᛊᛏᚨᛒ',
            hint: 'Einer, der Magie wirkt...'
        },
        {
            template: 'Das {ᛚᛁᚲᚺᛏ} der Kerze erlosch.',
            word: 'LICHT',
            runes: 'ᛚᛁᚲᚺᛏ',
            hint: 'Was eine Kerze spendet...'
        }
    ];
    
    // Geheime Zahl, die am Ende erscheint
    const SECRET_NUMBER = 193;
    
    // === INITIALISIERUNG ===
    function init() {
        state = 'reading';
        selectedRune = null;
        selectedRuneElement = null;
        
        // Kopiere vorgegebene Zuordnungen
        assignments = { ...GIVEN_ASSIGNMENTS };
        
        render();
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('cipherContainer');
        if (!container) return;
        
        const isEditing = state === 'editingRune';
        
        container.innerHTML = `
            <div class="lc-layout ${isEditing ? 'lc-editing-mode' : ''}">
                <!-- Buchseite -->
                <div class="lc-book-page ${isEditing ? 'lc-page-dimmed' : ''}">
                    <div class="lc-page-decoration lc-page-top"></div>
                    <div class="lc-page-content">
                        <p class="lc-hint-quote">„Worte verraten mehr als Zeichen."</p>
                        <div class="lc-sentences">
                            ${renderSentences()}
                        </div>
                    </div>
                    <div class="lc-page-decoration lc-page-bottom"></div>
                </div>
                
                <!-- Alphabet-Schlüssel -->
                <div class="lc-alphabet-key ${isEditing ? 'lc-key-dimmed' : ''}">
                    <h3 class="lc-key-title">Runen-Schlüssel</h3>
                    <div class="lc-key-grid">
                        ${renderAlphabetKey()}
                    </div>
                    <div class="lc-key-legend">
                        <span class="lc-legend-given">● Bekannt</span>
                        <span class="lc-legend-found">● Entdeckt</span>
                        <span class="lc-legend-unknown">● Unbekannt</span>
                    </div>
                </div>
            </div>
            
            <!-- Buchstaben-Auswahl (erscheint bei Klick auf Rune) -->
            <div class="lc-letter-picker ${isEditing ? 'lc-visible' : ''}" id="lcLetterPicker">
                <div class="lc-picker-backdrop" onclick="librarianCipher.closePicker()"></div>
                <div class="lc-picker-content">
                    <p class="lc-picker-title">Buchstabe für diese Rune:</p>
                    <div class="lc-picker-rune" id="lcPickerRune">${selectedRune || ''}</div>
                    <div class="lc-picker-letters">
                        ${renderLetterPicker()}
                    </div>
                    <button class="lc-picker-cancel" onclick="librarianCipher.closePicker()">✕ Abbrechen</button>
                </div>
            </div>
            
            <!-- Erfolgs-Overlay -->
            <div class="lc-success-overlay" id="lcSuccessOverlay">
                <div class="lc-success-scroll">
                    <div class="lc-scroll-content">
                        <p class="lc-scroll-title">✨ Die Chiffre ist gelöst! ✨</p>
                        <p class="lc-scroll-text">Die verborgene Zahl lautet:</p>
                        <p class="lc-scroll-number">${SECRET_NUMBER}</p>
                        <div class="lc-scroll-seal">📜</div>
                    </div>
                </div>
            </div>
        `;
        
        attachEventListeners();
        
        // Markiere die ausgewählte Rune nach dem Render
        if (selectedRune && state === 'editingRune') {
            highlightSelectedRune();
        }
    }
    
    function renderSentences() {
        return SENTENCES.map((sentence, idx) => {
            let html = sentence.template;
            
            // Ersetze {runen} durch klickbare Rune-Spans
            html = html.replace(/\{([^}]+)\}/g, (match, runeGroup) => {
                // Handle multiple words separated by |
                const words = runeGroup.split('|');
                return words.map(runes => {
                    return `<span class="lc-rune-word">${renderRuneWord(runes)}</span>`;
                }).join(' ');
            });
            
            return `<p class="lc-sentence">${html}</p>`;
        }).join('');
    }
    
    function renderRuneWord(runes) {
        return runes.split('').map(rune => {
            if (SOLUTION[rune]) {
                const letter = assignments[rune] || '?';
                const isGiven = GIVEN_ASSIGNMENTS[rune];
                const isSelected = selectedRune === rune && state === 'editingRune';
                const stateClass = isGiven ? 'lc-given' : (assignments[rune] ? 'lc-assigned' : 'lc-unknown');
                const selectedClass = isSelected ? 'lc-rune-selected' : '';
                const clickable = !isGiven ? 'lc-clickable' : '';
                
                return `<span class="lc-rune ${stateClass} ${selectedClass} ${clickable}" 
                              data-rune="${rune}" 
                              data-letter="${letter}">
                    <span class="lc-rune-symbol">${rune}</span>
                    <span class="lc-rune-letter">${letter}</span>
                </span>`;
            }
            return rune; // Normale Zeichen
        }).join('');
    }
    
    function renderAlphabetKey() {
        const allRunes = Object.keys(SOLUTION);
        
        return allRunes.map(rune => {
            const isGiven = GIVEN_ASSIGNMENTS[rune];
            const isAssigned = assignments[rune] && !isGiven;
            const isSelected = selectedRune === rune && state === 'editingRune';
            const letter = assignments[rune] || '?';
            
            let stateClass = 'lc-key-unknown';
            if (isGiven) stateClass = 'lc-key-given';
            else if (isAssigned) stateClass = 'lc-key-found';
            
            const selectedClass = isSelected ? 'lc-key-selected' : '';
            
            return `<div class="lc-key-pair ${stateClass} ${selectedClass}">
                <span class="lc-key-rune">${rune}</span>
                <span class="lc-key-arrow">→</span>
                <span class="lc-key-letter">${letter}</span>
            </div>`;
        }).join('');
    }
    
    function renderLetterPicker() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const usedLetters = Object.values(assignments);
        
        return alphabet.split('').map(letter => {
            const isUsed = usedLetters.includes(letter);
            const isCurrentLetter = selectedRune && assignments[selectedRune] === letter;
            return `<button class="lc-letter-btn ${isUsed && !isCurrentLetter ? 'lc-letter-used' : ''} ${isCurrentLetter ? 'lc-letter-current' : ''}" 
                            data-letter="${letter}"
                            ${isUsed && !isCurrentLetter ? 'disabled' : ''}>${letter}</button>`;
        }).join('');
    }
    
    // === HERVORHEBUNG ===
    function highlightSelectedRune() {
        // Markiere alle Instanzen der ausgewählten Rune
        document.querySelectorAll(`.lc-rune[data-rune="${selectedRune}"]`).forEach(el => {
            el.classList.add('lc-rune-selected');
        });
        
        // Markiere im Alphabet-Schlüssel
        document.querySelectorAll('.lc-key-pair').forEach(el => {
            const runeEl = el.querySelector('.lc-key-rune');
            if (runeEl && runeEl.textContent === selectedRune) {
                el.classList.add('lc-key-selected');
            }
        });
    }
    
    // === EVENT LISTENERS ===
    function attachEventListeners() {
        // Klick auf editierbare Runen (nicht vorgegebene)
        document.querySelectorAll('.lc-rune.lc-clickable').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const rune = el.dataset.rune;
                if (!GIVEN_ASSIGNMENTS[rune]) {
                    // Visuelles Feedback: kurze Animation
                    el.classList.add('lc-rune-clicked');
                    setTimeout(() => el.classList.remove('lc-rune-clicked'), 150);
                    
                    openPicker(rune, el);
                }
            });
        });
        
        // Klick auf Buchstaben im Picker
        document.querySelectorAll('.lc-letter-btn:not([disabled])').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const letter = el.dataset.letter;
                
                // Visuelles Feedback
                el.classList.add('lc-letter-clicked');
                
                setTimeout(() => {
                    assignLetter(letter);
                }, 100);
            });
        });
    }
    
    // === PICKER ===
    function openPicker(rune, element) {
        if (state === 'success') return;
        
        state = 'editingRune';
        selectedRune = rune;
        selectedRuneElement = element;
        
        // Sofort neu rendern mit Editing-Modus
        render();
    }
    
    function closePicker() {
        if (state !== 'editingRune') return;
        
        state = 'reading';
        selectedRune = null;
        selectedRuneElement = null;
        
        render();
    }
    
    function assignLetter(letter) {
        if (!selectedRune) return;
        
        // Entferne alte Zuordnung für diesen Buchstaben (falls vorhanden)
        Object.keys(assignments).forEach(rune => {
            if (assignments[rune] === letter && !GIVEN_ASSIGNMENTS[rune]) {
                delete assignments[rune];
            }
        });
        
        // Neue Zuordnung
        assignments[selectedRune] = letter;
        
        // Picker schließen und neu rendern
        state = 'reading';
        selectedRune = null;
        selectedRuneElement = null;
        
        render();
        
        // Prüfe ob gelöst
        checkSolution();
    }
    
    // === LÖSUNG PRÜFEN ===
    function checkSolution() {
        // Prüfe ob alle Runen korrekt zugeordnet sind
        const allCorrect = HIDDEN_RUNES.every(rune => {
            return assignments[rune] === SOLUTION[rune];
        });
        
        if (allCorrect) {
            handleSuccess();
        }
    }
    
    // === ERFOLG ===
    function handleSuccess() {
        state = 'success';
        
        // Alle Runen als gelöst markieren
        document.querySelectorAll('.lc-rune').forEach(el => {
            el.classList.add('lc-solved');
        });
        
        // Buchseite leuchten lassen
        document.querySelector('.lc-book-page').classList.add('lc-page-solved');
        
        // Erfolgs-Overlay zeigen
        setTimeout(() => {
            const overlay = document.getElementById('lcSuccessOverlay');
            if (overlay) {
                overlay.classList.add('lc-visible');
            }
            
            // Minigame als gelöst markieren
            if (typeof solveMinigame === 'function') {
                solveMinigame(3, '📜 Entschlüsseltes Pergament', SECRET_NUMBER);
            }
        }, 800);
    }
    
    // === RESET ===
    function reset() {
        state = 'reading';
        selectedRune = null;
        assignments = { ...GIVEN_ASSIGNMENTS };
        render();
    }
    
    // === PUBLIC API ===
    return {
        init,
        reset,
        closePicker
    };
})();

// Globale Funktion für minigames-core.js
function initCipher() {
    librarianCipher.init();
}
