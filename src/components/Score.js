import React from 'react';

export const Score = ({ blackScore, whiteScore }) => {
  return (
    <div className="infoContainer">
      <div className="infoTitle">Score</div>
      <table>
        <thead>
          <tr>
            <td>White</td>
            <td>Black</td>
          </tr>
        </thead>
        <tr>
          <td>{whiteScore}</td>
          <td>{blackScore}</td>
        </tr>
      </table>
    </div>
  );
};
