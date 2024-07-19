// Importálás
import { Game } from './game.js';

//Elemek kiválasztása

const message = document.querySelector("#reportMessage");
const restartBtn = document.querySelector("#restartBtn");

//// ---- MODAL ----\\
        ///-- Játék beállítása --\\\
const MODAL = document.querySelector(".modal");
const questions = document.querySelectorAll('.question');
const playerOptions = document.querySelectorAll('.player-option');
const winLengthOption = document.querySelector('.winning-length-option');
const boardSizeOptions = document.querySelectorAll('.board-size-btn')
const nextButtons = document.querySelectorAll('.next-btn');
const exitButtons = document.querySelectorAll('.exit-btn');

let firstPlayer;
let winningLength;
let boardSize;
let game;


  // Beküldött adatok gyűjtése \\
playerOptions.forEach((playerOp) => {
    playerOp.addEventListener("click", () => {
      firstPlayer = playerOp.value;
    });
});

//winningLength dinamikus csuszkainfó
let slider = document.getElementById("winning-length");
let sliderValue = document.getElementById("slider-value");
sliderValue.innerHTML = slider.value;

slider.oninput = function() {
    sliderValue.innerHTML = this.value;
}
winLengthOption.addEventListener("click", () => {
    winningLength = slider.value;
});

// Tábla generálása dinamikusan
function generateBoard(size) {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Tábla törlése
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const boardMaxWidth = 70 * size;
    board.style.maxWidth = `${boardMaxWidth}px`;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('cellIndexX', row);
            cell.setAttribute('cellIndexY', col);

            // Eltávolítjuk a bordereket a tábla szélein
            if (row === 0) {
                cell.style.borderTop = 'none';
            }
            if (row === size - 1) {
                cell.style.borderBottom = 'none';
            }
            if (col === 0) {
                cell.style.borderLeft = 'none';
            }
            if (col === size - 1) {
                cell.style.borderRight = 'none';
            }

            board.appendChild(cell);
        }
    }
}
boardSizeOptions.forEach((bSizeOp) => {
    bSizeOp.addEventListener("click", () => {
        boardSize = bSizeOp.value;

        //itt ez jó helyen van?
        generateBoard(boardSize);
        const cells = document.querySelectorAll(".cell");
        // Játék inicializálása a beküldött adatok alapján
        game = new Game(cells, message, restartBtn, firstPlayer, winningLength, boardSize);

    });
});




    // Kérdések elúszása \\
let questionIndex = 1;
nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
        cardFly(questionIndex)
        questionIndex++;
    });
});
function cardFly(qIndex) {
    questions.forEach((question) => {
        question.style.transform = `translateX(-${qIndex * 100}%)`;
    });
}

  // Modal bezárása \\
exitButtons.forEach((button) => {
    button.addEventListener("click", () => {
        MODAL.style.opacity = 0;
        MODAL.style.transition = 'opacity 0.8s ease-in-out;';
        setTimeout(() => {
            closeModal();
            document.querySelector("#app").style.display = 'inline';
            document.querySelector("#winningLengthInfo").innerText = winningLength;
        }, 800);
    });
});
function closeModal() {
    MODAL.style.display = 'none';
}

