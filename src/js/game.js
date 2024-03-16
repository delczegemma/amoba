import { Evaluator } from './evaluator.js';
export class Game {
    constructor(cells, message, restartBtn, firstPlayer, winningLength, boardSize) {
        this.cells = cells
        this.message = message
        this.restartBtn = restartBtn
        this.firstPlayer = firstPlayer
        this.winningLength = winningLength
        this.boardSize = boardSize
        this.restartGame(this.firstPlayer,this.cells.length);
        this.evaluator = new Evaluator(this.board);
        this.initGame();
    }
    initBoard(cellLength){ //flexibilis initBoard
        let boardSize = Math.sqrt(cellLength);
        return Array(boardSize).fill().map(() =>
            Array(boardSize).fill(""));
    }
    initGame() {
        this.cells.forEach((cell) => {
            cell.dataset.nextMove = this.player;
            cell.addEventListener("click", () => this.makeMove(event));
        });
        this.restartBtn.addEventListener("click", () => this.restartGame(this.firstPlayer,this.cells.length));
    }
    makeMove(event) {
        const cell = event.target;
        if (cell.classList.contains('filled')) {
            // ha már van itt lépés, ne tegyen semmit
            return;
        }
        const row = parseInt(cell.getAttribute("cellIndexX"));
        const col = parseInt(cell.getAttribute("cellIndexY"));

        //leteszi a lépést a táblára és a tömbbe
        this.placeStepOnBoard(cell, row, col);
        console.log(board);

        //A táblán lévő cellára filled classt rak
        //CheckWin
        const winDirections= this.evaluator.checkWin(row, col, this.winningLength )
        console.log("windirections tömb: " + winDirections)
        if (winDirections){
            const winningCoordinates = this.evaluator.getWinningCells(row, col, ...winDirections);
            this.highlightWinLine(winningCoordinates)
            this.gameOver();
            this.message.textContent = `Az ${this.player} játékos nyert! Gratulálunk!`
        }
        //CheckDraw
        else if (this.evaluator.checkDraw()){
            this.gameOver();
            this.message.textContent = `A játék véget ért. Az eredmény döntetlen. Újra?`
        } else {
            //játékosváltás
            this.switchPlayer();
        }
    }
    placeStepOnBoard(cell, row, col) {
        this.board[row][col] = this.player;
        cell.innerText = this.player;
        cell.classList.add('filled');
    }
    switchPlayer() {
        this.player = this.player === "X" ? "O" : "X";

        //hover helyzet váltása
        this.cells.forEach(cell => {
            cell.dataset.nextMove = this.player;
        });
    }
    gameOver() {
        this.cells.forEach(cell => {
            if (!cell.classList.contains('filled')) {
                cell.classList.add('filled')
            }
        })
    }
    restartGame(player, cellsLength) {
        this.board = this.initBoard(cellsLength);
        this.player = player;
        //esetleg if ide
        this.message.textContent = "";
        this.cells.forEach(cell => {
            cell.classList.remove('filled')
            cell.classList.remove('winner-cell');
            cell.textContent = ""
        })
    }
    highlightWinLine(coordinates){
        coordinates.forEach(({ x, y }) => {
            const cell = document.querySelector(`.cell[cellIndexX="${x}"][cellIndexY="${y}"]`);
            cell.classList.add('winner-cell');
        });
    }
}