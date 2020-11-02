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

const Scoreboard = styled.div`
  position: absolute;
  right: 20px;

  table, th, td {
    border-collapse: collapse;
  }
  th, td {
    border-bottom: 1px solid black;
    padding: 5px;
    text-align: left;
  }
`;

const ScoreDisplay = styled.th`
  colspan: 0;
`

const Game = () => {
  const [initBoardLayout, setInitBoardLayout] = React.useState(BOARD_LAYOUT_NAMES.GERMAN_DAISY);
  const [gameState, setGameState] = React.useState(BOARD_LAYOUTS.STANDARD);
  const [playerColor] = React.useState(MARVEL_COLORS.BLACK);
  const [gameMode, setGameMode] = React.useState(GAME_MODE.VSCOMPUTER);
  const [moveLimit] = React.useState(DEFAULT_MOVE_LIMIT);
  const [timeLimitInMinutes] = React.useState(DEFAULT_TIME_LIMIT_IN_MINUTES);
  const [isConfigModalShown, setIsConfigModalShown] = React.useState(true);
  const score = 0; // ???

  const handleInitBoardLayoutChange = (e) => {
    setInitBoardLayout(parseInt(e.target.value));
  };

  const handleGameModeChange = (e) => {
    setGameMode(parseInt(e.target.value));
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

export default Game;
