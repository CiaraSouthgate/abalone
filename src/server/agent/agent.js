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
const DEPTH = 5;
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

const utility = heuristic.ciaraHeuristic;

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
  // let v = maxValue(state, NEG_INF, POS_INF, DEPTH);
  return { move: bestMove, result: bestMoveResult };
};

// // Returns a utility value
// const maxValue = (state, alpha, beta, d) => {
//   if (cutoff_test(state, d)) return utility(state, maxSide);

//   let v = NEG_INF;
//   const actions = generateMoves(state, maxSide);
//   const nodes = orderNodes(actions, state, maxSide);
//   nodes.forEach((node) => {
//     v = Math.max(v, min_value(node.result, alpha, beta, d - 1));
//     if (v > beta) return v;
//     alpha = Math.max(v, alpha);
//     bestMove = node.action;
//     bestMoveResult = node.result;
//     console.log('updating best move:', bestMove);
//     if (beta <= alpha) break;
//   });
//   return v;
// };

// // Returns a utility value
// const min_value = (state, alpha, beta, d) => {
//   if (cutoff_test(state, d)) return utility(state, minSide);
//   let v = POS_INF;
//   const actions = generateMoves(state, minSide);
//   const nodes = orderNodes(actions, state, minSide);
//   nodes.forEach((node) => {
//     v = Math.min(v, maxValue(node.result, alpha, beta, d - 1));
//     if (v <= alpha) return v;
//     beta = Math.min(beta, v);
//   });
//   return v;
// };


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
      console.log("updating best move:", bestMove);
    }
    return value;
  } else {
    value = POS_INF;
    const actions = generateMoves(state, maxSide);
    const nodes = orderNodes(actions, state, maxSide);
    for (let i = 0; i < nodes.length; i++) {
      value = Math.min(value, alphabeta(nodes[i].result, depth - 1, alpha, beta, true));
      beta = Math.min(beta, value);
      if (beta <= alpha) {
        break;
      }
    }
    return value;
  }
}



// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
  return depth === 0 || returnBy - new Date().getTime() <= TIME_DELTA;
};

module.exports = {
  getMove: (state, colour, endTime, callback) => {
    callback(alphaBetaSearch(state, colour, endTime));
  }
};
