import { BLK, BOARD_LAYOUTS, DIRECTION, EMP, WHT } from '../constants';

const state = BOARD_LAYOUTS.BLANK;
const marble1directions = ['W', 'SE', 'SW'];

// Create the initial Game State using marble coordinates generated by input.js
export const createInitialState = (marbleCoords) => {
  // Go through each coordinate string, convert it, and place each marble on the board.
  marbleCoords.forEach((coord) => {
    const letter = coord[0];
    const num = coord[1];
    const color = coord[2];
    // set up initial state using coordinates.
    state[letter][num] = color === 'w' ? WHT : BLK;
  });
  return state;
};

const getColourStringFromCoordinate = (letter, num) => {
  if (state[letter][num] === WHT) {
    return 'w';
  } else if (state[letter][num] === BLK) {
    return 'b';
  } else {
    return 'emp';
  }
};

const getColourFromMarbleString = (marble) => {
  return state[marble[0]][marble[1]];
};

// This function returns a list of coordinates for only the marbles that match the startingColour
const getCoordinatesUsingColour = (startingColour, marbleCoords) => {
  const coordinates = [];
  marbleCoords.forEach((coord) => {
    if (coord.includes(startingColour)) {
      coordinates.push(coord);
    }
  });
  return coordinates;
};

// This function generates a set for duo and trio neighbouring marbles
export const generateMoves = (startingColour, marbleCoords) => {
  // get coordinates of only the marbles we will be moving
  const single_marbles = getCoordinatesUsingColour(startingColour, marbleCoords);
  // generate a list of duoing neighbour marbles
  const duo_marbles = getMarblePairs(single_marbles);
  // generate a list of trio neighbour marbles
  const trio_marbles = getMarbleTrios(duo_marbles);
  // Go through each list of marbles and check and generate moves for each one.
  const single_marble_moves = getSingleMarbleMoves(single_marbles);
  //console.log(single_marble_moves);

  const double_marble_moves = getMarbleGroupMoves(duo_marbles);
  //console.log(double_marble_moves);

  const triple_marble_moves = getMarbleGroupMoves(trio_marbles);
  //console.log(triple_marble_moves);

  // return moves
  return single_marble_moves.concat(double_marble_moves, triple_marble_moves);
};

