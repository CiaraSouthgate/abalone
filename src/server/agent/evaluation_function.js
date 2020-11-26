const constants = require('./constants');

const DIRECTION = constants.DIRECTION;
const WHT = constants.WHT;
const BLK = constants.BLK;

const MAX_DISTANCE = 4;
const MAX_FRIENDLY = 6;
const MAX_MARBLES = 14;

const jihyoHeuristic = (state, colour) => {
  return (
    numberOfMarblesEvaluation(state, colour) + formationBreakAndCoherenceEvaluation(state, colour)
  );
};

// The function returns difference in
// the number of marbles between mine and the opponent's.
const numberOfMarblesEvaluation = (state, colour) => {
  const opponentColour = colour === WHT ? BLK : WHT;
  let nMarbles = 0;
  let nOpponentMarbles = 0;

  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      if (state[row][column] === colour) {
        nMarbles++;
      } else if (state[row][column] === opponentColour) {
        nOpponentMarbles++;
      }
    });
  });
  return nMarbles - nOpponentMarbles;
};

// Formation break
const formationBreakAndCoherenceEvaluation = (state, colour) => {
  let breakScore = 0;
  let coherenceScore = 0;
  const opponentColour = colour === WHT ? BLK : WHT;
  Object.keys(state).forEach((row) => {
    Object.keys(state[row]).forEach((column) => {
      if (state[row][column] === colour) {
        for (const direction of Object.keys(DIRECTION)) {
          const nextPosition = getNextPosition(row, column, direction);
          let nextRow = nextPosition[0];
          let nextColumn = nextPosition[1];

          if (state[nextRow][nextColumn] === opponentColour) {
            // Formation Break
            breakScore++;
          } else if (state[nextRow][nextColumn] === colour) {
            // Coherence
            coherenceScore++;
            const nextNextPosition = getNextPosition(nextRow, nextColumn, direction);
            if (state[nextNextPosition[0][nextNextPosition[1]]] === colour) {
              coherenceScore++;
            }
          }
        }
      }
    });
  });
  coherenceScore /= 14;
  return breakScore + Math.floor(coherenceScore);
};

const spencer_heuristic = (state, colour) => {
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

const getNextPosition = (row, column, direction) => {
  let nextRow = row;
  let nextColumn = column;
  switch (direction) {
    case DIRECTION.E:
      nextColumn = column + 1;
      break;
    case DIRECTION.W:
      nextColumn = column - 1;
      break;
    case DIRECTION.NE:
      nextRow = String.fromCharCode(row.charCodeAt(0) + 1);
      nextColumn = column + 1;
      break;
    case DIRECTION.NW:
      nextRow = String.fromCharCode(row.charCodeAt(0) + 1);
      break;
    case DIRECTION.SE:
      nextRow = String.fromCharCode(row.charCodeAt(0) - 1);
      break;
    case DIRECTION.SW:
      nextRow = String.fromCharCode(row.charCodeAt(0) - 1);
      nextColumn = column - 1;
      break;
  }
  return [nextRow, nextColumn];
};

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

/**
 * Rewards proximity to centre, number of friendly neighbours surrounding each marble,
 * and number of captured enemy marbles; penalizes captured own marbles.
 */
const ciaraHeuristic = (state, playerSide, log) => {
  const opponent = playerSide === WHT ? BLK : WHT;

  let distanceScore = 0;
  let oppDistanceScore = 0;
  let neighbourScore = 0;
  let numOpponent = 0;
  let numFriendly = 0;

  Object.entries(state).forEach(([rowIdx, row]) => {
    Object.entries(row).forEach(([colIdx, cell]) => {
      if (cell === playerSide) {
        numFriendly++;
        distanceScore += 1 - distanceFromCenter[rowIdx][colIdx] / MAX_DISTANCE;
      } else if (cell === opponent) {
        numOpponent++;
        oppDistanceScore += distanceFromCenter[rowIdx][colIdx] / MAX_DISTANCE;
      }
    });
  });

  distanceScore /= numFriendly;
  oppDistanceScore /= numOpponent;
  neighbourScore /= numFriendly;

  const total =
    distanceScore +
    oppDistanceScore +
    neighbourScore +
    (MAX_MARBLES - numOpponent) -
    (MAX_MARBLES - numFriendly);

  if (log) {
    if (log === 'ALL') {
      console.log(
        'distanceScore:',
        distanceScore,
        '\noppDistanceScore:',
        oppDistanceScore,
        '\nneighbourScore',
        neighbourScore,
        '\nnumOpponent',
        numOpponent,
        '\nnumFriendly',
        numFriendly
      );
    }
    console.log('SCORE:', total);
  }

  return total;
};

module.exports = {
  jihyoHeuristic: jihyoHeuristic,
  spencer_heuristic: spencer_heuristic,
  ciaraHeuristic: ciaraHeuristic
};
