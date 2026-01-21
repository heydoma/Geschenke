// ============================================================================
// MARAUDER'S MAP - Die Karte des Rumtreibers
// Animated footsteps from bedroom to living room (Harry Potter style)
// Only unlocks after all 7 puzzles are solved!
// ============================================================================

let mapAnimationRunning = false;
let footstepElements = [];
let mapUnlocked = false;

function openMaraudersMap() {
    const modal = document.getElementById('maraudersMapModal');
    if (modal) {
        modal.style.display = 'flex';
        isMinigameOpen = true;
        
        // Check if all puzzles are solved
        checkMapUnlockStatus();
    }
}

function checkMapUnlockStatus() {
    // Count solved puzzles (gameState is from minigames-core.js)
    let solvedCount = 0;
    if (typeof gameState !== 'undefined' && gameState.solved) {
        for (let i = 0; i < 7; i++) {
            if (gameState.solved[i]) solvedCount++;
        }
    }
    
    const footstepsContainer = document.getElementById('footstepsContainer');
    const mapImage = document.getElementById('mapImage');
    const footstepsLabel = document.getElementById('footstepsLabel');
    const lockedMessage = document.getElementById('mapLockedMessage');
    const unlockSpell = document.getElementById('mapUnlockSpell');
    
    if (solvedCount >= 7) {
        // ALL PUZZLES SOLVED - Reveal the map!
        if (!mapUnlocked) {
            mapUnlocked = true;
            
            // Hide locked message
            if (lockedMessage) lockedMessage.style.display = 'none';
            
            // Show and animate the unlock spell
            if (unlockSpell) {
                unlockSpell.style.display = 'block';
                unlockSpell.style.opacity = '0';
                
                // Fade in spell text
                setTimeout(() => {
                    unlockSpell.style.opacity = '1';
                }, 100);
                
                // After showing spell, fade it out and start footsteps
                setTimeout(() => {
                    unlockSpell.style.opacity = '0';
                    setTimeout(() => {
                        unlockSpell.style.display = 'none';
                        // Show map and start animation
                        if (mapImage) mapImage.style.filter = 'sepia(0.3) contrast(1.1)';
                        startFootstepsAnimation();
                    }, 1000);
                }, 3000);
            }
        } else {
            // Already unlocked, just show footsteps
            if (lockedMessage) lockedMessage.style.display = 'none';
            if (unlockSpell) unlockSpell.style.display = 'none';
            startFootstepsAnimation();
        }
    } else {
        // NOT ALL PUZZLES SOLVED - Show locked message
        if (lockedMessage) {
            lockedMessage.style.display = 'flex';
            // Update counter
            const counter = document.getElementById('puzzleCounter');
            if (counter) counter.textContent = `${solvedCount}/7 Rätsel gelöst`;
        }
        if (unlockSpell) unlockSpell.style.display = 'none';
        if (footstepsContainer) footstepsContainer.innerHTML = '';
        if (footstepsLabel) footstepsLabel.style.opacity = '0';
        // Dim the map
        if (mapImage) mapImage.style.filter = 'sepia(0.5) contrast(0.8) brightness(0.6)';
    }
}

function closeMaraudersMap() {
    const modal = document.getElementById('maraudersMapModal');
    if (modal) {
        modal.style.display = 'none';
    }
    isMinigameOpen = false;
    mapAnimationRunning = false;
    clearFootsteps();
}

function clearFootsteps() {
    const container = document.getElementById('footstepsContainer');
    if (container) {
        container.innerHTML = '';
    }
    footstepElements = [];
    const label = document.getElementById('footstepsLabel');
    if (label) label.style.opacity = '0';
}

function startFootstepsAnimation() {
    if (mapAnimationRunning) return;
    if (!mapUnlocked) return; // Don't start if not unlocked
    
    mapAnimationRunning = true;
    clearFootsteps();
    
    // Path from Schlafzimmer (bedroom) to Wohnzimmer (living room)
    // Coordinates are percentages (x%, y%) of the map image
    // Adjust these values to match your karte.png layout!
    const path = [
        // Schlafzimmer (start - top area)
        { x: 70, y: 20 },
        { x: 68, y: 24 },
        { x: 65, y: 28 },
        // Durch die Tür in den Flur
        { x: 60, y: 32 },
        { x: 55, y: 36 },
        { x: 50, y: 40 },
        // Flur entlang
        { x: 45, y: 44 },
        { x: 40, y: 48 },
        { x: 35, y: 52 },
        // Richtung Wohnzimmer
        { x: 32, y: 56 },
        { x: 30, y: 60 },
        { x: 28, y: 64 },
        // Wohnzimmer (Ziel)
        { x: 27, y: 68 },
        { x: 26, y: 72 },
        { x: 25, y: 75 },
    ];
    
    animateFootstepsAlongPath(path, 0);
}

function animateFootstepsAlongPath(path, index) {
    if (!mapAnimationRunning || index >= path.length) {
        // Animation complete - restart after delay
        if (mapAnimationRunning) {
            setTimeout(() => {
                clearFootsteps();
                setTimeout(() => startFootstepsAnimation(), 1000);
            }, 2000);
        }
        return;
    }
    
    const point = path[index];
    const isLeft = index % 2 === 0;
    
    // Calculate angle to next point for rotation
    let angle = 0;
    if (index < path.length - 1) {
        const next = path[index + 1];
        angle = Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI) + 90;
    } else if (index > 0) {
        const prev = path[index - 1];
        angle = Math.atan2(point.y - prev.y, point.x - prev.x) * (180 / Math.PI) + 90;
    }
    
    createFootstep(point.x, point.y, isLeft, angle);
    updateLabel(point.x, point.y);
    
    // Fade out old footsteps (keep only last 6 visible)
    if (footstepElements.length > 6) {
        const oldStep = footstepElements.shift();
        if (oldStep) {
            oldStep.style.opacity = '0';
            setTimeout(() => oldStep.remove(), 300);
        }
    }
    
    // Continue to next step
    setTimeout(() => animateFootstepsAlongPath(path, index + 1), 400);
}

function createFootstep(x, y, isLeft, angle) {
    const container = document.getElementById('footstepsContainer');
    if (!container) return;
    
    const step = document.createElement('div');
    step.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        transform: translate(-50%, -50%) rotate(${angle}deg) ${isLeft ? 'scaleX(-1)' : ''};
        font-size: 16px;
        opacity: 0;
        transition: opacity 0.3s ease-in;
        filter: sepia(1) brightness(0.4);
    `;
    
    // SVG footprint icon (simple foot shape like in Harry Potter)
    step.innerHTML = `
        <svg width="12" height="18" viewBox="0 0 12 18" fill="#2a1a0a">
            <ellipse cx="6" cy="13" rx="4" ry="5"/>
            <circle cx="3" cy="4" r="1.5"/>
            <circle cx="5.5" cy="2.5" r="1.5"/>
            <circle cx="8" cy="2.5" r="1.5"/>
            <circle cx="10" cy="4.5" r="1.3"/>
        </svg>
    `;
    
    container.appendChild(step);
    footstepElements.push(step);
    
    // Fade in
    requestAnimationFrame(() => {
        step.style.opacity = '0.8';
    });
}

function updateLabel(x, y) {
    const label = document.getElementById('footstepsLabel');
    if (label) {
        label.style.left = (x + 3) + '%';
        label.style.top = (y - 2) + '%';
        label.style.opacity = '1';
    }
}

// Make functions globally available
window.openMaraudersMap = openMaraudersMap;
window.closeMaraudersMap = closeMaraudersMap;
