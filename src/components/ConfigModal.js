import React, { useState } from 'react';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core';
import {
  BLK,
  BOARD_LAYOUT_NAMES,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_SECONDS,
  WHT
} from '../constants';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const ConfigRow = styled.div`
  display: flex;
  margin: 10px 0;
`;

export const ConfigModal = ({ isOpen, onSubmit }) => {
  const [layout, setLayout] = useState(BOARD_LAYOUT_NAMES.STANDARD);
  const [aiColour, setAIColour] = useState(BLK);
  const [moveLimit, setMoveLimit] = useState(DEFAULT_MOVE_LIMIT);
  const [humanTime, setHumanTime] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [aiTime, setAITime] = useState(DEFAULT_TIME_LIMIT_IN_SECONDS);

  const onLayoutChanged = (e) => {
    setLayout(e.target.value);
  };

  const onAIColourChanged = (e) => {
    setAIColour(e.target.value);
  };

  const onMoveLimitChanged = (e) => {
    setMoveLimit(parseInt(e.target.value));
  };

  const onHumanTimeChanged = (e) => {
    setHumanTime(parseInt(e.target.value));
  };

  const onAITimeChanged = (e) => {
    setAITime(parseInt(e.target.value));
  };

  const onPlayClicked = () => {
    onSubmit(layout, aiColour, moveLimit, humanTime, aiTime);
  };

  return (
    <Modal className="configModal" open={isOpen} onClose={() => {}}>
      <Paper className="configPaper">
        <h2>Game Configuration</h2>
        <FormLabel component="legend">Board Layout</FormLabel>
        <ConfigRow row>
          <RadioGroup row value={layout} onChange={onLayoutChanged}>
            {Object.values(BOARD_LAYOUT_NAMES).map((layout) => {
              return (
                <FormControlLabel control={<Radio />} key={layout} label={layout} value={layout} />
              );
            })}
          </RadioGroup>
        </ConfigRow>
        <FormLabel component="legend">AI Marble Colour</FormLabel>
        <ConfigRow>
          <RadioGroup row value={aiColour} onChange={onAIColourChanged}>
            <FormControlLabel value={BLK} control={<Radio />} label="Black" />
            <FormControlLabel value={WHT} control={<Radio />} label="White" />
          </RadioGroup>
        </ConfigRow>
        <FormLabel component="legend">Movement Settings</FormLabel>
        <ConfigRow style={{ justifyContent: 'space-between' }}>
          <TextField
            label="Move Limit"
            type="number"
            variant="filled"
            size="small"
            defaultValue={moveLimit}
            onChange={onMoveLimitChanged}
          />
        </ConfigRow>
        <FormLabel component="legend">Timing (In Seconds)</FormLabel>
        <ConfigRow>
          <TextField
            label="Time Limit (Human)"
            type="number"
            variant="filled"
            size="small"
            defaultValue={humanTime}
            onChange={onHumanTimeChanged}
          />
          <TextField
            label="Time Limit (AI)"
            type="number"
            variant="filled"
            size="small"
            defaultValue={aiTime}
            onChange={onAITimeChanged}
          />
        </ConfigRow>
        <ConfigRow>
          <Button onClick={onPlayClicked} variant="contained" color="secondary" fullWidth>
            PLAY
          </Button>
        </ConfigRow>
      </Paper>
    </Modal>
  );
};
