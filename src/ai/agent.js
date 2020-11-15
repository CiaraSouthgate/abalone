const { generateMoves } = require("../state_generation");
const { spencer_heuristic } = require("./evaluation_function");
const { getMarblesAsArray } = require("../state_generation");

// negative infinity
const neg_inf = Number.NEGATIVE_INFINITY;
// positive infinity
const pos_inf = Number.POSITIVE_INFINITY;
// global variable for depth
var depth = 5;
// global variable for best move
var best_move;

var max_colour;
var min_colour;


// -------
// Alberto: result(state, action) needs to be replaced by a function that takes the state and a single action as input and returns the resulting state.
// -------

// Returns an action
const Alpha_Beta_Search = (state, startingColour) => {
    max_colour = startingColour;
    if (max_colour == "w") {
        min_colour = "b";
    } else {
        min_colour = "w";
    };
    let v = max_value(state, neg_inf, pos_inf, depth);
    return best_move;
}

// Returns a utility value
const max_value = (state, alpha, beta, d) => {
    if (cutoff_test(state, depth)) return spencer_heuristic(state);
    let v = neg_inf;
    let marble_coordinates = getMarblesAsArray(state);
    let actions = generateMoves(max_colour, marble_coordinates);
    for(let i = 0; i < actions.length; i++){
        v = Math.max(v, min_value(result(state, actions[i]), alpha, beta, d-1))
        if (v > beta) return v;
        alpha = Math.max(alpha, v); 
        // Sets the best move
        best_move = actions[i];
    }
    return v;
}

// Returns a utility value
const min_value = (state, alpha, beta, d) => {
    if (cutoff_test(state, depth)) return spencer_heuristic(state);
    let v = pos_inf;
    let marble_coordinates = getMarblesAsArray(state);
    let actions = generateMoves(min_colour, marble_coordinates);
    for (let i = 0; i < actions.length; i++){
        v = Math.min(v, max_value(result(state, actions[i]), alpha, beta, d-1))
        if (v <= a) return v;
        beta = Math.min(beta, v);
    }
    return v;
}

// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
    return (depth <= 0) ? true : false;
}