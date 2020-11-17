const express = require('express');
const agent = require('./agent/agent');
const stateGen = require('./agent/stateGeneration');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

const parseMoveRequest = (req, res, callback) => {
  const query = url.parse(req.url, true).query;

  let { state, colour } = query;

  if (state == null || colour == null) {
    let errorString = 'Invalid request.';
    res.status(400);
    if (state == null) errorString += ' State is required.';
    if (colour == null) errorString += ' Colour is required.';
    res.send(errorString);
    return;
  }

  state = JSON.parse(state);
  colour = parseInt(colour);

  callback(state, colour);
};

app.get('/bestmoves', (req, res) => {
  parseMoveRequest(req, res, (state, colour) => {
    const startTime = new Date().getTime();

    agent.getMove(state, colour, (bestMove) => {
      const calcTime = new Date().getTime() - startTime;
      const resString = JSON.stringify({ move: bestMove, time: calcTime });
      res.status(200).send(resString);
    });
  });
});

app.get('/allmoves', (req, res) => {
  parseMoveRequest(req, res, (state, colour) => {
    stateGen.getAllMoves(state, colour, (moves) => {
      res.status(200).send(JSON.stringify(moves));
    });
  });
});

app.get('/boardString', (req, res) => {
  parseMoveRequest(req, res, (state, colour) => {
    stateGen.getStatesString(state, colour, (string) => {
      res.status(200).send(string);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running and listening on port ${PORT}`);
});
