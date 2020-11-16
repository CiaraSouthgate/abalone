/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import {
  BLK,
  BOARD_LAYOUT_NAMES,
  BOARD_LAYOUTS,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_SECONDS,
  EMP,
  GAME_MODE,
  MARBLE_COLOURS,
  WHT,
  DIRECTION
} from '../constants';

import {
  Button,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core';
import { ButtonContainer } from './ButtonContainer';
import { InputFile } from './InputFile';
import {
  convertGameStateToCordinateArray,
  coordinatesToGameState,
  getLegalDirectionsToMove,
  getLegalMoveInfo,
  mapToColour
} from '../utils/movement';
import {
  createInitialState,
  generateMoves,
  generateOutput,
  getNextBoardConfiguration
} from '../state_generation';

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;
const MARGIN_SIZE = 1;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

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

const ConfigModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  background-color: white;
  box-shadow: 6px 5px 17px 5px rgba(0, 0, 0, 0.21);
  padding: 20px;
`;

const ConfigTitle = styled.h2``;

const ConfigBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfigRow = styled.div`
  display: flex;
  margin: 10px 0;
`;

const Scoreboard = styled.div`
  position: absolute;
  right: 20px;

  table,
  th,
  td {
    border-collapse: collapse;
  }
  th,
  td {
    border-bottom: 1px solid black;
    padding: 5px;
    text-align: left;
  }
`;

const ScoreDisplay = styled.th``;

export const Game = () => {
  const [initBoardLayout, setInitBoardLayout] = React.useState(BOARD_LAYOUT_NAMES.GERMAN_DAISY);
  const [gameState, setGameState] = React.useState(BOARD_LAYOUTS.GERMAN_DAISY);
  const [legalMoves, setLegalMoves] = React.useState([]);
  const [turn, setTurn] = React.useState(BLK);
  const [playerColour] = React.useState(MARBLE_COLOURS.BLACK);
  const [gameMode, setGameMode] = React.useState(GAME_MODE.VSCOMPUTER);
  const [moveLimit] = React.useState(DEFAULT_MOVE_LIMIT);
  const [timeLimitInSeconds] = React.useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [isConfigModalShown, setIsConfigModalShown] = React.useState(true);
  const [selectedMarbles, setselectedMarbles] = React.useState(new Set());
  const score = 0; // ???

  React.useEffect(() => {
    const coords = [
      'A3b',
      'B2b',
      'B3b',
      'C3b',
      'C4b',
      'G7b',
      'G8b',
      'H7b',
      'H8b',
      'H9b',
      'I8b',
      'I9b',
      'A4w',
      'A5w',
      'B4w',
      'B5w',
      'B6w',
      'C5w',
      'C6w',
      'G4w',
      'G5w',
      'H4w',
      'H5w',
      'H6w',
      'I5w',
      'I6w'
    ];
    const gs = coordinatesToGameState(coords);
    setGameState(gs);
  }, []);

  React.useEffect(() => {
    const coords = convertGameStateToCordinateArray(gameState);
    console.log(coords);
    createInitialState(coords);
    const moves = generateMoves(mapToColour(turn), coords);
    setLegalMoves(moves);
    const temp = generateOutput(moves, mapToColour(turn));
    console.log(temp);
  }, [gameState]);

  React.useEffect(() => {
    console.log('legalMoves updated');
  }, [legalMoves]);

  const handleInitBoardLayoutChange = (e) => {
    setInitBoardLayout(parseInt(e.target.value));
  };

  const handleGameModeChange = (e) => {
    setGameMode(parseInt(e.target.value));
  };

  const onPlayClick = () => {
    setIsConfigModalShown(false);
    // if (initBoardLayout === BOARD_LAYOUT_NAMES.STANDARD) {
    //   setGameState(BOARD_LAYOUTS.STANDARD);
    // } else if (initBoardLayout === BOARD_LAYOUT_NAMES.BELGIAN_DAISY) {
    //   setGameState(BOARD_LAYOUTS.BELGIAN_DAISY);
    // } else {
    //   setGameState(BOARD_LAYOUTS.GERMAN_DAISY);
    // }
  };

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

  const moveMarbles = (positions, direction) => {
    const adder = gameState[positions[0][0]][parseInt(positions[0][1])];
    const newGameState = JSON.parse(JSON.stringify(gameState));

    for (const position of positions) {
      const row = position[0];
      const col = parseInt(position[1]);
      const newPosition = getPosition(position, direction);
      if (newPosition) {
        const newrow = newPosition[0];
        const newcol = parseInt(newPosition[1]);

        if (!selectedMarbles.has(`${newrow}${newcol}`) && gameState[newrow][newcol] === adder) {
          console.log('not valid move');
          return;
        }

        newGameState[newrow][newcol] += adder;
        newGameState[row][col] -= adder;
      }
    }
    setGameState(newGameState);
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
    if (gameState[row][col] !== EMP) {
      // Push opponent Marble logic
      if (gameState[row][col] !== turn) {
        // Calculate the number of selected Marble
        return;
      }
      if (selectedMarbles.size > 1) {
        setselectedMarbles(new Set());
        return;
      }
      if (selectedMarbles.has(`${row}${col}`)) {
        setselectedMarbles(new Set());
        return;
      }
      const newselectedMarbles = new Set(selectedMarbles);
      if (selectedMarbles.size === 1) {
        const selectedMarble = Array.from(selectedMarbles)[0];
        const posBetween = getMarblePositionBetween(selectedMarble, `${row}${col}`);
        if (posBetween !== null && isFriendly(selectedMarble, posBetween)) {
          newselectedMarbles.add(posBetween);
        } else if (!isNeighbor(Array.from(selectedMarbles)[0], `${row}${col}`)) {
          setselectedMarbles(new Set([`${row}${col}`]));
          return;
        }
      }
      newselectedMarbles.add(`${row}${col}`);
      setselectedMarbles(newselectedMarbles);
    } else {
      const moves = getLegalMoveInfo(legalMoves, selectedMarbles);
      if (moves.length !== 0) {
        console.log(moves);
        const nextBoardConfig = getNextBoardConfiguration(
          gameState,
          moves[0].split(' '),
          mapToColour(turn)
        );
        const newGameState = coordinatesToGameState(nextBoardConfig);
        setGameState(newGameState);
        setselectedMarbles(new Set());
      }
    }
  };

  const onMarbleHover = (row, col) => {};

  const getOpponentsNeighbors = (position, direction) => {};

  return (
    <Wrapper>
      <ConfigModal
        open={isConfigModalShown}
        onClose={() => {}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Paper>
          <ConfigTitle>Game Configuration</ConfigTitle>
          <ConfigBody>
            <FormLabel component="legend">Board Layout</FormLabel>
            <ConfigRow row>
              <RadioGroup row value={initBoardLayout} onChange={handleInitBoardLayoutChange}>
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.STANDARD}
                  control={<Radio />}
                  label="Standard"
                />
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.GERMAN_DAISY}
                  control={<Radio />}
                  label="German Daisy"
                />
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.BELGIAN_DAISY}
                  control={<Radio />}
                  label="Belgian Daisy"
                />
              </RadioGroup>
            </ConfigRow>
            <FormLabel component="legend">Game Mode</FormLabel>
            <ConfigRow>
              <RadioGroup row value={gameMode} onChange={handleGameModeChange}>
                <FormControlLabel value={GAME_MODE.VSHUMAN} control={<Radio />} label="vs. Human" />
                <FormControlLabel
                  value={GAME_MODE.VSCOMPUTER}
                  control={<Radio />}
                  label="vs. Computer"
                />
              </RadioGroup>
            </ConfigRow>
            <FormLabel component="legend">Extra Settings</FormLabel>
            <ConfigRow style={{ justifyContent: 'space-between' }}>
              <TextField
                label="Move Limit"
                variant="filled"
                size="small"
                defaultValue={moveLimit}
              />
              <TextField
                label="Time Limit (in seconds)"
                variant="filled"
                size="small"
                defaultValue={timeLimitInSeconds}
              />
            </ConfigRow>
            <ConfigRow>
              <Button onClick={onPlayClick} variant="contained" color="secondary" fullWidth>
                PLAY
              </Button>
            </ConfigRow>
            <FormLabel component="legend">State Generation</FormLabel>
            <ConfigRow>
              <InputFile />
            </ConfigRow>
          </ConfigBody>
        </Paper>
      </ConfigModal>
      <ButtonContainer />
      <BoardContainer>
        <Board>
          {Object.keys(gameState).map((k) => (
            <BoardRow key={k}>
              {Object.keys(gameState[k]).map((col) => (
                <BoardTile
                  key={`${k}${col}`}
                  for={gameState[k][col]}
                  selected={selectedMarbles.has(`${k}${col}`)}
                  onClick={() => onMarbleClick(k, col)}
                  onMouseEnter={() => onMarbleHover(k, col)}>
                  {`${k}${col}`}
                </BoardTile>
              ))}
            </BoardRow>
          ))}
        </Board>
      </BoardContainer>
      <Scoreboard>
        <tr>
          <ScoreDisplay>Score: {score}</ScoreDisplay>
        </tr>
        <tr>
          <th>Turn #</th>
          <th>Player</th>
          <th>Move</th>
          <th>Time</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Player 1</td>
          <td>C4-&gt;E4</td>
          <td>0:20</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Player 2</td>
          <td>C4-&gt;E4</td>
          <td>0:40</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Player 1</td>
          <td>C4-&gt;E4</td>
          <td>1:00</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Player 2</td>
          <td>C4-&gt;E4</td>
          <td>1:20</td>
        </tr>
      </Scoreboard>
    </Wrapper>
  );
};
