// ========================================
// MINIGAME 4: DIE ROTIERENDEN TREPPEN
// Ein großes, komplexes Labyrinth-Puzzle
// ========================================

const rotatingStairs = (() => {
    // === ZUSTÄNDE ===
    // idle: Warten auf Spieler-Input
    // moving: Figur bewegt sich
    // rotating: Treppen rotieren
    // falling: Figur fällt (bei ungültigem Pfad)
    // success: Puzzle gelöst
    let state = 'idle';
    let hoveredTarget = null; // Aktuell gehoverte Ziel-ID
    
    // === GROSSES LABYRINTH-PUZZLE ===
    // 
    // Layout (4x4 Grid mit 11 Treppen):
    //
    //     0    1    2    3
    // 0   A -- S1 - S2 - S3
    // 1   |         |    |
    // 2   S4 - S5 - S6 - S7
    // 3   |         |
    // 4   S8 - S9 - S10
    // 5             |
    // 6             B
    //
    // KORREKTER WEG (einer von mehreren):
    // A → S1 → S2 → S6 → S10 → B
    //
    // FALLEN:
    // - Direkter Weg nach unten (A→S4→S8→S9→S10) dreht S10 falsch
    // - Oberer rechter Weg (S3→S7) ist Sackgasse
    //
    // ROTATIONEN:
    // - S1 rotiert S6 und S8
    // - S4 rotiert S5 und S9  
    // - S2 rotiert S10 (öffnet Weg zu B)
    // - S5 rotiert S6
    // - S8 rotiert S10 (schließt Weg zu B!)
    
    const SEGMENTS = [
        { id: 'start', x: 0, y: 0, fixed: true, symbol: 'A' },
        { id: 's1', x: 1, y: 0 },
        { id: 's2', x: 2, y: 0 },
        { id: 's3', x: 3, y: 0 },
        { id: 's4', x: 0, y: 1 },
        { id: 's5', x: 1, y: 1 },
        { id: 's6', x: 2, y: 1 },
        { id: 's7', x: 3, y: 1 },
        { id: 's8', x: 0, y: 2 },
        { id: 's9', x: 1, y: 2 },
        { id: 's10', x: 2, y: 2 },
        { id: 'goal', x: 2, y: 3, fixed: true, symbol: 'B' }
    ];
    
    const CONNECTIONS = {
        'start': { normal: ['E', 'S'], rotated: ['E', 'S'] },  // Fixiert
        's1': { normal: ['W', 'E'], rotated: ['N', 'S'] },     // Gerade H/V
        's2': { normal: ['W', 'E', 'S'], rotated: ['N', 'W', 'S'] }, // T-Stück
        's3': { normal: ['W', 'S'], rotated: ['N', 'E'] },     // L-Form
        's4': { normal: ['N', 'S'], rotated: ['E', 'W'] },     // Gerade V/H
        's5': { normal: ['W', 'E'], rotated: ['N', 'S'] },     // Gerade H/V
        's6': { normal: ['N', 'S'], rotated: ['E', 'W'] },     // Gerade V/H
        's7': { normal: ['N', 'W'], rotated: ['S', 'E'] },     // L-Form
        's8': { normal: ['N', 'E'], rotated: ['S', 'W'] },     // L-Form
        's9': { normal: ['W', 'E'], rotated: ['N', 'S'] },     // Gerade H/V
        's10': { normal: ['N', 'S', 'W'], rotated: ['E', 'W', 'N'] }, // T-Stück
        'goal': { normal: ['N'], rotated: ['N'] }              // Fixiert
    };
    
    const ROTATION_RULES = {
        'start': [],           // Freie Wahl am Start
        's1': ['s6', 's8'],    // Oberer Weg: öffnet Mittel-Route
        's2': ['s10'],         // WICHTIG: öffnet Weg zu B
        's3': [],              // Sackgassen-Ende
        's4': ['s5', 's9'],    // Unterer Weg: verändert Mittelbahn
        's5': ['s6'],          // Zusätzliche Komplexität
        's6': [],              // Kreuzung
        's7': [],              // Sackgassen-Ende
        's8': ['s10'],         // FALLE: schließt B wieder!
        's9': [],              // Durchgang
        's10': []              // Letzte Station vor B
    };
    
    // INITIALE ZUSTÄNDE
    // 0 = normal, 1 = rotiert
    const INITIAL_ROTATIONS = {
        's1': 0,   // W,E (horizontal)
        's2': 0,   // W,E,S (T nach unten offen)
        's3': 0,   // W,S (L-Form)
        's4': 0,   // N,S (vertikal) - Weg nach unten offen
        's5': 1,   // N,S (vertikal) - BLOCKIERT horizontal
        's6': 1,   // E,W (horizontal) - BLOCKIERT vertikal
        's7': 0,   // N,W (L-Form)
        's8': 0,   // N,E (L-Form)
        's9': 0,   // W,E (horizontal)
        's10': 1   // E,W,N - BLOCKIERT Weg nach S (zu B)
    };
    
    // === LÖSUNG VERIFIZIERUNG ===
    // Korrekter Pfad: A → S1 → S2 → S6 → S10 → B
    //
    // 1. A→S1: keine Rotation
    //    A(E,S)→E, S1(W,E) hat W ✓
    // 
    // 2. S1→S2: S6 rotiert 1→0, S8 rotiert 0→1
    //    S1(W,E)→E, S2(W,E,S) hat W ✓
    //    S6: wird N,S (vertikal - Weg nach unten offen!)
    //    S8: wird S,W (blockiert, aber egal)
    //
    // 3. S2→S6: S10 rotiert 1→0
    //    S2(W,E,S)→S, S6(N,S) hat N ✓
    //    S10: wird N,S,W (Weg nach S offen zu B!)
    //
    // 4. S6→S10: keine Rotation
    //    S6(N,S)→S, S10(N,S,W) hat N ✓
    //
    // 5. S10→B:
    //    S10(N,S,W)→S, B(N) ✓ ERFOLG!
    
    // Spieler-Position
    let playerPosition = 'start';
    let rotations = {};
    
    // === HILFSFUNKTIONEN ===
    
    function getConnections(segmentId, rotationOverride = null) {
        const conn = CONNECTIONS[segmentId];
        if (!conn) return [];
        const rot = rotationOverride !== null ? rotationOverride : rotations[segmentId];
        const isRotated = rot === 1;
        return isRotated ? conn.rotated : conn.normal;
    }
    
    function getSegmentAt(x, y) {
        return SEGMENTS.find(s => s.x === x && s.y === y);
    }
    
    function getSegment(id) {
        return SEGMENTS.find(s => s.id === id);
    }
    
    function getNeighborPos(x, y, direction) {
        switch (direction) {
            case 'N': return { x, y: y - 1 };
            case 'S': return { x, y: y + 1 };
            case 'E': return { x: x + 1, y };
            case 'W': return { x: x - 1, y };
        }
        return null;
    }
    
    function oppositeDir(dir) {
        return { 'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E' }[dir];
    }
    
    function areConnected(segA, segB, rotationsState = null) {
        const rots = rotationsState || rotations;
        const connA = getConnections(segA.id, rots[segA.id]);
        const connB = getConnections(segB.id, rots[segB.id]);
        
        let direction = null;
        if (segB.x === segA.x + 1 && segB.y === segA.y) direction = 'E';
        else if (segB.x === segA.x - 1 && segB.y === segA.y) direction = 'W';
        else if (segB.y === segA.y + 1 && segB.x === segA.x) direction = 'S';
        else if (segB.y === segA.y - 1 && segB.x === segA.x) direction = 'N';
        
        if (!direction) return false;
        
        return connA.includes(direction) && connB.includes(oppositeDir(direction));
    }
    
    function getReachableNeighbors(segmentId, rotationsState = null) {
        const segment = getSegment(segmentId);
        if (!segment) return [];
        
        const rots = rotationsState || rotations;
        const connections = getConnections(segmentId, rots[segmentId]);
        const neighbors = [];
        
        connections.forEach(dir => {
            const pos = getNeighborPos(segment.x, segment.y, dir);
            const neighbor = getSegmentAt(pos.x, pos.y);
            if (neighbor && areConnected(segment, neighbor, rots)) {
                neighbors.push(neighbor);
            }
        });
        
        return neighbors;
    }
    
    // Berechnet Distanz zum Ziel (Manhattan)
    function distanceToGoal(segmentId) {
        const seg = getSegment(segmentId);
        const goal = getSegment('goal');
        if (!seg || !goal) return Infinity;
        return Math.abs(seg.x - goal.x) + Math.abs(seg.y - goal.y);
    }
    
    // === INITIALISIERUNG ===
    function init() {
        state = 'idle';
        playerPosition = 'start';
        hoveredTarget = null;
        rotations = { ...INITIAL_ROTATIONS };
        render();
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('staircaseContainer');
        if (!container) return;
        
        const reachable = state === 'idle' ? getReachableNeighbors(playerPosition) : [];
        const reachableIds = reachable.map(s => s.id);
        
        // Welche Segmente würden bei Hover rotieren?
        const willRotate = hoveredTarget && state === 'idle' 
            ? (ROTATION_RULES[playerPosition] || []) 
            : [];
        
        container.innerHTML = `
            <div class="rs-puzzle">
                <div class="rs-grid">
                    ${SEGMENTS.map(seg => renderSegment(seg, reachableIds, willRotate)).join('')}
                    ${renderPlayer()}
                </div>
                <div class="rs-info">
                    <div class="rs-legend">
                        <span class="rs-legend-item"><span class="rs-dot rs-dot-start"></span> Start</span>
                        <span class="rs-legend-item"><span class="rs-dot rs-dot-goal"></span> Ziel</span>
                        <span class="rs-legend-item"><span class="rs-dot rs-dot-reachable"></span> Erreichbar</span>
                        <span class="rs-legend-item"><span class="rs-dot rs-dot-rotate"></span> Wird rotieren</span>
                    </div>
                    <p class="rs-hint">
                        ${state === 'idle' 
                            ? 'Hover zeigt, welche Treppen sich drehen werden.' 
                            : 'Bewegung läuft...'}
                    </p>
                </div>
            </div>
            
            <!-- Erfolgs-Overlay -->
            <div class="rs-success-overlay" id="rsSuccessOverlay">
                <div class="rs-success-content">
                    <p class="rs-success-title">✨ Geschafft! ✨</p>
                    <p class="rs-success-text">Die Treppen haben sich stabilisiert.</p>
                    <div class="rs-success-icon">🪜</div>
                </div>
            </div>
        `;
        
        attachEventListeners(reachableIds);
    }
    
    function renderSegment(segment, reachableIds, willRotate) {
        const isPlayer = segment.id === playerPosition;
        const isReachable = reachableIds.includes(segment.id);
        const isStart = segment.id === 'start';
        const isGoal = segment.id === 'goal';
        const isHovered = segment.id === hoveredTarget;
        const willRotateThis = willRotate.includes(segment.id);
        const rotation = rotations[segment.id] || 0;
        
        // CSS-Klassen
        let classes = ['rs-segment'];
        if (isStart) classes.push('rs-start');
        if (isGoal) classes.push('rs-goal');
        if (isPlayer) classes.push('rs-current');
        if (isReachable && state === 'idle') classes.push('rs-reachable');
        if (isHovered) classes.push('rs-hovered');
        if (willRotateThis && state === 'idle') classes.push('rs-will-rotate');
        if (rotation === 1) classes.push('rs-rotated');
        
        // Isometrische Position (größeres Grid für mehr Treppen)
        const isoX = (segment.x - segment.y) * 60 + 180;
        const isoY = (segment.x + segment.y) * 35 + 40;
        
        // Verbindungsrichtungen für visuelle Darstellung
        const connections = getConnections(segment.id);
        
        return `
            <div class="${classes.join(' ')}" 
                 data-id="${segment.id}"
                 style="left: ${isoX}px; top: ${isoY}px;">
                <div class="rs-segment-top">
                    <span class="rs-segment-symbol">${segment.symbol || ''}</span>
                    ${!segment.fixed ? renderConnectorDots(connections) : ''}
                </div>
                <div class="rs-segment-front"></div>
                <div class="rs-segment-side"></div>
            </div>
        `;
    }
    
    function renderConnectorDots(connections) {
        // Kleine Punkte zeigen an, wohin die Treppe führt
        return connections.map(dir => {
            let style = '';
            switch(dir) {
                case 'N': style = 'top: 5px; left: 50%; transform: translateX(-50%);'; break;
                case 'S': style = 'bottom: 5px; left: 50%; transform: translateX(-50%);'; break;
                case 'E': style = 'right: 5px; top: 50%; transform: translateY(-50%);'; break;
                case 'W': style = 'left: 5px; top: 50%; transform: translateY(-50%);'; break;
            }
            return `<span class="rs-connector-dot" style="${style}"></span>`;
        }).join('');
    }
    
    function renderPlayer() {
        const segment = getSegment(playerPosition);
        if (!segment) return '';
        
        const isoX = (segment.x - segment.y) * 60 + 180;
        const isoY = (segment.x + segment.y) * 35 + 40;
        
        return `
            <div class="rs-player" id="rsPlayer" style="left: ${isoX}px; top: ${isoY - 35}px;">
                <div class="rs-player-body">🧙</div>
            </div>
        `;
    }
    
    // === EVENT HANDLERS ===
    function attachEventListeners(reachableIds) {
        reachableIds.forEach(id => {
            const el = document.querySelector(`.rs-segment[data-id="${id}"]`);
            if (el) {
                // Hover: Zeige Rotation-Preview
                el.addEventListener('mouseenter', () => handleHoverEnter(id));
                el.addEventListener('mouseleave', () => handleHoverLeave());
                
                // Klick: Bewege Spieler
                el.addEventListener('click', () => handleSegmentClick(id));
            }
        });
    }
    
    function handleHoverEnter(targetId) {
        if (state !== 'idle') return;
        
        hoveredTarget = targetId;
        
        // Zeige welche Segmente rotieren werden
        const willRotate = ROTATION_RULES[playerPosition] || [];
        
        willRotate.forEach(segId => {
            const el = document.querySelector(`.rs-segment[data-id="${segId}"]`);
            if (el) {
                el.classList.add('rs-will-rotate');
            }
        });
        
        // Highlight das Ziel wenn wir näher kommen
        const currentDist = distanceToGoal(playerPosition);
        const targetDist = distanceToGoal(targetId);
        
        if (targetDist < currentDist) {
            const goalEl = document.querySelector('.rs-segment.rs-goal');
            if (goalEl) {
                goalEl.classList.add('rs-approaching');
            }
        }
    }
    
    function handleHoverLeave() {
        if (state !== 'idle') return;
        
        hoveredTarget = null;
        
        // Entferne alle Rotation-Previews
        document.querySelectorAll('.rs-will-rotate').forEach(el => {
            el.classList.remove('rs-will-rotate');
        });
        
        document.querySelectorAll('.rs-approaching').forEach(el => {
            el.classList.remove('rs-approaching');
        });
    }
    
    function handleSegmentClick(targetId) {
        if (state !== 'idle') return;
        
        const reachable = getReachableNeighbors(playerPosition);
        const target = reachable.find(s => s.id === targetId);
        
        if (!target) return;
        
        // Entferne Hover-States
        hoveredTarget = null;
        
        moveToSegment(targetId);
    }
    
    // === BEWEGUNG ===
    async function moveToSegment(targetId) {
        const fromSegment = playerPosition;
        const wasCloser = distanceToGoal(targetId) < distanceToGoal(fromSegment);
        
        // Phase 1: Bewegung
        state = 'moving';
        
        // Disable alle Interaktionen visuell
        document.querySelectorAll('.rs-reachable').forEach(el => {
            el.classList.remove('rs-reachable');
        });
        
        const playerEl = document.getElementById('rsPlayer');
        if (playerEl) {
            playerEl.classList.add('rs-moving');
        }
        
        // Klick-Feedback
        const targetEl = document.querySelector(`.rs-segment[data-id="${targetId}"]`);
        if (targetEl) {
            targetEl.classList.add('rs-clicked');
        }
        
        await delay(450);
        
        // Position aktualisieren
        playerPosition = targetId;
        
        // Prüfe auf Erfolg
        if (targetId === 'goal') {
            handleSuccess();
            return;
        }
        
        // Fortschritts-Feedback: Ziel pulsiert wenn wir näher kommen
        if (wasCloser) {
            const goalEl = document.querySelector('.rs-segment.rs-goal');
            if (goalEl) {
                goalEl.classList.add('rs-pulse-progress');
                setTimeout(() => goalEl.classList.remove('rs-pulse-progress'), 600);
            }
        }
        
        // Phase 2: Rotation
        state = 'rotating';
        
        const toRotate = ROTATION_RULES[fromSegment] || [];
        
        if (toRotate.length > 0) {
            // Neu rendern um Spielerposition zu zeigen
            render();
            
            // Markiere Segmente die rotieren werden
            toRotate.forEach(segId => {
                const el = document.querySelector(`.rs-segment[data-id="${segId}"]`);
                if (el) {
                    el.classList.add('rs-rotating-now');
                }
            });
            
            await delay(600);
            
            // Rotiere die Segmente
            toRotate.forEach(segId => {
                rotations[segId] = rotations[segId] === 0 ? 1 : 0;
            });
            
            // Neu rendern mit neuen Rotationen
            render();
            
            await delay(400);
        } else {
            render();
        }
        
        // Prüfe ob Spieler noch Verbindungen hat
        const reachableFromCurrent = getReachableNeighbors(playerPosition);
        
        if (reachableFromCurrent.length === 0 && playerPosition !== 'goal') {
            handleFall();
            return;
        }
        
        state = 'idle';
        render();
    }
    
    // === FALL-ANIMATION ===
    async function handleFall() {
        state = 'falling';
        
        // Neu rendern um Fall-Animation zu zeigen
        render();
        
        const playerEl = document.getElementById('rsPlayer');
        if (playerEl) {
            playerEl.classList.add('rs-falling');
        }
        
        if (typeof showMessage === 'function') {
            showMessage('💫 Die Treppe dreht sich weg... Zurück zum Start!', 'warning');
        }
        
        await delay(1400);
        
        // Sanfter Reset
        init();
    }
    
    // === ERFOLG ===
    function handleSuccess() {
        state = 'success';
        
        // Alle Segmente aufleuchten lassen
        document.querySelectorAll('.rs-segment').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('rs-solved');
            }, i * 100);
        });
        
        setTimeout(() => {
            const overlay = document.getElementById('rsSuccessOverlay');
            if (overlay) {
                overlay.classList.add('rs-visible');
            }
            
            if (typeof solveMinigame === 'function') {
                solveMinigame(4, '🪜 Treppen-Schlüssel');
            }
        }, 800);
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function reset() {
        init();
    }
    
    return {
        init,
        reset
    };
})();

function initStaircase() {
    rotatingStairs.init();
}
