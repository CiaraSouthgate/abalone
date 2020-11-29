const stateGen = require('./stateGeneration');
const heuristic = require('./evaluation_function');
const constants = require('./constants');

const createStateFromMove = stateGen.createStateFromMove;
const generateMoves = stateGen.generateMoves;
const BLK = constants.BLK;
const WHT = constants.WHT;

// time delta to ensure we return on time
const TIME_DELTA = 50;
// negative infinity
const NEG_INF = Number.NEGATIVE_INFINITY;
// positive infinity
const POS_INF = Number.POSITIVE_INFINITY;
// global variable for depth
const DEPTH = 3;
// global variable for best move
let bestMove;
// global variable for state after best move
let bestMoveResult;
// global variable for time result must be returned by (in MS since epoch)
let returnBy;
// Colour of Max, aka the colour of our game playing agent.
let maxSide;
// Colour of Min, aka the colour of the opponent.
let minSide;

const heuristicFunc = heuristic.ciaraHeuristic;

// const utility = heuristic.ciaraHeuristic;

const transTable = new Map();

const utility = (state, side) => {
  let table_value = transTable.get(state);
  if (table_value === undefined) {
    let new_value = heuristicFunc(state, side);
    transTable.set(state, new_value);
    return new_value;
  } else {
    return table_value;
  }
};

const orderNodes = (actions, state, side) => {
  return actions
    .map((action) => {
      const newState = createStateFromMove(state, action, side);

      return {
        action: action,
        score: utility(newState, side, true),
        result: newState
      };
    })
    .sort((a, b) => {
      if (a.score === b.score) return 0;
      if (side === maxSide) {
        return a.score < b.score ? -1 : 1;
      } else {
        return a.score > b.score ? -1 : 1;
      }
    });
};

// Returns an action
const alphaBetaSearch = (state, aiSide, endTime) => {
  returnBy = endTime;
  maxSide = aiSide;
  minSide = maxSide === WHT ? BLK : WHT;
  let v = alphabeta(state, DEPTH, NEG_INF, POS_INF, true);
  return { move: bestMove, result: bestMoveResult };
};

// Main alphabeta algorithm function
const alphabeta = (state, depth, alpha, beta, isMax) => {
  if (cutoff_test(state, depth)) {
    if (isMax) {
      return utility(state, maxSide);
    } else {
      return utility(state, minSide);
    }
  }
  let value;
  if (isMax) {
    value = NEG_INF;
    const actions = generateMoves(state, maxSide);
    const nodes = orderNodes(actions, state, maxSide);
    for (let i = 0; i < nodes.length; i++) {
      value = Math.max(value, alphabeta(nodes[i].result, depth - 1, alpha, beta, false));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break;
      }
      bestMove = nodes[i].action;
      bestMoveResult = nodes[i].result;
      console.log('updating best move:', bestMove);
    }
    return value;
  } else {
    value = POS_INF;
    const actions = generateMoves(state, minSide);
    const nodes = orderNodes(actions, state, minSide);
    for (let i = 0; i < nodes.length; i++) {
      value = Math.min(value, alphabeta(nodes[i].result, depth - 1, alpha, beta, true));
      beta = Math.min(beta, value);
      if (beta <= alpha) {
        break;
      }
    }
    return value;
  }
};

// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
  return depth === 0 || returnBy - new Date().getTime() <= TIME_DELTA;
};

module.exports = {
  getMove: (state, colour, endTime, callback) => {
    callback(alphaBetaSearch(state, colour, endTime));
  }
};
