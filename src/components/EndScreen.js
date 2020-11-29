import React, { useState } from 'react';
import {
    Button,
    FormControlLabel,
    FormLabel,
    Modal,
    Radio,
    RadioGroup,
    TextField
  } from '@material-ui/core';
  import styled from 'styled-components';
  import Paper from '@material-ui/core/Paper';


  const Row = styled.div`
  width: 300px;
  margin: 10px 0;
`;

  const Title = styled.div`
    text-align: center;
  `


  


export const EndScreen = ({isOpen, reason, whiteScore, blackScore}) => {



    const determineWinner = () => {
        if (whiteScore === blackScore) {
            return "TIE";
        }
        if (whiteScore > blackScore) {
            return "White"
        } else {
            return "Black"
        }
    }

    const restart = () => {
        document.location.reload();
    }

    return (
      <Modal className="configModal" open={isOpen}>
          <Paper className="configPaper">
            <Row>
                <Title><h2>Game Over!</h2></Title>
            </Row>
            <Row>
                <div>Winner: {determineWinner()}</div>
            </Row>
            <Row>
                <p>Reason: {reason}</p>
            </Row>
            <Row>
                
                <Title><h3>FINAL SCORES</h3></Title>
                <div>
                    <table>
                        <tr>
                            <td>Black</td>
                            <td>White</td>
                        </tr>
                        <tr>
                            <td>{blackScore}</td>
                            <td>{whiteScore}</td>
                        </tr>
                    </table>
                </div>
            </Row>

            <Title>
                <Button variant="contained" color="secondary" onClick={restart}>Start New Game</Button>
            </Title>

          </Paper>
      </Modal>
    );
  };
  