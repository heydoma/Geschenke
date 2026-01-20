// ============================================================================
// ESCAPE ROOM - CONTROLS
// Die Verbotene Abteilung - Movement, Collision, Input, Interaction
// ============================================================================

// ============================================================================
// COLLISION DETECTION
// ============================================================================

// Get floor height at a given XZ position by finding the highest walkable surface
function getFloorHeight(x, z) {
    let floorY = 0;  // Default ground floor
    const playerFeet = playerPosition.y - CONFIG.player.height;
    const stepUp = CONFIG.player.stepHeight;  // How high we can step up
    
    for (const box of colliders) {
        // Check if we're within the XZ bounds of this collider
        if (x > box.min.x && x < box.max.x && z > box.min.z && z < box.max.z) {
            const surfaceY = box.max.y;
            const boxHeight = box.max.y - box.min.y;
            
            // Only consider thin surfaces as walkable floors (not walls)
            if (boxHeight > 0.5) continue;
            
            // Accept any surface that is:
            // - At or below current feet + step height (can step up to)
            // - Higher than previously found floor (find the highest valid one)
            // This allows stepping DOWN onto lower surfaces AND stepping UP
            if (surfaceY <= playerFeet + stepUp + 0.5 && surfaceY > floorY) {
                floorY = surfaceY;
            }
        }
    }
    
    return floorY;
}

function checkCollision(newPos) {
    const radius = CONFIG.player.radius;
    const feetY = newPos.y - CONFIG.player.height;
    
    for (const box of colliders) {
        const minX = box.min.x - radius;
        const maxX = box.max.x + radius;
        const minZ = box.min.z - radius;
        const maxZ = box.max.z + radius;
        
        // Check XZ overlap
        if (newPos.x > minX && newPos.x < maxX && newPos.z > minZ && newPos.z < maxZ) {
            const boxHeight = box.max.y - box.min.y;
            
            // If this is a thin surface (floor/stair) that we can stand ON, don't block
            if (boxHeight < 0.5 && Math.abs(box.max.y - feetY) < CONFIG.player.stepHeight) {
                continue;  // This is a walkable surface, not a wall
            }
            
            // Check vertical overlap (player body vs collider)
            if (feetY < box.max.y && newPos.y > box.min.y) {
                return true;  // Blocked
            }
        }
    }
    
    return false;
}

function resolveCollision(currentPos, desiredPos) {
    const result = desiredPos.clone();
    
    // Try X movement only
    const testX = new THREE.Vector3(desiredPos.x, currentPos.y, currentPos.z);
    if (!checkCollision(testX)) {
        result.x = desiredPos.x;
    } else {
        result.x = currentPos.x;
    }
    
    // Try Z movement only
    const testZ = new THREE.Vector3(result.x, currentPos.y, desiredPos.z);
    if (!checkCollision(testZ)) {
        result.z = desiredPos.z;
    } else {
        result.z = currentPos.z;
    }
    
    return result;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
    if (!gameStarted) return;
    
    // When minigame is open, only ESC works
    if (isMinigameOpen) {
        if (e.code === 'Escape') {
            closeCurrentMinigame();
        }
        return;
    }
    
    switch(e.code) {
        case 'KeyW': case 'ArrowUp': moveForward = true; break;
        case 'KeyS': case 'ArrowDown': moveBackward = true; break;
        case 'KeyA': case 'ArrowLeft': moveLeft = true; break;
        case 'KeyD': case 'ArrowRight': moveRight = true; break;
        case 'ShiftLeft': case 'ShiftRight':
            if (stamina > CONFIG.stamina.minToSprint) isSprinting = true;
            break;
        case 'KeyE': interact(); break;
        case 'Escape':
            if (bookPopup.classList.contains('visible')) {
                bookPopup.classList.remove('visible');
            }
            break;
    }
}

function closeCurrentMinigame() {
    for (let i = 1; i <= 8; i++) {
        const modal = document.getElementById('minigame' + i);
        if (modal && (modal.classList.contains('active') || modal.style.display !== 'none')) {
            doCloseMinigame(i);
            break;
        }
    }
}

