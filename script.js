const Cell = function () {
  let value = "";

  const getValue = () => value;

  const markCell = (player) => {
    value = player;
  };

  return {
    getValue,
    markCell,
  };
};

const gameBoard = (function () {
  const board = [];
  const row = 3;
  const col = 3;

  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < col; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const checkBoard = (cell, player) => {
    if (cell.getValue() === "") {
      cell.markCell(player);
    }
  };

  return {
    getBoard,
    checkBoard,
  };
})();

const gameController = (function () {
  const players = ["X", "O"];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  const switchTurn = () => {
    activePlayer == players[0]
      ? (activePlayer = players[1])
      : (activePlayer = players[0]);
  };
  const playRound = (cell) => {
    gameBoard.checkBoard(cell, getActivePlayer());
    switchTurn();
  };

  return {
    playRound,
    getActivePlayer,
  };
})();

const displayController = (function () {
  const boardDiv = document.querySelector(".game-board");
  const turnLabelDiv = document.querySelector(".turn");
  const scoreLabelDiv = document.querySelector(".score-board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = gameBoard.getBoard();
    const activePlayer = gameController.getActivePlayer();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        const cellIndex = rowIndex * 3 + index;
        const cellDiv = document.createElement("div");
        cellDiv.dataset.cellNum = cellIndex;
        cellDiv.dataset.cellRow = rowIndex;
        cellDiv.dataset.cellCol = index;
        cellDiv.textContent = cell.getValue();
        cellDiv.classList.add("cell");
        boardDiv.append(cellDiv);
      });
    });
  };

  function clickHandler(e) {
    const cellRow = e.target.dataset.cellRow;
    const cellCol = e.target.dataset.cellCol;

    const selectedCell = gameBoard.getBoard()[cellRow][cellCol];

    if (!selectedCell) return;

    console.log(selectedCell.getValue());

    gameController.playRound(selectedCell);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandler);

  updateScreen();
})();
