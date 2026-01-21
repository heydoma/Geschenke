// ============================================================================
// ESCAPE ROOM - FURNITURE
// Die Verbotene Abteilung - Fireplace, Bookshelves, Desk, Props
// ============================================================================

// ============================================================================
// FIREPLACE (Grand stone fireplace on left wall, facing into room)
// ============================================================================
function createFireplace() {
    // Position: against left wall, facing +X (into room)
    const w = CONFIG.room.width;
    const wallX = -w/2;      // Left wall position
    const centerZ = 0;       // Center of room
    
    // Materials
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6a625a, roughness: 0.8 });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.9 });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0x8a827a, roughness: 0.4, metalness: 0.1 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x6a3a2a, roughness: 0.85 });
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x020202 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.7, roughness: 0.3 });
    
    // Build fireplace in a group, then position it
    // Fireplace opens toward +X (depth along X, width along Z)
    
    // === COLUMNS (front/back along Z) ===
    [-1.6, 1.6].forEach(dz => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.5, 0.6), marbleMat);
        col.position.set(wallX + 0.5, 2.25, centerZ + dz);
        col.castShadow = true;
        scene.add(col);
        
        // Column cap
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.8), stoneMat);
        cap.position.set(wallX + 0.5, 4.6, centerZ + dz);
        scene.add(cap);
        
        // Decorative ball
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), goldMat);
        ball.position.set(wallX + 0.5, 4.85, centerZ + dz);
        scene.add(ball);
    });
    
    // === MANTLE (spans columns, extends into room) ===
    const mantle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 4), marbleMat);
    mantle.position.set(wallX + 0.8, 4.5, centerZ);
    mantle.castShadow = true;
    scene.add(mantle);
    
    // === BACK WALL (against room wall) ===
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 3.2), darkStoneMat);
    backWall.position.set(wallX + 0.15, 2, centerZ);
    scene.add(backWall);
    
    // === FIRE OPENING (dark recess) ===
    const opening = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 2.2), darkMat);
    opening.position.set(wallX + 0.5, 1.35, centerZ);
    scene.add(opening);
    
    // === HEARTH (floor in front of fireplace) ===
    const hearth = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 4), darkStoneMat);
    hearth.position.set(wallX + 1.5, 0.05, centerZ);
    hearth.receiveShadow = true;
    scene.add(hearth);
    
    // === FIRE GRATE ===
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.4 });
    const grateBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.4), grateMat);
    grateBase.position.set(wallX + 0.7, 0.15, centerZ);
    scene.add(grateBase);
    
    // === LOGS ===
    const logMat = new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.95 });
    [[0, -0.3], [0, 0.3], [0.15, 0]].forEach(([dx, dz]) => {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8), logMat);
        log.position.set(wallX + 0.6 + dx, 0.25, centerZ + dz);
        log.rotation.x = Math.PI / 2;  // Lay horizontal along Z
        log.rotation.z = (Math.random() - 0.5) * 0.3;
        scene.add(log);
    });
    
    // === MANTLE DECORATIONS ===
    [-1.0, 1.0].forEach(dz => {
        // Candle holder
        const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.06, 8), goldMat);
        holder.position.set(wallX + 1.0, 4.68, centerZ + dz);
        scene.add(holder);
        
        // Candle
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5ead0 }));
        candle.position.set(wallX + 1.0, 4.78, centerZ + dz);
        scene.add(candle);
        
        // Flame
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 6),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 }));
        flame.position.set(wallX + 1.0, 4.9, centerZ + dz);
        scene.add(flame);
        floatingCandles.push({ mesh: flame, baseY: 4.9, phase: Math.random() * Math.PI * 2 });
    });
    
    // Collider (blocks walking into fireplace)
    addCollider(wallX + 0.5, 2, centerZ, 1.5, 4, 4);
    
    // Fire particles
    createFireParticles(wallX + 0.7, centerZ);
    createEmberParticles(wallX + 0.7, centerZ);
    
    // Fireplace interactive zone removed - bells are under the mantle now
}

// ============================================================================
// BOOKSHELVES (Floor-to-ceiling library shelving)
// ============================================================================
function createBookshelves() {
    const w = CONFIG.room.width;
    const h = CONFIG.room.height;
    const d = CONFIG.room.depth;
    
    // Giant bookshelf on back wall (behind player spawn)
    createGiantBackBookshelf();
    
    // Interactive book zone on back wall (only right side now - whispering books)
    createInteractiveBookZone(4, 4, d/2 - 1, 'bookshelfRight', CONFIG.interactives.bookshelfRight);
    
    // Side wall shelves (left wall - not blocking fireplace)
    createBookshelf(-w/2 + 0.5, 0, -d/2 + 3, Math.PI/2, null, null, true);
    createBookshelf(-w/2 + 0.5, 0, 5, Math.PI/2, null, null, true);
    
    // Side wall shelves (right wall - alchemy area)
    // The first one (z=-4) is now interactive for book sorting game
    createBookshelf(w/2 - 0.5, 0, -4, -Math.PI/2, 'bookshelfLeft', CONFIG.interactives.bookshelfLeft, false);
    createBookshelf(w/2 - 0.5, 0, 0, -Math.PI/2, null, null, true);
    createBookshelf(w/2 - 0.5, 0, 4, -Math.PI/2, null, null, true);
    
    // No more instanced books - books are built into shelves now
}

function createGiantBackBookshelf() {
    const w = CONFIG.room.width;
    const h = CONFIG.room.height;
    const d = CONFIG.room.depth;
    
    const shelfWidth = w - 4;  // Almost full width
    const shelfHeight = h - 1; // Almost full height
    const shelfDepth = 1.0;
    const x = 0;
    const z = d/2 - 0.5;  // Against back wall
    
    const frameMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodDark, roughness: 0.7 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.5 });
    
    // Book colors for variety
    const bookColors = [
        0x8b4513, 0x654321, 0x4a2511, // Browns
        0x2e4a1c, 0x1e3a0c, 0x3e5a2c, // Greens
        0x4a1c2e, 0x5a2c3e, 0x3a0c1e, // Burgundy
        0x1c2e4a, 0x0c1e3a, 0x2c3e5a, // Blues
        0x4a3a1c, 0x5a4a2c, 0x3a2a0c, // Tan
    ];
    
    // Main back panel - against the WALL (high z value)
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.15), frameMat);
    backPanel.position.set(x, shelfHeight/2, z + shelfDepth/2 - 0.1);
    backPanel.receiveShadow = true;
    scene.add(backPanel);
    
    // Vertical dividers
    const dividerCount = Math.floor(shelfWidth / 3);
    const sectionWidth = shelfWidth / dividerCount;
    
    for (let i = 0; i <= dividerCount; i++) {
        const dx = -shelfWidth/2 + sectionWidth * i;
        const divider = new THREE.Mesh(new THREE.BoxGeometry(0.14, shelfHeight, shelfDepth), shelfMat);
        divider.position.set(x + dx, shelfHeight/2, z);
        divider.castShadow = true;
        scene.add(divider);
    }
    
    // Side frames (thicker)
    [-shelfWidth/2, shelfWidth/2].forEach(dx => {
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.25, shelfHeight, shelfDepth + 0.15), frameMat);
        side.position.set(x + dx, shelfHeight/2, z);
        side.castShadow = true;
        scene.add(side);
    });
    
    // Horizontal shelves WITH book rows
    const shelfSpacing = 1.1;
    
    for (let sy = 0.6; sy <= shelfHeight - 0.5; sy += shelfSpacing) {
        // Shelf board
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth - 0.3, 0.08, shelfDepth - 0.1), shelfMat);
        shelf.position.set(x, sy, z);
        shelf.receiveShadow = true;
        scene.add(shelf);
        
        // Book rows for each section between dividers
        for (let sec = 0; sec < dividerCount; sec++) {
            const secX = -shelfWidth/2 + sectionWidth * sec + sectionWidth/2;
            
            // Create 3-5 book "blocks" per section with varied colors
            const bookCount = 3 + Math.floor(Math.random() * 3);
            const bookBlockWidth = (sectionWidth - 0.3) / bookCount;
            
            for (let b = 0; b < bookCount; b++) {
                const bx = secX - (sectionWidth - 0.3)/2 + bookBlockWidth * b + bookBlockWidth/2;
                const bookHeight = 0.6 + Math.random() * 0.35;  // Taller books
                const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
                
                const bookBlock = new THREE.Mesh(
                    new THREE.BoxGeometry(bookBlockWidth - 0.02, bookHeight, 0.5),
                    new THREE.MeshStandardMaterial({ color: bookColor, roughness: 0.8 })
                );
                // Position books at FRONT of shelf (towards player = lower z values)
                // Shelf is centered at z, books go at z - shelfDepth/2 + some offset to be visible
                bookBlock.position.set(x + bx, sy + 0.04 + bookHeight/2, z - shelfDepth/2 + 0.5);
                bookBlock.castShadow = true;
                bookBlock.receiveShadow = true;
                scene.add(bookBlock);
            }
        }
    }
    
    // Crown molding (ornate top)
    const crown = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.4, 0.3, shelfDepth + 0.25), accentMat);
    crown.position.set(x, shelfHeight + 0.15, z);
    scene.add(crown);
    
    const crownDetail = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.2, 0.15, 0.2), accentMat);
    crownDetail.position.set(x, shelfHeight + 0.35, z + shelfDepth/2);
    scene.add(crownDetail);
    
    // Base molding
    const base = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.3, 0.2, shelfDepth + 0.2), accentMat);
    base.position.set(x, 0.1, z);
    scene.add(base);
    
    addCollider(x, shelfHeight/2, z, shelfWidth + 0.3, shelfHeight, shelfDepth + 0.4);
}

