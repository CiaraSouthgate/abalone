// handles input of text file to our state generator

import { BLK, BOARD_LAYOUTS, WHT } from '../constants';

export const parseInputFile = (callback) => {
  // get input tag
  const input = document.getElementById('input');
  // get file
  const file = input.files[0];
  // create reader
  const reader = new FileReader();

  // read file as text
  reader.readAsText(file);

  // when its done reading, do the parsing
  reader.onload = () => {
    // split into lines
    let lines = reader.result.split('\n');

    // starting color is just first line
    let startingColour = lines[0].trim() === 'w' ? WHT : BLK;

    // pass marble coordinates as string into coordinate parser and get array of marble coordinates.
    let marbleCoordinates = parseCoords(lines[1].toLowerCase());

    const startState = createInitialState(marbleCoordinates);

    // do callback with finished data
    const req = new XMLHttpRequest();
    const queryString = `?state=${JSON.stringify(startState)}&colour=${startingColour}`;
    req.open('GET', 'localhost:5000/boardString' + queryString);
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(req.responseText);
      }
    };
    req.send();
  };

  // catch error
  reader.onerror = () => {
    console.log(reader.error);
  };
};

const createInitialState = (coords) => {
  const state = JSON.parse(JSON.stringify(BOARD_LAYOUTS.BLANK));
  coords.forEach((coord) => {
    const row = coord[0];
    const col = coord[1];
    const side = coord[2];
    state[row][col] = side === 'w' ? WHT : BLK;
  });
  return state;
};

// Function to parse coordinates from an inputString of marble coordinates.
const parseCoords = (inputString) => {
  // parse and return all coordinates
  return inputString.split(',');
};

// Creates output file for download
const createOutputFile = (text) => {
  let data = new Blob([text], { type: 'text/plain' });

  // Returns URL to the data
  return window.URL.createObjectURL(data);
};

export const downloadTextfile = (data, filename) => {
  let link = document.createElement('a');
  link.setAttribute('download', filename);
  link.href = createOutputFile(data);
  link.hidden = true;
  document.body.appendChild(link);

  window.requestAnimationFrame(() => {
    let event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
};
