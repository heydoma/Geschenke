// ============================================================================
// ESCAPE ROOM - FURNITURE
// Die Verbotene Abteilung - Fireplace, Bookshelves, Desk, Props
// ============================================================================

// ============================================================================
// FIREPLACE (Classic stone fireplace)
// ============================================================================
function createFireplace() {
    const x = -7.5, y = 0, z = -5.5;
    
    // Materials
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6a625a, roughness: 0.8 });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 0.9 });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0x8a827a, roughness: 0.4, metalness: 0.1 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x6a3a2a, roughness: 0.85 });
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x020202 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.7, roughness: 0.3 });
    
    // === MAIN SURROUND ===
    // Left column
    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.5, 0.6), marbleMat);
    leftCol.position.set(x - 1.6, 2.25, z + 0.3);
    leftCol.castShadow = true;
    scene.add(leftCol);
    
    // Right column
    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.5, 0.6), marbleMat);
    rightCol.position.set(x + 1.6, 2.25, z + 0.3);
    rightCol.castShadow = true;
    scene.add(rightCol);
    
    // Column caps
    [-1.6, 1.6].forEach(dx => {
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.8), stoneMat);
        cap.position.set(x + dx, 4.6, z + 0.3);
        scene.add(cap);
        
        // Decorative ball on top
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), goldMat);
        ball.position.set(x + dx, 4.85, z + 0.3);
        scene.add(ball);
    });
    
    // === MANTLE ===
    const mantle = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 1.2), marbleMat);
    mantle.position.set(x, 4.5, z + 0.4);
    mantle.castShadow = true;
    mantle.receiveShadow = true;
    scene.add(mantle);
    
    // Mantle front edge detail
    const mantleEdge = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 0.15), darkStoneMat);
    mantleEdge.position.set(x, 4.35, z + 0.95);
    scene.add(mantleEdge);
    
    // === FIRE OPENING ===
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.5, 0.3), darkStoneMat);
    backWall.position.set(x, 1.75, z - 0.1);
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // Interior brick pattern
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 5; col++) {
            const brick = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.08), brickMat);
            const offsetX = (row % 2) * 0.22;
            brick.position.set(x - 1.0 + col * 0.5 + offsetX, 0.3 + row * 0.25, z + 0.06);
            scene.add(brick);
        }
    }
    
    // Dark fire opening recess
    const opening = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.4), darkMat);
    opening.position.set(x, 1.4, z + 0.25);
    scene.add(opening);
    
    // === ARCH ===
    const archMat = new THREE.MeshStandardMaterial({ color: 0x5a524a, roughness: 0.6 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.18, 12, 16, Math.PI), archMat);
    arch.position.set(x, 2.65, z + 0.5);
    arch.rotation.x = Math.PI / 2;
    arch.castShadow = true;
    scene.add(arch);
    
    // Keystone
    const keystone = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.25), stoneMat);
    keystone.position.set(x, 3.75, z + 0.5);
    scene.add(keystone);
    
    // === HEARTH ===
    const hearth = new THREE.Mesh(new THREE.BoxGeometry(4, 0.12, 2), darkStoneMat);
    hearth.position.set(x, 0.06, z + 0.8);
    hearth.receiveShadow = true;
    scene.add(hearth);
    
    const hearthBorder = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.15), stoneMat);
    hearthBorder.position.set(x, 0.16, z + 1.85);
    scene.add(hearthBorder);
    
    // === FIRE GRATE ===
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.4 });
    const grateBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.8), grateMat);
    grateBase.position.set(x, 0.18, z + 0.4);
    scene.add(grateBase);
    
    for (let i = 0; i < 5; i++) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), grateMat);
        bar.position.set(x - 0.6 + i * 0.3, 0.18, z + 0.4);
        bar.rotation.x = Math.PI / 2;
        scene.add(bar);
    }
    
    // === LOGS ===
    const logMat = new THREE.MeshStandardMaterial({ color: 0x3a2510, roughness: 0.95 });
    const burntMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.9 });
    
    [[-0.4, 0.35], [0.4, 0.32], [0, 0.45]].forEach(([dx, dz], i) => {
        const mat = i === 2 ? burntMat : logMat;
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.9, 12), mat);
        log.position.set(x + dx, 0.32, z + dz);
        log.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
        log.rotation.y = (Math.random() - 0.5) * 0.3;
        scene.add(log);
    });
    
    for (let i = 0; i < 4; i++) {
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.4, 6), burntMat);
        stick.position.set(x + (Math.random() - 0.5) * 0.6, 0.22, z + 0.3 + Math.random() * 0.3);
        stick.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
        scene.add(stick);
    }
    
    // === DECORATIONS ON MANTLE ===
    [-1.2, 1.2].forEach(dx => {
        const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12), goldMat);
        holder.position.set(x + dx, 4.72, z + 0.4);
        scene.add(holder);
        
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8), 
            new THREE.MeshStandardMaterial({ color: 0xf5ead0 }));
        candle.position.set(x + dx, 4.86, z + 0.4);
        scene.add(candle);
        
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 }));
        flame.position.set(x + dx, 5.0, z + 0.4);
        scene.add(flame);
        
        floatingCandles.push({ mesh: flame, baseY: 5.0, phase: Math.random() * Math.PI * 2 });
    });
    
    // Mirror frame
    const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.08), goldMat);
    frameOuter.position.set(x, 5.2, z + 0.4);
    scene.add(frameOuter);
    
    const frameInner = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), 
        new THREE.MeshBasicMaterial({ color: 0x222222 }));
    frameInner.position.set(x, 5.2, z + 0.42);
    scene.add(frameInner);
    
    addCollider(x, 2.5, z, 4.5, 5, 2);
    
    // Particles
    createFireParticles(x, z);
    createEmberParticles(x, z);
    
    // Soot
    const sootGeo = new THREE.PlaneGeometry(2, 1);
    const sootMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.3 });
    const soot = new THREE.Mesh(sootGeo, sootMat);
    soot.rotation.x = -Math.PI / 2;
    soot.position.set(x, 0.003, z + 1);
    scene.add(soot);
    
    // Interactive zone
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 4, 2.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, 2, z + 0.5);
    interactZone.userData = { type: 'fireplace', ...CONFIG.interactives.fireplace };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