function createInteractiveBookZone(x, y, z, name, config) {
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 2),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z);
    interactZone.userData = { type: name, ...config };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createBookshelf(x, y, z, rotY, name, config, decorative = false) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;
    
    const frameMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodDark, roughness: 0.7 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    
    // Book colors
    const bookColors = [
        0x8b4513, 0x654321, 0x4a2511, 0x2e4a1c, 0x1e3a0c,
        0x4a1c2e, 0x5a2c3e, 0x1c2e4a, 0x4a3a1c, 0x3a3a3a
    ];
    
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8, 0.9), frameMat);
    frame.position.y = 4;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);
    
    const crown = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 1), shelfMat);
    crown.position.set(0, 8, 0);
    group.add(crown);
    
    // Shelves with integrated book rows
    for (let sy = 0.8; sy <= 7.2; sy += 1.1) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.75), shelfMat);
        shelf.position.set(0, sy, 0.1);
        shelf.receiveShadow = true;
        group.add(shelf);
        
        // Add book blocks on each shelf
        const bookCount = 4 + Math.floor(Math.random() * 3);
        const totalWidth = 3.8;
        const bookWidth = totalWidth / bookCount;
        
        for (let b = 0; b < bookCount; b++) {
            const bx = -totalWidth/2 + bookWidth * b + bookWidth/2;
            const bookHeight = 0.5 + Math.random() * 0.4;
            const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
            
            const bookBlock = new THREE.Mesh(
                new THREE.BoxGeometry(bookWidth - 0.03, bookHeight, 0.5),
                new THREE.MeshStandardMaterial({ color: bookColor, roughness: 0.8 })
            );
            bookBlock.position.set(bx, sy + 0.04 + bookHeight/2, 0.25);
            bookBlock.castShadow = true;
            group.add(bookBlock);
        }
    }
    
    const pillarGeo = new THREE.BoxGeometry(0.15, 8, 0.1);
    [-2.15, 2.15].forEach(px => {
        const pillar = new THREE.Mesh(pillarGeo, shelfMat);
        pillar.position.set(px, 4, 0.45);
        group.add(pillar);
    });
    
    scene.add(group);
    
    if (rotY === Math.PI/2 || rotY === -Math.PI/2) {
        addCollider(x, 4, z, 1, 8, 4.5);
    } else {
        addCollider(x, 4, z, 4.5, 8, 1);
    }
    
    if (!decorative && name && config) {
        const interactZone = new THREE.Mesh(
            new THREE.BoxGeometry(5, 8, 2),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        interactZone.position.set(x, 4, z + 0.8);
        interactZone.rotation.y = rotY;
        interactZone.userData = { type: name, ...config };
        interactiveObjects.push(interactZone);
        scene.add(interactZone);
    }
}

function createInstancedBooks() {
    // Books are now built directly into the shelves
    // This function is kept for compatibility but does nothing
    console.log('Books are now integrated into bookshelves');
}

// ============================================================================
// DESK AND ORB
// ============================================================================
function createDesk() {
    const x = 0, y = 0, z = -3;
    const woodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.5 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    
    // Desk top
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 1.8), woodMat);
    top.position.set(x, 0.9, z);
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);
    
    // Drawers
    const drawerGeo = new THREE.BoxGeometry(0.8, 0.6, 1.5);
    [-1.2, 1.2].forEach(dx => {
        const drawer = new THREE.Mesh(drawerGeo, darkWoodMat);
        drawer.position.set(x + dx, 0.5, z);
        drawer.castShadow = true;
        scene.add(drawer);
        
        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.04, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x8b7355, metalness: 0.4 })
        );
        handle.position.set(x + dx, 0.5, z + 0.78);
        scene.add(handle);
    });
    
    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
    [[-1.6, -0.8], [-1.6, 0.8], [1.6, -0.8], [1.6, 0.8]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, darkWoodMat);
        leg.position.set(x + lx, 0.45, z + lz);
        leg.castShadow = true;
        scene.add(leg);
    });
    
    // Props on desk
    for (let i = 0; i < 4; i++) {
        const paper = new THREE.Mesh(
            new THREE.PlaneGeometry(0.3 + Math.random() * 0.2, 0.4 + Math.random() * 0.2),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3, side: THREE.DoubleSide, roughness: 0.9 })
        );
        paper.rotation.x = -Math.PI / 2;
        paper.rotation.z = (Math.random() - 0.5) * 0.4;
        paper.position.set(x - 0.8 + Math.random() * 0.6, 0.97, z + (Math.random() - 0.5) * 0.6);
        scene.add(paper);
    }
    
    // Ink bottle
    const inkBottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.3 })
    );
    inkBottle.position.set(x - 1.2, 1.02, z - 0.3);
    scene.add(inkBottle);
    
    // Quill
    const quill = new THREE.Mesh(
        new THREE.ConeGeometry(0.01, 0.25, 8),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f0 })
    );
    quill.rotation.z = Math.PI / 6;
    quill.position.set(x - 1.1, 1.05, z - 0.3);
    scene.add(quill);
    
    // Open book
    const openBook = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.02, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
    );
    openBook.position.set(x + 0.3, 0.97, z);
    openBook.rotation.y = 0.1;
    scene.add(openBook);
    
    // === DIE KARTE DER VERBORGENEN WEGE ===
    // Center of desk
    createMagicMap(x, 0.97, z);
    
    addCollider(x, 0.5, z, 3.8, 1, 2);
    
    // Main desk is now just for the magic map - no puzzle trigger
    // Puzzle 3 (cipher/runes) moves to the new rune desk
    
    // Create the rune desk under the left window
    createRuneDesk();
}

// ============================================================================
// RUNE DESK (Under left window - puzzle 3: cipher/runes)
// ============================================================================
function createRuneDesk() {
    const w = CONFIG.room.width;
    const d = CONFIG.room.depth;
    // Position where the old stairs were (right side of room)
    const x = 7.5;
    const z = 3;
    
    const woodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodDark, roughness: 0.7 });
    
    // Small writing desk
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), woodMat);
    tableTop.position.set(x, 0.78, z);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);
    
    // Desk legs
    [[-0.8, -0.35], [-0.8, 0.35], [0.8, -0.35], [0.8, 0.35]].forEach(([dx, dz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.78, 0.06), darkWoodMat);
        leg.position.set(x + dx, 0.39, z + dz);
        scene.add(leg);
    });
    
    addCollider(x, 0.4, z, 2, 0.85, 1.1);
    
    // Large parchment with runes
    const parchment = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 0.8),
        new THREE.MeshStandardMaterial({ 
            color: 0xf5e6c8, 
            roughness: 0.9,
            side: THREE.DoubleSide
        })
    );
    parchment.rotation.x = -Math.PI / 2;
    parchment.rotation.z = 0.05;
    parchment.position.set(x, 0.83, z);
    scene.add(parchment);
    
    // Ink bottle (dark glass)
    const inkBottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 0.08, 12),
        new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.2, metalness: 0.3 })
    );
    inkBottle.position.set(x + 0.5, 0.86, z - 0.25);
    scene.add(inkBottle);
    
    // Ink in bottle
    const ink = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.04, 12),
        new THREE.MeshBasicMaterial({ color: 0x000022 })
    );
    ink.position.set(x + 0.5, 0.84, z - 0.25);
    scene.add(ink);
    
    // Quill pen
    const quillMat = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.6 });
    const quillFeather = new THREE.Mesh(
        new THREE.ConeGeometry(0.02, 0.3, 8),
        quillMat
    );
    quillFeather.rotation.z = Math.PI / 4;
    quillFeather.rotation.x = 0.2;
    quillFeather.position.set(x + 0.6, 0.88, z - 0.1);
    scene.add(quillFeather);
    
    // Second parchment (rolled)
    const rolledParchment = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12),
        new THREE.MeshStandardMaterial({ color: 0xf0dcc0, roughness: 0.8 })
    );
    rolledParchment.rotation.z = Math.PI / 2;
    rolledParchment.position.set(x - 0.6, 0.85, z + 0.2);
    scene.add(rolledParchment);
    
    // Small candle for reading
    const candleHolder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.03, 12),
        new THREE.MeshStandardMaterial({ color: 0x8b7355, metalness: 0.5 })
    );
    candleHolder.position.set(x - 0.5, 0.83, z - 0.3);
    scene.add(candleHolder);
    
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0xf5f0e6 })
    );
    candle.position.set(x - 0.5, 0.92, z - 0.3);
    scene.add(candle);
    
    // Candle flame
    const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.01, 0.03, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    );
    flame.position.set(x - 0.5, 1.0, z - 0.3);
    scene.add(flame);
    
    // Small light from candle
    const candleLight = new THREE.PointLight(0xff9944, 0.3, 2);
    candleLight.position.set(x - 0.5, 1.0, z - 0.3);
    scene.add(candleLight);
    
    // Interactive zone for rune puzzle
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.5, 1.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, 0.9, z);
    interactZone.userData = { type: 'desk', ...CONFIG.interactives.desk };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

