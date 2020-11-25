import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';

const MoveArrow = ({ direction, active, onClick }) => (
  <IconButton className={`arrow ${direction} ${!active && 'hidden'}`} onClick={onClick}>
    {direction.includes('E') ? <ArrowForwardIcon /> : <ArrowBackIcon />}
  </IconButton>
);

export const MoveArrows = ({ activeDirections, onArrowClick }) => {
  return Object.keys(activeDirections).map((direction) => (
    <MoveArrow
      key={direction}
      direction={direction}
      active={activeDirections[direction].active}
      onClick={() => {
        onArrowClick(direction);
      }}
    />
  ));
};
