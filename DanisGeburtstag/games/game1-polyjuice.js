// ========================================
// MINIGAME 1: POLYJUICE LABOR
// ========================================

const polyjuiceGame = (() => {
    // Game State
    let state = 'idle'; // idle | placing | checking | success | reset

    // Solution (fixed, immutable)
    const SOLUTION = {
        copper: 'knotgrass',  // Fluxkraut NICHT in Kupfer → Knöterich
        iron: 'fluxweed',     // Blutegel rechts von Eisen → Eisen = Fluxkraut
        tin: 'leech',         // Blutegel rechts von Eisen → Zinn = Blutegel
        stone: 'lacewing'     // Florfliegen = höchste Temp → Stein
    };

    // Current placements
    const placements = {
        copper: null,
        iron: null,
        tin: null,
        stone: null
    };

    // DOM Elements
    let cauldrons, ingredients, checkBtn;
    let draggedIngredient = null;

    // Initialize
    function init() {
        cauldrons = document.querySelectorAll('#minigame1 .cauldron');
        ingredients = document.querySelectorAll('#minigame1 .ingredient');
        checkBtn = document.getElementById('checkPolyjuiceBtn');

        setupDragAndDrop();
        updateCheckButton();
    }

    // Setup Drag & Drop
    function setupDragAndDrop() {
        // Ingredient drag events
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('dragstart', (e) => {
                if (state === 'checking' || state === 'success') return;

                draggedIngredient = ingredient;
                ingredient.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            ingredient.addEventListener('dragend', () => {
                ingredient.classList.remove('dragging');
                draggedIngredient = null;
            });
        });

        // Cauldron drop events
        cauldrons.forEach(cauldron => {
            cauldron.addEventListener('dragover', (e) => {
                if (state === 'checking' || state === 'success') return;
                e.preventDefault();
                cauldron.classList.add('drop-target');
            });

            cauldron.addEventListener('dragleave', () => {
                cauldron.classList.remove('drop-target');
            });

            cauldron.addEventListener('drop', (e) => {
                e.preventDefault();
                cauldron.classList.remove('drop-target');

                if (!draggedIngredient || state === 'checking' || state === 'success') return;

                const cauldronType = cauldron.dataset.cauldron;
                const ingredientType = draggedIngredient.dataset.ingredient;

                // Check if cauldron already has ingredient
                if (placements[cauldronType] !== null) {
                    showMessage('Dieser Kessel ist bereits belegt!', 'error');
                    return;
                }

                // Place ingredient
                placeIngredient(cauldronType, ingredientType, draggedIngredient);
            });
        });
    }

    // Place ingredient in cauldron
    function placeIngredient(cauldronType, ingredientType, ingredientElement) {
        state = 'placing';

        // Update placements
        placements[cauldronType] = ingredientType;

        // Update UI
        const cauldron = document.querySelector(`#minigame1 [data-cauldron="${cauldronType}"]`);
        const icon = ingredientElement.querySelector('.ingredient-icon').textContent;

        const content = document.createElement('div');
        content.className = 'cauldron-content';
        content.textContent = icon;
        cauldron.appendChild(content);

        // Hide ingredient from ingredients area
        ingredientElement.classList.add('placed');

        state = 'idle';
        updateCheckButton();
    }

    // Update check button state
    function updateCheckButton() {
        if (!checkBtn) return;
        const allPlaced = Object.values(placements).every(p => p !== null);
        checkBtn.disabled = !allPlaced || state === 'checking' || state === 'success';
    }

    // Check solution
    function check() {
        if (state === 'checking' || state === 'success') return;

        const allPlaced = Object.values(placements).every(p => p !== null);
        if (!allPlaced) {
            showMessage('Platziere erst alle Zutaten!', 'error');
            return;
        }

        state = 'checking';
        checkBtn.disabled = true;

        // Check if solution is correct
        const isCorrect = Object.keys(SOLUTION).every(
            cauldron => placements[cauldron] === SOLUTION[cauldron]
        );

        if (isCorrect) {
            handleSuccess();
        } else {
            handleError();
        }
    }

    // Handle success
    function handleSuccess() {
        state = 'success';

        // Animate cauldrons
        cauldrons.forEach(cauldron => {
            cauldron.classList.add('success');
        });

        // Show success message
        setTimeout(() => {
            showMessage('✨ Perfekt! Der Vielsaft-Trank ist gelungen!', 'success');
            solveMinigame(1, '🧪 Beschriftete Phiole');
        }, 500);
    }

    // Handle error
    function handleError() {
        // Animate explosion
        cauldrons.forEach(cauldron => {
            cauldron.classList.add('error');
        });

        showMessage('💥 BOOM! Falsche Kombination!', 'error');

        // Reset after animation
        setTimeout(() => {
            reset();
        }, 1000);
    }

    // Reset game
    function reset() {
        state = 'reset';

        // Clear placements
        Object.keys(placements).forEach(key => {
            placements[key] = null;
        });

        // Clear cauldron contents
        cauldrons.forEach(cauldron => {
            cauldron.classList.remove('success', 'error', 'drop-target');
            const content = cauldron.querySelector('.cauldron-content');
            if (content) content.remove();
        });

        // Show all ingredients again
        ingredients.forEach(ingredient => {
            ingredient.classList.remove('placed', 'dragging');
        });

        state = 'idle';
        updateCheckButton();
    }

    // Public API
    return {
        init,
        check,
        reset
    };
})();

function showExplosion() {
    showMessage('💥 BOOM! Falsche Kombination!', 'error');
}
