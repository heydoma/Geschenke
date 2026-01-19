// ========================================
// MINIGAME 5: INVISIBLE INK
// Aufdecken und Raten!
// ========================================

const invisibleInk = (() => {
    // === ZUSTAND ===
    let canvas = null;
    let ctx = null;
    let revealed = [];      // 2D Array: wie viel aufgedeckt (0-100)
    let burned = [];        // 2D Array: verbrannte Stellen (0-100)
    let mousePos = { x: -1, y: -1 };
    let isActive = false;
    let animationId = null;
    let guessInput = null;
    let solved = false;
    
    // Grid: 40x40 Zellen
    const GRID = 40;
    const CELL = 10; // 400 / 40
    
    // Die Lösung - was das Bild zeigt
    const SOLUTION = "HEILIGTÜMER";
    const SOLUTION_ALT = ["HEILIGTÜMER", "HEILIGTUEMER", "HEILIGTÜMER DES TODES", "DEATHLY HALLOWS", "HALLOWS", "DREIECK"]; // Alternative Schreibweisen
    
    // Das versteckte Muster - Heiligtümer des Todes Symbol
    const PATTERN = createPattern();
    
    function createPattern() {
        const p = Array(GRID).fill(0).map(() => Array(GRID).fill(0));
        
        // Hilfsfunktion: Punkt mit Dicke zeichnen
        function dot(x, y, r = 1) {
            for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                    if (dx*dx + dy*dy <= r*r) {
                        const px = Math.round(x) + dx;
                        const py = Math.round(y) + dy;
                        if (px >= 0 && px < GRID && py >= 0 && py < GRID) {
                            p[py][px] = 1;
                        }
                    }
                }
            }
        }
        
        // Linie zeichnen
        function line(x1, y1, x2, y2, r = 1) {
            const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1)) * 2;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                dot(x1 + (x2-x1)*t, y1 + (y2-y1)*t, r);
            }
        }
        
        // === HEILIGTÜMER DES TODES ===
        // Zentriert bei (20, 20), Größe angepasst
        
        const cx = 20; // Zentrum X
        const cy = 22; // Zentrum Y (etwas nach unten)
        const size = 14; // Größe des Dreiecks
        
        // DREIECK (Elder Wand's power)
        // Spitze oben
        const topY = cy - size;
        const bottomY = cy + size * 0.7;
        const leftX = cx - size * 0.85;
        const rightX = cx + size * 0.85;
        
        // Linke Seite des Dreiecks
        line(cx, topY, leftX, bottomY, 1);
        // Rechte Seite des Dreiecks  
        line(cx, topY, rightX, bottomY, 1);
        // Untere Seite des Dreiecks
        line(leftX, bottomY, rightX, bottomY, 1);
        
        // KREIS (Resurrection Stone)
        const circleY = cy + 2;
        const circleR = 7;
        for (let a = 0; a < 360; a += 4) {
            const rad = a * Math.PI / 180;
            dot(cx + circleR * Math.cos(rad), circleY + circleR * Math.sin(rad), 1);
        }
        
        // VERTIKALE LINIE (Elder Wand)
        line(cx, topY, cx, bottomY, 1);
        
        return p;
    }
    
    // === INIT ===
    function init() {
        canvas = document.getElementById('parchmentCanvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        
        // Reset arrays
        revealed = Array(GRID).fill(0).map(() => Array(GRID).fill(0));
        burned = Array(GRID).fill(0).map(() => Array(GRID).fill(0));
        
        isActive = true;
        
        // Events
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.x = Math.floor((e.clientX - rect.left) / CELL);
            mousePos.y = Math.floor((e.clientY - rect.top) / CELL);
        };
        canvas.onmouseleave = () => {
            mousePos = { x: -1, y: -1 };
        };
        
        // Start loop
        if (animationId) cancelAnimationFrame(animationId);
        loop();
    }
    
    // === GAME LOOP ===
    function loop() {
        if (!isActive) return;
        
        update();
        render();
        
        animationId = requestAnimationFrame(loop);
    }
    
    function update() {
        // Aufdecken & Verbrennen: Wenn Maus über einer Zelle ist
        if (mousePos.x >= 0 && mousePos.y >= 0) {
            const revealRadius = 3; // Aufdeckradius
            const burnRadius = 1.5; // Verbrennradius (kleiner, direkt unter Kerze)
            
            for (let dy = -4; dy <= 4; dy++) {
                for (let dx = -4; dx <= 4; dx++) {
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const px = mousePos.x + dx;
                    const py = mousePos.y + dy;
                    
                    if (px >= 0 && px < GRID && py >= 0 && py < GRID) {
                        // Aufdecken im größeren Radius
                        if (dist <= revealRadius) {
                            const strength = (1 - dist / revealRadius) * 6;
                            revealed[py][px] = Math.min(100, revealed[py][px] + strength);
                        }
                        
                        // VERBRENNEN im kleinen Radius direkt unter der Kerze
                        if (dist <= burnRadius && burned[py][px] < 100) {
                            const burnStrength = (1 - dist / burnRadius) * 2.5;
                            burned[py][px] = Math.min(100, burned[py][px] + burnStrength);
                        }
                    }
                }
            }
        }
        
        // VERBLASSEN: Aufgedeckte Bereiche kühlen SEHR LANGSAM ab
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (revealed[y][x] > 0) {
                    // Sehr langsames Verblassen
                    revealed[y][x] = Math.max(0, revealed[y][x] - 0.02);
                }
            }
        }
    }
    
    function checkGuess(guess) {
        if (solved) return;
        
        const normalized = guess.toUpperCase().trim();
        
        if (normalized === SOLUTION || SOLUTION_ALT.some(alt => normalized === alt.toUpperCase())) {
            solved = true;
            handleSuccess();
            return true;
        } else {
            // Falsche Antwort
            if (typeof showMessage === 'function') {
                showMessage('❌ Das ist nicht richtig... Schau nochmal genau hin!', 'error');
            }
            return false;
        }
    }
    
    // === RENDER ===
    function render() {
        // Pergament Hintergrund
        ctx.fillStyle = '#f5e6d3';
        ctx.fillRect(0, 0, 400, 400);
        
        // Alte Pergament-Textur
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = '#8b7355';
            ctx.fillRect((i * 47) % 400, (i * 31) % 400, 3, 3);
        }
        ctx.globalAlpha = 1;
        
        // Zellen zeichnen
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                const rev = revealed[y][x];
                const burn = burned[y][x];
                const hasInk = PATTERN[y][x] === 1;
                
                // Wärme-Glow (wo aufgedeckt wird, aber nicht verbrannt)
                if (rev > 0 && burn < 50) {
                    const warmth = (rev / 100) * 0.3 * (1 - burn / 100);
                    ctx.fillStyle = `rgba(255, 200, 150, ${warmth})`;
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
                
                // Tinte zeigen wenn aufgedeckt UND nicht verbrannt
                if (hasInk && rev > 20 && burn < 60) {
                    const alpha = Math.min(rev / 60, 1) * 0.95 * (1 - burn / 80);
                    ctx.fillStyle = `rgba(40, 25, 15, ${alpha})`;
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
                
                // VERBRANNTE STELLEN - schwarz/braun
                if (burn > 20) {
                    const burnAlpha = Math.min(burn / 60, 1) * 0.9;
                    // Gradient von braun zu schwarz
                    const r = Math.round(60 - burn * 0.5);
                    const g = Math.round(40 - burn * 0.35);
                    const b = Math.round(20 - burn * 0.15);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${burnAlpha})`;
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
            }
        }
        
        // Kerzen-Cursor
        if (mousePos.x >= 0 && mousePos.y >= 0) {
            const px = mousePos.x * CELL + CELL / 2;
            const py = mousePos.y * CELL + CELL / 2;
            
            // Wärme-Glow
            const grad = ctx.createRadialGradient(px, py, 0, px, py, 35);
            grad.addColorStop(0, 'rgba(255, 220, 150, 0.5)');
            grad.addColorStop(0.5, 'rgba(255, 180, 100, 0.2)');
            grad.addColorStop(1, 'rgba(255, 150, 50, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, 35, 0, Math.PI * 2);
            ctx.fill();
            
            // Kerze
            ctx.font = '26px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🕯️', px, py - 12);
        }
        
        // Fortschrittsbalken
        renderProgress();
    }
    
    function renderProgress() {
        // Hinweis unten
        ctx.fillStyle = 'rgba(50,30,20,0.7)';
        ctx.font = 'italic 13px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Was siehst du? Gib deine Antwort unten ein...', 200, 390);
    }
    
    // === ERFOLG ===
    function handleSuccess() {
        isActive = false;
        if (animationId) cancelAnimationFrame(animationId);
        
        // Finales Bild: Alles golden aufleuchten
        ctx.fillStyle = '#f5e6d3';
        ctx.fillRect(0, 0, 400, 400);
        
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (PATTERN[y][x] === 1) {
                    ctx.fillStyle = 'rgba(180, 140, 60, 0.95)';
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
            }
        }
        
        // Golden glow
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 30;
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.fillRect(0, 0, 400, 400);
        ctx.shadowBlur = 0;
        
        if (typeof showMessage === 'function') {
            showMessage('✨ Die Heiligtümer des Todes!', 'success');
        }
        
        setTimeout(() => {
            if (typeof solveMinigame === 'function') {
                solveMinigame(5, '△ Heiligtümer');
            }
        }, 1500);
    }
    
    // === RESET ===
    function reset() {
        isActive = false;
        solved = false;
        if (animationId) cancelAnimationFrame(animationId);
        if (canvas) {
            canvas.onmousemove = null;
            canvas.onmouseleave = null;
        }
        // Eingabefeld leeren
        const input = document.getElementById('inkGuessInput');
        if (input) input.value = '';
        init();
    }
    
    return { init, reset, checkGuess };
})();

function initInvisibleInk() {
    invisibleInk.init();
}

function checkInvisibleInkGuess(guess) {
    return invisibleInk.checkGuess(guess);
}
