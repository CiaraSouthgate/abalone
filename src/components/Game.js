/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  BLK,
  BOARD_LAYOUT_NAMES,
  BOARD_LAYOUTS,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_SECONDS,
  DIRECTIONS_OBJECT,
  EMP,
  WHT
} from '../constants';
import { Box } from '@material-ui/core';
import {
  getLegalMoveInfo,
  getMarblePositionBetween,
  getPlayerScores,
  isNeighbor
} from '../utils/movement';
import { History } from './History';
import { Score } from './Score';
import { ButtonContainer } from './ButtonContainer';
import { ConfigModal } from './ConfigModal';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MoveArrows } from './MoveArrows';
import { EndScreen } from './EndScreen';

const MARGIN_SIZE = 1;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: red;
  padding: 1rem 3rem;
  border-radius: 8px;
  background-color: burlywood;
  position: relative;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const BoardTile = styled.div`
  user-select: none;
  width: 4vw;
  height: 4vw;
  border-radius: 50%;
  margin: 0px ${MARGIN_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  &:hover {
    cursor: pointer;
  }
  color: ${(props) => {
    if (props.for === BLK) {
      return 'white';
    } else {
      return 'black';
    }
  }};
  border: ${(props) => {
    if (props.selected) {
      return '2px solid teal';
    }
    return '1px solid #00000010';
  }};
  background-color: ${(props) => {
    if (props.for === EMP) {
      return '#00000010';
    } else if (props.for === BLK) {
      return (
        'background: rgb(98,98,98);' +
        'background: radial-gradient(circle, rgba(98,98,98,1) 0%, ' +
        'rgba(60,60,64,1) 30%, rgba(0,0,0,1) 100%);'
      );
    } else {
      return (
        'background: rgb(255,255,255);' +
        'background: radial-gradient(circle, rgba(255,255,255,1) 0%, ' +
        'rgba(183,183,201,1) 90%, rgba(195,195,195,1) 100%);'
      );
    }
  }};
`;

