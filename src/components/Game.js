import React from 'react';
import styled from 'styled-components';
import {
  MAX,
  EMP,
  BOARD_LAYOUTS,
  MARVEL_COLORS,
  GAME_MODE,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_MINUTES,
  BOARD_LAYOUT_NAMES
} from '../constants';

import { Modal, FormControlLabel, Checkbox, FormLabel, TextField, Button } from '@material-ui/core';

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;
const MARGIN_SIZE = 1;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const BoardTile = styled.div`
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;
  border-radius: 50%;
  border: 2px solid black;
  margin: 0px ${MARGIN_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  background-color: ${(props) => {
    if (props.for === EMP) {
      return 'brown';
    } else if (props.for === MAX) {
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

const Game = () => {
  const [initBoardLayout, setInitBoardLayout] = React.useState(BOARD_LAYOUT_NAMES.STANDARD);
  const [gameState, setGameState] = React.useState(BOARD_LAYOUTS.STANDARD);
  const [playerColor] = React.useState(MARVEL_COLORS.BLACK);
  const [gameMode, setGameMode] = React.useState(GAME_MODE.VSCOMPUTER);
  const [moveLimit] = React.useState(DEFAULT_MOVE_LIMIT);
  const [timeLimitInMinutes] = React.useState(DEFAULT_TIME_LIMIT_IN_MINUTES);
  const [isConfigModalShown, setIsConfigModalShown] = React.useState(true);

  const handleInitBoardLayoutChange = (boardLayout) => {
    setInitBoardLayout(boardLayout);
  };

  const handleGameModeChange = (_gameMode) => {
    setGameMode(_gameMode);
  };

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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={initBoardLayout === BOARD_LAYOUT_NAMES.STANDARD}
                    onChange={(e) => {
                      handleInitBoardLayoutChange(BOARD_LAYOUT_NAMES.STANDARD);
                    }}
                  />
                }
                label="Standard"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={initBoardLayout === BOARD_LAYOUT_NAMES.GERMAN_DAISY}
                    onChange={() => {
                      handleInitBoardLayoutChange(BOARD_LAYOUT_NAMES.GERMAN_DAISY);
                    }}
                  />
                }
                label="German Daisy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={initBoardLayout === BOARD_LAYOUT_NAMES.BELGIAN_DAISY}
                    onChange={() => {
                      handleInitBoardLayoutChange(BOARD_LAYOUT_NAMES.BELGIAN_DAISY);
                    }}
                  />
                }
                label="Belgian Daisy"
              />
            </ConfigRow>
            <FormLabel component="legend">Game Mode</FormLabel>
            <ConfigRow>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gameMode === GAME_MODE.VSHUMAN}
                    onChange={(e) => {
                      handleGameModeChange(GAME_MODE.VSHUMAN);
                    }}
                  />
                }
                label="Vs. Human"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gameMode === GAME_MODE.VSCOMPUTER}
                    onChange={() => {
                      handleGameModeChange(GAME_MODE.VSCOMPUTER);
                    }}
                  />
                }
                label="Vs. Computer"
              />
            </ConfigRow>
            <FormLabel component="legend">Extra Settings</FormLabel>
            <ConfigRow style={{ justifyContent: 'space-between' }}>
              <TextField label="Move Limit" variant="filled" size="small" defaultValue={50} />
              <TextField
                label="Time Limit (in minutes)"
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
      <Board>
        {Object.keys(gameState).map((k) => (
          <BoardRow key={k}>
            {Object.keys(gameState[k]).map((k2) => (
              <BoardTile key={`${k}${k2}`} for={gameState[k][k2]} />
            ))}
          </BoardRow>
        ))}
      </Board>
    </Wrapper>
  );
};

export default Game;