// ============================================================================
// DIE KARTE DER VERBORGENEN WEGE (Magic Map - puzzle progress visualization)
// ============================================================================
// Global reference for updating the map as puzzles are solved
let magicMapElements = {
    parchment: null,
    pathLines: [],
    symbols: [],
    finalPath: null,
    glowLight: null
};

function createMagicMap(x, y, z) {
    // === PARCHMENT BASE ===
    const parchmentMat = new THREE.MeshStandardMaterial({ 
        color: 0xd4c4a8, 
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    
    const parchment = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 0.45),
        parchmentMat
    );
    parchment.position.set(x, y + 0.005, z);
    parchment.rotation.x = -Math.PI / 2;
    parchment.rotation.z = 0.08; // Slight angle
    parchment.receiveShadow = true;
    scene.add(parchment);
    magicMapElements.parchment = parchment;
    
    // Parchment edges (curled corners)
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xc4b498, roughness: 0.85 });
    [[-0.28, -0.2], [0.28, -0.2], [-0.28, 0.2], [0.28, 0.2]].forEach(([dx, dz]) => {
        const curl = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8),
            edgeMat
        );
        curl.position.set(x + dx, y + 0.015, z + dz);
        curl.rotation.z = Math.PI / 2;
        scene.add(curl);
    });
    
    // === FADED BASE MAP (always visible but faint) ===
    const fadedInkMat = new THREE.MeshBasicMaterial({ 
        color: 0x8a7a5a, 
        transparent: true, 
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    
    // Library outline (faded)
    const libraryOutline = createMapLine([
        [-0.22, -0.15], [-0.22, 0.15], [0.22, 0.15], [0.22, -0.15], [-0.22, -0.15]
    ], x, y + 0.006, z, fadedInkMat);
    scene.add(libraryOutline);
    
    // === PUZZLE PATH MARKERS (revealed as puzzles are solved) ===
    const pathLineMat = new THREE.MeshBasicMaterial({
        color: 0x2a1a0a,
        transparent: true,
        opacity: 0,  // Starts invisible
        side: THREE.DoubleSide
    });
    
    // 7 path segments corresponding to 7 puzzles
    const pathSegments = [
        // Puzzle 1: Polyjuice - from potions shelf area
        { from: [0.18, 0.08], to: [0.1, 0.02], symbol: '🧪', angle: 0.3 },
        // Puzzle 2: Whispering Books - from bookshelf
        { from: [-0.15, 0.12], to: [-0.05, 0.06], symbol: '📖', angle: -0.2 },
        // Puzzle 3: Cipher - from desk
        { from: [0, -0.05], to: [0, 0.02], symbol: '🔐', angle: 0 },
        // Puzzle 4: Staircase - from stairs
        { from: [0.2, -0.08], to: [0.12, -0.02], symbol: '🪜', angle: 0.4 },
        // Puzzle 5: Invisible Ink - from fireplace area
        { from: [-0.2, -0.08], to: [-0.1, -0.02], symbol: '🕯️', angle: -0.3 },
        // Puzzle 6: Bells - above fireplace
        { from: [-0.2, 0.0], to: [-0.08, 0.02], symbol: '🔔', angle: -0.15 },
        // Puzzle 7: Book Sort - from back bookshelf
        { from: [0, 0.15], to: [0, 0.08], symbol: '📚', angle: 0.1 }
    ];
    
    pathSegments.forEach((seg, index) => {
        // Create path line (initially invisible)
        const lineMat = pathLineMat.clone();
        const line = createMapLine([seg.from, seg.to], x, y + 0.007, z, lineMat);
        line.visible = false;
        scene.add(line);
        magicMapElements.pathLines.push({ mesh: line, material: lineMat, puzzleIndex: index + 1 });
        
        // Create symbol marker (initially invisible)
        const symbolGroup = createMapSymbol(x + seg.from[0], y + 0.008, z + seg.from[1], seg.symbol, seg.angle);
        symbolGroup.visible = false;
        scene.add(symbolGroup);
        magicMapElements.symbols.push({ group: symbolGroup, puzzleIndex: index + 1 });
    });
    
    // === FINAL PATH (revealed when all 7 puzzles solved) ===
    const finalPathMat = new THREE.MeshBasicMaterial({
        color: 0xc9a227,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    
    // Golden path leading to center/secret
    const finalPath = createMapLine([
        [0.1, 0.02], [0.05, 0], [0, 0], [-0.05, 0], [-0.08, 0.02],
        [0, 0.04], [0.08, 0.02], [0, 0] // Converging to center
    ], x, y + 0.008, z, finalPathMat);
    finalPath.visible = false;
    scene.add(finalPath);
    magicMapElements.finalPath = { mesh: finalPath, material: finalPathMat };
    
    // Subtle glow light for the map (intensifies as puzzles solved)
    const mapGlow = new THREE.PointLight(0xc9a227, 0, 1);
    mapGlow.position.set(x, y + 0.2, z);
    scene.add(mapGlow);
    magicMapElements.glowLight = mapGlow;
    
    // === DECORATIVE ELEMENTS (always visible) ===
    // Compass rose in corner
    createCompassRose(x + 0.22, y + 0.007, z - 0.15);
    
    // Title text simulation (just a decorative line)
    const titleLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.25, 0.015),
        new THREE.MeshBasicMaterial({ color: 0x3a2a1a, transparent: true, opacity: 0.6 })
    );
    titleLine.position.set(x, y + 0.006, z + 0.18);
    titleLine.rotation.x = -Math.PI / 2;
    scene.add(titleLine);
    
    // Interactive zone for the map
    const mapInteract = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.3, 0.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    mapInteract.position.set(x, y + 0.15, z);
    mapInteract.userData = { 
        type: 'magicMap', 
        hint: 'Die Karte der Verborgenen Wege betrachten',
        game: null // Not a minigame, just shows progress
    };
    interactiveObjects.push(mapInteract);
    scene.add(mapInteract);
}

function createMapLine(points, baseX, baseY, baseZ, material) {
    const shape = new THREE.Shape();
    const lineWidth = 0.003;
    
    // Create a thin plane for each segment
    const group = new THREE.Group();
    
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const dx = end[0] - start[0];
        const dz = end[1] - start[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        
        const segment = new THREE.Mesh(
            new THREE.PlaneGeometry(length, lineWidth),
            material
        );
        segment.position.set(
            (start[0] + end[0]) / 2,
            0,
            (start[1] + end[1]) / 2
        );
        segment.rotation.x = -Math.PI / 2;
        segment.rotation.z = -angle;
        group.add(segment);
    }
    
    group.position.set(baseX, baseY, baseZ);
    return group;
}

function createMapSymbol(x, y, z, symbol, angle) {
    // Create a small glowing marker for each puzzle location
    const group = new THREE.Group();
    
    // Circular marker
    const marker = new THREE.Mesh(
        new THREE.CircleGeometry(0.018, 12),
        new THREE.MeshBasicMaterial({ 
            color: 0xc9a227, 
            transparent: true, 
            opacity: 0.8 
        })
    );
    marker.rotation.x = -Math.PI / 2;
    group.add(marker);
    
    // Outer ring
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.02, 0.025, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x8b7355, 
            transparent: true, 
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);
    
    group.position.set(x, y, z);
    group.rotation.y = angle;
    
    return group;
}