export const Game = () => {
  const [configModalOpen, setConfigModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState(BOARD_LAYOUTS.BLANK);
  const [legalMoves, setLegalMoves] = useState([]);
  const [AIColour, setAIColour] = useState(null);
  const [humanColour, setHumanColour] = useState(null);
  const [moveLimit, setMoveLimit] = useState(DEFAULT_MOVE_LIMIT);
  const [historyEntries, setHistoryEntries] = useState([]);
  // Total calculation time for AI in seconds
  const [totalTime, setTotalTime] = useState(0);
  const [timeTakenForLastMove, setTimeTakenForLastMove] = useState(0);
  const [numTurns, setNumTurns] = useState(1);
  const [humanTimeLimit, setHumanTimeLimit] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [aiTimeLimit, setAITimeLimit] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [selectedMarbles, setSelectedMarbles] = useState(new Set());
  // previous gamestate so that we can use the undo button
  const [previousState, setPreviousState] = useState();
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);
  const [turn, setTurn] = useState(null);
  const [firstTurn, setFirstTurn] = useState(true);
  const [legalDirections, setLegalDirections] = useState(DIRECTIONS_OBJECT);
  const [humanMoveStart, setHumanMoveStart] = useState(null);

  // These are used for the end game pop up screen.
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [endGameReason, setEndGameReason] = useState("");

  const previousValues = useRef({ turn, gameState });

  useEffect(() => {
    if (previousValues.current.turn !== turn && previousValues.current.gameState !== gameState) {
      const scores = getPlayerScores(gameState);
      setBlackScore(scores.BLK);
      setWhiteScore(scores.WHT);
      if (!configModalOpen) {
        if (turn === AIColour) {
          if (firstTurn) {
            makeRandomMove();
          } else {
            makeBestMove();
          }
        } else {
          const now = new Date().getTime();
          setHumanMoveStart(now);
          getAllMoves((moves) => {
            setLegalMoves(moves);
          });
        }
      }
      previousValues.current = { turn, gameState };
    }
  }, [gameState, turn]);

  const onPlayClick = (layout, aiColour, moveLimit, humanTime, aiTime) => {
    switch (layout) {
      case BOARD_LAYOUT_NAMES.STANDARD:
        setGameState(BOARD_LAYOUTS.STANDARD);
        break;
      case BOARD_LAYOUT_NAMES.GERMAN_DAISY:
        setGameState(BOARD_LAYOUTS.GERMAN_DAISY);
        break;
      case BOARD_LAYOUT_NAMES.BELGIAN_DAISY:
        setGameState(BOARD_LAYOUTS.BELGIAN_DAISY);
        break;
      default:
        break;
    }
    setConfigModalOpen(false);
    setAIColour(aiColour);
    setHumanColour(aiColour === BLK ? WHT : BLK);
    setMoveLimit(moveLimit);
    setHumanTimeLimit(humanTime);
    setAITimeLimit(aiTime);
    setTurn(BLK);
  };

  // Will end the game and display the Game Finished window
  // Game finished window will contain:
  // Button to start a new game.
  // Scores of both players and an indicator for who won.
  const stopGameClick = () => {
    if (window.confirm("Are you sure you want to end the game?")){
      setIsGameFinished(true);
      setEndGameReason("Manual Termination");
    }
  }

  // Asks the user if they want to restart the game, if they confirm then the page is refreshed.
  const restartGame = () => {
    // If user confirms, reload else do nothing 
    if(window.confirm("Are you sure you want to restart the game?")){
      // reload page
      document.location.reload();
    }
  }

  const restorePreviousState = () => {
    setTurn(previousState.turn);
    setLegalMoves(previousState.legalMoves);
    setGameState(previousState.gameState);
    setFirstTurn(previousState.firstTurn);
    setHistoryEntries(previousState.historyEntries);
    setNumTurns(previousState.numTurns);
    setTimeTakenForLastMove(previousState.timeTakenForLastMove);
    setTotalTime(previousState.totalTime);
  };

  const updatePrevious = () => {
    setPreviousState({
      turn: turn,
      legalMoves: legalMoves,
      gameState: gameState,
      firstTurn: firstTurn,
      historyEntries: historyEntries,
      numTurns: numTurns,
      timeTakenForLastMove: timeTakenForLastMove,
      totalTime: totalTime
    });
  };

  const switchTurn = () => {
    setFirstTurn(false);
    setTurn(turn === BLK ? WHT : BLK);
  };

  const chooseRandomMove = (move_list) => {
    if (move_list.length === 0) console.log('no moves');
    let rand = getRandomInt(move_list.length);
    return move_list[rand];
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const getAllMoves = (callback) => {
    const req = new XMLHttpRequest();
    const queryString = `?state=${JSON.stringify(gameState)}&colour=${turn}`;
    req.open('GET', 'http://localhost:5000/allmoves' + queryString);
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.responseText));
      }
    };
    req.send();
  };

  const getStateFromMove = (move, callback) => {
    const req = new XMLHttpRequest();
    const queryString = `?state=${JSON.stringify(gameState)}&move=${move}&side=${turn}`;
    req.open('GET', 'http://localhost:5000/state' + queryString);
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.responseText));
      } else if (req.status === 400) {
        console.log(req.responseText);
      }
    };
    req.send();
  };

  const updateStateFromMove = (move) => {
    getStateFromMove(move, (result) => {
      updatePrevious();
      setGameState(result);
    });
  };

  const getBestMove = (callback) => {
    const req = new XMLHttpRequest();
    const queryString = `?state=${JSON.stringify(
      gameState
    )}&colour=${AIColour}&timeLimit=${aiTimeLimit}`;
    req.open('GET', 'http://localhost:5000/bestmove' + queryString);
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(JSON.parse(req.responseText));
      }
    };
    req.send();
  };

  const makeBestMove = () => {
    setIsLoading(true);
    getBestMove((response) => {
      setIsLoading(false);
      const { move, result, time } = response;
      const timeInSec = time / 1000;
      updatePrevious();
      setTimeTakenForLastMove(timeInSec);
      setGameState(result);
      switchTurn();
      setTotalTime(totalTime + timeInSec);
      addHistoryEntry({
        numTurn: numTurns,
        playerColour: AIColour,
        move: move,
        timeTaken: timeInSec
      });
    });
  };

  const makeRandomMove = () => {
    getAllMoves((moves) => {
      const move = chooseRandomMove(moves);
      updateStateFromMove(move);
      switchTurn();
      addHistoryEntry({
        numTurn: numTurns,
        playerColour: AIColour,
        move: move,
        timeTaken: timeTakenForLastMove
      });
    });
  };

  const clearMoveDirections = () => {
    return {
      NE: { active: false, move: null },
      E: { active: false, move: null },
      SE: { active: false, move: null },
      SW: { active: false, move: null },
      W: { active: false, move: null },
      NW: { active: false, move: null }
    };
  };

  const getDirectionsFromMoves = (moves) => {
    const directions = clearMoveDirections();
    moves.forEach((move) => {
      const direction = move.split(' ')[2];
      directions[direction].active = true;
      directions[direction].move = move;
    });
    setLegalDirections(directions);
  };

  const onMarbleClick = (row, col) => {
    if (gameState[row][col] === turn) {
      //deselect if clicking on same or if trying to add more than allowed to group
      if (selectedMarbles.size > 1 || selectedMarbles.has(`${row}${col}`)) {
        setSelectedMarbles(new Set());
        setLegalDirections(clearMoveDirections());
        return;
      }
      const newSelectedMarbles = new Set(selectedMarbles);
      if (selectedMarbles.size === 1) {
        const selectedMarble = Array.from(selectedMarbles)[0];
        const posBetween = getMarblePositionBetween(selectedMarble, `${row}${col}`);
        if (posBetween != null && isFriendly(selectedMarble, posBetween)) {
          newSelectedMarbles.add(posBetween);
        } else if (!isNeighbor(Array.from(selectedMarbles)[0], `${row}${col}`)) {
          setSelectedMarbles(new Set([`${row}${col}`]));
          return;
        }
      }
      newSelectedMarbles.add(`${row}${col}`);
      setSelectedMarbles(newSelectedMarbles);
      const moves = getLegalMoveInfo(legalMoves, newSelectedMarbles);
      if (moves.length !== 0) {
        getDirectionsFromMoves(moves);
      }
    }
  };

  const isFriendly = (position1, position2) => {
    return (
      gameState[position1[0]][parseInt(position1[1])] ===
      gameState[position2[0]][parseInt(position2[1])]
    );
  };

  const addHistoryEntry = (newEntry) => {
    if (historyEntries.length === 0) {
      setHistoryEntries([newEntry]);
    } else {
      const existingEntries = historyEntries;
      setHistoryEntries([newEntry, ...existingEntries]);
    }
  };

  const handleMoveArrowClick = (direction) => {
    const move = legalDirections[direction].move;
    updateStateFromMove(move);
    switchTurn();
    setSelectedMarbles(new Set());
    setLegalDirections(clearMoveDirections());
    addHistoryEntry({
      numTurn: numTurns,
      playerColour: turn,
      move: move,
      timeTaken: (new Date().getTime() - humanMoveStart) / 1000
    });
    setNumTurns(numTurns + 1);
  };

  return (
    <Box className="rowWrapper">
      <ConfigModal isOpen={configModalOpen} onSubmit={onPlayClick} />
      <Box className="colWrapper">
        <ButtonContainer onUndoClicked={restorePreviousState} onStopClicked={stopGameClick} onRestartClicked={restartGame}/>
        <Box className="colWrapper">
          <Board>
            <MoveArrows activeDirections={legalDirections} onArrowClick={handleMoveArrowClick} />
            {Object.keys(gameState).map((k) => (
              <BoardRow key={k}>
                {Object.keys(gameState[k]).map((col) => (
                  <BoardTile
                    key={`${k}${col}`}
                    for={gameState[k][col]}
                    selected={selectedMarbles.has(`${k}${col}`)}
                    onClick={() => onMarbleClick(k, col)}>
                    {`${k}${col}`}
                  </BoardTile>
                ))}
              </BoardRow>
            ))}
          </Board>
        </Box>
      </Box>
      <Box className="colWrapper">
        <Score blackScore={blackScore} whiteScore={whiteScore} />
        <LinearProgress className={`progress ${!isLoading && 'hidden'}`} />
        <History aiColour={AIColour} totalTime={totalTime} historyEntries={historyEntries} />
      </Box>
      <EndScreen isOpen={isGameFinished} whiteScore={whiteScore} blackScore={blackScore} reason={endGameReason}/>
    </Box>
  );
};
