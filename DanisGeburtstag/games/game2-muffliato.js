// ========================================
// MINIGAME 2: DIE FLÜSTERNDEN BUCHRÜCKEN
// Ein ruhiges Beobachtungsrätsel
// ========================================

const whisperingBooks = (() => {
    // === STATE ===
    let state = 'idle'; // idle | selecting | success
    let selectedBooks = [];
    let bookElements = [];
    
    // === BUCH-DEFINITIONEN ===
    // Jedes Buch: { id, title, glowColor, glowDuration, symbol, isTarget, targetOrder }
    // glowColor: 'gold' | 'violet' | 'none'
    // glowDuration: 'short' | 'long'
    // symbol: 'star' | 'circle' | 'line' | 'none'
    
    const BOOKS = [
        { id: 0, title: 'Noctis Obscura',      glowColor: 'violet', glowDuration: 'short', symbol: 'circle' },
        { id: 1, title: 'Lumina Perpetua',     glowColor: 'gold',   glowDuration: 'long',  symbol: 'star' },   // TARGET 1
        { id: 2, title: 'Arcana Silentium',    glowColor: 'none',   glowDuration: 'short', symbol: 'line' },
        { id: 3, title: 'Vox Aeterna',         glowColor: 'gold',   glowDuration: 'long',  symbol: 'star' },   // TARGET 2
        { id: 4, title: 'Umbra Memoria',       glowColor: 'violet', glowDuration: 'long',  symbol: 'none' },
        { id: 5, title: 'Lux Antiqua',         glowColor: 'gold',   glowDuration: 'long',  symbol: 'star' },   // TARGET 3
        { id: 6, title: 'Verbum Occultum',     glowColor: 'none',   glowDuration: 'short', symbol: 'circle' },
        { id: 7, title: 'Aurum Sapientia',     glowColor: 'gold',   glowDuration: 'long',  symbol: 'star' }    // TARGET 4
    ];
    
    // Die 4 Zielbücher: Gold, lang, Stern → Position 1, 3, 5, 7 (von links nach rechts)
    const TARGET_SEQUENCE = [1, 3, 5, 7];
    
    // === INITIALISIERUNG ===
    function init() {
        state = 'idle';
        selectedBooks = [];
        render();
    }
    
    // === RENDERING ===
    function render() {
        const container = document.getElementById('whisperingBooksContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="wb-hint">
                <p class="wb-hint-text">„Nicht die Lautesten, sondern die Übereinstimmungen weisen den Weg."</p>
            </div>
            <div class="wb-bookshelf">
                <div class="wb-shelf-back"></div>
                <div class="wb-books-row">
                    ${BOOKS.map(book => renderBook(book)).join('')}
                </div>
                <div class="wb-shelf-base"></div>
            </div>
            <div class="wb-selection-indicator">
                <span class="wb-dot"></span>
                <span class="wb-dot"></span>
                <span class="wb-dot"></span>
                <span class="wb-dot"></span>
            </div>
            <div class="wb-success-overlay" id="wbSuccessOverlay">
                <div class="wb-parchment">
                    <div class="wb-parchment-content">
                        <p class="wb-parchment-title">✨ Die Bücher offenbaren ihr Geheimnis ✨</p>
                        <p class="wb-parchment-text">„Gold leuchtet am längsten für jene,<br>die unter den Sternen suchen."</p>
                        <div class="wb-seal">📜</div>
                    </div>
                </div>
            </div>
        `;
        
        // Event Listeners
        bookElements = container.querySelectorAll('.wb-book');
        bookElements.forEach((el, index) => {
            el.addEventListener('mouseenter', () => handleHover(index, true));
            el.addEventListener('mouseleave', () => handleHover(index, false));
            el.addEventListener('click', () => handleClick(index));
        });
        
        updateSelectionIndicator();
    }
    
    function renderBook(book) {
        const symbolHTML = getSymbolHTML(book.symbol);
        const colorClass = `wb-glow-${book.glowColor}`;
        const durationClass = `wb-duration-${book.glowDuration}`;
        
        return `
            <div class="wb-book ${colorClass} ${durationClass}" data-id="${book.id}">
                <div class="wb-book-spine">
                    <div class="wb-book-symbol">${symbolHTML}</div>
                    <div class="wb-book-title">${book.title}</div>
                </div>
                <div class="wb-book-glow"></div>
                <div class="wb-book-selected-border"></div>
            </div>
        `;
    }
    
    function getSymbolHTML(symbol) {
        switch(symbol) {
            case 'star': return '✦';
            case 'circle': return '◯';
            case 'line': return '―';
            default: return '';
        }
    }
    
    // === HOVER HANDLING ===
    function handleHover(index, isEntering) {
        if (state === 'success') return;
        
        const bookEl = bookElements[index];
        if (!bookEl) return;
        
        if (isEntering) {
            bookEl.classList.add('wb-hovering');
        } else {
            bookEl.classList.remove('wb-hovering');
        }
    }
    
    // === CLICK HANDLING ===
    function handleClick(index) {
        if (state === 'success') return;
        
        state = 'selecting';
        
        const expectedIndex = selectedBooks.length;
        const expectedBookId = TARGET_SEQUENCE[expectedIndex];
        
        if (index === expectedBookId) {
            // Korrektes Buch!
            selectedBooks.push(index);
            markBookAsSelected(index);
            updateSelectionIndicator();
            
            if (selectedBooks.length === 4) {
                // Alle 4 korrekt!
                handleSuccess();
            }
        } else {
            // Falsches Buch - sanfter Reset
            handleSoftReset();
        }
    }
    
    function markBookAsSelected(index) {
        const bookEl = bookElements[index];
        if (bookEl) {
            bookEl.classList.add('wb-selected');
        }
    }
    
    function updateSelectionIndicator() {
        const dots = document.querySelectorAll('.wb-dot');
        dots.forEach((dot, i) => {
            if (i < selectedBooks.length) {
                dot.classList.add('wb-dot-active');
            } else {
                dot.classList.remove('wb-dot-active');
            }
        });
    }
    
    // === SOFT RESET ===
    function handleSoftReset() {
        // Sanftes Ausblenden aller Markierungen
        bookElements.forEach(el => {
            el.classList.add('wb-fading');
            setTimeout(() => {
                el.classList.remove('wb-selected', 'wb-fading');
            }, 400);
        });
        
        // State zurücksetzen
        setTimeout(() => {
            selectedBooks = [];
            state = 'idle';
            updateSelectionIndicator();
        }, 400);
    }
    
    // === SUCCESS ===
    function handleSuccess() {
        state = 'success';
        
        // Alle Zielbücher leuchten gold
        TARGET_SEQUENCE.forEach(id => {
            const bookEl = bookElements[id];
            if (bookEl) {
                bookEl.classList.add('wb-success-glow');
            }
        });
        
        // Pergament erscheinen lassen
        setTimeout(() => {
            const overlay = document.getElementById('wbSuccessOverlay');
            if (overlay) {
                overlay.classList.add('wb-visible');
            }
            
            // Minigame als gelöst markieren
            if (typeof solveMinigame === 'function') {
                solveMinigame(2, '📖 Flüsterndes Pergament');
            }
        }, 800);
    }
    
    // === RESET ===
    function reset() {
        state = 'idle';
        selectedBooks = [];
        render();
    }
    
    // === PUBLIC API ===
    return {
        init,
        reset
    };
})();

// Globale Funktion für minigames-core.js
function initAudioBalance() {
    whisperingBooks.init();
}
