const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = true;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();

    winningMessageElement.classList.remove('show');

    // If the computer is starting, make its move
    if (!circleTurn) {
        setTimeout(makeComputerMove, 500);
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();

        // If the current turn is the computer's, make its move
        if (!circleTurn) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

function makeComputerMove() {
    const bestMove = getBestMove();
    const cell = cellElements[bestMove];
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function getBestMove() {
    const availableMoves = getAvailableMoves();
    let bestMove;
    let bestScore = -Infinity;

    availableMoves.forEach(index => {
        // Make a move
        cellElements[index].classList.add(CIRCLE_CLASS);

        // Get the score for the current move
        const score = minimax(board, 0, false);

        // Undo the move
        cellElements[index].classList.remove(CIRCLE_CLASS);

        // Update the best move if needed
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    });

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        x: -1,
        circle: 1,
        draw: 0
    };

    if (checkWin(X_CLASS)) {
        return scores.x - depth;
    } else if (checkWin(CIRCLE_CLASS)) {
        return scores.circle - depth;
    } else if (isDraw()) {
        return scores.draw;
    }

    const availableMoves = getAvailableMoves();

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            const index = availableMoves[i];
            cellElements[index].classList.add(CIRCLE_CLASS);
            const score = minimax(board, depth + 1, false);
            cellElements[index].classList.remove(CIRCLE_CLASS);
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            const index = availableMoves[i];
            cellElements[index].classList.add(X_CLASS);
            const score = minimax(board, depth + 1, true);
            cellElements[index].classList.remove(X_CLASS);
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function getAvailableMoves() {
    return [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)).map(cell => Array.from(cell.parentElement.children).indexOf(cell));
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);

    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
