import React from 'react';
import readInputFile from '../state_generation/input';

export const InputFile = () => {
  return (
    <div>
      <input type="file" name="input file" id="input"></input>
      <button onClick={readInputFile}>Do State Generation</button>
    </div>
  );
};