function doCloseMinigame(num) {
    const modal = document.getElementById('minigame' + num);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    isMinigameOpen = false;
}

function onKeyUp(e) {
    switch(e.code) {
        case 'KeyW': case 'ArrowUp': moveForward = false; break;
        case 'KeyS': case 'ArrowDown': moveBackward = false; break;
        case 'KeyA': case 'ArrowLeft': moveLeft = false; break;
        case 'KeyD': case 'ArrowRight': moveRight = false; break;
        case 'ShiftLeft': case 'ShiftRight': isSprinting = false; break;
    }
}

function onClick(e) {
    if (!gameStarted) return;
    
    if (bookPopup.classList.contains('visible')) {
        bookPopup.classList.remove('visible');
        return;
    }
    
    if (!isPointerLocked && e.target.id === 'game-canvas') {
        document.body.requestPointerLock();
        return;
    }
    
    if (currentTarget) {
        interact();
    }
}

function onMouseMove(e) {
    if (!gameStarted || !isPointerLocked) return;
    
    const sensitivity = CONFIG.movement.mouseSensitivity;
    euler.y -= e.movementX * sensitivity;
    euler.x -= e.movementY * sensitivity;
    euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, euler.x));
    
    camera.quaternion.setFromEuler(euler);
}

function onPointerLockChange() {
    isPointerLocked = document.pointerLockElement === document.body;
    crosshair.style.display = isPointerLocked ? 'block' : 'none';
}

// ============================================================================
// INTERACTION
// ============================================================================
function interact() {
    if (!currentTarget) return;
    
    const type = currentTarget.userData.type;
    const game = currentTarget.userData.game;
    
    if (type === 'fireplace') {
        intensifyFire();
        playSound(180, 'sawtooth', 0.6, 0.08);
        return;
    }
    
    if (type === 'orb') {
        pulseOrb();
        playSound(440, 'sine', 0.8, 0.15);
    }
    
    if (game) {
        document.exitPointerLock();
        isMinigameOpen = true;
        openMinigame(game);
    }
}

function intensifyFire() {
    const original = fireLight.intensity;
    fireLight.intensity = 6;
    fireLight.color.setHex(0xff8844);
    
    setTimeout(() => {
        fireLight.intensity = original;
        fireLight.color.setHex(0xff6622);
    }, 600);
}

function pulseOrb() {
    if (!orbGlow) return;
    
    const original = orbGlow.material.opacity;
    orbGlow.material.opacity = 0.5;
    orbLight.intensity = 2.5;
    
    setTimeout(() => {
        orbGlow.material.opacity = original;
        orbLight.intensity = CONFIG.lighting.orbIntensity;
    }, 800);
}

