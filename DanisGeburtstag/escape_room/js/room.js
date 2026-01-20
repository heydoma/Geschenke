// ============================================================================
// ESCAPE ROOM - ROOM GEOMETRY
// Die Verbotene Abteilung - Room, Walls, Floor, Ceiling
// ============================================================================

function createRoom() {
    const w = CONFIG.room.width;
    const h = CONFIG.room.height;
    const d = CONFIG.room.depth;
    
    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.floor,
        roughness: 0.85,
        metalness: 0.05
    });
    
    const wallMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.woodDark,
        roughness: 0.75
    });
    
    const ceilMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.ceiling,
        roughness: 0.9
    });
    
    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Floor planks (visual detail)
    const plankMat = new THREE.MeshBasicMaterial({ color: 0x0a0500 });
    for (let x = -w/2; x <= w/2; x += 1.2) {
        const plank = new THREE.Mesh(new THREE.PlaneGeometry(0.015, d), plankMat);
        plank.rotation.x = -Math.PI / 2;
        plank.position.set(x, 0.002, 0);
        scene.add(plank);
    }
    
    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = h;
    scene.add(ceiling);
    
    // Ceiling beams
    const beamMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.7 });
    for (let z = -d/2 + 2; z <= d/2 - 2; z += 3) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, 0.3), beamMat);
        beam.position.set(0, h - 0.125, z);
        beam.castShadow = true;
        scene.add(beam);
    }
    
    // Walls
    createWall(0, h/2, -d/2, w, h, 0, 'back');
    createWall(0, h/2, d/2, w, h, Math.PI, 'front');
    createWall(-w/2, h/2, 0, d, h, Math.PI/2, 'left');
    createWall(w/2, h/2, 0, d, h, -Math.PI/2, 'right');
    
    // Wall colliders (invisible barriers)
    addCollider(-w/2 - 0.1, h/2, 0, 0.2, h, d); // Left
    addCollider(w/2 + 0.1, h/2, 0, 0.2, h, d);  // Right
    addCollider(0, h/2, -d/2 - 0.1, w, h, 0.2); // Back
    addCollider(0, h/2, d/2 + 0.1, w, h, 0.2);  // Front
}

function createWall(x, y, z, width, height, rotY, side) {
    const wallMat = new THREE.MeshStandardMaterial({
        color: CONFIG.colors.woodDark,
        roughness: 0.75
    });
    
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
    wall.position.set(x, y, z);
    wall.rotation.y = rotY;
    wall.receiveShadow = true;
    scene.add(wall);
    
    // Lower wood paneling
    const panelMat = new THREE.MeshStandardMaterial({ 
        color: CONFIG.colors.woodMedium, 
        roughness: 0.6 
    });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, 2.5), panelMat);
    panel.position.set(x, 1.25, z + (rotY === 0 ? 0.01 : rotY === Math.PI ? -0.01 : 0));
    if (side === 'left') panel.position.x += 0.01;
    if (side === 'right') panel.position.x -= 0.01;
    panel.rotation.y = rotY;
    scene.add(panel);
    
    // Crown molding
    const moldMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.5 });
    const mold = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, 0.1), moldMat);
    mold.position.set(x, height - 0.075, z);
    mold.rotation.y = rotY;
    scene.add(mold);
}

function addCollider(x, y, z, w, h, d) {
    colliders.push({
        min: new THREE.Vector3(x - w/2, y - h/2, z - d/2),
        max: new THREE.Vector3(x + w/2, y + h/2, z + d/2)
    });
}

