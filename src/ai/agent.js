const { HashTable } = require('./hashtable');
import { ciaraHeuristic } from './ciara_eval';
import { createStateFromMove, generateMoves, getMarblesAsArray } from '../state_generation';

// negative infinity
const NEG_INF = Number.NEGATIVE_INFINITY;
// positive infinity
const POS_INF = Number.POSITIVE_INFINITY;
// global variable for depth
const DEPTH = 3;
// global variable for best move
let best_move;
// Colour of Max, aka the colour of our game playing agent.
let max_colour;
// Colour of Min, aka the colour of the opponent.
let min_colour;
// Transposition table to keep track of which states we have visited already.
const transposition_table = new HashTable();

const utility = ciaraHeuristic;

const order_nodes = (actions, state, colour) => {
  return actions
    .map((action) => {
      const newState = createStateFromMove(state, action);
      return { action: action, score: utility(newState, colour), result: newState };
    })
    .sort((a, b) => {
      if (a.score === b.score) return 0;
      if (colour === max_colour) {
        return a.score < b.score ? -1 : 1;
      } else {
        return a.score > b.score ? -1 : 1;
      }
    });
};

// Returns an action
export const Alpha_Beta_Search = (state, startingColour) => {
  const marble_coordinates = getMarblesAsArray(state);
  let best_previous_move = transposition_table.getItem(marble_coordinates);
  if (best_previous_move) {
    return best_previous_move;
  }
  max_colour = startingColour;
  min_colour = max_colour === 'w' ? 'b' : 'w';
  let v = max_value(state, NEG_INF, POS_INF, DEPTH);
  transposition_table.setItem(marble_coordinates, best_move);
  return best_move;
};

// Returns a utility value
const max_value = (state, alpha, beta, d) => {
  if (cutoff_test(state, d)) return utility(state, max_colour);

  let v = NEG_INF;
  const marble_coordinates = getMarblesAsArray(state);
  const actions = generateMoves(max_colour, marble_coordinates);
  const nodes = order_nodes(actions, state, max_colour);
  nodes.forEach((node) => {
    v = Math.max(v, min_value(node.result, alpha, beta, d - 1));
    if (v > beta) return v;
    if (v > alpha) {
      alpha = v;
      best_move = node.action;
    }
  });
  return v;
};

// Returns a utility value
const min_value = (state, alpha, beta, d) => {
  if (cutoff_test(state, d)) return utility(state, min_colour);
  let v = POS_INF;
  const marble_coordinates = getMarblesAsArray(state);
  const actions = generateMoves(min_colour, marble_coordinates);
  const nodes = order_nodes(actions, state, min_colour);
  nodes.forEach((node) => {
    v = Math.min(v, max_value(node.result, alpha, beta, d - 1));
    if (v <= alpha) return v;
    beta = Math.min(beta, v);
  });
  return v;
};

// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
  return depth <= 0;
};