function createCompassRose(x, y, z) {
    const group = new THREE.Group();
    
    // Main circle
    const circle = new THREE.Mesh(
        new THREE.RingGeometry(0.025, 0.03, 16),
        new THREE.MeshBasicMaterial({ color: 0x3a2a1a, side: THREE.DoubleSide })
    );
    circle.rotation.x = -Math.PI / 2;
    group.add(circle);
    
    // Cardinal points
    const pointMat = new THREE.MeshBasicMaterial({ color: 0x3a2a1a, side: THREE.DoubleSide });
    [0, Math.PI/2, Math.PI, Math.PI * 1.5].forEach((angle, i) => {
        const point = new THREE.Mesh(
            new THREE.ConeGeometry(0.008, 0.025, 4),
            pointMat
        );
        point.position.set(Math.cos(angle) * 0.04, 0, Math.sin(angle) * 0.04);
        point.rotation.x = -Math.PI / 2;
        point.rotation.z = angle + Math.PI / 2;
        group.add(point);
    });
    
    // North indicator (slightly larger)
    const north = new THREE.Mesh(
        new THREE.ConeGeometry(0.01, 0.03, 4),
        new THREE.MeshBasicMaterial({ color: 0x8b4513 })
    );
    north.position.set(0, 0, 0.045);
    north.rotation.x = -Math.PI / 2;
    north.rotation.z = Math.PI;
    group.add(north);
    
    group.position.set(x, y, z);
    scene.add(group);
}

// === MAP UPDATE FUNCTION (called when a puzzle is solved) ===
function revealMapPath(puzzleNumber) {
    // Find and reveal the corresponding path segment
    const pathElement = magicMapElements.pathLines.find(p => p.puzzleIndex === puzzleNumber);
    if (pathElement) {
        pathElement.mesh.visible = true;
        // Animate opacity
        animateMapElement(pathElement.material, 0, 0.8, 1500);
    }
    
    // Reveal the symbol
    const symbolElement = magicMapElements.symbols.find(s => s.puzzleIndex === puzzleNumber);
    if (symbolElement) {
        symbolElement.group.visible = true;
    }
    
    // Update glow intensity based on progress
    const solvedCount = magicMapElements.pathLines.filter(p => p.mesh.visible).length;
    if (magicMapElements.glowLight) {
        magicMapElements.glowLight.intensity = solvedCount * 0.15;
    }
    
    // Check if all 7 puzzles solved → reveal final path
    if (solvedCount >= 7) {
        revealFinalPath();
    }
}

function revealFinalPath() {
    if (!magicMapElements.finalPath) return;
    
    magicMapElements.finalPath.mesh.visible = true;
    animateMapElement(magicMapElements.finalPath.material, 0, 1.0, 2000);
    
    // Intensify glow
    if (magicMapElements.glowLight) {
        magicMapElements.glowLight.intensity = 2.0;
        magicMapElements.glowLight.color.setHex(0xffd700);
    }
}

function animateMapElement(material, fromOpacity, toOpacity, duration) {
    const startTime = performance.now();
    
    function animate() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        material.opacity = fromOpacity + (toOpacity - fromOpacity) * eased;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function createMagicOrb() {
    const x = 0.8, y = 0.97, z = -3;
    
    // Stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, metalness: 0.3, roughness: 0.6 });
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.12, 16), standMat);
    stand.position.set(x, y + 0.06, z);
    scene.add(stand);
    
    // Orb
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x5588bb, transparent: true, opacity: 0.75 });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), orbMat);
    orb.position.set(x, y + 0.27, z);
    scene.add(orb);
    
    // Outer glow
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x88aadd, transparent: true, opacity: 0.15,
        blending: THREE.AdditiveBlending, side: THREE.BackSide
    });
    orbGlow = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), glowMat);
    orbGlow.position.set(x, y + 0.27, z);
    scene.add(orbGlow);
    
    // Light
    orbLight = new THREE.PointLight(0x6699cc, CONFIG.lighting.orbIntensity, 4);
    orbLight.position.set(x, y + 0.27, z);
    scene.add(orbLight);
    
    createOrbDustParticles(x, y + 0.27, z);
    
    // Interactive zone
    const interactZone = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y + 0.27, z);
    interactZone.userData = { type: 'orb', ...CONFIG.interactives.orb };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

// ============================================================================
// ALCHEMY STATION (Left side of room - thematic zone for potion puzzles)
// ============================================================================
function createPotionShelf() {
    // Full alchemy workstation instead of just a shelf
    createAlchemyStation();
}

function createAlchemyStation() {
    // Position against front wall under right window (z=-4 window)
    const w = CONFIG.room.width;
    const d = CONFIG.room.depth;
    const baseX = 4, baseZ = -d/2 + 1.2;  // Against front wall
    
    const woodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodDark, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.6, roughness: 0.4 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    
    // === WORKTABLE ===
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 1.2), woodMat);
    tableTop.position.set(baseX, 0.85, baseZ);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);
    
    // Table legs
    [[-1.1, -0.5], [-1.1, 0.5], [1.1, -0.5], [1.1, 0.5]].forEach(([dx, dz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), darkWoodMat);
        leg.position.set(baseX + dx, 0.425, baseZ + dz);
        scene.add(leg);
    });
    
    addCollider(baseX, 0.5, baseZ, 2.7, 1, 1.4);
    
    // === CAULDRON (central piece) ===
    const cauldronBody = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.7),
        metalMat
    );
    cauldronBody.position.set(baseX, 1.05, baseZ);
    cauldronBody.castShadow = true;
    scene.add(cauldronBody);
    
    // Cauldron rim
    const cauldronRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.03, 12, 24),
        metalMat
    );
    cauldronRim.position.set(baseX, 1.15, baseZ);
    cauldronRim.rotation.x = Math.PI / 2;
    scene.add(cauldronRim);
    
    // Cauldron legs
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.03, 0.15, 8),
            metalMat
        );
        leg.position.set(
            baseX + Math.cos(angle) * 0.18,
            0.97,
            baseZ + Math.sin(angle) * 0.18
        );
        scene.add(leg);
    }
    
    // Bubbling liquid in cauldron
    const liquidMat = new THREE.MeshBasicMaterial({ 
        color: 0x44aa55, 
        transparent: true, 
        opacity: 0.7 
    });
    const liquid = new THREE.Mesh(
        new THREE.CircleGeometry(0.18, 24),
        liquidMat
    );
    liquid.position.set(baseX, 1.12, baseZ);
    liquid.rotation.x = -Math.PI / 2;
    scene.add(liquid);
    
    // Steam/bubbles particles above cauldron
    createCauldronSteam(baseX, 1.15, baseZ);
    
    // === INGREDIENT JARS ===
    const jarPositions = [
        { x: -0.9, z: -0.3, color: 0x2d5a27, label: 'Fluxkraut' },
        { x: -0.9, z: 0.3, color: 0x8b4513, label: 'Boomslang' },
        { x: -0.5, z: -0.4, color: 0x4a1c2e, label: 'Blutegel' },
        { x: 0.5, z: -0.4, color: 0x6a5acd, label: 'Florfliegen' },
        { x: 0.9, z: -0.3, color: 0x8fbc8f, label: 'Knöterich' },
        { x: 0.9, z: 0.3, color: 0xdaa520, label: 'Goldstaub' }
    ];
    
    jarPositions.forEach(jar => {
        // Jar body
        const jarMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.06, 0.12, 12),
            new THREE.MeshStandardMaterial({ 
                color: 0xaabbcc, 
                transparent: true, 
                opacity: 0.4, 
                roughness: 0.1 
            })
        );
        jarMesh.position.set(baseX + jar.x, 0.96, baseZ + jar.z);
        scene.add(jarMesh);
        
        // Contents
        const contents = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.05, 0.08, 12),
            new THREE.MeshStandardMaterial({ color: jar.color, roughness: 0.8 })
        );
        contents.position.set(baseX + jar.x, 0.94, baseZ + jar.z);
        scene.add(contents);
        
        // Cork/lid
        const lid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.05, 0.025, 12),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        lid.position.set(baseX + jar.x, 1.03, baseZ + jar.z);
        scene.add(lid);
    });
    
    // === MORTAR & PESTLE ===
    const mortar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x6a625a, roughness: 0.7 })
    );
    mortar.position.set(baseX + 0.4, 0.94, baseZ);
    scene.add(mortar);
    
    const pestle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0x5a524a })
    );
    pestle.position.set(baseX + 0.42, 1.0, baseZ);
    pestle.rotation.z = 0.3;
    scene.add(pestle);
    
    // === SCALES ===
    const scaleBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.02, 0.08),
        copperMat
    );
    scaleBase.position.set(baseX - 0.5, 0.91, baseZ);
    scene.add(scaleBase);
    
    const scalePost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8),
        copperMat
    );
    scalePost.position.set(baseX - 0.5, 0.985, baseZ);
    scene.add(scalePost);
    
    const scaleArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.008, 0.015),
        copperMat
    );
    scaleArm.position.set(baseX - 0.5, 1.06, baseZ);
    scaleArm.rotation.z = 0.05; // Slight tilt
    scene.add(scaleArm);
    
    // Scale pans
    [-0.08, 0.08].forEach(dx => {
        const pan = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12),
            copperMat
        );
        pan.position.set(baseX - 0.5 + dx, 1.02 + (dx > 0 ? -0.01 : 0.01), baseZ);
        scene.add(pan);
    });
    
    // === WALL SHELF with more potions ===
    const shelfY = 2.2;
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2, 0.06, 0.35), woodMat);
    shelf.position.set(baseX, shelfY, baseZ - 0.75);
    scene.add(shelf);
    
    // Shelf brackets
    [-0.8, 0.8].forEach(dx => {
        const bracket = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.25, 0.3),
            darkWoodMat
        );
        bracket.position.set(baseX + dx, shelfY - 0.15, baseZ - 0.75);
        scene.add(bracket);
    });
    
    // Potion bottles on shelf
    const potionConfigs = [
        { dx: -0.7, color: 0x44aa55, h: 0.18 },
        { dx: -0.35, color: 0xaa44aa, h: 0.22 },
        { dx: 0, color: 0xaaaa44, h: 0.15 },
        { dx: 0.35, color: 0xaa4444, h: 0.2 },
        { dx: 0.7, color: 0x4466aa, h: 0.17 }
    ];
    
    potionConfigs.forEach(conf => {
        const bottle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.06, conf.h, 12),
            new THREE.MeshStandardMaterial({ 
                color: conf.color, 
                transparent: true, 
                opacity: 0.7, 
                roughness: 0.2 
            })
        );
        bottle.position.set(baseX + conf.dx, shelfY + 0.03 + conf.h/2, baseZ - 0.75);
        bottle.castShadow = true;
        scene.add(bottle);
        
        const cork = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.03, 0.03, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        cork.position.set(baseX + conf.dx, shelfY + 0.03 + conf.h + 0.015, baseZ - 0.75);
        scene.add(cork);
    });
    
    // === RECIPE NOTES ===
    const notesMat = new THREE.MeshStandardMaterial({ 
        color: 0xf5e6d3, 
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    
    // Pinned note on wall
    const note = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.35), notesMat);
    note.position.set(baseX - 0.6, 1.6, baseZ - 0.98);
    note.rotation.y = 0.1;
    scene.add(note);
    
    // Note on table
    const tableNote = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), notesMat);
    tableNote.position.set(baseX - 0.3, 0.91, baseZ + 0.35);
    tableNote.rotation.x = -Math.PI / 2;
    tableNote.rotation.z = 0.2;
    scene.add(tableNote);
    
    // === WARM LIGHT for the station ===
    const alchemyLight = new THREE.PointLight(0x88cc88, 0.5, 4);
    alchemyLight.position.set(baseX, 1.8, baseZ);
    scene.add(alchemyLight);
    
    // === INTERACTIVE ZONE ===
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 2),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(baseX, 1.2, baseZ);
    interactZone.userData = { type: 'potions', ...CONFIG.interactives.potions };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createCauldronSteam(x, y, z) {
    // Create subtle steam/bubble particles above cauldron
    const count = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.15;
        positions[i * 3] = x + Math.cos(angle) * radius;
        positions[i * 3 + 1] = y + Math.random() * 0.5;
        positions[i * 3 + 2] = z + Math.sin(angle) * radius;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = {
        baseX: x, baseY: y, baseZ: z,
        speeds: new Float32Array(count).fill(0).map(() => 0.01 + Math.random() * 0.02)
    };
    
    const material = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x88dd88,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const steam = new THREE.Points(geometry, material);
    steam.userData.isSteam = true;
    scene.add(steam);
    
    // Store reference for animation
    if (!window.cauldronSteam) window.cauldronSteam = [];
    window.cauldronSteam.push(steam);
}

