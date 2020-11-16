import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


// For testing heuristic
import { spencer_heuristic } from './ai/evaluation_function.js';
import { EMP, BLK, WHT } from "./constants";

let state = {
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


spencer_heuristic(state, 1);
ReactDOM.render(<App />, document.getElementById('root'));
