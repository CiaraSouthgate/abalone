import React from 'react';
import { Button } from '@material-ui/core';
import { downloadTextfile, parseInputFile } from '../state_generation';

export const InputFile = () => {
  const inputRef = React.createRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    parseInputFile((testName, data) => {
      // Download output file for states
      downloadTextfile(data[0], `${testName}.board`);
      // Download output file for moves
      downloadTextfile(data[1], `${testName}.move`);
    });
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <input type="file" name="input file" id="input" ref={inputRef} />
      <Button type="submit">Do State Generation</Button>
    </form>
  );
};
