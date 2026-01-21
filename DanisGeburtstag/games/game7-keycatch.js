// ========================================
// MINIGAME 7: FLIEGENDE SCHLÜSSEL
// Fang den goldenen Schlüssel wie in der verbotenen Kammer!
// ========================================

const keyCatch = (() => {
    // === KONSTANTEN ===
    const TOTAL_KEYS = 25;  // Viele ablenkende Schlüssel
    const CATCH_TIME = 20000;  // 20 Sekunden Zeit
    const KEY_SPEED_MIN = 1;
    const KEY_SPEED_MAX = 4;
    
    // === ZUSTAND ===
    let state = 'idle'; // idle, playing, success, failed
    let keys = [];
    let goldenKeyIndex = -1;
    let timeRemaining = CATCH_TIME;
    let animationFrame = null;
    let lastTime = 0;
    
    // === INIT ===
    function init() {
        state = 'playing';
        timeRemaining = CATCH_TIME;
        keys = [];
        
        // Container Größe ermitteln
        const container = document.getElementById('keyContainer');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const width = rect.width || 500;
        const height = rect.height || 350;
        
        // Zufällig einen goldenen Schlüssel bestimmen
        goldenKeyIndex = Math.floor(Math.random() * TOTAL_KEYS);
        
        // Schlüssel erstellen
        for (let i = 0; i < TOTAL_KEYS; i++) {
            const isGolden = i === goldenKeyIndex;
            keys.push({
                x: Math.random() * (width - 40),
                y: Math.random() * (height - 40),
                vx: (Math.random() - 0.5) * (KEY_SPEED_MAX - KEY_SPEED_MIN) * 2 + KEY_SPEED_MIN * Math.sign(Math.random() - 0.5),
                vy: (Math.random() - 0.5) * (KEY_SPEED_MAX - KEY_SPEED_MIN) * 2 + KEY_SPEED_MIN * Math.sign(Math.random() - 0.5),
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                scale: isGolden ? 1.3 : 0.8 + Math.random() * 0.4,
                isGolden: isGolden,
                // Goldener Schlüssel hat besondere Merkmale
                color: isGolden ? '#FFD700' : '#' + ['8B7355', 'A0522D', 'CD853F', '696969', '808080', 'B8860B'][Math.floor(Math.random() * 6)],
                wingSpeed: 3 + Math.random() * 3
            });
        }
        
        render();
        startGameLoop();
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('keyContainer');
        if (!container) return;
        
        container.innerHTML = '';
        container.style.cssText = `
            position: relative;
            width: 100%;
            height: 350px;
            background: linear-gradient(to bottom, #1a1a2e, #0f0f1a);
            border-radius: 10px;
            overflow: hidden;
            cursor: crosshair;
        `;
        
        // Timer anzeigen
        const timer = document.createElement('div');
        timer.id = 'keyTimer';
        timer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            color: ${timeRemaining < 5000 ? '#ff4444' : '#d4c4a8'};
            font-size: 18px;
            font-family: Georgia, serif;
            z-index: 10;
            text-shadow: 0 0 10px rgba(0,0,0,0.8);
        `;
        timer.textContent = `⏱️ ${Math.ceil(timeRemaining / 1000)}s`;
        container.appendChild(timer);
        
        // Hinweis
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: absolute;
            top: 10px;
            left: 15px;
            color: #888;
            font-size: 12px;
            z-index: 10;
        `;
        hint.textContent = '🔑 Fange den GOLDENEN Schlüssel!';
        container.appendChild(hint);
        
        // Schlüssel rendern
        keys.forEach((key, index) => {
            const keyEl = document.createElement('div');
            keyEl.className = 'flying-key';
            keyEl.dataset.index = index;
            keyEl.style.cssText = `
                position: absolute;
                left: ${key.x}px;
                top: ${key.y}px;
                font-size: ${24 * key.scale}px;
                transform: rotate(${key.rotation}deg);
                cursor: pointer;
                transition: transform 0.1s ease;
                filter: ${key.isGolden ? 'drop-shadow(0 0 8px gold)' : 'none'};
                z-index: ${key.isGolden ? 5 : 1};
            `;
            
            // Schlüssel mit Flügeln
            keyEl.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <span style="color: ${key.color}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">🗝️</span>
                    <span class="key-wing-left" style="
                        position: absolute;
                        left: -8px;
                        top: -2px;
                        font-size: ${12 * key.scale}px;
                        animation: wingFlap${key.isGolden ? 'Fast' : ''} ${key.wingSpeed / 10}s infinite;
                    ">🪽</span>
                    <span class="key-wing-right" style="
                        position: absolute;
                        right: -8px;
                        top: -2px;
                        font-size: ${12 * key.scale}px;
                        transform: scaleX(-1);
                        animation: wingFlap${key.isGolden ? 'Fast' : ''} ${key.wingSpeed / 10}s infinite reverse;
                    ">🪽</span>
                </div>
            `;
            
            keyEl.onclick = () => handleKeyClick(index);
            
            container.appendChild(keyEl);
        });
        
        // CSS Animation für Flügel
        if (!document.getElementById('keyAnimStyles')) {
            const style = document.createElement('style');
            style.id = 'keyAnimStyles';
            style.textContent = `
                @keyframes wingFlap {
                    0%, 100% { transform: rotate(-20deg); }
                    50% { transform: rotate(20deg); }
                }
                @keyframes wingFlapFast {
                    0%, 100% { transform: rotate(-30deg); }
                    50% { transform: rotate(30deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // === GAME LOOP ===
    function startGameLoop() {
        lastTime = performance.now();
        gameLoop();
    }
    
    function gameLoop() {
        if (state !== 'playing') return;
        
        const now = performance.now();
        const deltaMs = now - lastTime;
        const delta = deltaMs / 16;  // Normalize to ~60fps
        lastTime = now;
        
        // Timer aktualisieren
        timeRemaining -= deltaMs;
        
        const container = document.getElementById('keyContainer');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const width = rect.width || 500;
        const height = rect.height || 350;
        
        // Schlüssel bewegen
        keys.forEach((key, index) => {
            key.x += key.vx * delta;
            key.y += key.vy * delta;
            key.rotation += key.rotationSpeed * delta;
            
            // Bounce an Wänden
            if (key.x < 0 || key.x > width - 30) {
                key.vx *= -1;
                key.x = Math.max(0, Math.min(width - 30, key.x));
            }
            if (key.y < 0 || key.y > height - 30) {
                key.vy *= -1;
                key.y = Math.max(0, Math.min(height - 30, key.y));
            }
            
            // Goldener Schlüssel bewegt sich unregelmäßiger
            if (key.isGolden && Math.random() < 0.02) {
                key.vx += (Math.random() - 0.5) * 2;
                key.vy += (Math.random() - 0.5) * 2;
                // Geschwindigkeit begrenzen
                const speed = Math.sqrt(key.vx * key.vx + key.vy * key.vy);
                if (speed > KEY_SPEED_MAX * 1.5) {
                    key.vx *= KEY_SPEED_MAX * 1.5 / speed;
                    key.vy *= KEY_SPEED_MAX * 1.5 / speed;
                }
            }
            
            // DOM Element aktualisieren
            const keyEl = container.querySelector(`[data-index="${index}"]`);
            if (keyEl) {
                keyEl.style.left = key.x + 'px';
                keyEl.style.top = key.y + 'px';
                keyEl.style.transform = `rotate(${key.rotation}deg)`;
            }
        });
        
        // Timer DOM aktualisieren
        const timer = document.getElementById('keyTimer');
        if (timer) {
            const seconds = Math.ceil(timeRemaining / 1000);
            timer.textContent = `⏱️ ${seconds}s`;
            timer.style.color = seconds <= 5 ? '#ff4444' : '#d4c4a8';
        }
        
        // Zeit abgelaufen?
        if (timeRemaining <= 0) {
            handleTimeout();
            return;
        }
        
        animationFrame = requestAnimationFrame(gameLoop);
    }
    
    // === EVENT HANDLERS ===
    function handleKeyClick(index) {
        if (state !== 'playing') return;
        
        const key = keys[index];
        
        if (key.isGolden) {
            handleSuccess();
        } else {
            // Falscher Schlüssel - kleines Feedback
            const container = document.getElementById('keyContainer');
            const keyEl = container.querySelector(`[data-index="${index}"]`);
            if (keyEl) {
                keyEl.style.transform += ' scale(0.5)';
                keyEl.style.opacity = '0.3';
                setTimeout(() => {
                    keyEl.style.transform = `rotate(${key.rotation}deg)`;
                    keyEl.style.opacity = '1';
                }, 300);
            }
            
            // Zeitstrafe
            timeRemaining -= 1000;
            
            if (typeof showMessage === 'function') {
                showMessage('❌ Falscher Schlüssel! -1 Sekunde', 'error');
            }
        }
    }
    
    function handleSuccess() {
        state = 'success';
        cancelAnimationFrame(animationFrame);
        
        const container = document.getElementById('keyContainer');
        
        // Alle Schlüssel außer dem goldenen ausblenden
        keys.forEach((key, index) => {
            if (!key.isGolden) {
                const keyEl = container.querySelector(`[data-index="${index}"]`);
                if (keyEl) {
                    keyEl.style.transition = 'opacity 0.5s, transform 0.5s';
                    keyEl.style.opacity = '0';
                    keyEl.style.transform += ' scale(0)';
                }
            }
        });
        
        // Goldenen Schlüssel zentrieren und vergrößern
        const goldenEl = container.querySelector(`[data-index="${goldenKeyIndex}"]`);
        if (goldenEl) {
            goldenEl.style.transition = 'all 0.8s ease';
            goldenEl.style.left = '50%';
            goldenEl.style.top = '50%';
            goldenEl.style.transform = 'translate(-50%, -50%) scale(3) rotate(0deg)';
            goldenEl.style.filter = 'drop-shadow(0 0 30px gold)';
        }
        
        if (typeof showMessage === 'function') {
            showMessage('🔑 Du hast den goldenen Schlüssel gefangen!', 'success');
        }
        
        setTimeout(() => {
            if (typeof solveMinigame === 'function') {
                solveMinigame(2, '🔑 Goldener Schlüssel');  // Game 2!
            }
        }, 1500);
    }
    
    function handleTimeout() {
        state = 'failed';
        cancelAnimationFrame(animationFrame);
        
        if (typeof showMessage === 'function') {
            showMessage('⏰ Zeit abgelaufen! Versuche es nochmal.', 'error');
        }
        
        // Nach kurzer Pause neu starten
        setTimeout(() => {
            init();
        }, 2000);
    }
    
    function reset() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        init();
    }
    
    return { init, reset };
})();

// Globale Funktion für HTML
function initKeyCatch() {
    keyCatch.init();
}
