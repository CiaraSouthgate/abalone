const EMP = 0;
const MAX = 1;
const MIN = 2;
const MARVEL_COLORS = {
  BLACK: 0,
  WHITE: 1
};
const GAME_MODE = {
  VSCOMPUTER: 0,
  VSHUMAN: 1
};
const DEFAULT_MOVE_LIMIT = 50;
const DEFAULT_TIME_LIMIT_IN_MINUTES = 10;
const BOARD_LAYOUT_NAMES = {
  STANDARD: 0,
  GERMAN_DAISY: 1,
  BELGIAN_DAISY: 2
};
const BOARD_LAYOUTS = {
  STANDARD: {
    i: { 5: MIN, 6: MIN, 7: MIN, 8: MIN, 9: MIN },
    h: { 4: MIN, 5: MIN, 6: MIN, 7: MIN, 8: MIN, 9: MIN },
    g: { 3: EMP, 4: EMP, 5: MIN, 6: MIN, 7: MIN, 8: EMP, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: EMP, 3: MAX, 4: MAX, 5: MAX, 6: EMP, 7: EMP },
    b: { 1: MAX, 2: MAX, 3: MAX, 4: MAX, 5: MAX, 6: MAX },
    a: { 1: MAX, 2: MAX, 3: MAX, 4: MAX, 5: MAX }
  },
  GERMAN_DAISY: {
    i: { 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    h: { 4: MIN, 5: MIN, 6: EMP, 7: EMP, 8: MAX, 9: MAX },
    g: { 3: MIN, 4: MIN, 5: MIN, 6: EMP, 7: MAX, 8: MAX, 9: MAX },
    f: { 2: EMP, 3: MIN, 4: MIN, 5: EMP, 6: EMP, 7: MAX, 8: MAX, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: MAX, 3: MAX, 4: EMP, 5: EMP, 6: MIN, 7: MIN, 8: EMP },
    c: { 1: MAX, 2: MAX, 3: MAX, 4: EMP, 5: MIN, 6: MIN, 7: MIN },
    b: { 1: MAX, 2: MAX, 3: EMP, 4: EMP, 5: MIN, 6: MIN },
    a: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP }
  },
  BELGIAN_DAISY: {
    i: { 5: MIN, 6: MIN, 7: EMP, 8: MAX, 9: MAX },
    h: { 4: MIN, 5: MIN, 6: MIN, 7: MAX, 8: MAX, 9: MAX },
    g: { 3: EMP, 4: MIN, 5: MIN, 6: EMP, 7: MAX, 8: MAX, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: MAX, 3: MAX, 4: EMP, 5: MIN, 6: MIN, 7: EMP },
    b: { 1: MAX, 2: MAX, 3: MAX, 4: MIN, 5: MIN, 6: MIN },
    a: { 1: MAX, 2: MAX, 3: EMP, 4: MIN, 5: MIN }
  }
};

const DIRECTIONS = {
  EAST: 0,
  WEST: 1,
  NORTH_EAST: 2,
  NORTH_WEST: 3,
  SOUTH_EAST: 4,
  SOUTH_WEST: 5
};

export {
  BOARD_LAYOUTS,
  EMP,
  MAX,
  MIN,
  MARVEL_COLORS,
  GAME_MODE,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_MINUTES,
  BOARD_LAYOUT_NAMES,
  DIRECTIONS
};
