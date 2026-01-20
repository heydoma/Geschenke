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
    
    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x3a3530,
        roughness: 0.9,
        metalness: 0.0
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
    
    // Ceiling with vaulted appearance
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = h;
    scene.add(ceiling);
    
    // === GOTHIC CEILING BEAMS (exposed wooden beams) ===
    const beamMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.7 });
    
    // Main cross beams
    for (let z = -d/2 + 3; z <= d/2 - 3; z += 4) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, 0.4), beamMat);
        beam.position.set(0, h - 0.175, z);
        beam.castShadow = true;
        scene.add(beam);
    }
    
    // Longitudinal beams
    [-w/3, 0, w/3].forEach(x => {
        const longBeam = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, d), beamMat);
        longBeam.position.set(x, h - 0.35, 0);
        longBeam.castShadow = true;
        scene.add(longBeam);
    });
    
    // Walls
    createWall(0, h/2, -d/2, w, h, 0, 'back');
    createWall(0, h/2, d/2, w, h, Math.PI, 'front');
    createWall(-w/2, h/2, 0, d, h, Math.PI/2, 'left');
    createWall(w/2, h/2, 0, d, h, -Math.PI/2, 'right');
    
    // === STONE PILLARS (Gothic architecture) ===
    createStonePillars(w, h, d, stoneMat);
    
    // Wall colliders (invisible barriers)
    addCollider(-w/2 - 0.1, h/2, 0, 0.2, h, d); // Left
    addCollider(w/2 + 0.1, h/2, 0, 0.2, h, d);  // Right
    addCollider(0, h/2, -d/2 - 0.1, w, h, 0.2); // Back
    addCollider(0, h/2, d/2 + 0.1, w, h, 0.2);  // Front
}

