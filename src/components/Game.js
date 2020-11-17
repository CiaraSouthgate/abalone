/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import {
  BLK,
  BOARD_LAYOUT_NAMES,
  BOARD_LAYOUTS,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_TIME_LIMIT_IN_SECONDS,
  EMP,
  GAME_MODE,
  MARBLE_COLOURS,
  WHT,
  DIRECTION
} from '../constants';
// import { Alpha_Beta_Search } from '../ai/agent';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core';
import { ButtonContainer } from './ButtonContainer';
import { InputFile } from './InputFile';
import {
  convertGameStateToCordinateArray,
  coordinatesToGameState,
  getLegalMoveInfo,
  mapToColour
} from '../utils/movement';
// import {
//   createInitialState,
//   generateMoves,
//   getMarbleCoordinateInDirectionWithOffset,
//   getNextBoardConfiguration,
//   convertColourValueToString
// } from '../state_generation';

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;
const MARGIN_SIZE = 1;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const BoardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: red;
  padding: 1rem;
  border-radius: 8px;
  background-color: burlywood;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const BoardTile = styled.div`
  /* width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px; */
  user-select: none;
  width: 4vw;
  height: 4vw;
  border-radius: 50%;
  /* border: 0.1vw solid black; */
  margin: 0px ${MARGIN_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  &:hover {
    cursor: pointer;
  }
  color: ${(props) => {
    if (props.for === BLK) {
      return 'white';
    } else {
      return 'black';
    }
  }};
  background-color: ${(props) => {
    if (props.selected) {
      return 'red';
    }
    if (props.for === EMP) {
      return '#00000050';
    } else if (props.for === BLK) {
      return 'black';
    } else {
      return 'white';
    }
  }};
`;

const ConfigModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  background-color: white;
  box-shadow: 6px 5px 17px 5px rgba(0, 0, 0, 0.21);
  padding: 20px;
`;

const ConfigTitle = styled.h2``;

const ConfigBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfigRow = styled.div`
  display: flex;
  margin: 10px 0;
`;

const History = styled.div`
  position: fixed;
  right: 50px;
  border: solid 1px;
  height: 300px;
  width: 300px;
  overflow-x: hidden; 
  text-align: center;
  overflow-y: auto;
  table {
    width: 100%;
  }

  table,
  th,
  td {
    border-collapse: collapse;
  }
  th,
  td {
    border-bottom: 1px solid black;
    padding: 5px;
    text-align: center;
  }
`;

const HistoryDisplay = styled.div`
  font-weight: bold;
  border-bottom: 1px solid;
  padding: 5px;
`;


const TotalTime = styled.div`
  font-weight: bold;
  border-bottom: 1px solid;
  padding 5px;