function createBells() {
    // Position under fireplace mantle (left wall, inside fireplace area)
    const w = CONFIG.room.width;
    const x = -w/2 + 1.8, y = 3.8, z = 0;  // Under mantle, rotated to face into room
    
    const bellSizes = [0.08, 0.1, 0.12, 0.1, 0.08];
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xd4a855, metalness: 0.7, roughness: 0.25 });
    
    bellSizes.forEach((size, i) => {
        const bell = new THREE.Mesh(new THREE.ConeGeometry(size, size * 1.8, 16), bellMat);
        // Bells hang in a row along z axis (parallel to wall)
        bell.position.set(x, y, z - 0.4 + i * 0.2);
        bell.rotation.x = Math.PI;
        bell.castShadow = true;
        scene.add(bell);
        
        const string = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 0.15, 8),
            new THREE.MeshBasicMaterial({ color: 0x5a4a3a })
        );
        string.position.set(x, y + size * 1.8 / 2 + 0.075, z - 0.4 + i * 0.2);
        scene.add(string);
    });
    
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.8, 1.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z);
    interactZone.userData = { type: 'bells', ...CONFIG.interactives.bells };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createStairs() {
    // Floating miniature stairs in back left corner (under balcony stairs)
    // Hidden magical element that triggers the staircase puzzle
    const w = CONFIG.room.width;
    const d = CONFIG.room.depth;
    
    const x = -w/2 + 2.5;  // Left side
    const y = 1.5;          // Floating height
    const z = d/2 - 3;      // Back corner, under balcony
    
    const woodMat = new THREE.MeshStandardMaterial({ 
        color: 0x8b7355, 
        roughness: 0.6,
        emissive: 0x221100,
        emissiveIntensity: 0.1
    });
    
    // Create floating miniature staircase segments
    const stairsGroup = new THREE.Group();
    
    // 5 small floating stair segments that rotate slowly
    for (let i = 0; i < 5; i++) {
        const segment = new THREE.Group();
        
        // Small staircase piece (3 steps)
        for (let s = 0; s < 3; s++) {
            const step = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.03, 0.08),
                woodMat
            );
            step.position.set(0, s * 0.04, s * 0.05);
            segment.add(step);
        }
        
        // Position each segment floating around
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.4;
        segment.position.set(
            Math.cos(angle) * radius,
            Math.sin(i * 0.5) * 0.2,
            Math.sin(angle) * radius
        );
        segment.rotation.y = angle + Math.PI / 2;
        segment.rotation.x = Math.random() * 0.3 - 0.15;
        
        stairsGroup.add(segment);
    }
    
    stairsGroup.position.set(x, y, z);
    scene.add(stairsGroup);
    
    // Store reference for animation
    if (!window.floatingStairs) window.floatingStairs = [];
    window.floatingStairs.push(stairsGroup);
    
    // Soft magical glow
    const stairsGlow = new THREE.PointLight(0xaa8866, 0.3, 2);
    stairsGlow.position.set(x, y, z);
    scene.add(stairsGlow);
    
    // Interactive trigger zone
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 1.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z);
    interactZone.userData = { type: 'stairs', ...CONFIG.interactives.stairs };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createMezzanine() {
    const mezzMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.6 });
    const railMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium });
    
    // Right side mezzanine removed - only entrance balcony remains
    
    // === ENTRANCE BALCONY (back wall - player spawn point) ===
    createEntranceBalcony(mezzMat, railMat);
}

