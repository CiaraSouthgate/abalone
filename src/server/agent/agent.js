const stateGen = require('./stateGeneration');
const heuristic = require('./evaluation_function');
const constants = require('./constants');

const createStateFromMove = stateGen.createStateFromMove;
const generateMoves = stateGen.generateMoves;
const BLK = constants.BLK;
const WHT = constants.WHT;

// negative infinity
const NEG_INF = Number.NEGATIVE_INFINITY;
// positive infinity
const POS_INF = Number.POSITIVE_INFINITY;
// global variable for depth
const DEPTH = 5;
// global variable for best move
let bestMove;
// global variable for state after best move
let bestMoveResult;
// Colour of Max, aka the colour of our game playing agent.
let maxSide;
// Colour of Min, aka the colour of the opponent.
let minSide;

const utility = heuristic.ciaraHeuristic;

const orderNodes = (actions, state, side) => {
  return actions
    .map((action) => {
      const newState = createStateFromMove(state, action, side);
      return {
        action: action,
        score: utility(newState, side),
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
const alphaBetaSearch = (state, aiSide) => {
  maxSide = aiSide;
  minSide = maxSide === WHT ? BLK : WHT;
  let v = maxValue(state, NEG_INF, POS_INF, DEPTH);
  return { move: bestMove, result: bestMoveResult };
};

// Returns a utility value
const maxValue = (state, alpha, beta, d) => {
  if (cutoff_test(state, d)) return utility(state, maxSide);

  let v = NEG_INF;
  const actions = generateMoves(state, maxSide);
  const nodes = orderNodes(actions, state, maxSide);
  nodes.forEach((node) => {
    v = Math.max(v, min_value(node.result, alpha, beta, d - 1));
    if (v > beta) return v;
    if (v > alpha) {
      alpha = v;
      bestMove = node.action;
      bestMoveResult = node.result;
      console.log('updating best move:', bestMove);
    }
  });
  return v;
};

// Returns a utility value
const min_value = (state, alpha, beta, d) => {
  if (cutoff_test(state, d)) return utility(state, minSide);
  let v = POS_INF;
  const actions = generateMoves(state, minSide);
  const nodes = orderNodes(actions, state, minSide);
  nodes.forEach((node) => {
    v = Math.min(v, maxValue(node.result, alpha, beta, d - 1));
    if (v <= alpha) return v;
    beta = Math.min(beta, v);
  });
  return v;
};

// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
  return depth <= 0;
};

module.exports = {
  getMove: (state, colour, callback) => {
    callback(alphaBetaSearch(state, colour));
  }
};
