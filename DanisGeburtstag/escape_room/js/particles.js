// ============================================================================
// ESCAPE ROOM - PARTICLES
// Die Verbotene Abteilung - Fire, Dust, Embers, Magic Effects
// ============================================================================

// ============================================================================
// FIRE PARTICLES
// ============================================================================
function createFireParticles(baseX, baseZ) {
    const count = CONFIG.particles.fireCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = baseX + (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 1] = 0.3 + Math.random() * 2;
        positions[i * 3 + 2] = baseZ + 0.3 + Math.random() * 0.4;
        
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.5;
        colors[i * 3 + 2] = 0.05;
        
        sizes[i] = 0.08 + Math.random() * 0.15;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.userData = {
        baseX, baseZ,
        velocities: new Float32Array(count).fill(0).map(() => 0.015 + Math.random() * 0.035),
        lifetimes: new Float32Array(count).fill(0).map(() => Math.random())
    };
    
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    fireParticles = new THREE.Points(geometry, material);
    scene.add(fireParticles);
}

function updateFireParticles(time) {
    if (!fireParticles) return;
    
    const positions = fireParticles.geometry.attributes.position.array;
    const colors = fireParticles.geometry.attributes.color.array;
    const { baseX, baseZ, velocities, lifetimes } = fireParticles.geometry.userData;
    
    for (let i = 0; i < CONFIG.particles.fireCount; i++) {
        lifetimes[i] += 0.025;
        
        if (lifetimes[i] > 1) {
            positions[i * 3] = baseX + (Math.random() - 0.5) * 1.5;
            positions[i * 3 + 1] = 0.3;
            positions[i * 3 + 2] = baseZ + 0.3;
            lifetimes[i] = 0;
        }
        
        positions[i * 3] += Math.sin(time * 8 + i) * 0.004;
        positions[i * 3 + 1] += velocities[i];
        
        const life = lifetimes[i];
        colors[i * 3] = 1.0 - life * 0.2;
        colors[i * 3 + 1] = 0.4 - life * 0.35;
        colors[i * 3 + 2] = 0.05;
    }
    
    fireParticles.geometry.attributes.position.needsUpdate = true;
    fireParticles.geometry.attributes.color.needsUpdate = true;
}

// ============================================================================
// EMBER PARTICLES
// ============================================================================
function createEmberParticles(baseX, baseZ) {
    const count = CONFIG.particles.emberCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = baseX + (Math.random() - 0.5) * 3;
        positions[i * 3 + 1] = 1 + Math.random() * 4;
        positions[i * 3 + 2] = baseZ + (Math.random() - 0.5) * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = {
        baseX, baseZ,
        velocities: new Float32Array(count * 3).fill(0).map((_, i) => {
            const axis = i % 3;
            if (axis === 1) return 0.005 + Math.random() * 0.01;
            return (Math.random() - 0.5) * 0.008;
        }),
        lifetimes: new Float32Array(count).fill(0).map(() => Math.random())
    };
    
    const material = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xff6600,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    emberParticles = new THREE.Points(geometry, material);
    scene.add(emberParticles);
}

function updateEmberParticles(time, delta) {
    if (!emberParticles) return;
    
    const positions = emberParticles.geometry.attributes.position.array;
    const { baseX, baseZ, velocities, lifetimes } = emberParticles.geometry.userData;
    
    for (let i = 0; i < CONFIG.particles.emberCount; i++) {
        lifetimes[i] += delta * 0.3;
        
        if (lifetimes[i] > 1) {
            positions[i * 3] = baseX + (Math.random() - 0.5) * 1.5;
            positions[i * 3 + 1] = 1;
            positions[i * 3 + 2] = baseZ + (Math.random() - 0.5);
            lifetimes[i] = 0;
        }
        
        positions[i * 3] += velocities[i * 3] + Math.sin(time * 3 + i) * 0.002;
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
    }
    
    emberParticles.geometry.attributes.position.needsUpdate = true;
}

