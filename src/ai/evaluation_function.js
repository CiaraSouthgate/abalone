// The number of marbles

import { keys } from '@material-ui/core/styles/createBreakpoints';
import { BLK, DIRECTION, WHT } from '../constants';

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

export { numberOfMarblesEvaluation, formationBreakAndCoherenceEvaluation };
