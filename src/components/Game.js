import React from 'react';
import styled from 'styled-components';

const EMP = 0;
const MAX = 1;
const MIN = 2;
const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;
const MARGIN_SIZE = 1;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const BoardTile = styled.div`
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;
  border-radius: 50%;
  border: 2px solid black;
  margin: 0px ${MARGIN_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  background-color: ${(props) => {
    if (props.for === EMP) {
      return 'brown';
    } else if (props.for === MAX) {
      return 'black';
    } else {
      return 'white';
    }
  }};
`;

const Game = () => {
  const [gameState] = React.useState({
    i: { 5: MIN, 6: MIN, 7: EMP, 8: MAX, 9: MAX },
    h: { 4: MIN, 5: MIN, 6: MIN, 7: MAX, 8: MAX, 9: MAX },
    g: { 3: EMP, 4: MIN, 5: MIN, 6: EMP, 7: MAX, 8: MAX, 9: EMP },
    f: { 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    e: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP, 9: EMP },
    d: { 1: EMP, 2: EMP, 3: EMP, 4: EMP, 5: EMP, 6: EMP, 7: EMP, 8: EMP },
    c: { 1: EMP, 2: MAX, 3: MAX, 4: EMP, 5: MIN, 6: MIN, 7: EMP },
    b: { 1: MAX, 2: MAX, 3: MAX, 4: MIN, 5: MIN, 6: MIN },
    a: { 1: MAX, 2: MAX, 3: EMP, 4: MIN, 5: MIN }
  });

  return (
    <Wrapper>
      <Board>
        {Object.keys(gameState).map((k) => (
          <BoardRow key={k}>
            {Object.keys(gameState[k]).map((k2) => (
              <BoardTile key={`${k}${k2}`} for={gameState[k][k2]} />
            ))}
          </BoardRow>
        ))}
      </Board>
    </Wrapper>
  );
};

export default Game;
