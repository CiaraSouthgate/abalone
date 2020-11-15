const { generateMoves } = require("../state_generation");

// negative infinity
const neg_inf = Number.NEGATIVE_INFINITY;
// positive infinity
const pos_inf = Number.POSITIVE_INFINITY;
// global variable for best move
var best_move;


// Replace utility() with your heuristic function.
// 

// Returns an action
const Alpha_Beta_Search = (state) => {
    let v = max_value(state, neg_inf, pos_inf);
    return best_move;
}


// Returns a utility value
const max_value = (state, alpha, beta, depth) => {
    if (cutoff_test(state, depth)) return utility(state);
    let v = neg_inf;
    for(action in generateMoves(state)){
        v = Math.max(v, min_value(result(state, action), alpha, beta, depth-1))
        if (v > beta) return v;
        alpha = Math.max(alpha, v); 
        // Sets the best move
        best_move = action;
    }
    return v;
} 

// Returns a utility value
const min_value = (state, alpha, beta, depth) => {
    if (cutoff_test(state, depth)) return utility(state);
    let v = pos_inf;
    for (action in generateMoves(state)){
        v = Math.min(v, max_value(result(state, action), alpha, beta, depth-1))
        if (v <= a) return v;
        beta = Math.min(beta, v);
    }
    return v;
}

// Returns true when depth is zero and if the state is a terminal state. but for now only returns true when the depth is zero or less.
const cutoff_test = (state, depth) => {
    return (depth <= 0) ? true : false;
}