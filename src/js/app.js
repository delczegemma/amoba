// Importálás
import { Game } from './game.js';

//Elemek kiválasztása
const cells = document.querySelectorAll(".cell");
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
const exitButtons =document.querySelectorAll('.exit-btn');

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
boardSizeOptions.forEach((bSizeOp) => {
    bSizeOp.addEventListener("click", () => {
        boardSize = bSizeOp.value;

        // Játék inicializálása a beküldött adatok alapján
        game = new Game(cells, message, restartBtn, firstPlayer, winningLength, boardSize);
        // itt jó lesz a játékinicializálás?
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
        closeModal();
        document.querySelector("#app").style.display = 'inline';
        document.querySelector("#winningLengthInfo").innerText = winningLength;
    });
});
function closeModal() {
  MODAL.style.display = 'none';
}