// ============================================================================
// BOOKSHELVES
// ============================================================================
function createBookshelves() {
    createGiantBackBookshelf();
    createInteractiveBookZone(-2.5, 4, 6.3, 'bookshelfLeft', CONFIG.interactives.bookshelfLeft);
    createInteractiveBookZone(2.5, 4, 6.3, 'bookshelfRight', CONFIG.interactives.bookshelfRight);
    
    // Side wall shelves
    createBookshelf(-8.8, 0, 0, Math.PI/2, null, null, true);
    createBookshelf(-8.8, 0, 3, Math.PI/2, null, null, true);
    createBookshelf(8.8, 0, 0, -Math.PI/2, null, null, true);
    createBookshelf(8.8, 0, 3, -Math.PI/2, null, null, true);
    
    createInstancedBooks();
}

function createGiantBackBookshelf() {
    const shelfWidth = 15;
    const shelfHeight = 8.5;
    const shelfDepth = 0.9;
    const x = 0, z = 6.5;
    
    const frameMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodDark, roughness: 0.7 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium, roughness: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.5 });
    
    // Main back panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.15), frameMat);
    backPanel.position.set(x, shelfHeight/2, z - shelfDepth/2);
    backPanel.receiveShadow = true;
    scene.add(backPanel);
    
    // Vertical dividers
    [-6, -3, 0, 3, 6].forEach(dx => {
        const divider = new THREE.Mesh(new THREE.BoxGeometry(0.12, shelfHeight, shelfDepth), shelfMat);
        divider.position.set(x + dx, shelfHeight/2, z);
        divider.castShadow = true;
        scene.add(divider);
    });
    
    // Side frames
    [-shelfWidth/2, shelfWidth/2].forEach(dx => {
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, shelfHeight, shelfDepth + 0.1), frameMat);
        side.position.set(x + dx, shelfHeight/2, z);
        side.castShadow = true;
        scene.add(side);
    });
    
    // Horizontal shelves
    for (let sy = 0.8; sy <= 7.8; sy += 1.0) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth - 0.2, 0.06, shelfDepth - 0.1), shelfMat);
        shelf.position.set(x, sy, z);
        shelf.receiveShadow = true;
        scene.add(shelf);
    }
    
    // Crown molding
    const crown = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.3, 0.25, shelfDepth + 0.2), accentMat);
    crown.position.set(x, shelfHeight + 0.125, z);
    scene.add(crown);
    
    const topDeco = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.1, 0.12, 0.15), accentMat);
    topDeco.position.set(x, shelfHeight + 0.3, z + shelfDepth/2);
    scene.add(topDeco);
    
    // Base molding
    const base = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth + 0.2, 0.15, shelfDepth + 0.15), accentMat);
    base.position.set(x, 0.075, z);
    scene.add(base);
    
    addCollider(x, shelfHeight/2, z, shelfWidth, shelfHeight, shelfDepth + 0.3);
}

