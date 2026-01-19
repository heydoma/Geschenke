// ========================================
// MINIGAME 7: DEEP-DIVE BÜCHERREGAL
// ========================================

let bookState = {
    books: [
        { id: 1, quote: 'Der Stein der Weisen', order: 1 },
        { id: 2, quote: 'Die Kammer des Schreckens', order: 2 },
        { id: 3, quote: 'Der Gefangene von Askaban', order: 3 },
        { id: 4, quote: 'Der Feuerkelch', order: 4 },
        { id: 5, quote: 'Der Orden des Phönix', order: 5 },
        { id: 6, quote: 'Der Halbblutprinz', order: 6 },
        { id: 7, quote: 'Die Heiligtümer des Todes', order: 7 }
    ],
    currentOrder: []
};

function initBookSort() {
    bookState.currentOrder = [...bookState.books].sort(() => Math.random() - 0.5);
    renderBooks();
}

function renderBooks() {
    const shelf = document.getElementById('bookShelf');
    shelf.innerHTML = '';

    bookState.currentOrder.forEach((book, i) => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-spine';
        bookDiv.textContent = book.quote;
        bookDiv.draggable = true;
        bookDiv.dataset.index = i;

        bookDiv.ondragstart = (e) => e.dataTransfer.setData('index', i);
        bookDiv.ondragover = (e) => e.preventDefault();
        bookDiv.ondrop = (e) => {
            const fromIndex = parseInt(e.dataTransfer.getData('index'));
            swapBooks(fromIndex, i);
        };

        shelf.appendChild(bookDiv);
    });
}

function swapBooks(from, to) {
    [bookState.currentOrder[from], bookState.currentOrder[to]] =
    [bookState.currentOrder[to], bookState.currentOrder[from]];
    renderBooks();
    checkBookOrder();
}

function checkBookOrder() {
    const correct = bookState.currentOrder.every((book, i) => book.order === i + 1);

    if (correct) {
        solveMinigame(7, '📚 Sortierte Bände');
    }
}
