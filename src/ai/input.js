

// handles input of text file to our state generator, passes the file text to 2 parsers.
function readInputFile() {
    // get input tag
    let input = document.getElementById('input');
    // get file
    let file = input.files[0];
    // create reader
    let reader = new FileReader();

    // read file as text
    reader.readAsText(file);

    // when its done reading, do the parsing
    reader.onload = function(){

        // split into lines
        let lines = reader.result.split('\n');

        // starting color is just first line
        let startingColour = lines[0];

        // pass marble coordinates as string into coordinate parser and get array of marble coordinates.
        let marbleCoordinates = parseCoords(lines[1]);

        // results
        console.log("Starting colour", startingColour);
        console.log("Coordinates", marbleCoordinates);
    }

    // catch error
    reader.onerror = function(){
        console.log(reader.error);
    }
};


// Function to parse coordinates from an inputString of marble coordinates.
function parseCoords(inputString){
    // parse all coordinates
    let arrayOfCoords = inputString.split(',');
    // return coordinates
    return arrayOfCoords;
}

export default readInputFile;