function createEntranceBalcony(mezzMat, railMat) {
    // Central entrance balcony spanning back wall - player spawns here
    // Use CONFIG values for consistency with player spawn
    const w = CONFIG.room.width;
    const d = CONFIG.room.depth;
    const balconyWidth = 12;  // Wide enough for grand entrance
    const balconyDepth = 3.5;
    // Floor level: player feet = startY - height, so platform top should be there
    const floorSurfaceY = CONFIG.player.startY - CONFIG.player.height;
    const platformThickness = 0.25;
    const platformCenterY = floorSurfaceY - platformThickness/2;  // Center of platform geometry
    const balconyZ = d/2 - 2.5;  // Near back wall
    
    // Main platform
    const entrancePlatform = new THREE.Mesh(
        new THREE.BoxGeometry(balconyWidth, platformThickness, balconyDepth), 
        mezzMat
    );
    entrancePlatform.position.set(0, platformCenterY, balconyZ);
    entrancePlatform.castShadow = true;
    entrancePlatform.receiveShadow = true;
    scene.add(entrancePlatform);
    // Collider for the floor surface (top at floorSurfaceY)
    addCollider(0, platformCenterY, balconyZ, balconyWidth, platformThickness, balconyDepth);
    
    // Stair opening positions (x = -4 and x = 4, width 1.8m each)
    const stairOpeningWidth = 1.8;
    const leftStairX = -4;
    const rightStairX = 4;
    
    // Front railing with gaps for stairs - 3 segments
    const railY = floorSurfaceY + 0.9;
    const railZ = balconyZ - balconyDepth/2 + 0.1;
    
    // Left segment: from -balconyWidth/2 to left stair opening
    const leftSegmentWidth = (balconyWidth/2 + leftStairX) - stairOpeningWidth/2;
    const leftSegmentX = -balconyWidth/2 + leftSegmentWidth/2;
    if (leftSegmentWidth > 0.2) {
        const leftRail = new THREE.Mesh(new THREE.BoxGeometry(leftSegmentWidth, 0.1, 0.12), railMat);
        leftRail.position.set(leftSegmentX, railY, railZ);
        scene.add(leftRail);
        addCollider(leftSegmentX, floorSurfaceY + 0.5, balconyZ - balconyDepth/2, leftSegmentWidth, 1, 0.2);
    }
    
    // Middle segment: between the two stair openings
    const middleSegmentWidth = (rightStairX - stairOpeningWidth/2) - (leftStairX + stairOpeningWidth/2);
    const middleSegmentX = 0;
    const middleRail = new THREE.Mesh(new THREE.BoxGeometry(middleSegmentWidth, 0.1, 0.12), railMat);
    middleRail.position.set(middleSegmentX, railY, railZ);
    scene.add(middleRail);
    addCollider(middleSegmentX, floorSurfaceY + 0.5, balconyZ - balconyDepth/2, middleSegmentWidth, 1, 0.2);
    
    // Right segment: from right stair opening to balconyWidth/2
    const rightSegmentWidth = (balconyWidth/2 - rightStairX) - stairOpeningWidth/2;
    const rightSegmentX = balconyWidth/2 - rightSegmentWidth/2;
    if (rightSegmentWidth > 0.2) {
        const rightRail = new THREE.Mesh(new THREE.BoxGeometry(rightSegmentWidth, 0.1, 0.12), railMat);
        rightRail.position.set(rightSegmentX, railY, railZ);
        scene.add(rightRail);
        addCollider(rightSegmentX, floorSurfaceY + 0.5, balconyZ - balconyDepth/2, rightSegmentWidth, 1, 0.2);
    }
    
    // Balusters - skip stair openings
    for (let i = 0; i < 20; i++) {
        const x = -balconyWidth/2 + 0.4 + i * (balconyWidth - 0.8) / 19;
        // Skip balusters in stair openings
        if (Math.abs(x - leftStairX) < stairOpeningWidth/2 + 0.1) continue;
        if (Math.abs(x - rightStairX) < stairOpeningWidth/2 + 0.1) continue;
        
        const baluster = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.8, 0.08), 
            railMat
        );
        baluster.position.set(x, floorSurfaceY + 0.5, railZ);
        scene.add(baluster);
    }
    
    // Side railings  
    [-balconyWidth/2 + 0.1, balconyWidth/2 - 0.1].forEach(x => {
        const sideRail = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.9, balconyDepth - 0.5),
            railMat
        );
        sideRail.position.set(x, floorSurfaceY + 0.55, balconyZ + 0.2);
        scene.add(sideRail);
        addCollider(x, floorSurfaceY + 0.5, balconyZ, 0.2, 1, balconyDepth);
    });
    
    // Support beams underneath
    [-3, 0, 3].forEach(dx => {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, floorSurfaceY, 0.25),
            mezzMat
        );
        beam.position.set(dx, floorSurfaceY / 2, balconyZ);
        beam.castShadow = true;
        scene.add(beam);
    });
    
    // Decorative brackets under balcony
    [-4, -2, 2, 4].forEach(dx => {
        const bracket = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.5, 0.8),
            railMat
        );
        bracket.position.set(dx, floorSurfaceY - 0.35, balconyZ - balconyDepth/2 + 0.5);
        scene.add(bracket);
    });
    
    // === STAIRS DOWN from balcony ===
    createBalconyStairs(-4, floorSurfaceY, balconyZ - balconyDepth/2, mezzMat, railMat);
    createBalconyStairs(4, floorSurfaceY, balconyZ - balconyDepth/2, mezzMat, railMat);
}

function createBalconyStairs(startX, startY, startZ, mezzMat, railMat) {
    // Staircase going DOWN from balcony (high at startZ, low at startZ - totalDepth)
    // Visual: individual steps. Mechanical: ramp collider for smooth walking
    const stepCount = 10;
    const stepHeight = startY / stepCount;
    const stepDepth = 0.4;
    const stepWidth = 1.6;
    const totalDepth = stepCount * stepDepth;
    
    // Railing on OUTSIDE (away from room center)
    const railSide = startX < 0 ? -stepWidth/2 - 0.1 : stepWidth/2 + 0.1;
    
    // Create VISUAL steps only (no individual colliders)
    for (let i = 0; i < stepCount; i++) {
        const stepY = startY - (i + 1) * stepHeight;
        const stepZ = startZ - i * stepDepth - stepDepth/2;
        
        const step = new THREE.Mesh(
            new THREE.BoxGeometry(stepWidth, 0.15, stepDepth),
            mezzMat
        );
        step.position.set(startX, stepY - 0.075, stepZ);
        step.castShadow = true;
        step.receiveShadow = true;
        scene.add(step);
    }
    
    // Create RAMP COLLIDERS - many thin walkable surfaces forming a slope
    // More segments = smoother walking
    const rampSegments = 30;
    const segmentDepth = totalDepth / rampSegments;
    for (let i = 0; i <= rampSegments; i++) {
        const t = i / rampSegments;
        const segY = startY * (1 - t);  // Height decreases from startY to 0
        const segZ = startZ - t * totalDepth;
        // Each segment is a thin platform the player can stand on
        addCollider(startX, segY, segZ, stepWidth, 0.15, segmentDepth + 0.05);
    }
    
    // Railing posts along the stairs (on outside edge)
    for (let i = 0; i <= stepCount; i += 2) {
        const postY = startY - i * stepHeight;
        const postZ = startZ - i * stepDepth;
        
        const post = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.9, 0.08),
            railMat
        );
        post.position.set(startX + railSide, postY + 0.45, postZ);
        scene.add(post);
    }
    
    // Handrail following the slope
    const railLength = Math.sqrt(totalDepth * totalDepth + startY * startY);
    const railAngle = -Math.atan2(startY, totalDepth);
    
    const handrail = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, railLength),
        railMat
    );
    handrail.position.set(
        startX + railSide,
        startY / 2 + 0.45,
        startZ - totalDepth / 2
    );
    handrail.rotation.x = railAngle;
    scene.add(handrail);
}

// ============================================================================
// PROPS
// ============================================================================
function createProps() {
    // === FIREPLACE LOUNGE ZONE ===
    createFireplaceLounge();
    
    createCandelabra(-0.5, 0.97, -3.2);
}