// This function will go through each single marble and return all the possible moves as an array of strings
// coordinates is a list of coordinates of single marbles
const getDirection = (pos1, pos2) => {
  const pos1row = pos1[0];
  const pos1col = parseInt(pos1[1]);
  const pos2row = pos2[0];
  const pos2col = parseInt(pos2[1]);

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

// This function returns a list of duo marble neighbours
const getMarblePairs = (coordinates) => {
  const duo_marbles = [];
  for (let i = 0; i < coordinates.length; i++) {
    const thisMarble = coordinates[i];
    const neighbours = getNeighbours(thisMarble);
    for (let k = 0; k < neighbours.length; k++) {
      if (thisMarble < neighbours[k]) {
        if (thisMarble.charAt(2) === neighbours[k].charAt(2)) {
          duo_marbles.push(thisMarble + neighbours[k]);
        }
      }
    }
  }
  return duo_marbles;
};

// This function returns a list of trio marble neighbours
const getMarbleTrios = (duo_coordinates) => {
  const trio_marbles = [];
  duo_coordinates.forEach((duo) => {
    const pair = getMarblesFromGroup(duo);
    const direction = getDirection(pair[0], pair[1]);
    const nextInLine = getNeighbourCoordinateWithDirection(pair[1], direction);
    if (nextInLine !== undefined && nextInLine.endsWith(duo.slice(-1))) {
      trio_marbles.push(duo + nextInLine);
    }
  });
  return trio_marbles;
};

// This function returns a list of neighbours
const getNeighbours = (coord) => {
  const letterCode = coord[0].charCodeAt(0);
  const num = parseInt(coord[1]);
  const neighbours = [];

  const spacesAround = [
    { row: String.fromCharCode(letterCode - 1), col: num - 1 },
    { row: String.fromCharCode(letterCode - 1), col: num },
    { row: String.fromCharCode(letterCode), col: num - 1 },
    { row: String.fromCharCode(letterCode), col: num + 1 },
    { row: String.fromCharCode(letterCode + 1), col: num },
    { row: String.fromCharCode(letterCode + 1), col: num + 1 }
  ];

  spacesAround.forEach((space) => {
    try {
      const neighbour = state[space.row][space.col];
      if (neighbour !== undefined) {
        const colour = getColourStringFromCoordinate(space.row, space.col);
        neighbours.push(space.row + space.col + colour);
      }
    } catch (ignored) {}
  });

  return neighbours;
};

const getSingleMarbleMoves = (coordinates) => {
  // moves will be placed in here
  const moves = [];
  // go through each marble and find the valid moves.
  for (let i = 0; i < coordinates.length; i++) {
    const neighbours = getNeighbours(coordinates[i]);
    for (let k = 0; k < neighbours.length; k++) {
      if (neighbours[k].includes('emp')) {
        // get the direction and create the correct move string
        const direction = getDirection(neighbours[k], coordinates[i]);
        const coord = coordinates[i].substr(0, 2).toUpperCase();
        const thisMove = `SINGLE ${coord} ${direction}`;
        moves.push(thisMove);
      }
    }
  }
  return moves;
};

// Will return EMP, WHT, BLK, undefined (if out of bounds)
const getNeighbourWithDirection = (marble, direction) => {
  try {
    // marble is a string in the form xxx
    // direction is a string which represents the direction

    // Must check which direction is given, and depending on the direction I must check the neighbour in that direction
    const modifier = convertDirectionToCoordinateModifier(direction);
    const marbleLetter = String.fromCharCode(marble[0].charCodeAt(0) + modifier[0]);
    const marbleNum = parseInt(marble[1]) + modifier[1];
    return state[marbleLetter][marbleNum];
  } catch (ignore) {}
};

const getNeighbourCoordinateWithDirection = (marble, direction) => {
  try {
    // marble is a string in the form xxx
    // direction is a string which represents the direction

    // Must check which direction is given, and depending on the direction I must check the neighbour in that direction
    const modifier = convertDirectionToCoordinateModifier(direction);
    const marbleLetter = String.fromCharCode(marble[0].charCodeAt(0) + modifier[0]);
    const marbleNum = parseInt(marble[1]) + modifier[1];
    const marbleColour = convertColourValueToString(state[marbleLetter][marbleNum]);
    return `${marbleLetter}${marbleNum}${marbleColour}`;
  } catch (ignore) {}
};

const convertColourValueToString = (colour) => {
  switch (colour) {
    case EMP:
      return 'emp';
    case BLK:
      return 'b';
    case WHT:
      return 'w';
  }
};

// This function will return a coordinate modifier, which is used to check a neighbour in a given direction
const convertDirectionToCoordinateModifier = (direction) => {
  switch (direction) {
    case 'E':
      return [0, 1];
    case 'W':
      return [0, -1];
    case 'NE':
      return [1, 1];
    case 'NW':
      return [1, 0];
    case 'SE':
      return [-1, 0];
    case 'SW':
      return [-1, -1];
  }
};

// This function will count the number of same coloured marbles in a row, in the given direction.
const countMarblesInDirection = (startingMarble, direction, colour) => {
  const marble = getNeighbourWithDirection(startingMarble, direction);
  const nextMarble = getNeighbourCoordinateWithDirection(startingMarble, direction);
  if (marble === colour) {
    return 1 + countMarblesInDirection(nextMarble, direction, colour);
  }
  return 1;
};

// This function returns the string representation of each marble coordinate in a marble group.
const getMarblesFromGroup = (marbleGroup) => {
  const marbles = [];
  for (let i = 0; i < marbleGroup.length / 3; i++) {
    marbles.push(marbleGroup.substr(i * 3, 3));
  }
  return marbles;
};

// This function will go through each group of marbles and return all the possible moves as an array of strings.
// coordinates is the coordinates for all marble groupings
const getMarbleGroupMoves = (coordinates) => {
  let moves = [];
  coordinates.forEach((set) => {
    const marbles = getMarblesFromGroup(set);

    const [inline, sidestep] = setMultiMoveGroups(marbles[0], marbles[1]);
    const inlineMoves = getInlineMoves(marbles, inline);
    if (!!inlineMoves) {
      moves = moves.concat(inlineMoves);
    }
    const sideStepMoves = getSidestepMoves(marbles, sidestep);
    if (!!sideStepMoves) {
      moves = moves.concat(sideStepMoves);
    }
  });
  return moves;
};

const getMarblesString = (marbles) => {
  return marbles.reduce((str, marble) => {
    return str + marble.substr(0, 2).toUpperCase();
  }, '');
};

const getInlineMoves = (marbles, directions) => {
  const moves = [];
  directions.forEach((direction) => {
    const leadMarble =
      marble1directions.indexOf(direction) >= 0 ? marbles[0] : marbles[marbles.length - 1];

    const neighbourColour = getNeighbourWithDirection(leadMarble, direction);
    if (
      neighbourColour === undefined ||
      neighbourColour === getColourFromMarbleString(marbles[0])
    ) {
      return;
    } else if (neighbourColour !== EMP) {
      //is opponent's marble
      const neighbourCoordinate = getNeighbourCoordinateWithDirection(leadMarble, direction);
      const numOpposing = countMarblesInDirection(neighbourCoordinate, direction, neighbourColour);
      if (numOpposing >= marbles.length) {
        return;
      }
    }

    moves.push(`INLINE ${getMarblesString(marbles)} ${direction}`);
  });
  return moves.length > 0 ? moves : null;
};

const getSidestepMoves = (marbles, directions) => {
  const moves = [];
  directions.forEach((direction) => {
    const numClear = marbles.filter((marble) => {
      return getNeighbourWithDirection(marble, direction) === EMP;
    }).length;
    if (numClear === marbles.length) {
      moves.push(`SIDESTEP ${getMarblesString(marbles)} ${direction}`);
    }
  });
  return moves.length > 0 ? moves : null;
};

const setMultiMoveGroups = (marble1, marble2) => {
  let inline;
  let sidestep;

  const rowDir = getDirection(marble1, marble2);
  switch (rowDir) {
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