// ============================================================================
// LIGHTING
// ============================================================================
function createLighting() {
    // Ambient (very low, colored)
    const ambient = new THREE.AmbientLight(0x1a1510, CONFIG.lighting.ambientIntensity);
    scene.add(ambient);
    
    // Fireplace light
    fireLight = new THREE.PointLight(0xff6622, CONFIG.lighting.fireIntensity, 14);
    fireLight.position.set(-7.5, 2.5, -5);
    fireLight.castShadow = true;
    fireLight.shadow.mapSize.width = 1024;
    fireLight.shadow.mapSize.height = 1024;
    fireLight.shadow.camera.near = 0.5;
    fireLight.shadow.camera.far = 15;
    fireLight.shadow.bias = -0.001;
    scene.add(fireLight);
    
    // Secondary fire light (fill)
    const fireFill = new THREE.PointLight(0xff4400, 0.8, 8);
    fireFill.position.set(-7, 1, -4);
    scene.add(fireFill);
    
    // Moonlight (directional, cool)
    moonLight = new THREE.DirectionalLight(0x6688aa, CONFIG.lighting.moonIntensity);
    moonLight.position.set(0, 10, -15);
    moonLight.target.position.set(0, 0, 0);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 1;
    moonLight.shadow.camera.far = 30;
    moonLight.shadow.camera.left = -15;
    moonLight.shadow.camera.right = 15;
    moonLight.shadow.camera.top = 15;
    moonLight.shadow.camera.bottom = -15;
    scene.add(moonLight);
    scene.add(moonLight.target);
}

// ============================================================================
// FLOOR FOG
// ============================================================================
function createFloorFog() {
    const fogMat = new THREE.MeshBasicMaterial({
        color: 0x1a1815,
        transparent: true,
        opacity: CONFIG.fog.floorFogOpacity,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    for (let layer = 0; layer < 4; layer++) {
        const fog = new THREE.Mesh(
            new THREE.PlaneGeometry(CONFIG.room.width, CONFIG.room.depth),
            fogMat.clone()
        );
        fog.rotation.x = -Math.PI / 2;
        fog.position.y = 0.05 + layer * 0.12;
        fog.material.opacity = CONFIG.fog.floorFogOpacity - layer * 0.05;
        scene.add(fog);
    }
}

// ============================================================================
// GOD RAYS (Windows with moonlight)
// ============================================================================
function createGodRays() {
    const rayMat = new THREE.MeshBasicMaterial({
        color: 0xaabbdd,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Bigger windows on back wall
    const windows = [
        { x: -4.5, z: -6.85 },
        { x: 4.5, z: -6.85 }
    ];
    
    windows.forEach(win => {
        // Large arched window frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.7 });
        const frame = new THREE.Mesh(new THREE.BoxGeometry(3, 6.5, 0.25), frameMat);
        frame.position.set(win.x, 5, win.z);
        scene.add(frame);
        
        // Window arch top
        const arch = new THREE.Mesh(
            new THREE.TorusGeometry(1.3, 0.15, 8, 12, Math.PI),
            frameMat
        );
        arch.position.set(win.x, 7.8, win.z + 0.1);
        arch.rotation.x = Math.PI / 2;
        scene.add(arch);
        
        // Glass (glowing moonlight)
        const glassMat = new THREE.MeshBasicMaterial({
            color: 0x5566aa,
            transparent: true,
            opacity: 0.35
        });
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 5.8), glassMat);
        glass.position.set(win.x, 5, win.z + 0.13);
        scene.add(glass);
        
        // Mullions (window cross bars)
        const barMat = new THREE.MeshStandardMaterial({ color: 0x2a2520 });
        
        // Vertical bar
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 5.8, 0.08), barMat);
        vBar.position.set(win.x, 5, win.z + 0.14);
        scene.add(vBar);
        
        // Horizontal bars
        [-1.5, 0, 1.5].forEach(dy => {
            const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 0.06), barMat);
            hBar.position.set(win.x, 5 + dy, win.z + 0.14);
            scene.add(hBar);
        });
        
        // God ray (larger cone)
        const ray = new THREE.Mesh(
            new THREE.ConeGeometry(4, 10, 8, 1, true),
            rayMat.clone()
        );
        ray.position.set(win.x, 2.5, win.z + 5);
        ray.rotation.x = Math.PI * 0.78;
        scene.add(ray);
        
        // Add point light at window for moonlight glow
        const windowLight = new THREE.PointLight(0x6688cc, 0.6, 8);
        windowLight.position.set(win.x, 5, win.z + 1);
        scene.add(windowLight);
    });
}