function createStonePillars(w, h, d, stoneMat) {
    const pillarPositions = [
        // Corner pillars
        [-w/2 + 0.4, -d/2 + 0.4],
        [w/2 - 0.4, -d/2 + 0.4],
        [-w/2 + 0.4, d/2 - 0.4],
        [w/2 - 0.4, d/2 - 0.4],
        // Mid-wall pillars
        [-w/2 + 0.4, 0],
        [w/2 - 0.4, 0],
        [0, -d/2 + 0.4]
    ];
    
    pillarPositions.forEach(([x, z]) => {
        // Main pillar shaft
        const pillar = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, h, 0.6),
            stoneMat
        );
        pillar.position.set(x, h/2, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        
        // Pillar base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 0.8),
            stoneMat
        );
        base.position.set(x, 0.15, z);
        scene.add(base);
        
        // Pillar capital (top decorative element)
        const capital = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.25, 0.8),
            stoneMat
        );
        capital.position.set(x, h - 0.5, z);
        scene.add(capital);
        
        // Collision
        addCollider(x, h/2, z, 0.7, h, 0.7);
    });
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
    const w = CONFIG.room.width;
    const d = CONFIG.room.depth;
    
    // Ambient (very low, colored for cozy atmosphere)
    const ambient = new THREE.AmbientLight(0x1a1510, CONFIG.lighting.ambientIntensity);
    scene.add(ambient);
    
    // Fireplace light (left side of room, at z=0)
    fireLight = new THREE.PointLight(0xff6622, CONFIG.lighting.fireIntensity, 18);
    fireLight.position.set(-w/2 + 2, 2.5, 0);
    fireLight.castShadow = true;
    fireLight.shadow.mapSize.width = 1024;
    fireLight.shadow.mapSize.height = 1024;
    fireLight.shadow.camera.near = 0.5;
    fireLight.shadow.camera.far = 18;
    fireLight.shadow.bias = -0.001;
    scene.add(fireLight);
    
    // Secondary fire light (fill)
    const fireFill = new THREE.PointLight(0xff4400, 1.0, 10);
    fireFill.position.set(-w/2 + 2.5, 1, 0);
    scene.add(fireFill);
    
    // Moonlight (directional, cool - from back windows)
    moonLight = new THREE.DirectionalLight(0x6688aa, CONFIG.lighting.moonIntensity);
    moonLight.position.set(0, 15, -d);
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
// GOD RAYS (Gothic arched windows with moonlight)
// ============================================================================
function createGodRays() {
    const w = CONFIG.room.width;
    const h = CONFIG.room.height;
    const d = CONFIG.room.depth;
    
    const rayMat = new THREE.MeshBasicMaterial({
        color: 0xaabbdd,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Gothic windows on back wall (front-facing, toward player spawn)
    const backWindows = [
        { x: -6, z: -d/2 + 0.1 },
        { x: 0, z: -d/2 + 0.1 },
        { x: 6, z: -d/2 + 0.1 }
    ];
    
    backWindows.forEach(win => {
        createGothicWindow(win.x, 6, win.z, 0, rayMat);
    });
    
    // Side windows on left wall
    const leftWindows = [
        { x: -w/2 + 0.1, z: -4 },
        { x: -w/2 + 0.1, z: 3 }
    ];
    
    leftWindows.forEach(win => {
        createGothicWindow(win.x, 6, win.z, Math.PI/2, rayMat);
    });
    
    // Side windows on right wall
    const rightWindows = [
        { x: w/2 - 0.1, z: -4 },
        { x: w/2 - 0.1, z: 3 }
    ];
    
    rightWindows.forEach(win => {
        createGothicWindow(win.x, 6, win.z, -Math.PI/2, rayMat);
    });
}

function createGothicWindow(x, y, z, rotY, rayMat) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.8 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.9 });
    
    const windowGroup = new THREE.Group();
    
    // === GOTHIC POINTED ARCH WINDOW ===
    const windowWidth = 2.2;
    const windowHeight = 5;
    const archHeight = 1.5;
    
    // Stone frame - left side
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, windowHeight, 0.3),
        stoneMat
    );
    leftFrame.position.set(-windowWidth/2, windowHeight/2, 0);
    windowGroup.add(leftFrame);
    
    // Stone frame - right side
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, windowHeight, 0.3),
        stoneMat
    );
    rightFrame.position.set(windowWidth/2, windowHeight/2, 0);
    windowGroup.add(rightFrame);
    
    // Stone frame - bottom sill
    const sill = new THREE.Mesh(
        new THREE.BoxGeometry(windowWidth + 0.5, 0.2, 0.4),
        stoneMat
    );
    sill.position.set(0, 0, 0.05);
    windowGroup.add(sill);
    
    // Gothic arch (pointed)
    const archShape = new THREE.Shape();
    archShape.moveTo(-windowWidth/2, windowHeight);
    archShape.quadraticCurveTo(-windowWidth/4, windowHeight + archHeight, 0, windowHeight + archHeight * 1.2);
    archShape.quadraticCurveTo(windowWidth/4, windowHeight + archHeight, windowWidth/2, windowHeight);
    archShape.lineTo(-windowWidth/2, windowHeight);
    
    const archGeo = new THREE.ExtrudeGeometry(archShape, { depth: 0.25, bevelEnabled: false });
    const arch = new THREE.Mesh(archGeo, stoneMat);
    arch.position.z = -0.125;
    windowGroup.add(arch);
    
    // Glass pane (glowing with moonlight)
    const glassMat = new THREE.MeshBasicMaterial({
        color: 0x4466aa,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth - 0.3, windowHeight - 0.2),
        glassMat
    );
    glass.position.set(0, windowHeight/2 + 0.1, 0.02);
    windowGroup.add(glass);
    
    // Mullions (window dividers)
    const barMat = new THREE.MeshStandardMaterial({ color: 0x1a1510, metalness: 0.2 });
    
    // Vertical mullion
    const vBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, windowHeight, 0.06),
        barMat
    );
    vBar.position.set(0, windowHeight/2, 0.03);
    windowGroup.add(vBar);
    
    // Horizontal mullions
    [1.5, 3, 4.5].forEach(barY => {
        const hBar = new THREE.Mesh(
            new THREE.BoxGeometry(windowWidth - 0.4, 0.05, 0.05),
            barMat
        );
        hBar.position.set(0, barY, 0.03);
        windowGroup.add(hBar);
    });
    
    // Position and rotate window
    windowGroup.position.set(x, y - windowHeight/2, z);
    windowGroup.rotation.y = rotY;
    scene.add(windowGroup);
    
    // === GOD RAY (light beam) ===
    const ray = new THREE.Mesh(
        new THREE.ConeGeometry(3, 8, 6, 1, true),
        rayMat.clone()
    );
    
    // Calculate ray position based on rotation
    const rayOffset = new THREE.Vector3(0, -2, 4);
    rayOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    
    ray.position.set(x + rayOffset.x, y - 1, z + rayOffset.z);
    ray.rotation.x = Math.PI * 0.7;
    ray.rotation.y = rotY;
    scene.add(ray);
    
    // Point light at window
    const lightOffset = new THREE.Vector3(0, 0, 0.5);
    lightOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    
    const windowLight = new THREE.PointLight(0x6688cc, 0.5, 10);
    windowLight.position.set(x + lightOffset.x, y, z + lightOffset.z);
    scene.add(windowLight);
}
