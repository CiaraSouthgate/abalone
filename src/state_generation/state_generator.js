

// Create the initial Game State using marble coordinates generated by input.js
export const createInitialState = (marbleCoords) => {
    let initialState = {
        i: { 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
        h: { 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
        g: { 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
        f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
        e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
        d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
        c: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP },
        b: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP },
        a: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP }
      };

    // Go through each coordinate string and place each marble on the board.
    for (let i = 0; i < marbleCoords.length; i++){

    }

}