import React from 'react';
import { BLK } from '../constants';

export const History = ({ aiColour, totalTime, historyEntries }) => {
  return (
    <div className="infoContainer history">
      <div className="infoTitle">History</div>
      <div className="totalTime">
        <span>
          Total Time ({aiColour === BLK ? 'Black' : 'White'}): {totalTime}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Turn</th>
            <th>Player</th>
            <th>Move</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {historyEntries.map((entry, i) => (
            <tr key={i}>
              <td>{entry.numTurn}</td>
              <td>{entry.playerColour === BLK ? 'Black' : 'White'}</td>
              <td>{entry.move}</td>
              <td>{entry.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