function createInteractiveBookZone(x, y, z, name, config) {
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 1.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z + 0.5);
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
    
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8, 0.9), frameMat);
    frame.position.y = 4;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);
    
    const crown = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 1), shelfMat);
    crown.position.set(0, 8, 0);
    group.add(crown);
    
    for (let sy = 0.8; sy <= 7.2; sy += 1.1) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.75), shelfMat);
        shelf.position.set(0, sy, 0.1);
        shelf.receiveShadow = true;
        group.add(shelf);
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
    const bookGeo = new THREE.BoxGeometry(1, 1, 1);
    const bookMat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 });
    
    const instanceCount = CONFIG.books.totalCount;
    bookInstances = new THREE.InstancedMesh(bookGeo, bookMat, instanceCount);
    bookInstances.castShadow = true;
    bookInstances.receiveShadow = true;
    
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    
    const shelfConfigs = [
        { x: -5.5, z: 6.3, rotY: Math.PI, shelves: 8, width: 2.5 },
        { x: -2.5, z: 6.3, rotY: Math.PI, shelves: 8, width: 2.5 },
        { x: 0.5, z: 6.3, rotY: Math.PI, shelves: 8, width: 2.5 },
        { x: 2.5, z: 6.3, rotY: Math.PI, shelves: 8, width: 2.5 },
        { x: 5.5, z: 6.3, rotY: Math.PI, shelves: 8, width: 2.5 },
        { x: -8.4, z: 0, rotY: Math.PI/2, shelves: 7, width: 1.8 },
        { x: -8.4, z: 3, rotY: Math.PI/2, shelves: 7, width: 1.8 },
        { x: 8.4, z: 0, rotY: -Math.PI/2, shelves: 7, width: 1.8 },
        { x: 8.4, z: 3, rotY: -Math.PI/2, shelves: 7, width: 1.8 },
    ];
    
    let bookIndex = 0;
    
    shelfConfigs.forEach(config => {
        const halfWidth = (config.width || 1.8) / 2;
        for (let shelfY = 0; shelfY < config.shelves; shelfY++) {
            const y = 0.9 + shelfY * 0.95;
            let localX = -halfWidth + 0.1;
            
            while (localX < halfWidth - 0.1 && bookIndex < instanceCount) {
                const bookWidth = 0.05 + Math.random() * 0.1;
                const bookHeight = 0.45 + Math.random() * 0.4;
                const bookDepth = 0.3 + Math.random() * 0.2;
                const lean = (Math.random() - 0.5) * 0.08;
                
                if (config.rotY === 0) {
                    position.set(config.x + localX, y + bookHeight/2, config.z);
                } else if (config.rotY === Math.PI/2) {
                    position.set(config.x, y + bookHeight/2, config.z + localX);
                } else {
                    position.set(config.x, y + bookHeight/2, config.z - localX);
                }
                
                quaternion.setFromEuler(new THREE.Euler(0, config.rotY + lean, lean * 0.5));
                scale.set(bookWidth, bookHeight, bookDepth);
                
                matrix.compose(position, quaternion, scale);
                bookInstances.setMatrixAt(bookIndex, matrix);
                
                const colorHex = CONFIG.books.colorsSpine[Math.floor(Math.random() * CONFIG.books.colorsSpine.length)];
                color.setHex(colorHex);
                bookInstances.setColorAt(bookIndex, color);
                
                localX += bookWidth + 0.01 + Math.random() * 0.02;
                if (Math.random() < 0.08) localX += 0.1;
                bookIndex++;
            }
        }
    });
    
    // Books on floor
    for (let i = 0; i < 30 && bookIndex < instanceCount; i++) {
        const stackX = -3 + Math.random() * 6;
        const stackZ = -4 + Math.random() * 8;
        
        for (let j = 0; j < 3 + Math.floor(Math.random() * 4) && bookIndex < instanceCount; j++) {
            const bookWidth = 0.15 + Math.random() * 0.1;
            const bookHeight = 0.02 + Math.random() * 0.02;
            const bookDepth = 0.25 + Math.random() * 0.1;
            
            position.set(stackX + (Math.random() - 0.5) * 0.1, 0.01 + j * 0.025, stackZ + (Math.random() - 0.5) * 0.1);
            quaternion.setFromEuler(new THREE.Euler(Math.PI/2, Math.random() * 0.5, 0));
            scale.set(bookWidth, bookHeight, bookDepth);
            
            matrix.compose(position, quaternion, scale);
            bookInstances.setMatrixAt(bookIndex, matrix);
            
            color.setHex(CONFIG.books.colorsSpine[Math.floor(Math.random() * CONFIG.books.colorsSpine.length)]);
            bookInstances.setColorAt(bookIndex, color);
            bookIndex++;
        }
    }
    
    bookInstances.instanceMatrix.needsUpdate = true;
    bookInstances.instanceColor.needsUpdate = true;
    scene.add(bookInstances);
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
    
    addCollider(x, 0.5, z, 3.8, 1, 2);
    
    // Interactive zone
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 2.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, 1, z + 0.5);
    interactZone.userData = { type: 'desk', ...CONFIG.interactives.desk };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
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
// OTHER INTERACTABLES
// ============================================================================
function createPotionShelf() {
    const x = 7.5, y = 2.5, z = -5;
    
    const shelfMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium });
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2, 0.08, 0.5), shelfMat);
    shelf.position.set(x, y, z);
    shelf.castShadow = true;
    scene.add(shelf);
    
    [-0.8, 0.8].forEach(dx => {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), shelfMat);
        bracket.position.set(x + dx, y - 0.15, z);
        scene.add(bracket);
    });
    
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
            new THREE.MeshStandardMaterial({ color: conf.color, transparent: true, opacity: 0.7, roughness: 0.2 })
        );
        bottle.position.set(x + conf.dx, y + 0.04 + conf.h/2, z);
        bottle.castShadow = true;
        scene.add(bottle);
        
        const cork = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.03, 0.03, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        cork.position.set(x + conf.dx, y + 0.04 + conf.h + 0.015, z);
        scene.add(cork);
    });
    
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 1.5, 1),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z);
    interactZone.userData = { type: 'potions', ...CONFIG.interactives.potions };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createBells() {
    const x = -7.5, y = 4.2, z = -5.5;
    
    const bellSizes = [0.08, 0.1, 0.12, 0.1, 0.08];
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xd4a855, metalness: 0.7, roughness: 0.25 });
    
    bellSizes.forEach((size, i) => {
        const bell = new THREE.Mesh(new THREE.ConeGeometry(size, size * 1.8, 16), bellMat);
        bell.position.set(x - 0.4 + i * 0.2, y, z);
        bell.rotation.x = Math.PI;
        bell.castShadow = true;
        scene.add(bell);
        
        const string = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 0.15, 8),
            new THREE.MeshBasicMaterial({ color: 0x5a4a3a })
        );
        string.position.set(x - 0.4 + i * 0.2, y + size * 1.8 / 2 + 0.075, z);
        scene.add(string);
    });
    
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.8, 0.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, y, z);
    interactZone.userData = { type: 'bells', ...CONFIG.interactives.bells };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createStairs() {
    const x = 7.5, y = 0, z = 3;
    const stepMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.6 });
    
    for (let i = 0; i < 8; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, 0.35), stepMat);
        step.position.set(x, 0.15 + i * 0.35, z - i * 0.4);
        step.castShadow = true;
        step.receiveShadow = true;
        scene.add(step);
        addCollider(x, 0.15 + i * 0.35, z - i * 0.4, 2, 0.35, 0.4);
    }
    
    const railMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 3.5), railMat);
    rail.position.set(x + 1.1, 1.8, z - 1.4);
    rail.rotation.x = Math.atan(0.35 / 0.4);
    scene.add(rail);
    addCollider(x + 1.1, 1.8, z - 1.4, 0.15, 1.5, 3.5);
    
    const interactZone = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 4),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    interactZone.position.set(x, 1.5, z - 1);
    interactZone.userData = { type: 'stairs', ...CONFIG.interactives.stairs };
    interactiveObjects.push(interactZone);
    scene.add(interactZone);
}

