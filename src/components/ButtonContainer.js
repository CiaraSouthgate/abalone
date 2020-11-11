import React from 'react';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import UndoIcon from '@material-ui/icons/Undo';
import { ButtonGroup, IconButton } from '@material-ui/core';

export const ButtonContainer = () => {
  return (
    <ButtonGroup>
      <IconButton>
        <PlayArrowIcon />
      </IconButton>
      <IconButton>
        <StopIcon />
      </IconButton>
      <IconButton>
        <AutorenewIcon />
      </IconButton>
      <IconButton>
        <PauseIcon />
      </IconButton>
      <IconButton>
        <UndoIcon />
      </IconButton>
    </ButtonGroup>
  );
};
