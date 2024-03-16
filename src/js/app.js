// Importálás
import { Game } from './game.js';

//Elemek kiválasztása
const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#reportMessage");
const restartBtn = document.querySelector("#restartBtn");

//// ---- MODAL ----\\
//Játék beállítása
const MODAL = document.getElementById('myModal');
const form = document.getElementById("gameSettingsForm");
form.addEventListener("submit", function(event) {
  // Űrlap elküldésének megakadályozása
  event.preventDefault();

  // Beküldött adatok gyűjtése
  const firstPlayer = document.getElementById("firstPlayer").value;
  const winningLength = parseInt(document.getElementById("winningLength").value);
  const boardSize = parseInt(document.getElementById("boardSize").value);

  // Játék inicializálása a beküldött adatok alapján
  const game = new Game(cells, message, restartBtn, firstPlayer, winningLength, boardSize);


  // Modal bezárása
  closeModal();
  document.querySelector("#app").style.display = 'inline';
  document.querySelector("#winningLengthInfo").innerText = winningLength;
});

//beállításolal mutatása
function setGame() {
  MODAL.style.display = 'block';
}

// Modal bezárása
function closeModal() {
  MODAL.style.display = 'none';
}