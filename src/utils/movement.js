import { BLK, DIRECTION, EMP, WHT } from '../constants';

export const convertGameStateToCordinateArray = (state) => {
  const coordinates = [];
  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      if (state[row][column] !== EMP) {
        coordinates.push(`${row}${column}${mapToColour(state[row][column])}`);
      }
    });
  });
  return coordinates;
};

export const getPlayerScores = (state) => {
  let numWhite = 0;
  let numBlack = 0;
  let whiteScore;
  let blackScore;
  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      if (state[row][column] === WHT) {
        numWhite++;
      } else if (state[row][column] === BLK) {
        numBlack++;
      }
    });
  });
  whiteScore = 14 - numBlack;
  blackScore = 14 - numWhite;
  return { WHT: whiteScore, BLK: blackScore };
};

export const getLegalMoveInfo = (legalMoves, marbles) => {
  const marbleString = Array.from(marbles).sort().join('').toUpperCase();
  return legalMoves.filter((move) => move.split(' ')[1] === marbleString);
};

export const coordinatesToGameState = (coordinates) => {
  const gameState = {
    i: { 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    h: { 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    g: { 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP },
    b: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP },
    a: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP }
  };
  coordinates.forEach((coord) => {
    const row = coord[0];
    const col = coord[1];
    const colour = coord[2];
    gameState[row.toLowerCase()][col] = colour === 'w' ? WHT : BLK;
  });
  return gameState;
};

export const mapToColour = (colour) => {
  switch (colour) {
    case BLK:
      return 'b';
    case WHT:
      return 'w';
    default:
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

export const getPositionInDirection = (position, direction) => {
  const row = position.charCodeAt(0);
  const col = parseInt(position[1]);

  let afterRow = row;
  let afterCol = col;

  switch (direction) {
    case DIRECTION.NW:
      afterRow++;
      break;
    case DIRECTION.NE:
      afterCol++;
      afterRow++;
      break;
    case DIRECTION.E:
      afterCol++;
      break;
    case DIRECTION.SE:
      afterRow--;
      break;
    case DIRECTION.SW:
      afterRow--;
      afterCol--;
      break;
    case DIRECTION.W:
      afterCol--;
  }

  return `${String.fromCharCode(afterRow)}${afterCol}`;
};

export const isNeighbor = (position1, position2) => {
  return getDirection(position1, position2) !== undefined;
};

export const getMarblePositionBetween = (position1, position2) => {
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