// ============================================================================
// FIREPLACE LOUNGE (Cozy area near fireplace with seating, rugs, book stacks)
// ============================================================================
function createFireplaceLounge() {
    // Position in front of fireplace (fireplace is at left wall, z=0)
    const w = CONFIG.room.width;
    const loungeX = -w/2 + 4;  // In front of fireplace
    const loungeZ = 0;         // Same Z as fireplace
    
    // === LARGE ORNATE RUG ===
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x5a2525, roughness: 0.95 });
    const rugBorderMat = new THREE.MeshStandardMaterial({ color: 0x3a1515, roughness: 0.95 });
    const rugGoldMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });
    
    // Main rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(loungeX, 0.003, loungeZ);
    rug.receiveShadow = true;
    scene.add(rug);
    
    // Inner border
    const innerBorder = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), rugBorderMat);
    innerBorder.rotation.x = -Math.PI / 2;
    innerBorder.position.set(loungeX, 0.004, loungeZ);
    scene.add(innerBorder);
    
    // Center pattern
    const centerPattern = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.8), rugMat);
    centerPattern.rotation.x = -Math.PI / 2;
    centerPattern.position.set(loungeX, 0.005, loungeZ);
    scene.add(centerPattern);
    
    // Gold trim lines
    [[-1.7, 0], [1.7, 0]].forEach(([dx, dz]) => {
        const trim = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 2.6), rugGoldMat);
        trim.rotation.x = -Math.PI / 2;
        trim.position.set(loungeX + dx, 0.006, loungeZ + dz);
        scene.add(trim);
    });
    
    // === ARMCHAIRS ===
    // Chair facing fireplace (angled)
    createLoungeChair(loungeX + 1.2, 0, loungeZ - 0.5, -Math.PI * 0.15);
    
    // Chair opposite (angled toward fireplace)
    createLoungeChair(loungeX - 1.2, 0, loungeZ + 0.5, Math.PI * 0.85);
    
    // === SMALL SIDE TABLE between chairs ===
    const tableMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.5 });
    const sideTableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 16), tableMat);
    sideTableTop.position.set(loungeX, 0.55, loungeZ);
    sideTableTop.castShadow = true;
    scene.add(sideTableTop);
    
    const sideTableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.53, 12), tableMat);
    sideTableLeg.position.set(loungeX, 0.265, loungeZ);
    scene.add(sideTableLeg);
    
    addCollider(loungeX, 0.3, loungeZ, 0.6, 0.6, 0.6);
    
    // Items on side table
    // Tea cup
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xddd8d0, roughness: 0.3 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.06, 12), cupMat);
    cup.position.set(loungeX - 0.08, 0.6, loungeZ + 0.05);
    scene.add(cup);
    
    // Saucer
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 12), cupMat);
    saucer.position.set(loungeX - 0.08, 0.575, loungeZ + 0.05);
    scene.add(saucer);
    
    // Small book on table
    const tableBook = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.025, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.8 })
    );
    tableBook.position.set(loungeX + 0.08, 0.585, loungeZ - 0.05);
    tableBook.rotation.y = 0.3;
    scene.add(tableBook);
    
    // === BOOK STACKS on floor ===
    createBookStack(loungeX - 1.5, 0, loungeZ - 1, 5, 0.2);
    createBookStack(loungeX + 1.6, 0, loungeZ + 0.8, 4, -0.15);
    createBookStack(loungeX - 0.3, 0, loungeZ + 1.3, 3, 0.4);
    
    // === THROW BLANKET draped over chair arm ===
    const blanketMat = new THREE.MeshStandardMaterial({ 
        color: 0x2a4a3a, 
        roughness: 0.95,
        side: THREE.DoubleSide
    });
    const blanket = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.8), blanketMat);
    blanket.position.set(loungeX + 1.55, 0.6, loungeZ - 0.5);
    blanket.rotation.set(-0.3, 0.2, 0.5);
    scene.add(blanket);
    
    // === RUNE STONES near hearth (decorative magic elements) ===
    createRuneStones(loungeX + 1.8, 0.01, loungeZ - 1.2);
}

function createLoungeChair(x, y, z, rotY) {
    const group = new THREE.Group();
    
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x3a1a0a, roughness: 0.7 });
    const woodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    
    // Seat cushion (larger, more comfortable looking)
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.7), leatherMat);
    seat.position.set(0, 0.42, 0);
    seat.castShadow = true;
    group.add(seat);
    
    // Back cushion (high back, winged)
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.15), leatherMat);
    back.position.set(0, 0.9, -0.28);
    back.rotation.x = 0.08;
    back.castShadow = true;
    group.add(back);
    
    // Wing sides
    [-0.4, 0.4].forEach(dx => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.4), leatherMat);
        wing.position.set(dx, 0.85, -0.1);
        wing.rotation.y = dx > 0 ? -0.2 : 0.2;
        group.add(wing);
    });
    
    // Armrests
    [-0.42, 0.42].forEach(dx => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.6), leatherMat);
        arm.position.set(dx, 0.58, 0);
        group.add(arm);
        
        // Arm supports
        const support = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.08), woodMat);
        support.position.set(dx, 0.45, 0.25);
        group.add(support);
    });
    
    // Wooden legs
    const legGeo = new THREE.SphereGeometry(0.05, 8, 8);
    [[-0.32, -0.28], [-0.32, 0.28], [0.32, -0.28], [0.32, 0.28]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(lx, 0.05, lz);
        group.add(leg);
        
        const legPost = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.04, 0.25, 8),
            woodMat
        );
        legPost.position.set(lx, 0.2, lz);
        group.add(legPost);
    });
    
    group.position.set(x, y, z);
    group.rotation.y = rotY;
    scene.add(group);
    
    addCollider(x, y + 0.5, z, 1, 1.4, 0.9);
}

function createBookStack(x, y, z, count, rotation) {
    for (let i = 0; i < count; i++) {
        const width = 0.18 + Math.random() * 0.08;
        const height = 0.025 + Math.random() * 0.015;
        const depth = 0.25 + Math.random() * 0.08;
        
        const bookMat = new THREE.MeshStandardMaterial({ 
            color: CONFIG.books.colorsSpine[Math.floor(Math.random() * CONFIG.books.colorsSpine.length)],
            roughness: 0.85
        });
        
        const book = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bookMat);
        book.position.set(
            x + (Math.random() - 0.5) * 0.05,
            y + 0.013 + i * 0.028,
            z + (Math.random() - 0.5) * 0.05
        );
        book.rotation.y = rotation + (Math.random() - 0.5) * 0.2;
        book.castShadow = true;
        scene.add(book);
    }
}

function createRuneStones(x, y, z) {
    const runeMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.8 });
    const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0xffaa44, 
        transparent: true, 
        opacity: 0.3 
    });
    
    // Small arrangement of rune stones
    const stonePositions = [
        { dx: 0, dz: 0, size: 0.06 },
        { dx: 0.12, dz: 0.05, size: 0.04 },
        { dx: -0.08, dz: 0.1, size: 0.05 },
        { dx: 0.05, dz: -0.08, size: 0.035 }
    ];
    
    stonePositions.forEach(stone => {
        // Stone
        const stoneMesh = new THREE.Mesh(
            new THREE.DodecahedronGeometry(stone.size, 0),
            runeMat
        );
        stoneMesh.position.set(x + stone.dx, y + stone.size * 0.8, z + stone.dz);
        stoneMesh.rotation.set(Math.random(), Math.random(), Math.random());
        stoneMesh.castShadow = true;
        scene.add(stoneMesh);
        
        // Subtle glow on some stones
        if (Math.random() > 0.5) {
            const glow = new THREE.Mesh(
                new THREE.CircleGeometry(stone.size * 1.5, 12),
                glowMat
            );
            glow.position.set(x + stone.dx, y + 0.002, z + stone.dz);
            glow.rotation.x = -Math.PI / 2;
            scene.add(glow);
        }
    });
}

function createArmchair(x, y, z) {
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x4a2515, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium });
    
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.6), chairMat);
    seat.position.set(x, y + 0.4, z);
    seat.castShadow = true;
    scene.add(seat);
    
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.12), chairMat);
    back.position.set(x, y + 0.85, z - 0.25);
    back.castShadow = true;
    scene.add(back);
    
    [-0.38, 0.38].forEach(dx => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.5), chairMat);
        arm.position.set(x + dx, y + 0.55, z);
        scene.add(arm);
    });
    
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
    [[-0.28, -0.22], [-0.28, 0.22], [0.28, -0.22], [0.28, 0.22]].forEach(([dx, dz]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(x + dx, y + 0.175, z + dz);
        scene.add(leg);
    });
    
    addCollider(x, y + 0.5, z, 0.9, 1.2, 0.8);
}

function createCandelabra(x, y, z) {
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.6, roughness: 0.3 });
    
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.05, 16), brassMat);
    base.position.set(x, y + 0.025, z);
    scene.add(base);
    
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.2, 8), brassMat);
    stem.position.set(x, y + 0.15, z);
    scene.add(stem);
    
    [-0.08, 0, 0.08].forEach((dx, i) => {
        const candleY = y + 0.25 + (i === 1 ? 0.05 : 0);
        
        if (i !== 1) {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), brassMat);
            arm.position.set(x + dx/2, y + 0.22, z);
            scene.add(arm);
        }
        
        const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.03, 8), brassMat);
        holder.position.set(x + dx, candleY, z);
        scene.add(holder);
        
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.018, 0.08, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
        );
        candle.position.set(x + dx, candleY + 0.055, z);
        scene.add(candle);
        
        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.012, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa44 })
        );
        flame.position.set(x + dx, candleY + 0.1, z);
        floatingCandles.push({ mesh: flame, baseY: candleY + 0.1 });
        scene.add(flame);
    });
}

