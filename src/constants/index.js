const EMP = 0;
const BLK = 1;
const WHT = 2;
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
const DIRECTION = {
  NE: 'NE',
  E: 'E',
  SE: 'SE',
  SW: 'SW',
  W: 'W',
  NW: 'NW'
}
const BOARD_LAYOUTS = {
  STANDARD: {
    i: { 5: WHT, 6: WHT, 7: WHT, 8: WHT, 9: WHT },
    h: { 4: WHT, 5: WHT, 6: WHT, 7: WHT, 8: WHT, 9: WHT },
    g: { 3: EMP, 4: EMP, 5: WHT, 6: WHT, 7: WHT, 8: EMP, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: EMP, 3: BLK, 4: BLK, 5: BLK, 6: EMP, 7: EMP },
    b: { 1: BLK, 2: BLK, 3: BLK, 4: BLK, 5: BLK, 6: BLK },
    a: { 1: BLK, 2: BLK, 3: BLK, 4: BLK, 5: BLK }
  },
  GERMAN_DAISY: {
    i: { 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    h: { 4: WHT, 5: WHT, 6: EMP, 7: EMP, 8: BLK, 9: BLK },
    g: { 3: WHT, 4: WHT, 5: WHT, 6: EMP, 7: BLK, 8: BLK, 9: BLK },
    f: { 2: EMP, 3: WHT, 4: WHT, 5: EMP, 6: EMP, 7: BLK, 8: BLK, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: BLK, 3: BLK, 4: EMP, 5: EMP, 6: WHT, 7: WHT, 8: EMP },
    c: { 1: BLK, 2: BLK, 3: BLK, 4: EMP, 5: WHT, 6: WHT, 7: WHT },
    b: { 1: BLK, 2: BLK, 3: EMP, 4: EMP, 5: WHT, 6: WHT },
    a: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP }
  },
  BELGIAN_DAISY: {
    i: { 5: WHT, 6: WHT, 7: EMP, 8: BLK, 9: BLK },
    h: { 4: WHT, 5: WHT, 6: WHT, 7: BLK, 8: BLK, 9: BLK },
    g: { 3: EMP, 4: WHT, 5: WHT, 6: EMP, 7: BLK, 8: BLK, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: BLK, 3: BLK, 4: EMP, 5: WHT, 6: WHT, 7: EMP },
    b: { 1: BLK, 2: BLK, 3: BLK, 4: WHT, 5: WHT, 6: WHT },
    a: { 1: BLK, 2: BLK, 3: EMP, 4: WHT, 5: WHT }
  }
};

export {
  BOARD_LAYOUTS,
  EMP,
  BLK,
  WHT,
  MARVEL_COLORS,
  GAME_MODE,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_MINUTES,
  BOARD_LAYOUT_NAMES,
  DIRECTION
};
