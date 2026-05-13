// script.js

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let currentPlayer = 'X';
let gameActive = true;

let scores = {
    X: 0,
    O: 0
};

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function handleCellClick(event) {

    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;

    clickedCell.textContent = currentPlayer;

    if (currentPlayer === 'X') {
        clickedCell.style.color = '#ff4d6d';
    } else {
        clickedCell.style.color = '#4d96ff';
    }

    checkWinner();
}

function checkWinner() {

    let roundWon = false;
    let winningPattern = [];

    for (let i = 0; i < winningConditions.length; i++) {

        const condition = winningConditions[i];

        const a = gameState[condition[0]];
        const b = gameState[condition[1]];
        const c = gameState[condition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {

            roundWon = true;
            winningPattern = condition;

            break;
        }
    }

    if (roundWon) {

        statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;

        scores[currentPlayer]++;

        if (currentPlayer === 'X') {
            scoreX.textContent = scores.X;
        } else {
            scoreO.textContent = scores.O;
        }

        drawWinningLine(winningPattern);

        launchConfetti();

        gameActive = false;

        return;
    }

    if (!gameState.includes('')) {

        statusText.textContent = "It's a Draw!";

        gameActive = false;

        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function restartGame() {

    currentPlayer = 'X';

    gameActive = true;

    gameState = ["", "", "", "", "", "", "", "", ""];

    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    cells.forEach(cell => {

        cell.textContent = '';

        cell.classList.remove('winning-cell');
    });

    const oldLine = document.querySelector('.line');

    if (oldLine) {
        oldLine.remove();
    }
}

function launchConfetti() {

    for (let i = 0; i < 100; i++) {

        const confetti = document.createElement('div');

        confetti.classList.add('confetti');

        confetti.style.left = Math.random() * 100 + 'vw';

        confetti.style.backgroundColor =
            `hsl(${Math.random() * 360}, 100%, 50%)`;

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + 's';

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function drawWinningLine(pattern) {

    pattern.forEach(index => {
        cells[index].classList.add('winning-cell');
    });

    const board = document.querySelector('.board');

    const line = document.createElement('div');

    line.classList.add('line');

    board.appendChild(line);

    const positions = {
        // Horizontal
        "0,1,2": { top: 52, left: 0, width: 350, rotate: 0 },
        "3,4,5": { top: 167, left: 0, width: 350, rotate: 0 },
        "6,7,8": { top: 282, left: 0, width: 350, rotate: 0 },

        // Vertical
        "0,3,6": { top: 0, left: 52, width: 350, rotate: 90 },
        "1,4,7": { top: 0, left: 167, width: 350, rotate: 90 },
        "2,5,8": { top: 0, left: 282, width: 350, rotate: 90 },

        // Diagonal
        "0,4,8": { top: 0, left: 5, width: 485, rotate: 45 },
        "2,4,6": { top: 0, left: 345, width: 485, rotate: 135 }
    };

    const key = pattern.toString();

    const pos = positions[key];

    line.style.width = `${pos.width}px`;
    line.style.top = `${pos.top}px`;
    line.style.left = `${pos.left}px`;
    line.style.transform = `rotate(${pos.rotate}deg)`;
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);