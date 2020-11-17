const constants = require('./constants');
const utils = require('./boardUtils');

const Marble = utils.Marble;
const DIRECTION = constants.DIRECTION;
const EMP = constants.EMP;
const WHT = constants.WHT;
const BLK = constants.BLK;

let state;
const marble1directions = [DIRECTION.W, DIRECTION.SE, DIRECTION.SW];

const generateMoves = (gameState, aiColour) => {
  state = gameState;
  return getMarbleMoves(aiColour);
};

/**
 * Gets all valid moves for the specified side given the current board state
 * @param side the side to return moves for
 * @returns a list of all valid moves moves
 */
const getMarbleMoves = (side) => {
  let moves = [];
  Object.entries(state).forEach(([rowIdx, row]) => {
    Object.entries(row).forEach(([colIdx, cell]) => {
      if (cell === side) {
        const marble = new Marble(rowIdx, parseInt(colIdx), side);
        const neighbours = utils.getNeighbours(marble, state);
        neighbours.forEach((neighbour) => {
          if (neighbour.side === side) {
            if (marble.compareTo(neighbour) <= 0) {
              // this is a valid pair
              const pair = [marble, neighbour];
              const direction = getDirection(marble, neighbour);
              // get moves for this pair
              const pairMoves = getGroupMoves(pair, direction);
              if (!!pairMoves) moves = moves.concat(pairMoves);
              // find trios from pair
              const nextInLine = getNeighbourWithDirection(neighbour, direction);
              if (nextInLine.side !== undefined && nextInLine.side === side) {
                const trio = [...pair, nextInLine];
                //get moves for this trio
                const trioMoves = getGroupMoves(trio, direction);
                if (!!trioMoves) moves = moves.concat(trioMoves);
              }
            }
          } else if (neighbour.side === EMP) {
            // space is empty; this is a valid move
            const direction = getDirection(marble, neighbour);
            moves.push(`SINGLE ${getMarblesString([marble])} ${direction}`);
          }
        });
      }
    });
  });
  return moves;
};

/**
 * Gets all valid moves for a group of marbles
 * @param marbles the marble group
 * @param direction the direction the group is facing
 * @returns all valid moves
 */
const getGroupMoves = (marbles, direction) => {
  let moves = [];
  const multiMoveGroups = setMultiMoveGroups(direction);
  const inline = multiMoveGroups[0];
  const sidestep = multiMoveGroups[1];
  const inlineMoves = getInlineMoves(marbles, inline);
  if (!!inlineMoves) {
    moves = moves.concat(inlineMoves);
  }
  const sideStepMoves = getSidestepMoves(marbles, sidestep);
  if (!!sideStepMoves) {
    moves = moves.concat(sideStepMoves);
  }
  return moves.length > 0 ? moves : null;
};

/**
 * Checks whether a move produces a valid sumito
 * @param startMarble the first marble of the opposing group
 * @param direction the direction of the movement
 * @param groupSize the number of marbles doing the push
 * @returns whether the sumito is valid
 */
const checkSumito = (startMarble, direction, groupSize) => {
  let count = 1;
  let nextMarble = getNeighbourWithDirection(startMarble, direction);
  while (nextMarble.side === startMarble.side) {
    if (++count === groupSize) return false; // can't be pushed if same number
    nextMarble = getNeighbourWithDirection(nextMarble, direction);
  }
  //if next space is empty or undefined (off the board), it's a valid sumito
  return nextMarble.side === EMP || nextMarble.side === undefined;
};

/**
 * Gets all valid inline moves for a group of marbles
 * @param marbles the group of marbles
 * @param directions the inline directions for that group
 * @returns a list of moves (null if none)
 */
const getInlineMoves = (marbles, directions) => {
  const moves = [];
  directions.forEach((direction) => {
    const leadMarble =
      marble1directions.indexOf(direction) >= 0 ? marbles[0] : marbles[marbles.length - 1];
    const neighbour = getNeighbourWithDirection(leadMarble, direction);
    if (
      !(neighbour.side === undefined || neighbour.side === leadMarble.side) && //off the edge of the board or into own marbles
      (neighbour.side === EMP || //into empty space
        (neighbour.side !== EMP && checkSumito(neighbour, direction, marbles.length))) //sumito
    ) {
      moves.push(`INLINE ${getMarblesString(marbles)} ${direction}`);
    }
  });
  return moves.length > 0 ? moves : null;
};

