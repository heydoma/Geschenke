// ========================================
// MINIGAME 7: DEEP-DIVE BÜCHERREGAL
// Ereignisse aus Harry Potter chronologisch sortieren
// ========================================

const bookSort = (() => {
    // Die 7 Ereignisse in chronologischer Reihenfolge
    const BOOKS = [
        { 
            id: 1, 
            event: 'Das Begehren',
            hint: 'Ein Spiegel zeigt nicht das Gesicht...',
            quote: '„Erised stra ehru oyt ube cafru oyt on wohsi"',
            year: '???',
            color: '#8B0000'  // Dunkelrot
        },
        { 
            id: 2, 
            event: 'Die Wahrheit im Netz',
            hint: 'Acht Augen, viele Kinder, ein Geheimnis...',
            quote: '„Das Mädchen wurde in einem Klo gefunden. Wir fliehen vor IHM..."',
            year: '???',
            color: '#006400'  // Dunkelgrün
        },
        { 
            id: 3, 
            event: 'Der silberne Retter',
            hint: 'Hundert Seelen in Schwarz, ein Licht...',
            quote: '„Ich wusste, dass ich es konnte, weil ich es schon getan hatte."',
            year: '???',
            color: '#4169E1'  // Königsblau
        },
        { 
            id: 4, 
            event: 'Knochen, Fleisch, Blut',
            hint: 'Ein Kessel, ein Ritual, eine Wiedergeburt...',
            quote: '„...des Vaters, des Dieners, des Feindes..."',
            year: '???',
            color: '#2F4F4F'  // Dunkelgrau
        },
        { 
            id: 5, 
            event: 'Die zerbrechliche Kugel',
            hint: 'Hinter verschlossenen Türen liegt Wissen...',
            quote: '„...und einer muss von der Hand des anderen sterben..."',
            year: '???',
            color: '#4B0082'  // Indigo
        },
        { 
            id: 6, 
            event: 'Das gebrochene Versprechen',
            hint: 'Ein Turm, ein Flehen, ein grüner Blitz...',
            quote: '„Severus... bitte..."',
            year: '???',
            color: '#191970'  // Mitternachtsblau
        },
        { 
            id: 7, 
            event: 'Der Stein dreht sich',
            hint: 'Begleitet von den Gefallenen...',
            quote: '„Ich öffne mich zum Ende."',
            year: '???',
            color: '#1a1a1a'  // Fast Schwarz
        }
    ];
    
    let currentOrder = [];
    let selectedBook = null;
    let detailOpen = false;
    
    // === INIT ===
    function init() {
        // Zufällige Reihenfolge
        currentOrder = [...BOOKS].sort(() => Math.random() - 0.5);
        selectedBook = null;
        detailOpen = false;
        render();
    }
    
    // === RENDERING ===
    function render() {
        const shelf = document.getElementById('bookShelf');
        if (!shelf) return;
        
        shelf.innerHTML = '';
        shelf.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 8px;
            padding: 30px 20px;
            min-height: 280px;
            perspective: 800px;
        `;
        
        currentOrder.forEach((book, index) => {
            const bookEl = document.createElement('div');
            bookEl.className = 'book-spine';
            bookEl.dataset.index = index;
            
            // Höhe variiert leicht für natürlicheren Look
            const height = 180 + (book.id % 3) * 15;
            
            bookEl.style.cssText = `
                width: 45px;
                height: ${height}px;
                background: linear-gradient(135deg, ${book.color}, ${adjustColor(book.color, -30)});
                border-radius: 3px 6px 6px 3px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 
                    inset -3px 0 8px rgba(0,0,0,0.3),
                    3px 3px 10px rgba(0,0,0,0.4);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                transform-style: preserve-3d;
            `;
            
            // Buchrücken-Text (vertikal)
            const titleEl = document.createElement('div');
            titleEl.style.cssText = `
                writing-mode: vertical-rl;
                text-orientation: mixed;
                transform: rotate(180deg);
                color: #d4c4a8;
                font-size: 11px;
                font-family: Georgia, serif;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                padding: 10px 0;
                max-height: ${height - 30}px;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
            titleEl.textContent = book.event;
            bookEl.appendChild(titleEl);
            
            // Jahr-Badge
            const yearBadge = document.createElement('div');
            yearBadge.style.cssText = `
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 8px;
                color: #a99;
                background: rgba(0,0,0,0.3);
                padding: 2px 4px;
                border-radius: 3px;
            `;
            yearBadge.textContent = book.year;
            bookEl.appendChild(yearBadge);
            
            // Hover-Effekt
            bookEl.onmouseenter = () => {
                if (!detailOpen) {
                    bookEl.style.transform = 'translateY(-10px) rotateY(-15deg)';
                    bookEl.style.boxShadow = `
                        inset -3px 0 8px rgba(0,0,0,0.3),
                        5px 10px 20px rgba(0,0,0,0.5),
                        0 0 20px rgba(255,215,0,0.3)
                    `;
                }
            };
            bookEl.onmouseleave = () => {
                if (!detailOpen || selectedBook !== index) {
                    bookEl.style.transform = 'translateY(0) rotateY(0)';
                    bookEl.style.boxShadow = `
                        inset -3px 0 8px rgba(0,0,0,0.3),
                        3px 3px 10px rgba(0,0,0,0.4)
                    `;
                }
            };
            
            // Klick: Buch-Detail öffnen oder tauschen
            bookEl.onclick = () => handleBookClick(index);
            
            // Drag & Drop
            bookEl.draggable = true;
            bookEl.ondragstart = (e) => {
                e.dataTransfer.setData('index', index.toString());
                bookEl.style.opacity = '0.5';
            };
            bookEl.ondragend = () => {
                bookEl.style.opacity = '1';
            };
            bookEl.ondragover = (e) => e.preventDefault();
            bookEl.ondrop = (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('index'));
                if (fromIndex !== index) {
                    swapBooks(fromIndex, index);
                }
            };
            
            shelf.appendChild(bookEl);
        });
        
        // Detail-Popup rendern wenn offen
        if (detailOpen && selectedBook !== null) {
            renderDetailPopup();
        }
    }
    
    function adjustColor(color, amount) {
        // Farbe dunkler/heller machen
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0,2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2,2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4,2), 16) + amount));
        return `rgb(${r},${g},${b})`;
    }
    
    function handleBookClick(index) {
        if (detailOpen) {
            // Wenn Detail offen: Buch tauschen oder schließen
            if (selectedBook === index) {
                // Gleiches Buch → schließen
                closeDetail();
            } else {
                // Anderes Buch → tauschen
                swapBooks(selectedBook, index);
                closeDetail();
            }
        } else {
            // Detail öffnen
            selectedBook = index;
            detailOpen = true;
            render();
        }
    }
    
    function renderDetailPopup() {
        const shelf = document.getElementById('bookShelf');
        const book = currentOrder[selectedBook];
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'bookDetailOverlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
        `;
        overlay.onclick = (e) => {
            if (e.target === overlay) closeDetail();
        };
        
        // Popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: linear-gradient(135deg, #2a1a0a, #1a0f05);
            border: 2px solid ${book.color};
            border-radius: 10px;
            padding: 25px;
            max-width: 320px;
            box-shadow: 0 0 30px rgba(0,0,0,0.8), 0 0 60px ${book.color}40;
            animation: popIn 0.3s ease;
        `;
        
        popup.innerHTML = `
            <h3 style="color: #d4c4a8; margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 18px;">
                📖 ${book.event}
            </h3>
            <p style="color: #a99; font-size: 12px; margin: 0 0 15px 0;">
                ${book.year}
            </p>
            <p style="color: #c9b896; font-style: italic; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0; border-left: 3px solid ${book.color}; padding-left: 12px;">
                ${book.quote}
            </p>
            <p style="color: #888; font-size: 12px; margin: 0;">
                💡 ${book.hint}
            </p>
            <p style="color: #666; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
                Klicke auf ein anderes Buch zum Tauschen
            </p>
        `;
        
        overlay.appendChild(popup);
        shelf.style.position = 'relative';
        shelf.appendChild(overlay);
    }
    
    function closeDetail() {
        detailOpen = false;
        selectedBook = null;
        const overlay = document.getElementById('bookDetailOverlay');
        if (overlay) overlay.remove();
        render();
    }
    
    function swapBooks(from, to) {
        [currentOrder[from], currentOrder[to]] = [currentOrder[to], currentOrder[from]];
        render();
        
        // Kurze Verzögerung, dann prüfen
        setTimeout(checkOrder, 300);
    }
    
    function checkOrder() {
        const correct = currentOrder.every((book, i) => book.id === i + 1);
        
        if (correct) {
            handleSuccess();
        }
    }
    
    function handleSuccess() {
        const shelf = document.getElementById('bookShelf');
        const books = shelf.querySelectorAll('.book-spine');
        
        // Alle Bücher golden aufleuchten
        books.forEach((book, i) => {
            setTimeout(() => {
                book.style.boxShadow = `
                    inset -3px 0 8px rgba(0,0,0,0.3),
                    0 0 30px rgba(255,215,0,0.8),
                    0 0 60px rgba(255,200,100,0.5)
                `;
                book.style.transform = 'translateY(-5px)';
            }, i * 100);
        });
        
        if (typeof showMessage === 'function') {
            showMessage('📚 Die Chronik ist vollständig!', 'success');
        }
        
        setTimeout(() => {
            if (typeof solveMinigame === 'function') {
                solveMinigame(7, '📚 Chronik der Ereignisse');
            }
        }, 1500);
    }
    
    function reset() {
        init();
    }
    
    return { init, reset };
})();

// Globale Funktionen für HTML
function initBookSort() {
    bookSort.init();
}

function resetBookSort() {
    bookSort.reset();
}