function createMezzanine() {
    const mezzMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight, roughness: 0.6 });
    const railMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium });
    
    const platform = new THREE.Mesh(new THREE.BoxGeometry(5, 0.15, 4), mezzMat);
    platform.position.set(6.5, 3, 1);
    platform.castShadow = true;
    platform.receiveShadow = true;
    scene.add(platform);
    addCollider(6.5, 3, 1, 5, 0.2, 4);
    
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 0.08), railMat);
    frontRail.position.set(6.5, 3.9, 3);
    scene.add(frontRail);
    
    for (let i = 0; i < 8; i++) {
        const baluster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.06), railMat);
        baluster.position.set(4.3 + i * 0.65, 3.5, 3);
        scene.add(baluster);
    }
    addCollider(6.5, 3.5, 3.1, 5, 1, 0.2);
    
    [4.5, 8.5].forEach(px => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), mezzMat);
        beam.position.set(px, 1.5, -0.5);
        beam.castShadow = true;
        scene.add(beam);
        addCollider(px, 1.5, -0.5, 0.3, 3, 0.3);
    });
}

// ============================================================================
// PROPS
// ============================================================================
function createProps() {
    // Globe on mezzanine
    const globeStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodMedium })
    );
    globeStand.position.set(5.5, 3.55, 1);
    scene.add(globeStand);
    
    const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x2a5a4a, roughness: 0.4 })
    );
    globe.position.set(5.5, 4.3, 1);
    globe.castShadow = true;
    scene.add(globe);
    
    // Ladder
    const ladderMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.woodLight });
    const ladderGroup = new THREE.Group();
    
    [-0.25, 0.25].forEach(dx => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.5, 0.05), ladderMat);
        rail.position.set(dx, 1.75, 0);
        ladderGroup.add(rail);
    });
    
    for (let i = 0; i < 10; i++) {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.04), ladderMat);
        rung.position.set(0, 0.3 + i * 0.35, 0);
        ladderGroup.add(rung);
    }
    
    ladderGroup.position.set(-4, 0, -6.3);
    ladderGroup.rotation.x = -0.15;
    scene.add(ladderGroup);
    addCollider(-4, 1.75, -6.3, 0.6, 3.5, 0.2);
    
    // Carpet
    const carpet = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        new THREE.MeshStandardMaterial({ color: 0x4a2a2a, roughness: 0.9 })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(-6, 0.005, -3);
    scene.add(carpet);
    
    const border = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 1.6),
        new THREE.MeshBasicMaterial({ color: 0x3a1a1a })
    );
    border.rotation.x = -Math.PI / 2;
    border.position.set(-6, 0.006, -3);
    scene.add(border);
    
    createArmchair(-5, 0, -2);
    createCandelabra(-0.5, 0.97, -3.2);
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
// FLOATING CANDLES
// ============================================================================
function createFloatingCandles() {
    const candlePositions = [
        [-2, 7.5, -2], [2, 7.8, -1], [-1, 7.2, 1], [3, 7.6, 2],
        [-3, 7.4, 0], [1, 7.9, -3], [-4, 7.3, 2], [4, 7.7, -2],
        [0, 7.5, 0], [-5, 7.6, -4], [5, 7.4, -4], [0, 7.8, -5],
        [-2, 7.3, 3], [2, 7.5, 4], [-4, 7.7, -1], [4, 7.2, 1],
        [-6, 5.5, -2], [6, 5.8, -2], [-3, 5.2, 4], [3, 5.6, 4],
        [0, 6.0, 2], [-5, 5.4, 1], [5, 5.3, 0]
    ];
    
    candlePositions.forEach(([x, y, z]) => {
        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.035, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5e6d3 })
        );
        candle.position.set(x, y, z);
        candle.castShadow = true;
        scene.add(candle);
        
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.015, 0.04, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 })
        );
        flame.position.set(x, y + 0.095, z);
        scene.add(flame);
        
        const glow = new THREE.PointLight(0xff8833, 0.3, 2);
        glow.position.set(x, y + 0.1, z);
        scene.add(glow);
        
        floatingCandles.push({
            mesh: candle,
            flame,
            light: glow,
            baseY: y,
            phase: Math.random() * Math.PI * 2
        });
    });
}
