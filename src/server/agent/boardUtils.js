const constants = require('./constants');
const DIRECTION = constants.DIRECTION;

class Marble {
  constructor(row, col, side) {
    this.row = row;
    this.col = col;
    this.side = side;
  }

  compareTo(other) {
    if (this.row < other.row) {
      return -1;
    } else if (this.row > other.row) {
      return 1;
    }

    if (this.col < other.col) {
      return -1;
    } else if (this.col > other.col) {
      return 1;
    }

    return 0;
  }
}

module.exports = {
  Marble: Marble,

  getNeighbours: (marble, state) => {
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
  },

  getCoordinateModifierFromDirection: (direction) => {
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
  },

  getDirectionFromCoordinateModifier: (modifier) => {
    switch (modifier) {
      case { row: -1, col: 0 }:
        return DIRECTION.NW;
      case { row: -1, col: -1 }:
        return DIRECTION.NE;
      case { row: 0, col: -1 }:
        return DIRECTION.E;
      case { row: 0, col: 1 }:
        return DIRECTION.W;
      case { row: 1, col: 1 }:
        return DIRECTION.SW;
      case { row: 1, col: 0 }:
        return DIRECTION.SE;
    }
  }
};