function playSound(freq, type, duration, volume = 0.2) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// ============================================================================
// SETTINGS
// ============================================================================
function setupSettings() {
    document.getElementById('walkSpeedSlider').addEventListener('input', (e) => {
        CONFIG.movement.walkSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('sensitivitySlider').addEventListener('input', (e) => {
        CONFIG.movement.mouseSensitivity = 0.001 * parseFloat(e.target.value);
    });
    
    document.getElementById('bloomSlider').addEventListener('input', (e) => {
        renderer.toneMappingExposure = 0.5 + parseFloat(e.target.value) * 0.3;
    });
    
    document.getElementById('fogSlider').addEventListener('input', (e) => {
        scene.fog.far = parseFloat(e.target.value);
    });
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('visible');
}

// ============================================================================
// MOVEMENT UPDATE
// ============================================================================
function updateMovement(delta, time) {
    if (!isPointerLocked) return;
    
    const isMoving = moveForward || moveBackward || moveLeft || moveRight;
    const canSprint = isSprinting && stamina > 0 && isMoving;
    const targetSpeed = canSprint ? CONFIG.movement.sprintSpeed : CONFIG.movement.walkSpeed;
    
    // Input direction
    inputDirection.z = Number(moveForward) - Number(moveBackward);
    inputDirection.x = Number(moveRight) - Number(moveLeft);
    inputDirection.normalize();
    
    // Calculate world direction from camera
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();
    
    // Target velocity
    const targetVelocity = new THREE.Vector3();
    targetVelocity.addScaledVector(forward, inputDirection.z);
    targetVelocity.addScaledVector(right, inputDirection.x);
    targetVelocity.normalize().multiplyScalar(targetSpeed);
    
    // Smooth acceleration/deceleration
    const accel = isMoving ? CONFIG.movement.acceleration : CONFIG.movement.deceleration;
    velocity.x += (targetVelocity.x - velocity.x) * accel * delta;
    velocity.z += (targetVelocity.z - velocity.z) * accel * delta;
    
    // Calculate new position
    const newPos = playerPosition.clone();
    newPos.x += velocity.x * delta;
    newPos.z += velocity.z * delta;
    
    // Collision resolution (horizontal)
    const resolvedPos = resolveCollision(playerPosition, newPos);
    playerPosition.x = resolvedPos.x;
    playerPosition.z = resolvedPos.z;
    
    // Floor height detection (for stairs/ramps)
    const floorY = getFloorHeight(playerPosition.x, playerPosition.z);
    const targetY = floorY + CONFIG.player.height;
    
    // Smooth Y transition for stairs
    const yDiff = targetY - playerPosition.y;
    if (Math.abs(yDiff) > 0.01) {
        // Going up stairs is faster, going down is gravity-like
        const ySpeed = yDiff > 0 ? 8.0 : 12.0;
        playerPosition.y += yDiff * ySpeed * delta;
        // Clamp to prevent overshoot
        if (yDiff > 0 && playerPosition.y > targetY) playerPosition.y = targetY;
        if (yDiff < 0 && playerPosition.y < targetY) playerPosition.y = targetY;
    }
    
    // Head bob
    if (CONFIG.headBob.enabled && isMoving && velocity.length() > 0.5) {
        headBobTime += delta * (canSprint ? CONFIG.headBob.sprintFrequency : CONFIG.headBob.walkFrequency);
        const amplitude = canSprint ? CONFIG.headBob.sprintAmplitude : CONFIG.headBob.walkAmplitude;
        const bobY = Math.sin(headBobTime) * amplitude;
        const bobX = Math.cos(headBobTime * 0.5) * amplitude * 0.5;
        
        camera.position.set(
            playerPosition.x + bobX,
            playerPosition.y + bobY,
            playerPosition.z
        );
    } else {
        // Smooth return to base position
        camera.position.x += (playerPosition.x - camera.position.x) * 5 * delta;
        camera.position.y += (playerPosition.y - camera.position.y) * 5 * delta;
        camera.position.z += (playerPosition.z - camera.position.z) * 5 * delta;
    }
}

function updateStamina(delta) {
    const isMoving = moveForward || moveBackward || moveLeft || moveRight;
    
    if (isSprinting && isMoving && stamina > 0) {
        stamina -= CONFIG.stamina.drainRate * delta;
        stamina = Math.max(0, stamina);
        staminaBar.classList.add('visible');
        
        if (stamina <= 0) {
            isSprinting = false;
        }
    } else if (stamina < CONFIG.stamina.max) {
        stamina += CONFIG.stamina.regenRate * delta;
        stamina = Math.min(CONFIG.stamina.max, stamina);
        
        if (stamina >= CONFIG.stamina.max) {
            staminaBar.classList.remove('visible');
        }
    }
    
    staminaFill.style.width = `${(stamina / CONFIG.stamina.max) * 100}%`;
}

function updateInteractionCheck() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0 && intersects[0].distance < 3.5) {
        const obj = intersects[0].object;
        if (!obj.userData.hidden) {
            currentTarget = obj;
            interactionPrompt.innerHTML = `<kbd>E</kbd> ${obj.userData.hint}`;
            interactionPrompt.classList.add('visible');
            return;
        }
    }
    
    currentTarget = null;
    interactionPrompt.classList.remove('visible');
}
