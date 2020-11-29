const constants = require('./constants');
const DIRECTION = constants.DIRECTION;

class Marble {
  constructor(row, col, side) {
    this.row = row;
    this.col = col;
    this.side = side;
  }

  compareTo(other) {
    if (this.row === other.row) {
      if (this.col === other.col) {
        return 0;
      }
      return this.col < other.col ? -1 : 1;
    }
    return this.row < other.row ? -1 : 1;
  }
}

const getNeighbours = (marble, state) => {
  const letterCode = marble.row.charCodeAt(0);
  const num = marble.col;
  const neighbours = [];

  const neighbourSpaces = [
    { row: String.fromCharCode(letterCode - 1), col: num - 1 },
    { row: String.fromCharCode(letterCode - 1), col: num },
    { row: String.fromCharCode(letterCode), col: num - 1 },
    { row: String.fromCharCode(letterCode), col: num + 1 },
    { row: String.fromCharCode(letterCode + 1), col: num },
    { row: String.fromCharCode(letterCode + 1), col: num + 1 }
  ];

  neighbourSpaces.forEach((space) => {
    try {
      const neighbourSide = state[space.row][space.col];
      if (neighbourSide !== undefined) {
        neighbours.push(new Marble(space.row, space.col, neighbourSide));
      }
    } catch (ignored) {}
  });
  return neighbours;
};

const getCoordinateModifierFromDirection = (direction) => {
  switch (direction) {
    case DIRECTION.E:
      return { row: 0, col: 1 };
    case DIRECTION.W:
      return { row: 0, col: -1 };
    case DIRECTION.NE:
      return { row: 1, col: 1 };
    case DIRECTION.NW:
      return { row: 1, col: 0 };
    case DIRECTION.SE:
      return { row: -1, col: 0 };
    case DIRECTION.SW:
      return { row: -1, col: -1 };
  }
};

const getNeighbourWithDirection = (marble, direction, state) => {
  const modifier = getCoordinateModifierFromDirection(direction);
  const row = String.fromCharCode(marble.row.charCodeAt(0) + modifier.row);
  const col = marble.col + modifier.col;
  let side;
  try {
    side = state[row][col];
  } catch (ignored) {}
  return new Marble(row, col, side);
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

const getOppositeDirection = (direction) => {
  switch (direction) {
    case DIRECTION.NE:
      return DIRECTION.SW;
    case DIRECTION.E:
      return DIRECTION.W;
    case DIRECTION.SE:
      return DIRECTION.NW;
    case DIRECTION.SW:
      return DIRECTION.NE;
    case DIRECTION.W:
      return DIRECTION.E;
    case DIRECTION.NW:
      return direction.SE;
  }
};

const deepCopy = (object) => {
  return JSON.parse(JSON.stringify(object));
};

module.exports = {
  Marble: Marble,
  getNeighbours: getNeighbours,
  getCoordinateModifierFromDirection: getCoordinateModifierFromDirection,
  getNeighbourWithDirection: getNeighbourWithDirection,
  getMarblesString: getMarblesString,
  getMarblesListFromString: getMarblesListFromString,
  getDirection: getDirection,
  getOppositeDirection: getOppositeDirection,
  deepCopy: deepCopy
};
