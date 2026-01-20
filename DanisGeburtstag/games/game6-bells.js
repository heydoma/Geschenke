// ========================================
// MINIGAME 6: GLOCKENSPIEL DER HAUSELFEN
// Ruhiges Gedächtnis-Rätsel mit Vorwärts & Rückwärts
// ========================================

const bellGame = (() => {
    // === KONSTANTEN ===
    // Feste Sequenzen - eine magische Hauselfen-Melodie
    // Glocken: 0=C5(tief), 1=E5, 2=G5, 3=B5, 4=D6(hoch)
    const SEQUENCES = [
        [2, 4, 3],              // Level 1: 3 Töne - aufsteigend mystisch
        [2, 4, 3, 1],           // Level 2: 4 Töne - mit Auflösung
        [2, 4, 3, 1, 0],        // Level 3: 5 Töne - vollständige Phrase
    ];
    
    // Glocken-Eigenschaften (Position 0-4, von links nach rechts)
    const BELLS = [
        { note: 'C5', size: 'large',  color: '#8B4513' },   // Tief
        { note: 'E5', size: 'medium-large', color: '#A0522D' },
        { note: 'G5', size: 'medium', color: '#CD853F' },
        { note: 'B5', size: 'medium-small', color: '#DEB887' },
        { note: 'D6', size: 'small',  color: '#F5DEB3' },   // Hoch
    ];
    
    // Frequenzen für Web Audio
    const FREQUENCIES = {
        'C5': 523.25,
        'E5': 659.25,
        'G5': 783.99,
        'B5': 987.77,
        'D6': 1174.66
    };
    
    // === ZUSTAND ===
    let state = 'idle'; // idle, playingSequence, waitingForInput, checking, success
    let currentLevel = 0;
    let phase = 'forward'; // 'forward' oder 'backward'
    let playerSequence = [];
    let audioContext = null;
    
    // === AUDIO ===
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    function playTone(bellIndex, duration = 400) {
        initAudio();
        
        const bell = BELLS[bellIndex];
        const freq = FREQUENCIES[bell.note];
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Glocken-artiger Klang
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        // Sanftes Ein- und Ausklingen
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('bellContainer');
        if (!container) return;
        
        container.innerHTML = '';
        container.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 15px;
            padding: 30px 20px;
            min-height: 200px;
        `;
        
        BELLS.forEach((bell, index) => {
            const bellWrapper = document.createElement('div');
            bellWrapper.className = 'bell-wrapper';
            bellWrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
            `;
            
            // Seil
            const rope = document.createElement('div');
            rope.className = 'bell-rope';
            rope.style.cssText = `
                width: 3px;
                height: 40px;
                background: linear-gradient(to bottom, #4a3520, #8B4513);
                border-radius: 2px;
            `;
            
            // Glocke
            const bellEl = document.createElement('div');
            bellEl.className = 'bell';
            bellEl.dataset.index = index;
            
            // Größe basierend auf Tonhöhe
            const sizes = {
                'large': 70,
                'medium-large': 62,
                'medium': 54,
                'medium-small': 46,
                'small': 38
            };
            const size = sizes[bell.size];
            
            bellEl.style.cssText = `
                width: ${size}px;
                height: ${size * 1.1}px;
                background: linear-gradient(135deg, ${bell.color}, #654321);
                border-radius: 5px 5px ${size/2}px ${size/2}px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 
                    inset 0 -5px 15px rgba(0,0,0,0.3),
                    0 5px 15px rgba(0,0,0,0.3);
                position: relative;
            `;
            
            // Klöppel
            const clapper = document.createElement('div');
            clapper.style.cssText = `
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: ${size * 0.2}px;
                height: ${size * 0.25}px;
                background: #2a1a0a;
                border-radius: 50%;
            `;
            bellEl.appendChild(clapper);
            
            // Click Handler
            bellEl.onclick = () => handleBellClick(index);
            
            bellWrapper.appendChild(rope);
            bellWrapper.appendChild(bellEl);
            container.appendChild(bellWrapper);
        });
        
        // Phase-Anzeige aktualisieren
        updatePhaseIndicator();
    }
    
    function updatePhaseIndicator() {
        const indicator = document.getElementById('bellPhase');
        if (!indicator) return;
        
        if (phase === 'forward') {
            indicator.textContent = `Phase: Vorwärts (Level ${currentLevel + 1}/3)`;
            indicator.style.color = '#d4c4a8';
        } else {
            indicator.textContent = '⚡ Phase: RÜCKWÄRTS!';
            indicator.style.color = '#ffd700';
        }
    }
    
    function highlightBell(index, duration = 400) {
        const bells = document.querySelectorAll('.bell');
        const bell = bells[index];
        if (!bell) return;
        
        // Aufleuchten
        bell.style.boxShadow = `
            inset 0 -5px 15px rgba(0,0,0,0.3),
            0 0 30px rgba(255, 215, 0, 0.8),
            0 0 60px rgba(255, 200, 100, 0.5)
        `;
        bell.style.transform = 'scale(1.1) rotate(-5deg)';
        bell.style.filter = 'brightness(1.4)';
        
        // Ton spielen
        playTone(index, duration);
        
        // Nach Dauer zurücksetzen
        setTimeout(() => {
            bell.style.boxShadow = `
                inset 0 -5px 15px rgba(0,0,0,0.3),
                0 5px 15px rgba(0,0,0,0.3)
            `;
            bell.style.transform = 'scale(1) rotate(0deg)';
            bell.style.filter = 'brightness(1)';
        }, duration);
    }
    
    function dimAllBells() {
        const bells = document.querySelectorAll('.bell');
        bells.forEach(bell => {
            bell.style.opacity = '0.5';
            bell.style.filter = 'grayscale(50%)';
        });
        
        setTimeout(() => {
            bells.forEach(bell => {
                bell.style.opacity = '1';
                bell.style.filter = 'brightness(1)';
            });
        }, 800);
    }
    
    function celebrateSuccess() {
        const bells = document.querySelectorAll('.bell');
        
        // Alle Glocken gleichzeitig aufleuchten lassen
        bells.forEach((bell, i) => {
            setTimeout(() => {
                bell.style.boxShadow = `
                    inset 0 -5px 15px rgba(0,0,0,0.3),
                    0 0 40px rgba(255, 215, 0, 1),
                    0 0 80px rgba(255, 200, 100, 0.7)
                `;
                bell.style.transform = 'scale(1.15)';
                bell.style.filter = 'brightness(1.5)';
                playTone(i, 800);
            }, i * 100);
        });
    }
    
    // === SPIELLOGIK ===
    function getCurrentSequence() {
        return SEQUENCES[currentLevel];
    }
    
    function getTargetSequence() {
        const seq = getCurrentSequence();
        return phase === 'forward' ? seq : [...seq].reverse();
    }
    
    function playSequence() {
        state = 'playingSequence';
        playerSequence = [];
        
        const sequence = getCurrentSequence();
        const delay = 700; // Zeit zwischen Tönen
        
        if (typeof showMessage === 'function') {
            showMessage('🎵 Höre gut zu...', 'info');
        }
        
        // Sequenz abspielen
        sequence.forEach((bellIndex, i) => {
            setTimeout(() => {
                highlightBell(bellIndex, 500);
            }, i * delay + 500); // 500ms Pause vor Start
        });
        
        // Nach Abspielen: Warten auf Eingabe
        const totalTime = sequence.length * delay + 800;
        setTimeout(() => {
            state = 'waitingForInput';
            if (typeof showMessage === 'function') {
                if (phase === 'forward') {
                    showMessage('🎶 Deine Reihenfolge...', 'info');
                } else {
                    showMessage('⚡ Jetzt RÜCKWÄRTS!', 'info');
                }
            }
        }, totalTime);
    }
    
    function handleBellClick(index) {
        // Eingaben nur im richtigen State erlauben
        if (state !== 'waitingForInput') return;
        
        // Glocke animieren und Ton spielen
        highlightBell(index, 350);
        
        // Zur Spieler-Sequenz hinzufügen
        playerSequence.push(index);
        
        // Prüfen wenn vollständig (KEINE Teilprüfung!)
        const target = getTargetSequence();
        if (playerSequence.length === target.length) {
            checkSequence();
        }
    }
    
    function checkSequence() {
        state = 'checking';
        
        const target = getTargetSequence();
        const isCorrect = playerSequence.every((val, i) => val === target[i]);
        
        setTimeout(() => {
            if (isCorrect) {
                handleCorrect();
            } else {
                handleWrong();
            }
        }, 400);
    }
    
    function handleCorrect() {
        if (phase === 'forward') {
            // Vorwärts-Phase: Nächstes Level oder Rückwärts-Phase
            if (currentLevel < SEQUENCES.length - 1) {
                // Nächstes Level
                currentLevel++;
                updatePhaseIndicator();
                
                if (typeof showMessage === 'function') {
                    showMessage('✨ Richtig! Nächste Sequenz...', 'success');
                }
                
                setTimeout(() => {
                    playSequence();
                }, 1500);
            } else {
                // Maximale Länge erreicht → Rückwärts-Phase!
                phase = 'backward';
                updatePhaseIndicator();
                
                if (typeof showMessage === 'function') {
                    showMessage('⚡ "In der Zeit zurückzugehen ist die einzige Rettung."', 'info');
                }
                
                setTimeout(() => {
                    playSequence();
                }, 2500);
            }
        } else {
            // Rückwärts-Phase geschafft → ERFOLG!
            handleSuccess();
        }
    }
    
    function handleWrong() {
        // Sanftes visuelles Feedback
        dimAllBells();
        
        if (typeof showMessage === 'function') {
            showMessage('💫 Nicht ganz... Versuche es nochmal.', 'error');
        }
        
        // GLEICHE Sequenz erneut abspielen (keine neue!)
        setTimeout(() => {
            playSequence();
        }, 1500);
    }
    
    function handleSuccess() {
        state = 'success';
        
        celebrateSuccess();
        
        if (typeof showMessage === 'function') {
            showMessage('🔔 Die Glocken erklingen in perfekter Harmonie!', 'success');
        }
        
        setTimeout(() => {
            if (typeof solveMinigame === 'function') {
                solveMinigame(6, '🔔 Glocken-Erinnerung');
            }
        }, 2000);
    }
    
    // === INIT & RESET ===
    function init() {
        state = 'idle';
        currentLevel = 0;
        phase = 'forward';
        playerSequence = [];
        
        render();
        
        // Kurze Pause, dann Sequenz abspielen
        setTimeout(() => {
            playSequence();
        }, 800);
    }
    
    function reset() {
        state = 'idle';
        currentLevel = 0;
        phase = 'forward';
        playerSequence = [];
        
        render();
        
        setTimeout(() => {
            playSequence();
        }, 500);
    }
    
    return { init, reset, playSequence };
})();

// Globale Funktionen für HTML
function initBellGame() {
    bellGame.init();
}

function resetBellGame() {
    bellGame.reset();
}

function startBellSequence() {
    bellGame.playSequence();
}
