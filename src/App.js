import { useState } from "react";
import { getSudoku, getInvalidCellMatrix, isValidSudoku, hasNulls, getHint } from "./tools";

const MAX_HINTS = 5;

function HintButton({ noOfHints, setNoOfHints }) {
  return (
    <button className='hint-button' onClick={setNoOfHints}>
      Hint:{noOfHints}
    </button>
  );
}

function Square({ value, setValue }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
  }

  return (
    <button className='square' onClick={handleClick}>
      {value}
    </button>
  );
}

function InvalidSquare({ value, setValue }) {
  function handleClick() {
    let v = value;
    if (value === null) {
      setValue(1);
      v = 1;
    } else {
      setValue((value % 9) + 1);
      v = (value % 9) + 1;
    }
  }

  return (
    <button className='square' onClick={handleClick} style={{ backgroundColor: "rgba(252, 0, 0, 0.3)" }}>
      {value}
    </button>
  );
}

function FixedSquare({ value }) {
  return (
    <button className='square' style={{ color: "red", fontWeight: "bold", fontSize: "23px" }} disabled={true}>
      {value}
    </button>
  );
}

function Board({ board, setBoard, initialBoard, invalidCellMatrix }) {
  function updateBoard(value, ridx, cidx) {
    let newBoard = board.map(function (arr) {
      return arr.slice();
    });
    newBoard[ridx][cidx] = value;
    setBoard(newBoard);
  }

  const dispBoard = [];

  for (let ridx = 0; ridx < board.length && ridx < 9; ridx++) {
    const dispRow = [];

    for (let cidx = 0; cidx < board[ridx].length && cidx < 9; cidx++) {
      if (initialBoard[ridx][cidx]) {
        dispRow.push(<FixedSquare key={`${(ridx + 1) * (cidx + 1)}`} value={initialBoard[ridx][cidx]} />);
      } else {
        if (invalidCellMatrix[ridx][cidx]) {
          dispRow.push(
            <InvalidSquare
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
            />
          );
        } else {
          dispRow.push(
            <Square
              key={`${(ridx + 1) * (cidx + 1)}`}
              value={board[ridx][cidx]}
              setValue={(a) => updateBoard(a, ridx, cidx)}
            />
          );
        }
      }
    }

    dispBoard.push(dispRow);
  }

  return <div className='sudoku-board'>{dispBoard}</div>;
}

let invalidCells = Array.from({ length: 9 }, () => Array(9).fill(0));

function getNewGame() {
  console.log("Loading New Game!");
  const [initialSudokuBoard, solvedSudokuBoard] = getSudoku();
  localStorage.setItem("initialSudokuBoard", JSON.stringify(initialSudokuBoard));
  localStorage.setItem("solvedSudokuBoard", JSON.stringify(solvedSudokuBoard));
  localStorage.setItem("lastSudokuBoard", JSON.stringify(initialSudokuBoard));
  localStorage.setItem("noHints", JSON.stringify(MAX_HINTS));

  return [initialSudokuBoard, solvedSudokuBoard, initialSudokuBoard, MAX_HINTS];
}

function getOldGame() {
  const oldInitialBoard = JSON.parse(localStorage.getItem("initialSudokuBoard"));
  const oldSolvedBoard = JSON.parse(localStorage.getItem("solvedSudokuBoard"));
  const oldLastBoard = JSON.parse(localStorage.getItem("lastSudokuBoard"));
  const noHints = JSON.parse(localStorage.getItem("noHints"));

  if (oldInitialBoard && oldSolvedBoard && oldLastBoard && noHints) {
    console.log("Loading Old Game!");
    return [
      oldInitialBoard,
      oldSolvedBoard,
      oldLastBoard,
      noHints,
    ];
  }

  return getNewGame();
}

export default function Game() {
  let [initialSudokuBoard, solvedSudokuBoard, currBoard, noHints] = getOldGame();

  const [board, setBoard] = useState(currBoard);
  const [won, setWon] = useState(false);
  const [hints, setHints] = useState(noHints);
  const [hintUsed, setHintUsed] = useState(false);

  function newGame() {
    const [newInitialSudokuBoard, newSolvedSudokuBoard, currBoard, noHints] = getNewGame();
    setBoard(currBoard);
    setHints(noHints);
    setWon(false);
    setHintUsed(false);
    initialSudokuBoard = newInitialSudokuBoard;
    solvedSudokuBoard = newSolvedSudokuBoard;
  }

  function restart() {
    
    setWon(false);
    setHintUsed(false);
    setHints(MAX_HINTS);
    setBoard(initialSudokuBoard);

    refreshStorage(initialSudokuBoard, MAX_HINTS)
  }
  
  function refreshStorage(newBoard, newHints){
    localStorage.setItem("lastSudokuBoard", JSON.stringify(newBoard));
    localStorage.setItem("noHints", String(newHints));
  }

  function updateBoard(board) {
    if (isValidSudoku(board) && !hasNulls(board)) {
      setWon(true);
    }
    setHintUsed(false);
    setBoard(board);
    
    refreshStorage(board, hints)
  }

  function updateHints() {
    
    if (!hints) {
      console.log("No hints left");
    
    } else {
      
      setHintUsed(true);
      invalidCells = getInvalidCellMatrix(board, solvedSudokuBoard);
      
      let newHint = getHint(currBoard, solvedSudokuBoard);

      if(newHint){
        const [row, col, number] = newHint
        board[row][col] = number
      }
      setHints(hints - 1);
      setBoard(board);
      refreshStorage(board, (hints-1))
    }
  }

  if (won) {
    return (
      <div>
        <p>won</p>
        <button onClick={newGame}>New Game!</button>
      </div>
    );
  } else {
    return (
      <div className='game'>
        <HintButton noOfHints={hints} setNoOfHints={updateHints} />
        <Board
          board={board}
          setBoard={updateBoard}
          initialBoard={initialSudokuBoard}
          invalidCellMatrix={hintUsed ? invalidCells : Array.from({ length: 9 }, () => Array(9).fill(0))}
        />
        <button onClick={newGame}>New Game!</button>
        <button onClick={restart}>Restart!</button>
      </div>
    );
  }
}
