import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GRID_SIZE = 5;

const App = () => {
  const [robotPosition, setRobotPosition] = useState({ row: 0, col: 0 });
  const [endPosition, setEndPosition] = useState({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 });
  const [directions, setDirections] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [executedInstructions, setExecutedInstructions] = useState([]);
  const  success= () => toast.success("Victory");
    const fail = () => toast.error("Robot moved outside the grid!");

  const handleCellClick = (row, col) => {
    if (!isPlaying) {
      setRobotPosition({ row, col });
    }
  };

  const handleDragStart = (e, direction) => {
    e.dataTransfer.setData('text/plain', direction);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const direction = e.dataTransfer.getData('text/plain');
    setDirections((prevDirections) => [...prevDirections, direction]);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    executeDirections(directions.slice());
  };

  const executeDirections = (directionsCopy) => {
    if (directionsCopy.length === 0) {
      setIsPlaying(false);
      setCurrentInstruction('');
      return;
    }

    const direction = directionsCopy.shift();
    setCurrentInstruction(direction);
    moveRobot(direction);
    setExecutedInstructions((prevInstructions) => [...prevInstructions, "robot moved "+direction]);
   

    if (directionsCopy.length === 0) {
      setIsPlaying(false);
      setCurrentInstruction('');
    } else {
      setTimeout(() => {
        executeDirections(directionsCopy);
      }, 500);
    }
  };

  const moveRobot = (direction) => {
    setRobotPosition((prevPosition) => {
      let newRow = prevPosition.row;
      let newCol = prevPosition.col;

      switch (direction) {
        case 'Up':
          newRow =  prevPosition.row - 1;
          break;
        case 'Down':
          newRow =  prevPosition.row + 1;
          break;
        case 'Left':
          newCol =  prevPosition.col - 1;
          break;
        case 'Right':
          newCol =  prevPosition.col + 1;
          break;
        default:
          break;
      }

      if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
        fail();
        handleReset();
      }

      return { row: newRow, col: newCol };
    });
  };

  const handleReset = () => {
    if (!isPlaying) {
      setRobotPosition({ row: 0, col: 0 });
      setDirections([]);
      setCurrentInstruction('');
      setExecutedInstructions([]);
    }
  };

  const renderLogicPanelSquares = () => {
    return directions.map((direction, index) => (
      <div key={index} className="logic-panel-square">
        <FontAwesomeIcon
          icon={
            direction === 'Up'
              ? faArrowUp
              : direction === 'Down'
              ? faArrowDown
              : direction === 'Left'
              ? faArrowLeft
              : faArrowRight
          }
          className="arrow-icon"
        />
      </div>
    ));
  };

  const renderExecutedInstructions = () => {
    return executedInstructions.map((instruction, index) => (
      <div key={index}>{instruction}</div>
    ));
  };

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isRobot = row === robotPosition.row && col === robotPosition.col;
        const isEndSquare = row === endPosition.row && col === endPosition.col;
        const cellClass = isRobot
          ? 'grid-cell robot'
          : isEndSquare
          ? 'grid-cell end-square'
          : 'grid-cell';
        cells.push(
          <div
            key={`${row}-${col}`}
            className={cellClass}
            onClick={() => handleCellClick(row, col)}
          ></div>
        );
      }
    }

    setTimeout(() => {
      if (GRID_SIZE - 1 === robotPosition.row && GRID_SIZE - 1 === robotPosition.col) {
        success();
      }
    }, 50);

    return cells;
  };

  return (
    <div className='fle'>
    <div className="app">
      <div className="grid">{renderGrid()}</div>
      <div className="info-h">Drag and Drop arrow icons in the logic pallet</div>
      <div className="logic-panel" onDrop={handleDrop} onTouchEnd={(e) => e.preventDefault()} onDragOver={(e) => e.preventDefault()}>
        {renderLogicPanelSquares()}
      </div>
      <div className="arrow-buttons">
        <div className="arrow-button" draggable onTouchStart={(e) => handleDragStart(e, 'Up')} onDragStart={(e) => handleDragStart(e, 'Up')}>
          <FontAwesomeIcon icon={faArrowUp} />
        </div>
        <div className="arrow-button" draggable onDragStart={(e) => handleDragStart(e, 'Down')}>
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
        <div className="arrow-button" draggable onDragStart={(e) => handleDragStart(e, 'Left')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <div className="arrow-button" draggable onDragStart={(e) => handleDragStart(e, 'Right')}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
      <div className="buttons">
        <button className="play-button" onClick={handlePlay} disabled={isPlaying}>
          Play
        </button>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
    <div className="executed-instructions">
      <div className="title">Executed Instructions</div>
    <div className="proccess">
    {renderExecutedInstructions()}
    </div>
    </div>
    <ToastContainer theme="colored" />
    </div>
  );
};

export default App;
