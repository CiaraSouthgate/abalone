import { BLK, WHT } from '../constants';

const distanceFromCenter = {
  a: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
  b: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
  c: { 1: 4, 2: 3, 3: 2, 4: 2, 5: 2, 6: 3, 7: 4 },
  d: { 1: 4, 2: 3, 3: 2, 4: 1, 5: 1, 6: 2, 7: 3, 8: 4 },
  e: { 1: 4, 2: 3, 3: 2, 4: 1, 5: 0, 6: 1, 7: 2, 8: 3, 9: 4 },
  f: { 2: 4, 3: 3, 4: 2, 5: 1, 6: 1, 7: 2, 8: 3, 9: 4 },
  g: { 3: 4, 4: 3, 5: 2, 6: 2, 7: 2, 8: 3, 9: 4 },
  h: { 4: 4, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 },
  i: { 5: 4, 6: 4, 7: 4, 8: 4, 9: 4 }
};

const MAX_DISTANCE = 4;
const MAX_FRIENDLY = 6;
const MAX_MARBLES = 14;

const getFriendlyNeighbours = (state, marble) => {
  const spacesAround = [
    { row: String.fromCharCode(marble.row - 1), col: marble.col - 1 },
    { row: String.fromCharCode(marble.row - 1), col: marble.col },
    { row: String.fromCharCode(marble.row), col: marble.col - 1 },
    { row: String.fromCharCode(marble.row), col: marble.col + 1 },
    { row: String.fromCharCode(marble.row + 1), col: marble.col },
    { row: String.fromCharCode(marble.row + 1), col: marble.col + 1 }
  ];

  let numFriendly = 0;

  spacesAround.forEach((space) => {
    try {
      const neighbour = state[space.row][space.col];
      if (neighbour === state[marble.row][marble.col]) numFriendly++;
    } catch (ignored) {}
  });

  return numFriendly;
};

/**
 * Rewards proximity to centre, number of friendly neighbours surrounding each marble,
 * and number of captured enemy marbles; penalizes captured own marbles.
 */
export const ciaraHeuristic = (state, player) => {
  const colour = player === 'w' ? WHT : BLK;
  const opponent = player === 'w' ? BLK : WHT;

  let distanceScore = 0;
  let neighbourScore = 0;
  let numOpponent = 0;
  let numFriendly = 0;

  Object.entries(state).forEach(([rowIdx, row]) => {
    Object.entries(row).forEach(([colIdx, cell]) => {
      if (cell === colour) {
        numFriendly++;
        distanceScore += 1 - distanceFromCenter[rowIdx][colIdx] / MAX_DISTANCE;
        const marble = { row: rowIdx, col: colIdx };
        neighbourScore += getFriendlyNeighbours(state, marble, colour) / MAX_FRIENDLY;
      } else if (cell === opponent) {
        numOpponent++;
      }
    });
  });

  return distanceScore + neighbourScore + (MAX_MARBLES - numOpponent) - (MAX_MARBLES - numFriendly);
};
