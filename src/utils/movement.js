import { BLK, BOARD_LAYOUTS, DIRECTION, EMP, WHT } from '../constants';

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

// Return an array, with white then black player score.
export const getPlayerScores = (state) => {
  let numWhite = 0;
  let numBlack = 0;
  let whiteScore;
  let blackScore;
  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      if(state[row][column] === WHT) {
        numWhite++;
      } else if (state[row][column] === BLK) {
        numBlack++;
      }
    });
  });
  whiteScore = (14 - numBlack);
  blackScore = (14 - numWhite);
  return [whiteScore, blackScore];
}

export const getLegalMoveInfo = (legalMoves, coordinates) => {
  const coordArr = Array.from(coordinates);
  coordArr.sort();
  const legalDirections = [];

  for (let i = 0; i < legalMoves.length; i++) {
    const moveInfo = legalMoves[i].split(' ');
    const coordinate = moveInfo[1];
    const coordinatesString = coordArr.join('').toUpperCase();
    if (coordinatesString === coordinate) {
      legalDirections.push(legalMoves[i]);
    }
  }
  return legalDirections;
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
