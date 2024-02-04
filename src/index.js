const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#reportMessage");
const restartBtn = document.querySelector("#restartBtn");

let player = "X";

let board = initBoard();

let running = false;

function initBoard(){
  let boardSize = Math.sqrt(cells.length);
  return Array(boardSize).fill().map(() =>
      Array(boardSize).fill(""));
}

initGame();

function initGame(){
  cells.forEach(cell =>
    {
      cell.addEventListener('click', makeMove)
    }
  )
  restartBtn.addEventListener('click', restartGame);
  running = true;
}

function makeMove() {
  if (this.classList.contains('filled') || !running) {
    // ha már van itt lépés, ne tegyen semmit
    return;
  }

  const row = parseInt(this.getAttribute("cellIndexX"));
  const col = parseInt(this.getAttribute("cellIndexY"));

  //leteszi a lépést a táblára és a tömbbe
  placeStepOnBoard(this, row, col);
  console.log(board);

  //A táblán lévő cellára filled classt rak
  //CheckWin
  if (checkWin(board, row, col, 4 )){
    running = false;
    message.textContent = `Az ${player} játékos nyert! Gratulálunk!`
  }
  //CheckDraw
  else if (checkDraw(board)){
    running = false;
    message.textContent = `A játék véget ért. Az eredmény döntetlen. Újra?`
  } else {
    //játékosváltás
    switchPlayer();

    //hover helyzet váltása
    cells.forEach(cell => {
      cell.dataset.nextMove = player;
    });
  }
}

function placeStepOnBoard(cell, row, col) {
  board[row][col] = player;
  cell.innerText = player;
  cell.classList.add('filled');
}
function switchPlayer() {
  player = player === "X" ? "O" : "X";
}

function restartGame() {
  board = initBoard();
  player = "X";
  running = true;
  message.textContent = "";
  cells.forEach(cell => {
    cell.classList.remove('filled')
    cell.textContent = ""
  })
}

function checkDirection(
  board,
  row,
  column,
  PlayerSymbol,
  rowChange,
  colChange
) {
  let difference = 1;
  console.log(`CheckDirection függvény: `) //esetleg még paraméterek kiíratása plusszba
  while (
    row + difference * rowChange < board.length &&
    column + difference * colChange < board[0].length &&
    row + difference * rowChange >= 0 &&
    column + difference * colChange >= 0
  ) {
    console.log(`   x: ${row + difference * rowChange}, y: ${
      column + difference * colChange}, szimbólum:  ${
      PlayerSymbol}, érték: ${board[row + difference * rowChange][column + (difference * colChange)]
     }`);
    if (
      board[row + difference * rowChange][column + (difference * colChange)] ===
      PlayerSymbol
    ) {
      difference++;
    } else {
      break;
    }
  }
  console.log(`   eredmény: ${difference-1}`)
  return difference - 1;
}

function getWinningCells(board, row, column, PlayerSymbol, rowC1, rowC2, colC1, colC2) {
  const winningCells = [];
  let x = row;
  let y = column;
  const withinBorders = (x, y) => x >= 0 && y >= 0 && x < board.length && y < board[0].length;
  do {
    winningCells.push({x, y});
    x += rowC1;
    y += colC1
  } while (withinBorders(x, y) && board[x][y] === PlayerSymbol)
  x= row + rowC2;
  y= column + colC2;
  while(withinBorders(x, y) && board[x][y] === PlayerSymbol){
    winningCells.push({x, y});
    x += rowC2;
    y += colC2
  }
  //tesztelés: a kapott tömb mindig a winninglength-el megegyező hosszúságú kell legyen
  console.log("A győztes tömb: ")
  console.log(winningCells);
  return winningCells;
}

function highlightWinLine(coordinates){
  coordinates.forEach(({ x, y }) => {
    const cell = document.querySelector(`.cell[cellIndexX="${x}"][cellIndexY="${y}"]`);
    cell.classList.add('winner-cell');
  });
}
function checkWin(board, row, column, winningLength) {
  const PlayerSymbol = board[row][column];

  const rowLength =
    checkDirection(board, row, column, PlayerSymbol, 0, 1) +
    checkDirection(board, row, column, PlayerSymbol, 0, -1) +
    1;
  const columnLength =
    checkDirection(board, row, column, PlayerSymbol, 1, 0) +
    checkDirection(board, row, column, PlayerSymbol, -1, 0) +
    1;
  const mDiagonalLength =
    checkDirection(board, row, column, PlayerSymbol, 1, 1) +
    checkDirection(board, row, column, PlayerSymbol, -1, -1) +
    1;
  const oppDiagonalLength =
    checkDirection(board, row, column, PlayerSymbol, 1, -1) +
    checkDirection(board, row, column, PlayerSymbol, -1, 1) +
    1;
  console.log(`Checkwin függvény 
      sora: ${rowLength},oszlopa: ${columnLength},főátló: ${mDiagonalLength},ellenátló: ${oppDiagonalLength} `)

  let winningCoordinates = [];
  switch (true){
    case (rowLength >= winningLength):
      winningCoordinates = getWinningCells(board, row, column, PlayerSymbol, 0, 0, 1, -1);
      highlightWinLine(winningCoordinates);
      return true;
    case (columnLength >= winningLength):
      winningCoordinates = getWinningCells(board, row, column, PlayerSymbol, 1, -1, 0, 0);
      highlightWinLine(winningCoordinates);
      return true;
    case (mDiagonalLength >= winningLength):
      winningCoordinates = getWinningCells(board, row, column, PlayerSymbol, 1, -1, 1, -1);
      highlightWinLine(winningCoordinates);
      return true;
    case (oppDiagonalLength >= winningLength):
      winningCoordinates = getWinningCells(board, row, column, PlayerSymbol, 1, -1, -1, 1);
      highlightWinLine(winningCoordinates);
      return true;
    default:
      return false;
  }
}


//console.log(checkWin(board, 2,3, 4));


function checkDraw(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      console.log(`Az ${i} ${j}edik elem: ${board[i][j]}. Üres?`);
      console.log(board[i][j] === "");
      if (board[i][j] === "") {
        return false;
      }
    }
  }
  return true;
}