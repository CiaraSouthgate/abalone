import { keys } from '@material-ui/core/styles/createBreakpoints';
import { BLK, DIRECTION, WHT } from '../constants';

export const jihyoHeuristic = (state, colour) => {
  return (
    numberOfMarblesEvaluation(state, colour) + formationBreakAndCoherenceEvaluation(state, colour)
  );
};

// The function returns difference in
// the number of marbles between mine and the opponent's.
export const numberOfMarblesEvaluation = (state, colour) => {
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
export const formationBreakAndCoherenceEvaluation = (state, colour) => {
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