// ============================================================================
// DUST PARTICLES
// ============================================================================
function createDustParticles() {
    const count = CONFIG.particles.dustCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * CONFIG.room.width;
        positions[i * 3 + 1] = Math.random() * CONFIG.room.height;
        positions[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.room.depth;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = {
        velocities: new Float32Array(count * 3).fill(0).map((_, i) => {
            const axis = i % 3;
            if (axis === 1) return 0.001 + Math.random() * 0.002;
            return (Math.random() - 0.5) * 0.001;
        })
    };
    
    const material = new THREE.PointsMaterial({
        size: 0.025,
        color: 0xffe8c8,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    dustParticles = new THREE.Points(geometry, material);
    scene.add(dustParticles);
}

function updateDustParticles(delta) {
    if (!dustParticles) return;
    
    const positions = dustParticles.geometry.attributes.position.array;
    const { velocities } = dustParticles.geometry.userData;
    
    for (let i = 0; i < CONFIG.particles.dustCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        if (positions[i * 3 + 1] > CONFIG.room.height) {
            positions[i * 3 + 1] = 0;
            positions[i * 3] = (Math.random() - 0.5) * CONFIG.room.width;
            positions[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.room.depth;
        }
    }
    
    dustParticles.geometry.attributes.position.needsUpdate = true;
}

// ============================================================================
// ORB DUST PARTICLES
// ============================================================================
function createOrbDustParticles(cx, cy, cz) {
    const count = CONFIG.particles.orbDustCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 0.2 + Math.random() * 0.3;
        
        positions[i * 3] = cx + r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = cy + r * Math.cos(phi);
        positions[i * 3 + 2] = cz + r * Math.sin(phi) * Math.sin(theta);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = {
        center: new THREE.Vector3(cx, cy, cz),
        angles: new Float32Array(count).fill(0).map(() => Math.random() * Math.PI * 2),
        speeds: new Float32Array(count).fill(0).map(() => 0.3 + Math.random() * 0.5),
        radii: new Float32Array(count).fill(0).map(() => 0.2 + Math.random() * 0.3),
        yOffsets: new Float32Array(count).fill(0).map(() => (Math.random() - 0.5) * 0.4)
    };
    
    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xaaccff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    orbDustParticles = new THREE.Points(geometry, material);
    scene.add(orbDustParticles);
}

function updateOrbDust(time) {
    if (!orbDustParticles) return;
    
    const positions = orbDustParticles.geometry.attributes.position.array;
    const { center, angles, speeds, radii, yOffsets } = orbDustParticles.geometry.userData;
    
    for (let i = 0; i < CONFIG.particles.orbDustCount; i++) {
        angles[i] += speeds[i] * 0.02;
        
        positions[i * 3] = center.x + Math.cos(angles[i]) * radii[i];
        positions[i * 3 + 1] = center.y + yOffsets[i] + Math.sin(time * 2 + i) * 0.05;
        positions[i * 3 + 2] = center.z + Math.sin(angles[i]) * radii[i];
    }
    
    orbDustParticles.geometry.attributes.position.needsUpdate = true;
}

// ============================================================================
// LIGHTING UPDATES
// ============================================================================
function updateLighting(time) {
    // Fire flicker
    const flicker = Math.sin(time * 12) * 0.2 + Math.sin(time * 17) * 0.15 + Math.sin(time * 23) * 0.1;
    fireLight.intensity = CONFIG.lighting.fireIntensity + flicker * CONFIG.lighting.fireFlickerAmount;
    
    // Orb pulse
    if (orbLight) {
        orbLight.intensity = CONFIG.lighting.orbIntensity + Math.sin(time * 2) * 0.2;
    }
    
    if (orbGlow) {
        orbGlow.material.opacity = 0.12 + Math.sin(time * 1.5) * 0.04;
        orbGlow.scale.setScalar(1 + Math.sin(time * 1.8) * 0.08);
    }
}

function updateFloatingCandles(time) {
    floatingCandles.forEach((candle, i) => {
        const phase = candle.phase || i;
        
        // Flame flicker effect (all candles)
        if (candle.flame) {
            // Slight scale variation for flicker
            const flickerScale = 0.9 + Math.sin(time * 15 + phase * 2) * 0.15 + Math.sin(time * 23 + phase) * 0.1;
            candle.flame.scale.setScalar(flickerScale);
        }
        
        // Magical floating candles get gentle bobbing motion
        if (candle.isMagical && candle.mesh) {
            const bobY = Math.sin(time * 0.8 + phase) * 0.08;
            const bobX = Math.sin(time * 0.5 + phase * 1.3) * 0.02;
            const bobZ = Math.cos(time * 0.6 + phase * 0.9) * 0.02;
            
            candle.mesh.position.y = candle.baseY + bobY;
            candle.mesh.position.x += bobX * 0.01;
            candle.mesh.position.z += bobZ * 0.01;
            
            if (candle.flame) {
                candle.flame.position.y = candle.baseY + bobY + 0.08;
            }
            
            // Magic ring rotation
            if (candle.magicRing) {
                candle.magicRing.position.y = candle.baseY + bobY - 0.02;
                candle.magicRing.rotation.z += 0.01;
                candle.magicRing.material.opacity = 0.3 + Math.sin(time * 2 + phase) * 0.15;
            }
            
            // Sparkles orbit
            if (candle.sparkles) {
                candle.sparkles.position.y = candle.baseY + bobY;
                candle.sparkles.rotation.y += 0.02;
            }
        }
        
        // Point light intensity flicker (if present)
        if (candle.light) {
            candle.light.intensity = 0.3 + Math.sin(time * 10 + phase) * 0.1 + Math.sin(time * 17 + phase * 1.5) * 0.05;
        }
    });
}