`;

export const Game = () => {
  const [initBoardLayout, setInitBoardLayout] = React.useState(BOARD_LAYOUT_NAMES.GERMAN_DAISY);
  const [gameState, setGameState] = React.useState(BOARD_LAYOUTS.BLANK);
  const [legalMoves, setLegalMoves] = React.useState([]);
  const [turn, setTurn] = React.useState(BLK);
  const [AIColour, setAIColour] = React.useState(BLK);
  const [gameMode, setGameMode] = React.useState(GAME_MODE.VSCOMPUTER);
  const [moveLimit] = React.useState(DEFAULT_MOVE_LIMIT);
  const [historyEntries, setHistoryEntries] = React.useState([]);
  // Total calculation time for AI in seconds
  const [totalTime] = React.useState(0);
  const [timeTakenForLastMove, setTimeTakenForLastMove] = React.useState(0);
  const [numTurns, setNumTurns] = React.useState(1);
  const [timeLimitInSecondsWhite] = React.useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [timeLimitInSecondsBlack] = React.useState(DEFAULT_TIME_LIMIT_IN_SECONDS);
  const [isConfigModalShown, setIsConfigModalShown] = React.useState(true);
  const [selectedMarbles, setselectedMarbles] = React.useState(new Set());
  const [firstTurn, setFirstTurn] = React.useState(true);
  const score = 0; // ???

  React.useEffect(() => {
    if (!isConfigModalShown) {

      // State and Player colour
      // const coords = convertGameStateToCordinateArray(gameState);
      // createInitialState(coords);
      // // replace with api call for all moves.
      // const moves = generateMoves(mapToColour(turn), coords);
      // setLegalMoves(moves);
        const req = new XMLHttpRequest();
        const queryString = `?state=${JSON.stringify(gameState)}&colour=${turn}`;
        req.open('GET', 'http://localhost:5000/allmoves' + queryString);
        req.onreadystatechange = () => {
          if (req.readyState === 4 && req.status === 200) {
            setLegalMoves(JSON.parse(req.responseText));
          }
        };
        req.send();
        if (firstTurn) {
          // ------------random move function goes here ----------
          setFirstTurn(false);
          console.log("random move generated")
        } else if (turn === AIColour) {
          // replace 
          // let colour = convertColourValueToString(AIColour);
          // const move = Alpha_Beta_Search(gameState, colour);
          const req = new XMLHttpRequest();
          const queryString = `?state=${JSON.stringify(gameState)}&colour=${turn}`;
          req.open('GET', 'http://localhost:5000/bestmoves' + queryString);
          req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
              console.log((JSON.parse(req.responseText)));
            }
          };
          req.send();
          console.log(move);
        }
      }
    }, [gameState]);

  const handleInitBoardLayoutChange = (e) => {
    setInitBoardLayout(parseInt(e.target.value));
  };

  const handleGameModeChange = (e) => {
    setGameMode(parseInt(e.target.value));
  };

  const handleGameStateChange = (newGameState) =>  {
    setGameState(newGameState);
  };

  const handleAIColourChange = (e) => {
    setAIColour(parseInt(e.target.value));
  };

  const onPlayClick = () => {
    setIsConfigModalShown(false);
    if (initBoardLayout === BOARD_LAYOUT_NAMES.STANDARD) {
      handleGameStateChange(BOARD_LAYOUTS.STANDARD);
    } else if (initBoardLayout === BOARD_LAYOUT_NAMES.BELGIAN_DAISY) {
      handleGameStateChange(BOARD_LAYOUTS.BELGIAN_DAISY);
    } else if (initBoardLayout === BOARD_LAYOUT_NAMES.GERMAN_DAISY) {
      handleGameStateChange(BOARD_LAYOUTS.GERMAN_DAISY);
    }
  };

  const getPosition = (position, direction) => {
    const row = position[0];
    const col = parseInt(position[1]);

    let newrow = row;
    let newcol = col;
    const ascii = row.charCodeAt(0);
    let newascii = ascii;

    switch (direction) {
      case DIRECTION.E:
        newcol = col + 1;
        break;
      case DIRECTION.W:
        newcol = col - 1;
        break;
      case DIRECTION.NE:
        newascii = ascii + 1;
        newcol = col + 1;
        break;
      case DIRECTION.NW:
        newascii = ascii + 1;
        break;
      case DIRECTION.SE:
        newascii = ascii - 1;
        break;
      case DIRECTION.SW:
        newascii = ascii - 1;
        newcol = col - 1;
        break;
    }
    newrow = String.fromCharCode(newascii);
    if (newascii > 96 && newascii < 107 && gameState[newrow][newcol] !== undefined) {
      return `${newrow}${newcol}`;
    } else {
      return null;
    }
  };

  const getDirection = (position1, position2) => {
    const pos1row = position1[0];
    const pos1col = parseInt(position1[1]);
    const pos2row = position2[0];
    const pos2col = parseInt(position2[1]);

    const rowDiff = pos1row.charCodeAt(0) - pos2row.charCodeAt(0);
    const colDiff = pos1col - pos2col;

    if (rowDiff === -1 && colDiff === 0) {
      return DIRECTION.NW;
    } else if (rowDiff === -1 && colDiff === -1) {
      return DIRECTION.NE;
    } else if (rowDiff === 0 && colDiff === -1) {
      return DIRECTION.E;
    } else if (rowDiff === 0 && colDiff === 1) {
      return DIRECTION.W;
    } else if (rowDiff === 1 && colDiff === 1) {
      return DIRECTION.SW;
    } else if (rowDiff === 1 && colDiff === 0) {
      return DIRECTION.SE;
    }
  };

  const isNeighbor = (position1, position2) => {
    return getDirection(position1, position2) !== undefined;
  };

  const isFriendly = (position1, position2) => {
    return (
      gameState[position1[0]][parseInt(position1[1])] ===
      gameState[position2[0]][parseInt(position2[1])]
    );
  };

  const getMarblePositionBetween = (position1, position2) => {
    const pos1row = position1[0].charCodeAt(0);
    const pos1col = parseInt(position1[1]);
    const pos2row = position2[0].charCodeAt(0);
    const pos2col = parseInt(position2[1]);

    if (Math.abs(pos1row - pos2row) === 2) {
      if (pos1col > pos2col && pos1col - pos2col === 2) {
        return `${String.fromCharCode(pos1row - 1)}${pos1col - 1}`;
      } else if (pos1col < pos2col && pos2col - pos1col === 2) {
        return `${String.fromCharCode(pos2row - 1)}${pos2col - 1}`;
      } else if (pos1col === pos2col && pos1row > pos2row) {
        return `${String.fromCharCode(pos1row - 1)}${pos1col}`;
      } else if (pos1col === pos2col && pos2row > pos1row) {
        return `${String.fromCharCode(pos2row - 1)}${pos1col}`;
      }
    } else if (pos1row === pos2row) {
      if (pos1col > pos2col && pos1col - pos2col === 2) {
        return `${position1[0]}${pos1col - 1}`;
      } else if (pos1col < pos2col && pos2col - pos1col === 2) {
        return `${position1[0]}${pos2col - 1}`;
      }
    }
    return null;
  };

  const onMarbleClick = (row, col) => {
    if (gameState[row][col] === turn) {
      // Push opponent Marble logic
      if (selectedMarbles.size > 1) {
        setselectedMarbles(new Set());
        return;
      }
      if (selectedMarbles.has(`${row}${col}`)) {
        setselectedMarbles(new Set());  
        return;
      }
      const newselectedMarbles = new Set(selectedMarbles);
      if (selectedMarbles.size === 1) {
        const selectedMarble = Array.from(selectedMarbles)[0];
        const posBetween = getMarblePositionBetween(selectedMarble, `${row}${col}`);
        if (posBetween !== null && isFriendly(selectedMarble, posBetween)) {
          newselectedMarbles.add(posBetween);
        } else if (!isNeighbor(Array.from(selectedMarbles)[0], `${row}${col}`)) {
          setselectedMarbles(new Set([`${row}${col}`]));
          return;
        }
      }
      newselectedMarbles.add(`${row}${col}`);
      setselectedMarbles(newselectedMarbles);
    } else {
      const moves = getLegalMoveInfo(legalMoves, selectedMarbles);
      if (moves.length !== 0) {
        console.log(moves);

        const dir = parseInt(prompt(moves.join(' / ')) -1);
        // if empty string then continue.
        if (isNaN(dir)) {
          console.log("user cancelled");
          return;
        }
        try {
          // If the user enter in like 124 when there are only 2 moves, catch the error and let them try again.
          let move;
          try {
            move = moves[dir].split(' ');
          } catch(err) {
            console.log(err)
            console.log("invalid input");
            return;
          }

          const req = new XMLHttpRequest();
          const queryString = `?state=${JSON.stringify(gameState)}&move=${moves[dir]}&side=${turn}`;
          req.open('GET', 'http://localhost:5000/state' + queryString);
          req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
              console.log((JSON.parse(req.responseText)));
              setGameState(JSON.parse(req.responseText));
            }
          };
          req.send();

        // ---------------------------------------------------
        // const nextBoardConfig = getNextBoardConfiguration(
        //   gameState,
        //   moves[dir].split(' '),
        //   mapToColour(turn)
        // );
        // const newGameState = coordinatesToGameState(nextBoardConfig);
        // -------------------------------------------------------------

        // ------------
        // This will be a request, and this function will be the callback, instead of newGameState, it will be the response.
  
        // ------------

        setselectedMarbles(new Set());
        setTurn(turn === BLK ? WHT : BLK);
        addHistoryEntry({
          numTurn: numTurns,
          playerColour: turn,
          move: moves[dir],
          timeTaken: timeTakenForLastMove
        });
        setNumTurns(numTurns + 1);
        console.log(historyEntries);
        } catch(err) {
          console.log("not a valid option");
          console.log(err);
          return;
        }
      }
    }
  };


  const historyEntryRender = () => 
    historyEntries.map((entry) => 
      <tr key={entry.numTurn}>
        <td>{entry.numTurn}</td>
        <td>{entry.playerColour === BLK ? "Black" : "White"}</td>
        <td>{entry.move}</td>
        <td>{entry.playerColour !== AIColour ? 0 : entry.timeTaken}</td>
      </tr>
    );

    const addHistoryEntry = (newEntry) => {
      if (historyEntries.length === 0) {
        setHistoryEntries([newEntry]);
      } else {
        setHistoryEntries([...historyEntries, newEntry]);
      }
    }

  return (
    <Wrapper>
      <ConfigModal
        open={isConfigModalShown}
        onClose={() => {}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Paper>
          <ConfigTitle>Game Configuration</ConfigTitle>
          <ConfigBody>
            <FormLabel component="legend">Board Layout</FormLabel>
            <ConfigRow row>
              <RadioGroup row value={initBoardLayout} onChange={handleInitBoardLayoutChange}>
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.STANDARD}
                  control={<Radio />}
                  label="Standard"
                />
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.GERMAN_DAISY}
                  control={<Radio />}
                  label="German Daisy"
                />
                <FormControlLabel
                  value={BOARD_LAYOUT_NAMES.BELGIAN_DAISY}
                  control={<Radio />}
                  label="Belgian Daisy"
                />
              </RadioGroup>
            </ConfigRow>
            <FormLabel component="legend">AI Marble Colour</FormLabel>
            <ConfigRow>
              <RadioGroup row value={AIColour} onChange={handleAIColourChange}>
                <FormControlLabel value={BLK} control={<Radio />} label="Black"/>
                <FormControlLabel value={WHT} control={<Radio />} label="White"/>
              </RadioGroup>
            </ConfigRow>
            <FormLabel component="legend">Movement Settings</FormLabel>
            <ConfigRow style={{ justifyContent: 'space-between' }}>
              <TextField
                label="Move Limit"
                variant="filled"
                size="small"
                defaultValue={moveLimit}
              />
            </ConfigRow>
            <FormLabel component="legend">Timing (In Seconds)</FormLabel>
            <ConfigRow>
            <TextField
                label="Time Limit (White Player)"
                variant="filled"
                size="small"
                defaultValue={timeLimitInSecondsWhite}
              />
              <TextField
                label="Time Limit (Black Player)"
                variant="filled"
                size="small"
                defaultValue={timeLimitInSecondsBlack}
              />
            </ConfigRow>
            <ConfigRow>
              <Button onClick={onPlayClick} variant="contained" color="secondary" fullWidth>
                PLAY
              </Button>
            </ConfigRow>
            <FormLabel component="legend">State Generation</FormLabel>
            <ConfigRow>
              <InputFile />
            </ConfigRow>
          </ConfigBody>
        </Paper>
      </ConfigModal>
      <ButtonContainer />
      <BoardContainer>
        <Board>
          {Object.keys(gameState).map((k) => (
            <BoardRow key={k}>
              {Object.keys(gameState[k]).map((col) => (
                <BoardTile
                  key={`${k}${col}`}
                  for={gameState[k][col]}
                  selected={selectedMarbles.has(`${k}${col}`)}
                  onClick={() => onMarbleClick(k, col)}>
                  {`${k}${col}`}
                </BoardTile>
              ))}
            </BoardRow>
          ))}
        </Board>
      </BoardContainer>
      <History>
      <HistoryDisplay>History</HistoryDisplay>
              <TotalTime><span>Total Time ({AIColour === 1 ? "Black" : "White"}):</span></TotalTime>
        <table>
        <thead>
          <th>Turn</th>
          <th>Player</th>
          <th>Move</th>
          <th>Time</th>
        </thead>
          <tbody>
            {historyEntryRender()}
          </tbody>
        </table>
      </History>
    </Wrapper>
  );
};


// const HistoryComponent = () => {

//   let state = [
//     {numTurn: 1, playerColour: "Black", move: "INLINE B3C3 SW", timeTaken: 10},
//   ];

//   const historyEntryRender = () => 
//     state.map((entry) => 
//       <tr key={entry}>
//         <td>{entry.numTurn}</td>
//         <td>{entry.playerColour}</td>
//         <td>{entry.move}</td>
//         <td>{entry.timeTaken}</td>
//       </tr>
//     );

//     const addHistoryEntry = (newEntry) => {
//       state = [...state, newEntry];
//     }

//   return (
//     <tbody>
//       {historyEntryRender()}
//     </tbody>
//   );
// }