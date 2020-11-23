/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BLK,
  BOARD_LAYOUT_NAMES,
  BOARD_LAYOUTS,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_SECONDS,
  DIRECTION,
  EMP,
  WHT
} from '../constants';
import { Box } from '@material-ui/core';
import { getLegalMoveInfo, getPlayerScores } from '../utils/movement';
import { History } from './History';
import { Score } from './Score';
import { ButtonContainer } from './ButtonContainer';
import { ConfigModal } from './ConfigModal';

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;
const MARGIN_SIZE = 1;

const BoardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: red;
  padding: 1rem;
  border-radius: 8px;
  background-color: burlywood;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const BoardTile = styled.div`
  /* width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px; */
  user-select: none;
  width: 4vw;
  height: 4vw;
  border-radius: 50%;
  /* border: 0.1vw solid black; */
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
  background-color: ${(props) => {
    if (props.selected) {
      return 'red';
    }
    if (props.for === EMP) {
      return '#00000050';
    } else if (props.for === BLK) {
      return 'black';
    } else {
      return 'white';
    }
  }};
`;

export const Game = () => {
  const [gameState, setGameState] = useState(BOARD_LAYOUTS.BLANK);
  const [legalMoves, setLegalMoves] = useState([]);
  const [AIColour, setAIColour] = useState(BLK);
  const [humanColour, setHumanColour] = useState(WHT);
  const [moveLimit, setMoveLimit] = useState(DEFAULT_MOVE_LIMIT);
  const [historyEntries, setHistoryEntries] = useState([]);
  // Total calculation time for AI in seconds
  const [totalTime, setTotalTime] = useState(0);
  const [timeTakenForLastMove, setTimeTakenForLastMove] = useState(0);
  const [numTurns, setNumTurns] = useState(1);
  const [humanTimeLimit, setHumanTimeLimit] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [aiTimeLimit, setAITimeLimit] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [configModalOpen, setConfigModalOpen] = useState(true);
  const [selectedMarbles, setSelectedMarbles] = useState(new Set());
  // previous gamestate so that we can use the undo button
  const [previousState, setPreviousState] = useState();
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);
  const [turn, setTurn] = useState(BLK);
  const [firstTurn, setFirstTurn] = useState(true);

  const restorePreviousState = () => {
    setTurn(previousState.turn);
    setLegalMoves(previousState.legalMoves);
    setGameState(previousState.gamestate);
    setHistoryEntries(previousState.historyEntries);
    setNumTurns(previousState.numTurns);
    setTimeTakenForLastMove(previousState.timeTakenForLastMove);
    setTotalTime(previousState.totalTime);
  };

  const handleGameStateChange = (newGameState) => {
    setGameState(newGameState);
  };

  const switchTurn = () => {
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
  };

  const makeBestMove = () => {
    getBestMove((response) => {
      const { move, result, time } = response;
      setTimeTakenForLastMove(time / 1000);
      setGameState(result);
      addHistoryEntry({
        numTurn: numTurns,
        playerColour: AIColour,
        move: move,
        timeTaken: timeTakenForLastMove
      });
    });
  };

  const makeRandomMove = () => {
    getAllMoves((moves) => {
      const move = chooseRandomMove(moves);
      setFirstTurn(false);
      updateStateFromMove(move);
      addHistoryEntry({
        numTurn: numTurns,
        playerColour: AIColour,
        move: move,
        timeTaken: timeTakenForLastMove
      });
    });
  };

  const onPlayClick = (layout, aiColour, moveLimit, humanTime, aiTime) => {
    switch (layout) {
      case BOARD_LAYOUT_NAMES.STANDARD:
        handleGameStateChange(BOARD_LAYOUTS.STANDARD);
        break;
      case BOARD_LAYOUT_NAMES.GERMAN_DAISY:
        handleGameStateChange(BOARD_LAYOUTS.GERMAN_DAISY);
        break;
      case BOARD_LAYOUT_NAMES.BELGIAN_DAISY:
        handleGameStateChange(BOARD_LAYOUTS.BELGIAN_DAISY);
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
  };

  useEffect(() => {
    if (!configModalOpen) {
      if (turn === AIColour) {
        if (firstTurn) {
          makeRandomMove();
        } else {
          makeBestMove();
        }
        switchTurn();
      }
    }
  }, [gameState]);

  useEffect(() => {
    if (turn !== AIColour) {
      getAllMoves((moves) => {
        setLegalMoves(moves);
      });
    }
  }, [turn]);

  const getPosition = (position, direction) => {
    const row = position[0];
    const col = parseInt(position[1]);

    let newrow = row;
    let newcol = col;
    const ascii = row.charCodeAt(0);
    let newascii = ascii;

    switch (direction) {
      case DIRECTION.E:
        newcol = col + 1;
        break;
      case DIRECTION.W:
        newcol = col - 1;
        break;
      case DIRECTION.NE:
        newascii = ascii + 1;
        newcol = col + 1;
        break;
      case DIRECTION.NW:
        newascii = ascii + 1;
        break;
      case DIRECTION.SE:
        newascii = ascii - 1;
        break;
      case DIRECTION.SW:
        newascii = ascii - 1;
        newcol = col - 1;
        break;
    }
    newrow = String.fromCharCode(newascii);
    if (newascii > 96 && newascii < 107 && gameState[newrow][newcol] !== undefined) {
      return `${newrow}${newcol}`;
    } else {
      return null;
    }
  };

  const getDirection = (position1, position2) => {
    const pos1row = position1[0];
    const pos1col = parseInt(position1[1]);
    const pos2row = position2[0];
    const pos2col = parseInt(position2[1]);

    const rowDiff = pos1row.charCodeAt(0) - pos2row.charCodeAt(0);
    const colDiff = pos1col - pos2col;

    if (rowDiff === -1 && colDiff === 0) {
      return DIRECTION.NW;
    } else if (rowDiff === -1 && colDiff === -1) {
      return DIRECTION.NE;
    } else if (rowDiff === 0 && colDiff === -1) {
      return DIRECTION.E;
    } else if (rowDiff === 0 && colDiff === 1) {
      return DIRECTION.W;
    } else if (rowDiff === 1 && colDiff === 1) {
      return DIRECTION.SW;
    } else if (rowDiff === 1 && colDiff === 0) {
      return DIRECTION.SE;
    }
  };

  const isNeighbor = (position1, position2) => {
    return getDirection(position1, position2) !== undefined;
  };

  const isFriendly = (position1, position2) => {
    return (
      gameState[position1[0]][parseInt(position1[1])] ===
      gameState[position2[0]][parseInt(position2[1])]
    );
  };

  const getMarblePositionBetween = (position1, position2) => {
    const pos1row = position1[0].charCodeAt(0);
    const pos1col = parseInt(position1[1]);
    const pos2row = position2[0].charCodeAt(0);
    const pos2col = parseInt(position2[1]);

    if (Math.abs(pos1row - pos2row) === 2) {
      if (pos1col > pos2col && pos1col - pos2col === 2) {
        return `${String.fromCharCode(pos1row - 1)}${pos1col - 1}`;
      } else if (pos1col < pos2col && pos2col - pos1col === 2) {
        return `${String.fromCharCode(pos2row - 1)}${pos2col - 1}`;
      } else if (pos1col === pos2col && pos1row > pos2row) {
        return `${String.fromCharCode(pos1row - 1)}${pos1col}`;
      } else if (pos1col === pos2col && pos2row > pos1row) {
        return `${String.fromCharCode(pos2row - 1)}${pos1col}`;
      }
    } else if (pos1row === pos2row) {
      if (pos1col > pos2col && pos1col - pos2col === 2) {
        return `${position1[0]}${pos1col - 1}`;
      } else if (pos1col < pos2col && pos2col - pos1col === 2) {
        return `${position1[0]}${pos2col - 1}`;
      }
    }
    return null;
  };

  const onMarbleClick = (row, col) => {
    if (gameState[row][col] === turn) {
      // Push opponent Marble logic
      if (selectedMarbles.size > 1) {
        setSelectedMarbles(new Set());
        return;
      }
      if (selectedMarbles.has(`${row}${col}`)) {
        setSelectedMarbles(new Set());
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
    } else {
      const moves = getLegalMoveInfo(legalMoves, selectedMarbles);
      if (moves.length !== 0) {
        console.log(moves);

        const choice = parseInt(prompt(moves.join(' / '))) - 1;
        // if empty string then continue.
        if (isNaN(choice)) {
          console.log('user cancelled');
          return;
        }
        try {
          // If the user enter in like 124 when there are only 2 moves, catch the error and let them try again.
          try {
            updateStateFromMove(moves[choice]);
          } catch (err) {
            console.log(err);
            console.log('invalid input');
            return;
          }
          setSelectedMarbles(new Set());
          addHistoryEntry({
            numTurn: numTurns,
            playerColour: turn,
            move: moves[choice],
            timeTaken: turn === AIColour ? timeTakenForLastMove : 0
          });
          switchTurn();
          setNumTurns(numTurns + 1);
        } catch (err) {
          console.log('not a valid option');
          console.log(err);
        }
      }
    }
  };

  const addHistoryEntry = (newEntry) => {
    if (historyEntries.length === 0) {
      setHistoryEntries([newEntry]);
    } else {
      setHistoryEntries([...historyEntries, newEntry]);
    }
  };

  return (
    <Box className="rowWrapper">
      <ConfigModal isOpen={configModalOpen} onSubmit={onPlayClick} />
      <Box className="colWrapper">
        <ButtonContainer onUndoClicked={restorePreviousState} />
        <BoardContainer>
          <Board>
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
        </BoardContainer>
      </Box>
      <Box className="colWrapper">
        <Score blackScore={blackScore} whiteScore={whiteScore} />
        <History aiColor={AIColour} totalTime={totalTime} historyEntries={historyEntries} />
      </Box>
    </Box>
  );
};
