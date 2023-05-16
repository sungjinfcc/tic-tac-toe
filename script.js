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
  let markCount = 0;
  const getMarkCount = () => markCount;

  const resetBoard = () => {
    for (let i = 0; i < row; i++) {
      board[i] = [];
      for (let j = 0; j < col; j++) {
        board[i].push(Cell());
      }
    }
    markCount = 0;
  };

  const getBoard = () => board;

  const checkBoard = (cell, player) => {
    if (cell.getValue() === "") {
      cell.markCell(player);
      markCount++;
    }
  };

  resetBoard();

  return {
    getBoard,
    checkBoard,
    resetBoard,
    getMarkCount,
  };
})();

const gameController = (function () {
  const players = ["X", "O"];
  let activePlayer = players[0];
  let winner = "";
  let isTie = false;
  const getIsTie = () => isTie;
  const getWinner = () => winner;
  const resetPlayer = () => {
    activePlayer = players[0];
    winner = "";
    isTie = false;
  };

  const getActivePlayer = () => activePlayer;

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWinCondition = () => {
    const board = gameBoard.getBoard();
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0].getValue() == board[i][1].getValue() &&
        board[i][1].getValue() == board[i][2].getValue()
      ) {
        if (board[i][0].getValue() !== "") {
          winner = board[i][0].getValue();
          return;
        }
      } else if (
        board[0][i].getValue() == board[1][i].getValue() &&
        board[1][i].getValue() == board[2][i].getValue()
      ) {
        if (board[0][i].getValue() !== "") {
          winner = board[0][i].getValue();
          return;
        }
      }
    }

    if (
      (board[0][0].getValue() == board[1][1].getValue() &&
        board[1][1].getValue() == board[2][2].getValue()) ||
      (board[0][2].getValue() == board[1][1].getValue() &&
        board[1][1].getValue() == board[2][0].getValue())
    ) {
      if (board[1][1].getValue() !== "") {
        winner = board[1][1].getValue();
        return;
      }
    }

    if (gameBoard.getMarkCount() === 9) {
      isTie = true;
      return;
    }
  };
  const playRound = (cell) => {
    gameBoard.checkBoard(cell, getActivePlayer());
    checkWinCondition();
    switchTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getWinner,
    resetPlayer,
    getIsTie,
  };
})();

const displayController = (function () {
  const boardDiv = document.querySelector(".game-board");
  const turnLabelDiv = document.querySelector(".turn");
  const resetButton = document.querySelector(".reset-button");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = gameBoard.getBoard();
    const activePlayer = gameController.getActivePlayer();

    console.log(board, activePlayer);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.dataset.cellRow = rowIndex;
        cellDiv.dataset.cellCol = index;
        cellDiv.textContent = cell.getValue();
        cellDiv.classList.add("cell");
        boardDiv.append(cellDiv);
      });
    });

    if (gameController.getWinner() !== "") {
      turnLabelDiv.textContent = `Winner is : ${gameController.getWinner()}`;
      boardDiv.removeEventListener("click", clickHandler);
    } else if (gameController.getIsTie()) {
      turnLabelDiv.textContent = `Tie!`;
    } else {
      turnLabelDiv.textContent = `${activePlayer}'s turn!`;
    }
  };

  const resetScreen = () => {
    gameBoard.resetBoard();
    gameController.resetPlayer();
    updateScreen();
    boardDiv.addEventListener("click", clickHandler);
  };

  function clickHandler(e) {
    const cellRow = e.target.dataset.cellRow;
    const cellCol = e.target.dataset.cellCol;

    const selectedCell = gameBoard.getBoard()[cellRow][cellCol];

    if (!selectedCell) return;

    gameController.playRound(selectedCell);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandler);
  resetButton.addEventListener("click", resetScreen);

  updateScreen();

  return {
    resetScreen,
  };
})();
