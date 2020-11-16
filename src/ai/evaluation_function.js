export const spencer_heuristic = (state, colour) => {
  let positioningValue = 0;
  let numOpponentMarbles = 0;
  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      let thisMarble = state[row][column];
      if (thisMarble === colour) {
        let coord = `${row}${column}`;
        positioningValue += centerPositionEvaluation(coord);
      } else if (thisMarble !== 0) {
        numOpponentMarbles++;
      }
    });
  });
  let opponentMarbleValue = aggressiveMoveEvaluation(numOpponentMarbles);
  return opponentMarbleValue + positioningValue;
};

const MAX_MARBLES = 14;

const aggressiveMoveEvaluation = (num) => {
  return MAX_MARBLES / num;
};

const centerPositionEvaluation = (position) => {
  // These are all the positions on the edge of the board.
  let bad_positions = [
    'i5',
    'i6',
    'i7',
    'i8',
    'i9',
    'h4',
    'h9',
    'g3',
    'g9',
    'f2',
    'f9',
    'e1',
    'e9',
    'd1',
    'd8',
    'c1',
    'c7',
    'b1',
    'b7',
    'a1',
    'a2',
    'a3',
    'a4',
    'a5'
  ];
  if (bad_positions.includes(position)) {
    return -1;
  } else {
    return 1;
  }
};
