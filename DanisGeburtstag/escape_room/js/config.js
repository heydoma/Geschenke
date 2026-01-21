// ============================================================================
// ESCAPE ROOM - CONFIGURATION
// Die Verbotene Abteilung - Tuneable Parameters
// ============================================================================

const CONFIG = {
    // Room dimensions (larger for grand library feel)
    room: {
        width: 22,
        height: 12,
        depth: 18
    },
    
    // Movement (slow, calm exploration pace)
    movement: {
        walkSpeed: 1.8,           // Normal walking (m/s) - slow exploration
        sprintSpeed: 3.2,         // Sprinting (m/s)
        acceleration: 8,          // Smooth acceleration
        deceleration: 6,          // Smooth deceleration
        mouseSensitivity: 0.001,  // Mouse look speed
    },
    
    // Stamina
    stamina: {
        max: 100,
        drainRate: 25,            // Per second while sprinting
        regenRate: 15,            // Per second while not sprinting
        minToSprint: 10           // Minimum stamina to start sprinting
    },
    
    // Head bob
    headBob: {
        enabled: true,
        walkAmplitude: 0.02,      // Subtle vertical bob
        walkFrequency: 6,         // Slower bob for calm pace
        sprintAmplitude: 0.04,
        sprintFrequency: 10,
        swayAmount: 0.001         // Subtle horizontal sway
    },
    
    // Player collision (capsule approximated as cylinder)
    player: {
        radius: 0.35,             // Collision radius
        height: 1.7,              // Eye height
        stepHeight: 0.35,         // Can step over obstacles (increased for stairs)
        // Spawn on balcony looking into room
        startX: 0,
        startY: 4.2,              // Elevated balcony (floor + eye height)
        startZ: 6.5,              // On the balcony (d/2 - 2.5)
        startRotY: 0              // Facing into room (toward fireplace)
    },
    
    // Particles (optimized for performance)
    particles: {
        dustCount: 60,            // Floating dust motes (reduced)
        fireCount: 40,            // Fire particles (reduced)
        emberCount: 8,            // Floating embers (reduced)
        orbDustCount: 15          // Magical dust near orb (reduced)
    },
    
    // Lighting (brighter moon for visibility)
    lighting: {
        fireIntensity: 3.0,       // Base fire light intensity
        fireFlickerAmount: 0.6,   // Flicker variation
        moonIntensity: 1.2,       // Moonlight strength (brighter!)
        ambientIntensity: 0.18,   // Base ambient (brighter)
        orbIntensity: 0.8         // Orb glow
    },
    
    // Fog
    fog: {
        near: 2,
        far: 22,
        color: 0x0a0806,
        floorFogOpacity: 0.25
    },
    
    // Books (reduced for performance)
    books: {
        totalCount: 800,          // Total instanced books
        colorsSpine: [
            0x8b4513, 0x654321, 0x4a2511, // Browns
            0x2e4a1c, 0x1e3a0c, 0x3e5a2c, // Greens
            0x4a1c2e, 0x5a2c3e, 0x3a0c1e, // Burgundy
            0x1c2e4a, 0x0c1e3a, 0x2c3e5a, // Blues
            0x4a3a1c, 0x5a4a2c, 0x3a2a0c, // Tan
            0x3a3a3a, 0x2a2a2a, 0x1a1a1a  // Dark
        ]
    },
    
    // Post-processing
    postProcessing: {
        bloomStrength: 0.8,
        bloomRadius: 0.4,
        vignetteIntensity: 0.4
    },
    
    // Colors
    colors: {
        woodDark: 0x1a0f08,
        woodMedium: 0x2a1a0a,
        woodLight: 0x4a3520,
        stone: 0x3a3530,
        floor: 0x2a1a0a,
        ceiling: 0x15100a
    },
    
    // Interactive objects
    interactives: {
        fireplace: { game: null, hint: "Das Feuer knistert..." },
        orb: { game: 5, hint: "Ein mystisches Leuchten..." },
        bookshelfLeft: { game: 7, hint: "Die Bücher sind ungeordnet..." },
        bookshelfRight: { game: 2, hint: "Diese Bücher flüstern..." },
        desk: { game: 3, hint: "Verschlüsselte Runen..." },
        potions: { game: 1, hint: "Seltsame Tränke..." },
        bells: { game: 6, hint: "Ein magisches Glockenspiel..." },
        stairs: { game: 4, hint: "Magische Treppen-Schriften..." },
        pensieve: { game: 8, hint: "Das Denkarium...", hidden: true }
    }
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