/**
 * Gets all valid sidestep moves for a group of marbles
 * @param marbles the group of marbles
 * @param directions the sidestep directions for that group
 * @returns a list of moves (null if none)
 */
const getSidestepMoves = (marbles, directions) => {
  const moves = [];
  directions.forEach((direction) => {
    const numClear = marbles.filter((marble) => {
      return getNeighbourWithDirection(marble, direction).side === EMP;
    }).length;
    if (numClear === marbles.length) {
      moves.push(`SIDESTEP ${getMarblesString(marbles)} ${direction}`);
    }
  });
  return moves.length > 0 ? moves : null;
};

/**
 * Returns which directions are inline and which are sidestep given the
 * direction of a group of marbles
 * @param direction the direction of the marble group
 * @returns a list of inline and a list of sidestep directions
 */
const setMultiMoveGroups = (direction) => {
  let inline;
  let sidestep;

  switch (direction) {
    case DIRECTION.NW:
    case DIRECTION.SE:
      inline = [DIRECTION.NW, DIRECTION.SE];
      sidestep = [DIRECTION.E, DIRECTION.W, DIRECTION.NE, DIRECTION.SW];
      break;
    case DIRECTION.E:
    case DIRECTION.W:
      inline = [DIRECTION.E, DIRECTION.W];
      sidestep = [DIRECTION.NW, DIRECTION.SE, DIRECTION.NE, DIRECTION.SW];
      break;
    case DIRECTION.NE:
    case DIRECTION.SW:
      inline = [DIRECTION.SW, DIRECTION.NE];
      sidestep = [DIRECTION.E, DIRECTION.W, DIRECTION.NW, DIRECTION.SE];
      break;
  }

  return [inline, sidestep];
};

/**
 * Creates a string in the format "A1A1A1" for a group of marbles
 * @param marbles group of marbles
 * @returns formatted string
 */
const getMarblesString = (marbles) => {
  return marbles.reduce((str, marble) => {
    return str + marble.row.toUpperCase() + marble.col;
  }, '');
};

const getMarblesListFromString = (marbleString, state) => {
  const marbles = [];
  for (let i = 0; i < marbleString.length / 2; i++) {
    const row = marbleString[i * 2].toLowerCase();
    const col = parseInt(marbleString[i * 2 + 1]);
    const side = state[row][col];
    marbles.push(new Marble(row, col, side));
  }
  return marbles;
};

/**
 * Returns the direction of two neighbouring positions
 * @param pos1
 * @param pos2
 * @returns the direction
 */
const getDirection = (pos1, pos2) => {
  const rowDiff = pos1.row.charCodeAt(0) - pos2.row.charCodeAt(0);
  const colDiff = pos1.col - pos2.col;

  if (rowDiff === -1 && colDiff === 0) return DIRECTION.NW;
  if (rowDiff === -1 && colDiff === -1) return DIRECTION.NE;
  if (rowDiff === 0 && colDiff === -1) return DIRECTION.E;
  if (rowDiff === 0 && colDiff === 1) return DIRECTION.W;
  if (rowDiff === 1 && colDiff === 1) return DIRECTION.SW;
  if (rowDiff === 1 && colDiff === 0) return DIRECTION.SE;
};

/**
 * Gets the neighbour of a given marble in a given direction
 * @param marble
 * @param direction
 * @returns the neighbour
 */
const getNeighbourWithDirection = (marble, direction) => {
  const modifier = utils.getCoordinateModifierFromDirection(direction);
  const row = String.fromCharCode(marble.row.charCodeAt(0) + modifier.row);
  const col = marble.col + modifier.col;
  let side;
  try {
    side = state[row][col];
  } catch (ignored) {}
  return new Marble(row, col, side);
};

