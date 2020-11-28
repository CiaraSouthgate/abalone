import React from 'react';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import UndoIcon from '@material-ui/icons/Undo';
import { ButtonGroup, IconButton } from '@material-ui/core';

export const ButtonContainer = ({ onUndoClicked, onStopClicked, onRestartClicked }) => {
  return (
    <ButtonGroup>
      <IconButton>
        <StopIcon onClick={onStopClicked}/>
      </IconButton>
      <IconButton>
        <AutorenewIcon onClick={onRestartClicked}/>
      </IconButton>
      <IconButton>
        <PauseIcon />
      </IconButton>
      <IconButton onClick={onUndoClicked}>
        <UndoIcon />
      </IconButton>
    </ButtonGroup>
  );
};
