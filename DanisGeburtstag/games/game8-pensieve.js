// ========================================
// MINIGAME 8: DENKARIUM (FINALE)
// Ruhiges, emotionales Finale
// ========================================

const pensieve = (() => {
    // === KONSTANTEN ===
    // Die Artefakte aus den vorherigen Spielen (NEUE ZUORDNUNG)
    const ARTIFACTS = [
        { id: 1, name: '🧪 Phiole', fullName: 'Beschriftete Phiole', game: 1 },
        { id: 2, name: '🔑 Schlüssel', fullName: 'Goldener Schlüssel', game: 2 },  // Key Catch ist jetzt Game 2!
        { id: 3, name: '📜 Chiffre', fullName: 'Entschlüsseltes Pergament', game: 3 },
        { id: 4, name: '🪜 Treppe', fullName: 'Treppen-Fragment', game: 4 },
        { id: 5, name: '△ Symbol', fullName: 'Heiligtümer des Todes', game: 5 },
        { id: 6, name: '🔔 Klang', fullName: 'Glocken-Erinnerung', game: 6 },
        { id: 7, name: '📖 Pergament', fullName: 'Flüsterndes Pergament', game: 7 }  // Whispering Books ist jetzt Game 7!
    ];
    
    // Die korrekte Reihenfolge (4 Artefakte)
    // Basiert auf Hinweisen aus den Spielen:
    // - Game 3 (Cipher) gibt eine Zahl
    // - Game 4 (Treppen) - Die Route
    // - Die Reihenfolge: Heiligtümer → Glocken → Schlüssel → Chiffre
    // (Symbol erkennen → Melodie merken → Schlüssel finden → Code entschlüsseln)
    const CORRECT_ORDER = [5, 6, 2, 3]; // Die IDs der Artefakte (Schlüssel ist jetzt ID 2!)
    
    // === ZUSTAND ===
    let state = 'idle'; // idle, placingMemories, checking, success
    let slots = [null, null, null, null];
    let collectedArtifacts = [];
    let selectedSlot = null;
    
    // === INIT ===
    function init() {
        state = 'placingMemories';
        slots = [null, null, null, null];
        selectedSlot = null;
        
        // Sammle alle Artefakte die der Spieler freigeschaltet hat
        collectedArtifacts = [];
        if (typeof gameState !== 'undefined' && gameState.artifacts) {
            ARTIFACTS.forEach(artifact => {
                // Prüfe ob das entsprechende Spiel gelöst wurde
                if (gameState.solved && gameState.solved[artifact.game]) {
                    collectedArtifacts.push(artifact);
                }
            });
        }
        
        // Fallback: Wenn nichts gesammelt, alle verfügbar machen (für Tests)
        if (collectedArtifacts.length === 0) {
            collectedArtifacts = [...ARTIFACTS];
        }
        
        render();
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('penseiveSlots');
        const available = document.getElementById('availableArtifacts');
        if (!container || !available) return;
        
        // Pensieve Becken
        renderBasin();
        
        // Slots Container
        container.innerHTML = '';
        container.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        `;
        
        // 4 Slots rendern
        slots.forEach((artifactId, index) => {
            const slot = document.createElement('div');
            slot.className = 'pensieve-slot';
            
            const artifact = artifactId ? ARTIFACTS.find(a => a.id === artifactId) : null;
            
            slot.style.cssText = `
                width: 70px;
                height: 70px;
                border: 2px dashed ${artifact ? '#8b7355' : '#5a4a3a'};
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: ${artifact ? 'rgba(139, 115, 85, 0.3)' : 'rgba(30, 20, 10, 0.5)'};
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            `;
            
            if (artifact) {
                slot.innerHTML = `
                    <span style="font-size: 24px;">${artifact.name.split(' ')[0]}</span>
                    <span style="font-size: 9px; color: #a99; margin-top: 2px;">${artifact.name.split(' ')[1] || ''}</span>
                `;
                slot.style.boxShadow = '0 0 15px rgba(139, 115, 85, 0.4)';
            } else {
                slot.innerHTML = `<span style="font-size: 12px; color: #666;">${index + 1}</span>`;
            }
            
            // Klick: Artefakt entfernen
            slot.onclick = () => {
                if (artifact && state === 'placingMemories') {
                    slots[index] = null;
                    animateBasin('remove');
                    render();
                }
            };
            
            container.appendChild(slot);
        });
        
        // Verfügbare Artefakte
        available.innerHTML = '';
        available.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
            padding: 15px;
            background: rgba(20, 15, 10, 0.5);
            border-radius: 10px;
        `;
        
        // Titel
        const title = document.createElement('div');
        title.style.cssText = `
            width: 100%;
            text-align: center;
            color: #a99;
            font-size: 12px;
            margin-bottom: 10px;
        `;
        title.textContent = '✨ Gesammelte Erinnerungen';
        available.appendChild(title);
        
        // Artefakte die noch nicht in Slots sind
        collectedArtifacts.forEach(artifact => {
            if (slots.includes(artifact.id)) return; // Bereits platziert
            
            const item = document.createElement('div');
            item.className = 'artifact-item';
            item.style.cssText = `
                padding: 10px 15px;
                background: linear-gradient(135deg, #3a2a1a, #2a1a0a);
                border: 1px solid #5a4a3a;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
            `;
            
            item.innerHTML = `
                <span style="font-size: 20px;">${artifact.name.split(' ')[0]}</span>
                <span style="font-size: 10px; color: #888; margin-top: 3px;">${artifact.fullName}</span>
            `;
            
            item.onmouseenter = () => {
                item.style.transform = 'scale(1.05)';
                item.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
            };
            item.onmouseleave = () => {
                item.style.transform = 'scale(1)';
                item.style.boxShadow = 'none';
            };
            
            // Klick: In nächsten freien Slot platzieren
            item.onclick = () => {
                if (state !== 'placingMemories') return;
                
                const emptySlot = slots.findIndex(s => s === null);
                if (emptySlot !== -1) {
                    slots[emptySlot] = artifact.id;
                    animateBasin('place');
                    render();
                    
                    // Prüfen wenn alle Slots belegt
                    if (slots.every(s => s !== null)) {
                        setTimeout(checkOrder, 500);
                    }
                }
            };
            
            available.appendChild(item);
        });
        
        // Wenn keine Artefakte mehr verfügbar
        if (collectedArtifacts.filter(a => !slots.includes(a.id)).length === 0 && !slots.every(s => s !== null)) {
            const hint = document.createElement('div');
            hint.style.cssText = 'color: #666; font-size: 12px; font-style: italic;';
            hint.textContent = 'Klicke auf platzierte Erinnerungen um sie zu entfernen...';
            available.appendChild(hint);
        }
    }
    
    function renderBasin() {
        const basin = document.querySelector('.pensieve-basin');
        if (!basin) return;
        
        // Dynamische Wellenbewegung basierend auf gefüllten Slots
        const filledCount = slots.filter(s => s !== null).length;
        const intensity = filledCount * 0.2;
        
        basin.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 ${10 + filledCount * 5}px rgba(139, 115, 85, ${0.3 + intensity}));
        `;
    }
    
    function animateBasin(type) {
        const basin = document.querySelector('.pensieve-basin');
        if (!basin) return;
        
        // Kurzes Schimmern
        basin.style.transition = 'filter 0.3s ease';
        if (type === 'place') {
            basin.style.filter = 'drop-shadow(0 0 30px rgba(200, 180, 140, 0.8))';
        } else {
            basin.style.filter = 'drop-shadow(0 0 10px rgba(139, 115, 85, 0.3))';
        }
        
        setTimeout(() => {
            renderBasin();
        }, 300);
    }
    
    // === LOGIK ===
    function checkOrder() {
        state = 'checking';
        
        // Prüfe ob die Reihenfolge korrekt ist
        const isCorrect = slots.every((id, index) => id === CORRECT_ORDER[index]);
        
        setTimeout(() => {
            if (isCorrect) {
                handleSuccess();
            } else {
                handleWrong();
            }
        }, 800);
    }
    
    function handleWrong() {
        state = 'placingMemories';
        
        // Visuelles Feedback: Wirre Erinnerungen
        const basin = document.querySelector('.pensieve-basin');
        if (basin) {
            basin.style.filter = 'drop-shadow(0 0 20px rgba(100, 80, 60, 0.5)) blur(1px)';
            setTimeout(() => {
                basin.style.filter = '';
                renderBasin();
            }, 800);
        }
        
        if (typeof showMessage === 'function') {
            showMessage('💫 Die Erinnerungen sind noch ungeordnet...', 'info');
        }
        
        // Slots bleiben - Spieler kann umsortieren
    }
    
    function handleSuccess() {
        state = 'success';
        
        // Finale Offenbarung
        revealFinalMemory();
    }
    
    function revealFinalMemory() {
        const modal = document.getElementById('minigame8');
        if (!modal) return;
        
        const body = modal.querySelector('.modal-body');
        if (!body) return;
        
        // Langsamer Übergang
        body.style.transition = 'all 1s ease';
        body.style.opacity = '0';
        
        setTimeout(() => {
            body.innerHTML = `
                <div class="final-reveal" style="
                    text-align: center;
                    padding: 20px;
                    animation: fadeIn 2s ease;
                ">
                    <h2 style="
                        color: #ffd700;
                        font-family: 'Times New Roman', serif;
                        font-size: 20px;
                        margin-bottom: 5px;
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                        letter-spacing: 2px;
                    ">„Ich schwöre feierlich, dass ich ein Tunichtgut bin."</h2>
                    
                    <!-- KARTE DES RUMTREIBERS -->
                    <div class="marauders-map" style="
                        background: #f5e6d3;
                        background-image: 
                            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 115, 85, 0.1) 50px, rgba(139, 115, 85, 0.1) 51px),
                            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 115, 85, 0.1) 50px, rgba(139, 115, 85, 0.1) 51px);
                        border: 3px solid #8b7355;
                        border-radius: 5px;
                        padding: 15px;
                        margin: 15px auto;
                        max-width: 450px;
                        box-shadow: 
                            inset 0 0 30px rgba(139, 115, 85, 0.3),
                            0 5px 20px rgba(0, 0, 0, 0.5);
                        position: relative;
                    ">
                        <!-- Titel -->
                        <div style="
                            font-family: 'Times New Roman', serif;
                            color: #4a3520;
                            font-size: 14px;
                            margin-bottom: 10px;
                            border-bottom: 1px solid #8b7355;
                            padding-bottom: 8px;
                        ">
                            <span style="font-size: 11px; letter-spacing: 3px;">DIE KARTE DES RUMTREIBERS PRÄSENTIERT</span><br>
                            <strong style="font-size: 16px;">Die Wohnung</strong>
                        </div>
                        
                        <!-- Wohnungsgrundriss -->
                        <svg viewBox="0 0 400 250" style="width: 100%; height: auto;">
                            <!-- Stil für die Karte -->
                            <defs>
                                <pattern id="parchmentPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                    <rect width="10" height="10" fill="#f5e6d3"/>
                                    <circle cx="5" cy="5" r="0.5" fill="#d4c4a8" opacity="0.5"/>
                                </pattern>
                                <filter id="handDrawn">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
                                </filter>
                            </defs>
                            
                            <!-- Außenwände -->
                            <rect x="10" y="10" width="380" height="230" fill="none" stroke="#4a3520" stroke-width="3"/>
                            
                            <!-- FLUR -->
                            <rect x="10" y="10" width="80" height="230" fill="none" stroke="#4a3520" stroke-width="1.5"/>
                            <text x="50" y="130" text-anchor="middle" font-family="'Times New Roman', serif" font-size="10" fill="#6b5530">Flur</text>
                            
                            <!-- WOHNZIMMER -->
                            <rect x="90" y="10" width="180" height="140" fill="none" stroke="#4a3520" stroke-width="1.5"/>
                            <text x="180" y="85" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" fill="#6b5530">Wohnzimmer</text>
                            <!-- Sofa -->
                            <rect x="110" y="100" width="60" height="25" fill="none" stroke="#8b7355" stroke-width="1" stroke-dasharray="3,2"/>
                            <text x="140" y="117" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#8b7355">Sofa</text>
                            
                            <!-- KÜCHE -->
                            <rect x="270" y="10" width="120" height="110" fill="none" stroke="#4a3520" stroke-width="1.5"/>
                            <text x="330" y="65" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" fill="#6b5530">Küche</text>
                            
                            <!-- SCHLAFZIMMER -->
                            <rect x="90" y="150" width="150" height="90" fill="none" stroke="#4a3520" stroke-width="1.5"/>
                            <text x="165" y="200" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" fill="#6b5530">Schlafzimmer</text>
                            <!-- Bett -->
                            <rect x="100" y="170" width="50" height="40" fill="none" stroke="#8b7355" stroke-width="1" stroke-dasharray="3,2"/>
                            <text x="125" y="195" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#8b7355">Bett</text>
                            
                            <!-- BAD -->
                            <rect x="240" y="150" width="70" height="90" fill="none" stroke="#4a3520" stroke-width="1.5"/>
                            <text x="275" y="200" text-anchor="middle" font-family="'Times New Roman', serif" font-size="10" fill="#6b5530">Bad</text>
                            
                            <!-- BALKON -->
                            <rect x="310" y="120" width="80" height="120" fill="none" stroke="#4a3520" stroke-width="1.5" stroke-dasharray="5,3"/>
                            <text x="350" y="185" text-anchor="middle" font-family="'Times New Roman', serif" font-size="10" fill="#6b5530">Balkon</text>
                            
                            <!-- FUSSABDRÜCKE zum Versteck -->
                            <g fill="#4a3520" opacity="0.6">
                                <!-- Fußspuren vom Eingang -->
                                <ellipse cx="50" cy="200" rx="4" ry="6" transform="rotate(-10 50 200)"/>
                                <ellipse cx="58" cy="190" rx="4" ry="6" transform="rotate(10 58 190)"/>
                                <ellipse cx="52" cy="175" rx="4" ry="6" transform="rotate(-5 52 175)"/>
                                <ellipse cx="60" cy="160" rx="4" ry="6" transform="rotate(5 60 160)"/>
                                <!-- Durch Flur -->
                                <ellipse cx="55" cy="140" rx="4" ry="6" transform="rotate(-5 55 140)"/>
                                <ellipse cx="62" cy="125" rx="4" ry="6" transform="rotate(10 62 125)"/>
                                <!-- Zum Wohnzimmer -->
                                <ellipse cx="100" cy="115" rx="4" ry="6" transform="rotate(60 100 115)"/>
                                <ellipse cx="115" cy="108" rx="4" ry="6" transform="rotate(70 115 108)"/>
                                <ellipse cx="135" cy="105" rx="4" ry="6" transform="rotate(80 135 105)"/>
                            </g>
                            
                            <!-- TICKETS MARKIERUNG - Anpassen wo sie liegen! -->
                            <g class="ticket-location">
                                <!-- Pulsierender Marker -->
                                <circle cx="200" cy="50" r="15" fill="none" stroke="#ffd700" stroke-width="2">
                                    <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite"/>
                                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                                </circle>
                                <circle cx="200" cy="50" r="8" fill="#ffd700" opacity="0.8"/>
                                <text x="200" y="54" text-anchor="middle" font-size="10" fill="#4a3520">🎟️</text>
                                
                                <!-- Beschriftung -->
                                <text x="200" y="35" text-anchor="middle" font-family="'Times New Roman', serif" font-size="9" fill="#8b4513" font-weight="bold">
                                    HIER!
                                </text>
                            </g>
                            
                            <!-- Kleine Details -->
                            <text x="50" y="225" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#8b7355">Tür</text>
                        </svg>
                        
                        <!-- Fußnote -->
                        <div style="
                            font-family: 'Times New Roman', serif;
                            color: #6b5530;
                            font-size: 11px;
                            margin-top: 10px;
                            font-style: italic;
                            border-top: 1px solid #8b7355;
                            padding-top: 8px;
                        ">
                            🎭 Harry Potter und das verwunschene Kind<br>
                            <span style="font-size: 10px; color: #8b7355;">Mehr! Theater Hamburg</span>
                        </div>
                    </div>
                    
                    <button onclick="pensieve.complete()" style="
                        margin-top: 15px;
                        padding: 12px 30px;
                        font-size: 16px;
                        background: linear-gradient(135deg, #8b4513, #654321);
                        color: #f5e6d3;
                        border: 2px solid #a0522d;
                        border-radius: 10px;
                        cursor: pointer;
                        font-family: 'Times New Roman', serif;
                        transition: all 0.3s ease;
                        box-shadow: 0 0 20px rgba(139, 69, 19, 0.5);
                        letter-spacing: 1px;
                    " onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform='scale(1)'">
                        ✨ Mischief Managed ✨
                    </button>
                </div>
            `;
            
            body.style.opacity = '1';
            
            // Erfolgs-Sound oder Nachricht
            if (typeof showMessage === 'function') {
                showMessage('🗺️ Die Karte offenbart sich!', 'success');
            }
        }, 1000);
    }
    
    function complete() {
        if (typeof solveMinigame === 'function') {
            solveMinigame(8, '🎭 Das verwunschene Kind');
        }
        
        // Finales Confetti oder Effekt
        setTimeout(() => {
            if (typeof closeMinigame === 'function') {
                closeMinigame(8);
            }
            
            // Zeige finale Nachricht
            setTimeout(() => {
                if (typeof showMessage === 'function') {
                    showMessage('🧙‍♂️ Der Escape Room ist gemeistert! 🎭', 'success');
                }
            }, 500);
        }, 500);
    }
    
    function reset() {
        init();
    }
    
    return { init, reset, complete };
})();

// Globale Funktionen für HTML
function initPensieve() {
    pensieve.init();
}

function resetPensieve() {
    pensieve.reset();
}
