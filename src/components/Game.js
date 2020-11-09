/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import {
  BLK,
  WHT,
  EMP,
  BOARD_LAYOUTS,
  MARVEL_COLORS,
  GAME_MODE,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_MINUTES,
  BOARD_LAYOUT_NAMES,
  DIRECTIONS
} from '../constants';

import {
  Modal,
  FormControlLabel,
  Checkbox,
  FormLabel,
  TextField,
  Button,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { ButtonContainer } from './ButtonContainer';

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
  const [turn, setTurn] = React.useState(BLK);
  const [playerColor] = React.useState(MARVEL_COLORS.BLACK);
  const [gameMode, setGameMode] = React.useState(GAME_MODE.VSCOMPUTER);
  const [moveLimit] = React.useState(DEFAULT_MOVE_LIMIT);
  const [timeLimitInWHTutes] = React.useState(DEFAULT_TIME_LIMIT_IN_MINUTES);
  const [isConfigModalShown, setIsConfigModalShown] = React.useState(true);
  const [selectedMarvels, setSelectedMarvels] = React.useState(new Set());
  const score = 0; // ???

  const handleInitBoardLayoutChange = (e) => {
    setInitBoardLayout(parseInt(e.target.value));
  };

  const handleGameModeChange = (e) => {
    setGameMode(parseInt(e.target.value));
  };

  React.useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  const onPlayClick = () => {
    setIsConfigModalShown(false);
    if (initBoardLayout === BOARD_LAYOUT_NAMES.STANDARD) {
      setGameState(BOARD_LAYOUTS.STANDARD);
    } else if (initBoardLayout === BOARD_LAYOUT_NAMES.BELGIAN_DAISY) {
      setGameState(BOARD_LAYOUTS.BELGIAN_DAISY);
    } else {
      setGameState(BOARD_LAYOUTS.GERMAN_DAISY);
    }
  };

  const getPosition = (position, direction) => {
    const k1 = position[0];
    const k2 = parseInt(position[1]);

    let newk1 = k1;
    let newk2 = k2;
    const ascii = k1.charCodeAt(0);
    let newascii = ascii;

    switch (direction) {
      case DIRECTIONS.EAST:
        newk2 = k2 + 1;
        break;
      case DIRECTIONS.WEST:
        newk2 = k2 - 1;
        break;
      case DIRECTIONS.NORTH_EAST:
        newascii = ascii + 1;
        newk2 = k2 + 1;
        break;
      case DIRECTIONS.NORTH_WEST:
        newascii = ascii + 1;
        break;
      case DIRECTIONS.SOUTH_EAST:
        newascii = ascii - 1;
        break;
      case DIRECTIONS.SOUTH_WEST:
        newascii = ascii - 1;
        newk2 = k2 - 1;
        break;
    }
    newk1 = String.fromCharCode(newascii);
    if (newascii > 96 && newascii < 107 && gameState[newk1][newk2] !== undefined) {
      return `${newk1}${newk2}`;
    } else {
      return null;
    }
  };

  const getDirection = (position1, position2) => {
    const pos1K1 = position1[0];
    const pos1K2 = parseInt(position1[1]);
    const pos2K1 = position2[0];
    const pos2K2 = parseInt(position2[1]);

    const k1Diff = pos1K1.charCodeAt(0) - pos2K1.charCodeAt(0);
    const k2Diff = pos1K2 - pos2K2;

    console.log(k1Diff, k2Diff);
    if (k1Diff === -1 && k2Diff === 0) {
      return DIRECTIONS.NORTH_WEST;
    } else if (k1Diff === -1 && k2Diff === -1) {
      return DIRECTIONS.NORTH_EAST;
    } else if (k1Diff === 0 && k2Diff === -1) {
      return DIRECTIONS.EAST;
    } else if (k1Diff === 0 && k2Diff === 1) {
      return DIRECTIONS.WEST;
    } else if (k1Diff === 1 && k2Diff === 1) {
      return DIRECTIONS.SOUTH_WEST;
    } else if (k1Diff === 1 && k2Diff === 0) {
      return DIRECTIONS.SOUTH_EAST;
    }
  };

  const moveMarvels = (positions, direction) => {
    const adder = gameState[positions[0][0]][parseInt(positions[0][1])];
    const newGameState = JSON.parse(JSON.stringify(gameState));

    for (const position of positions) {
      const k1 = position[0];
      const k2 = parseInt(position[1]);
      const newPosition = getPosition(position, direction);
      if (newPosition) {
        const newK1 = newPosition[0];
        const newK2 = parseInt(newPosition[1]);

        if (!selectedMarvels.has(`${newK1}${newK2}`) && gameState[newK1][newK2] === adder) {
          console.log('not valid move');
          return;
        }

        newGameState[newK1][newK2] += adder;
        newGameState[k1][k2] -= adder;
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

  const getMarvelPositionBetween = (position1, position2) => {
    const pos1K1 = position1[0].charCodeAt(0);
    const pos1K2 = parseInt(position1[1]);
    const pos2K1 = position2[0].charCodeAt(0);
    const pos2K2 = parseInt(position2[1]);

    if (Math.abs(pos1K1 - pos2K1) === 2) {
      if (pos1K2 > pos2K2 && pos1K2 - pos2K2 === 2) {
        return `${String.fromCharCode(pos1K1 - 1)}${pos1K2 - 1}`;
      } else if (pos1K2 < pos2K2 && pos2K2 - pos1K2 === 2) {
        return `${String.fromCharCode(pos2K1 - 1)}${pos2K2 - 1}`;
      } else if (pos1K2 === pos2K2 && pos1K1 > pos2K1) {
        return `${String.fromCharCode(pos1K1 - 1)}${pos1K2}`;
      } else if (pos1K2 === pos2K2 && pos2K1 > pos1K1) {
        return `${String.fromCharCode(pos2K1 - 1)}${pos1K2}`;
      }
    } else if (pos1K1 === pos2K1) {
      if (pos1K2 > pos2K2 && pos1K2 - pos2K2 === 2) {
        return `${position1[0]}${pos1K2 - 1}`;
      } else if (pos1K2 < pos2K2 && pos2K2 - pos1K2 === 2) {
        return `${position1[0]}${pos2K2 - 1}`;
      }
    }
    return null;
  };

  const onMarvelClick = (k1, k2) => {
    if (gameState[k1][k2] !== EMP) {
      // Push opponent marvel logic
      if (gameState[k1][k2] !== turn) {
        // Calculate the number of selected marvel
        console.log(Array.from(selectedMarvels).length);
        return;
      }
      if (selectedMarvels.size > 1) {
        setSelectedMarvels(new Set());
        return;
      }
      if (selectedMarvels.has(`${k1}${k2}`)) {
        setSelectedMarvels(new Set());
        return;
      }
      const newSelectedMarvels = new Set(selectedMarvels);
      if (selectedMarvels.size === 1) {
        const selectedMarvel = Array.from(selectedMarvels)[0];
        const posBetween = getMarvelPositionBetween(selectedMarvel, `${k1}${k2}`);
        if (posBetween !== null && isFriendly(selectedMarvel, posBetween)) {
          newSelectedMarvels.add(posBetween);
        } else if (!isNeighbor(Array.from(selectedMarvels)[0], `${k1}${k2}`)) {
          setSelectedMarvels(new Set([`${k1}${k2}`]));
          return;
        }
      }
      newSelectedMarvels.add(`${k1}${k2}`);
      setSelectedMarvels(newSelectedMarvels);
    } else {
      if (selectedMarvels.size === 0) {
        return;
      }
      let dir = undefined;
      selectedMarvels.forEach((val) => {
        let temp = getDirection(val, `${k1}${k2}`);
        if (temp !== undefined) {
          dir = temp;
        }
      });
      if (dir !== undefined) {
        moveMarvels(Array.from(selectedMarvels), dir);
      }
      setSelectedMarvels(new Set());
      setTurn(turn === BLK ? WHT : BLK);
    }
  };

  const onMarvelHover = (k1, k2) => {
    console.log(k1, k2);
  };

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
              <TextField label="Move Limit" variant="filled" size="small" defaultValue={50} />
              <TextField
                label="Time Limit (in WHTutes)"
                variant="filled"
                size="small"
                defaultValue={15}
              />
            </ConfigRow>
            <ConfigRow>
              <Button onClick={onPlayClick} variant="contained" color="secondary" fullWidth>
                PLAY
              </Button>
            </ConfigRow>
          </ConfigBody>
        </Paper>
      </ConfigModal>
      <ButtonContainer />
      <BoardContainer>
        <Board>
          {Object.keys(gameState).map((k) => (
            <BoardRow key={k}>
              {Object.keys(gameState[k]).map((k2) => (
                <BoardTile
                  key={`${k}${k2}`}
                  for={gameState[k][k2]}
                  selected={selectedMarvels.has(`${k}${k2}`)}
                  onClick={() => onMarvelClick(k, k2)}
                  onMouseEnter={() => onMarvelHover(k, k2)}>
                  {`${k}${k2}`}
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
