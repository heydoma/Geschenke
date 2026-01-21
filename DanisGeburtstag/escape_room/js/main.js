// ============================================================================
// ESCAPE ROOM - MAIN
// Die Verbotene Abteilung - Initialization and Game Loop
// ============================================================================

// === GLOBALS ===
let scene, camera, renderer;
let clock = new THREE.Clock();
let gameStarted = false;
let isPointerLocked = false;

// Movement state
const velocity = new THREE.Vector3();
const inputDirection = new THREE.Vector3();
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
let moveForward = false, moveBackward = false;
let moveLeft = false, moveRight = false;
let isSprinting = false;
let stamina = CONFIG.stamina.max;
let headBobTime = 0;
let baseEyeHeight = CONFIG.player.height;

// Colliders
const colliders = [];
const playerPosition = new THREE.Vector3(
    CONFIG.player.startX, 
    CONFIG.player.startY, 
    CONFIG.player.startZ
);

// Objects
let fireParticles, dustParticles, emberParticles, orbDustParticles;
let fireLight, moonLight, orbLight;
let orbGlow;
let interactiveObjects = [];
let currentTarget = null;
let bookInstances = null;
let floatingCandles = [];
let isMinigameOpen = false;

// Audio
let audioCtx = null;

// UI Elements (initialized after DOM ready)
let interactionPrompt, staminaBar, staminaFill, bookPopup, crosshair;

// Raycaster
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3();

// ============================================================================
// INITIALIZATION
// ============================================================================
function init() {
    // Get UI elements
    interactionPrompt = document.getElementById('interactionPrompt');
    staminaBar = document.getElementById('staminaBar');
    staminaFill = document.getElementById('staminaFill');
    bookPopup = document.getElementById('bookPopup');
    crosshair = document.getElementById('crosshair');
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(CONFIG.fog.color, CONFIG.fog.near, CONFIG.fog.far);
    scene.background = new THREE.Color(CONFIG.fog.color);
    
    // Camera
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.copy(playerPosition);
    camera.rotation.y = CONFIG.player.startRotY;
    euler.y = CONFIG.player.startRotY;
    
    // Renderer - optimized for performance
    const canvas = document.getElementById('game-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: false,  // Disabled for performance
        powerPreference: "high-performance",
        stencil: false,
        depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));  // Limit pixel ratio for performance
    renderer.shadowMap.enabled = false;  // Shadows disabled for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;  // Slightly brighter to compensate
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Build scene
    createRoom();
    createLighting();
    createFireplace();
    createBookshelves();
    createDesk();
    createMagicOrb();
    createPotionShelf();
    createBells();
    createStairs();
    createMezzanine();
    createProps();
    createDustParticles();
    createFloorFog();
    createFloatingCandles();
    createGodRays();
    
    // Events
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    
    // Settings sliders
    setupSettings();
    
    // Start
    animate();
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================
function animate() {
    requestAnimationFrame(animate);
    
    if (!gameStarted) {
        renderer.render(scene, camera);
        return;
    }
    
    const delta = Math.min(clock.getDelta(), 0.1);
    const time = clock.getElapsedTime();
    
    // Update movement
    updateMovement(delta, time);
    
    // Update stamina
    updateStamina(delta);
    
    // Raycast for interactions
    updateInteractionCheck();
    
    // Update particles
    updateFireParticles(time);
    updateEmberParticles(time, delta);
    updateDustParticles(delta);
    updateOrbDust(time);
    
    // Update lighting
    updateLighting(time);
    
    // Update floating candles
    updateFloatingCandles(time);
    
    renderer.render(scene, camera);
}

// ============================================================================
// GAME CONTROL
// ============================================================================
function startGame() {
    document.getElementById('introOverlay').classList.add('hidden');
    gameStarted = true;
    
    setTimeout(() => {
        interactionPrompt.innerHTML = 'Klicke um die Maussteuerung zu aktivieren';
        interactionPrompt.classList.add('visible');
        setTimeout(() => interactionPrompt.classList.remove('visible'), 3000);
    }, 500);
}

// ============================================================================
// MINIGAME OVERRIDES (after minigames-core.js loads)
// ============================================================================
window.addEventListener('load', () => {
    init();
    
    // Override openMinigame
    const origOpen = window.openMinigame;
    window.openMinigame = function(num) {
        if (typeof num === 'string') {
            const slotIndex = parseInt(num.replace(/slot[LR]/, '')) - 1;
            num = num.startsWith('slotL') ? slotIndex + 1 : slotIndex + 5;
        }
        
        if (gameState.solved[num - 1]) {
            showMessage('Dieses Rätsel wurde bereits gelöst! ✨');
            return;
        }
        
        const modal = document.getElementById('minigame' + num);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            isMinigameOpen = true;
            initMinigame(num);
        }
    };
    
    // Override closeMinigame
    window.closeMinigame = function(num) {
        const modal = document.getElementById('minigame' + num);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        isMinigameOpen = false;
    };
    
    // Add click handlers to close buttons
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.minigame-modal');
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
            isMinigameOpen = false;
        });
    });
    
    // Override solveMinigame
    const origSolve = window.solveMinigame;
    if (origSolve) {
        window.solveMinigame = function(num, artifact, number = null) {
            origSolve(num, artifact, number);
            
            const gem = document.querySelector(`.progress-gem[data-game="${num}"]`);
            if (gem) gem.classList.add('active');
            
            // === REVEAL MAP PATH for this puzzle ===
            if (typeof revealMapPath === 'function') {
                revealMapPath(num);
            }
            
            let solved = 0;
            for (let i = 1; i <= 7; i++) {
                if (gameState.solved[i - 1]) solved++;
            }
            
            if (solved >= 7) {
                const pensieve = interactiveObjects.find(o => o.userData.type === 'pensieve');
                if (pensieve) {
                    pensieve.userData.hidden = false;
                    showMessage('✨ Das Denkarium erwacht...', 'success');
                }
            }
        };
    }
});
