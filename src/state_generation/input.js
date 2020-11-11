import { createInitialState, generateMoves } from './state_generator';

// handles input of text file to our state generator
export const parseInputFile = (callback) => {
  // get input tag
  let input = document.getElementById('input');
  // get file
  let file = input.files[0];
  // create reader
  let reader = new FileReader();

  // read file as text
  reader.readAsText(file);

  // when its done reading, do the parsing
  reader.onload = () => {
    // split into lines
    let lines = reader.result.split('\n');

    // starting color is just first line
    let startingColour = lines[0].trim();

    // pass marble coordinates as string into coordinate parser and get array of marble coordinates.
    let marbleCoordinates = parseCoords(lines[1].toLowerCase());

    // pass information to the state generator
    let initialState = createInitialState(marbleCoordinates);

    // pass info to move generator
    let moves = generateMoves(startingColour, marbleCoordinates);

    // do state generation from moves
    // convert to formats

    // do callback: generate files, etc
    callback(initialState, moves);
  };

  // catch error
  reader.onerror = () => {
    console.log(reader.error);
  };
};

// Function to parse coordinates from an inputString of marble coordinates.
const parseCoords = (inputString) => {
  // parse and return all coordinates
  return inputString.split(',');
};
