import { EMP } from "../constants/index";
import { BLK } from "../constants/index";
import { WHT } from "../constants/index";

// Create the initial Game State using marble coordinates generated by input.js
export function createInitialState(marbleCoords) {

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

    // Go through each coordinate string, convert it, and place each marble on the board.
    for (let i = 0; i < marbleCoords.length; i++){
      // must set to lower case to work with our object
      let letter = marbleCoords[i][0].toLowerCase();
      // get num
      let num = marbleCoords[i][1];
      // color
      let color = marbleCoords[i][2];

      // set up initial state using coordinates.
      if (color === "w") {
        initialState[letter][num] = WHT;
      } else {
        initialState[letter][num] = BLK;
      }
    }

    // return the initial state
    return initialState;
}

// This function generates a set for duo and trio neighbouring marbles
export function generateMoves(startingColour, marbleCoords, initialState){
  let state = initialState;
  // get coordinates of only the marbles we will be moving
  let single_marbles = getCoordinatesUsingColour(startingColour, marbleCoords);
  console.log(single_marbles);
  // generate a list of duoing neighbour marbles
  let duo_marbles = getMarblePairs(single_marbles, state);
  console.log(duo_marbles);
  // generate a list of trio neighbour marbles
  let trio_marbles = getMarbleTrios(duo_marbles, state);
  console.log(trio_marbles);
  // Go through each list of marbles and check and generate moves for each one.
  

}

// This function returns a list of duo marble neighbours
function getMarblePairs(coordinates, state) {
  let duo_marbles = [];
  for (let i = 0; i < coordinates.length; i++){
    let thisMarble = coordinates[i];
    let neighbours = getNeighbours(thisMarble, state);
    for (let k = 0; k < neighbours.length; k++){
      if (thisMarble[2] == neighbours[k][2]){
        duo_marbles.push(thisMarble.toLowerCase() + neighbours[k]);
      }
    }
  }
  return duo_marbles;
}

// This function returns a list of trio marble neighbours
function getMarbleTrios(duo_coordinates, state){
  let trio_marbles = [];
  for (let i = 0; i < duo_coordinates.length; i++){
    let marble_letter = duo_coordinates[i][3].charCodeAt(0) - duo_coordinates[i][0].charCodeAt(0);
    let marble_num = duo_coordinates[i][4] - duo_coordinates[i][1];
    let x = duo_coordinates[i][3].charCodeAt(0)+marble_letter;
    let y = parseInt(duo_coordinates[i][4])+marble_num;
    if (String.fromCharCode(x).search(/[^a-i\s]/) != -1 || y > 9 || y < 1){
      continue;
    }
    let marble_colour = getColourFromCoordinate(
      String.fromCharCode(x),
      y,
      state);
    if (marble_colour == duo_coordinates[i][2]){
      trio_marbles.push(duo_coordinates[i]+String.fromCharCode(x)+y+marble_colour);
    }
  }
  return trio_marbles;
}

// This function returns a list of neighbours
function getNeighbours(coord, state){
  let letter = coord[0].toLowerCase().charCodeAt(0);
  let num = parseInt(coord[1]);
  let neighbours = [];
  try {
    let tempLetter = String.fromCharCode(letter-1);
    let tempNum = num - 1;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch (err) {
    console.log();
  }
  try {
    let tempLetter = String.fromCharCode(letter);
    let tempNum = num-1;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch(err) {
    console.log();
  }
  try {
    let tempLetter = String.fromCharCode(letter);
    let tempNum = num+1;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch(err) {
    console.log();
  }
  try {
    let tempLetter = String.fromCharCode(letter+1);
    let tempNum = num;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch(err) {
    console.log();
  }
  try {
    let tempLetter = String.fromCharCode(letter+1);
    let tempNum = num+1;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch(err) {
    console.log();
  }
  try {
    let tempLetter = String.fromCharCode(letter-1);
    let tempNum = num;
    if (state[tempLetter][tempNum] == undefined) {
      throw Error();
    };
    let colour = getColourFromCoordinate(tempLetter, tempNum, state);
    neighbours.push(tempLetter+tempNum+colour);
  } catch(err) {
    console.log();
  }
  return neighbours;
}

function getColourFromCoordinate(letter, num, state) {
  if (state[letter][num] == 2) {
    return "w";
  } else if (state[letter][num] == 1) {
    return "b";
  } else {
    return "emp";
  };
}

// This function returns a list of coordinates for only the marbles that match the startingColour
function getCoordinatesUsingColour(startingColour, marbleCoords){
  let coordinates = [];
  // If the starting colour is white then get the coordinates for the white marbles
  if (startingColour.includes("w")){
    for (let i = 0; i < marbleCoords.length; i++){
      if (marbleCoords[i].includes("w")){coordinates.push(marbleCoords[i])};
    }
  // If the starting colour is black then get the coordinates for the black marbles
  } else {
    for (let i = 0; i < marbleCoords.length; i++){
      if (marbleCoords[i].includes("b")){coordinates.push(marbleCoords[i])};
    }
  }
  return coordinates;
}