const generateOutput = (moves, side, startState) => {
  const states = getStatesFromMoves(moves, side, startState);
  const stateStrings = [];
  states.forEach((state) => {
    const cellStrings = [];
    Object.entries(state).forEach(([rowIdx, row]) => {
      Object.entries(row).forEach(([colIdx, cell]) => {
        let cellStr = rowIdx.toUpperCase() + colIdx;
        if (cell === WHT) {
          cellStrings.push(cellStr + 'w');
        } else if (cell === BLK) {
          cellStrings.push(cellStr + 'b');
        }
      });
      cellStrings.sort((a, b) => {
        if (a[2] === b[2]) {
          if (a[0] === b[0]) {
            if (a[1] === a[1]) {
              return 0;
            }
            return a[1] < b[1] ? -1 : 1;
          }
          return a[0] < b[0] ? -1 : 1;
        }
        return a[2] < b[2] ? -1 : 1;
      });
    });
    stateStrings.push(cellStrings.join(','));
  });
  return [stateStrings.join('\n'), moves.join('\n')];
};

const getStatesFromMoves = (moves, side, startState) => {
  const states = [];
  moves.forEach((move) => {
    const state = createStateFromMove(startState, move);
    states.push(state);
  });
  return states;
};

const createStateFromMove = (startState, move) => {
  const [moveType, marbleString, direction] = move.split(' ');
  const marbles = getMarblesListFromString(marbleString, startState);
  if (moveType === 'SINGLE') {
    return moveSingleMarble(...marbles, direction, startState);
  } else {
    return moveMarbleGroup(marbles, direction, moveType, startState);
  }
};

const moveSingleMarble = (marble, direction, startState) => {
  const newState = utils.deepCopy(startState);
  const modifier = utils.getCoordinateModifierFromDirection(direction);
  const newRow = String.fromCharCode(marble.row.charCodeAt(0) + modifier.row);
  const newCol = marble.col + modifier.col;
  newState[newRow][newCol] = marble.side;
  newState[marble.row][marble.col] = EMP;
  return newState;
};

const dontEatMarble = () => {
  //I have no idea why this prevents the marble being eaten, but it does.
};

const moveMarbleGroup = (marbles, direction, moveType, startState) => {
  const newState = utils.deepCopy(startState);
  if (moveType === 'INLINE') {
    let leadMarble;
    let tailMarble;
    if (direction === getDirection(marbles[0], marbles[1])) {
      leadMarble = marbles[marbles.length - 1];
      tailMarble = marbles[0];
    } else {
      leadMarble = marbles[0];
      tailMarble = marbles[marbles.length - 1];
    }

    let nextMarble = getNeighbourWithDirection(leadMarble, direction);

    if (nextMarble.side === EMP) {
      newState[nextMarble.row][nextMarble.col] = leadMarble.side;
      newState[tailMarble.row][tailMarble.col] = EMP;
    } else {
      const opponentSide = nextMarble.side;
      const opponentStart = utils.deepCopy(nextMarble);
      while (nextMarble.side === opponentSide) {
        nextMarble = getNeighbourWithDirection(nextMarble, direction);
      }
      if (nextMarble.side === EMP) {
        newState[nextMarble.row][nextMarble.col] = opponentSide;
        dontEatMarble();
      }
      newState[opponentStart.row][opponentStart.col] = leadMarble.side;
      newState[tailMarble.row][tailMarble.col] = EMP;
    }

    return newState;
  } else {
    let tmpState = newState;
    marbles.forEach((marble) => {
      tmpState = moveSingleMarble(marble, direction, tmpState);
    });
    return tmpState;
  }
};

module.exports = {
  generateMoves: generateMoves,
  createStateFromMove: createStateFromMove,
  getState: (state, move, side, callback) => {
    callback(createStateFromMove(state, move, side));
  },
  getStatesString: (state, colour, callback) => {
    const moves = generateMoves(state, colour);
    callback(generateOutput(moves, colour, state));
  },
  getAllMoves: (state, colour, callback) => {
    callback(generateMoves(state, colour));
  }
};