// ============================================================================
// FLOATING CANDLES → CHANDELIERS & WALL SCONCES (physically anchored)
// ============================================================================
function createFloatingCandles() {
    // Floating candles - OPTIMIZED for performance
    // Reduced count, fewer lights
    
    // Main cluster above center (reduced from 15 to 6)
    for (let i = 0; i < 6; i++) {
        const fx = (Math.random() - 0.5) * 10;
        const fy = 6 + Math.random() * 3;
        const fz = (Math.random() - 0.5) * 8;
        createFloatingCandle(fx, fy, fz);
    }
    
    // Cluster above desk area (reduced from 8 to 3)
    for (let i = 0; i < 3; i++) {
        const fx = (Math.random() - 0.5) * 3;
        const fy = 4 + Math.random() * 2;
        const fz = -3 + (Math.random() - 0.5) * 2;
        createFloatingCandle(fx, fy, fz);
    }
    
    // One central chandelier
    createGrandChandelier(0, 8, -1);
    
    // Wall sconces (reduced from 6 to 4)
    createWallSconce(-8.5, 3, -1, Math.PI/2);
    createWallSconce(8.5, 3, -1, -Math.PI/2);
    createWallSconce(-4, 3, -6.8, 0);
    createWallSconce(4, 3, -6.8, 0);
    
    // One magical candle near orb
    createMagicalCandle(0.5, 2.5, -2.5);
}

// Single floating candle - NO individual lights for performance
function createFloatingCandle(x, y, z) {
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.3 });
    const flameMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa33, 
        emissive: 0xff6600, 
        emissiveIntensity: 1.2  // Brighter emissive to compensate for no light
    });
    
    // Candle body (tall and thin)
    const candleHeight = 0.15 + Math.random() * 0.1;
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, candleHeight, 6),  // Reduced segments
        candleMat
    );
    candle.position.set(x, y, z);
    scene.add(candle);
    
    // Flame with bright emissive (no point light needed)
    const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.012, 0.04, 6),  // Reduced segments
        flameMat
    );
    flame.position.set(x, y + candleHeight/2 + 0.02, z);
    scene.add(flame);
    // NO point light - emissive material provides glow effect
}

function createGrandChandelier(x, y, z) {
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x8b7355, 
        metalness: 0.7, 
        roughness: 0.3 
    });
    const goldMat = new THREE.MeshStandardMaterial({ 
        color: 0xc9a227, 
        metalness: 0.8, 
        roughness: 0.2 
    });
    
    // Simplified chain (cylinder instead of individual links)
    const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2.5, 6),
        metalMat
    );
    chain.position.set(x, CONFIG.room.height - 1.5, z);
    scene.add(chain);
    
    // Central hub (reduced segments)
    const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 8),
        goldMat
    );
    hub.position.set(x, y + 0.3, z);
    scene.add(hub);
    
    // Main ring (reduced segments)
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.8, 0.04, 8, 16),
        metalMat
    );
    ring.position.set(x, y, z);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Inner ring
    const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 12, 24),
        goldMat
    );
    innerRing.position.set(x, y - 0.1, z);
    innerRing.rotation.x = Math.PI / 2;
    scene.add(innerRing);
    
    // Connecting spokes
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const spoke = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
            metalMat
        );
        spoke.position.set(
            x + Math.cos(angle) * 0.45,
            y + 0.15,
            z + Math.sin(angle) * 0.45
        );
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.y = angle;
        scene.add(spoke);
    }
    
    // Candles on outer ring (8 candles)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cx = x + Math.cos(angle) * 0.75;
        const cz = z + Math.sin(angle) * 0.75;
        
        // Candle holder
        const holder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.05, 0.04, 12),
            goldMat
        );
        holder.position.set(cx, y - 0.02, cz);
        scene.add(holder);
        
        // Candle
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.03, 0.12, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
        );
        candle.position.set(cx, y + 0.06, cz);
        scene.add(candle);
        
        // Flame
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.015, 0.04, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 })
        );
        flame.position.set(cx, y + 0.14, cz);
        scene.add(flame);
        
        floatingCandles.push({
            mesh: candle,
            flame: flame,
            baseY: y + 0.14,
            phase: i * 0.5
        });
    }
    
    // Candles on inner ring (4 candles)
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const cx = x + Math.cos(angle) * 0.35;
        const cz = z + Math.sin(angle) * 0.35;
        
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.025, 0.1, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
        );
        candle.position.set(cx, y - 0.05, cz);
        scene.add(candle);
        
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.012, 0.035, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 })
        );
        flame.position.set(cx, y + 0.02, cz);
        scene.add(flame);
        
        floatingCandles.push({
            mesh: candle,
            flame: flame,
            baseY: y + 0.02,
            phase: i * 0.7 + 2
        });
    }
    
    // Central chandelier light
    const chandelierLight = new THREE.PointLight(0xff9944, 1.5, 12);
    chandelierLight.position.set(x, y - 0.2, z);
    chandelierLight.castShadow = true;
    chandelierLight.shadow.mapSize.width = 512;
    chandelierLight.shadow.mapSize.height = 512;
    scene.add(chandelierLight);
}

function createSmallChandelier(x, y, z) {
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x6b5344, 
        metalness: 0.6, 
        roughness: 0.4 
    });
    
    // Chain
    for (let i = 0; i < 5; i++) {
        const link = new THREE.Mesh(
            new THREE.TorusGeometry(0.03, 0.01, 8, 10),
            metalMat
        );
        link.position.set(x, CONFIG.room.height - 0.2 - i * 0.12, z);
        link.rotation.x = i % 2 === 0 ? 0 : Math.PI / 2;
        scene.add(link);
    }
    
    // Simple ring
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.025, 10, 20),
        metalMat
    );
    ring.position.set(x, y, z);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // 5 candles
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const cx = x + Math.cos(angle) * 0.32;
        const cz = z + Math.sin(angle) * 0.32;
        
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.025, 0.1, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
        );
        candle.position.set(cx, y + 0.05, cz);
        scene.add(candle);
        
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.012, 0.03, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 })
        );
        flame.position.set(cx, y + 0.12, cz);
        scene.add(flame);
        
        floatingCandles.push({
            mesh: candle,
            flame: flame,
            baseY: y + 0.12,
            phase: i * 0.6 + x
        });
    }
    
    // Light
    const light = new THREE.PointLight(0xff9944, 0.6, 6);
    light.position.set(x, y, z);
    scene.add(light);
}

function createWallSconce(x, y, z, rotY) {
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x6b5344, 
        metalness: 0.5, 
        roughness: 0.5 
    });
    
    const group = new THREE.Group();
    group.rotation.y = rotY;
    
    // Wall plate
    const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.2, 0.03),
        metalMat
    );
    plate.position.set(0, 0, 0);
    group.add(plate);
    
    // Arm extending from wall
    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, 0.2),
        metalMat
    );
    arm.position.set(0, 0, 0.12);
    group.add(arm);
    
    // Candle holder cup
    const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.03, 0.04, 12),
        metalMat
    );
    cup.position.set(0, 0.02, 0.22);
    group.add(cup);
    
    // Candle
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, 0.15, 8),
        new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
    );
    candle.position.set(0, 0.11, 0.22);
    group.add(candle);
    
    // Flame
    const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.04, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    );
    flame.position.set(0, 0.2, 0.22);
    group.add(flame);
    
    group.position.set(x, y, z);
    scene.add(group);
    
    // Light
    const light = new THREE.PointLight(0xff8833, 0.4, 4);
    const worldPos = new THREE.Vector3(0, 0.15, 0.25);
    worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    light.position.set(x + worldPos.x, y + worldPos.y, z + worldPos.z);
    scene.add(light);
    
    floatingCandles.push({
        mesh: candle,
        flame: flame,
        baseY: 0.2,
        phase: x + z
    });
}

function createMagicalCandle(x, y, z) {
    // A few truly floating candles with visible magical aura - near the orb/magical areas
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
    );
    candle.position.set(x, y, z);
    candle.castShadow = true;
    scene.add(candle);
    
    // Flame
    const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.04, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    );
    flame.position.set(x, y + 0.08, z);
    scene.add(flame);
    
    // Magical glow ring around candle (visible magical support)
    const magicRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.008, 8, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x88aaff, 
            transparent: true, 
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        })
    );
    magicRing.position.set(x, y - 0.02, z);
    magicRing.rotation.x = Math.PI / 2;
    scene.add(magicRing);
    
    // Subtle particles/sparkles around the candle
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = 8;
    const positions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
        const angle = (i / sparkleCount) * Math.PI * 2;
        const radius = 0.06 + Math.random() * 0.04;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const sparkles = new THREE.Points(sparkleGeo, new THREE.PointsMaterial({
        color: 0xaabbff,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    }));
    sparkles.position.set(x, y, z);
    scene.add(sparkles);
    
    // Light
    const glow = new THREE.PointLight(0xff8833, 0.3, 2);
    glow.position.set(x, y + 0.05, z);
    scene.add(glow);
    
    floatingCandles.push({
        mesh: candle,
        flame: flame,
        magicRing: magicRing,
        sparkles: sparkles,
        baseY: y,
        phase: x * 2 + z,
        isMagical: true
    });
}
