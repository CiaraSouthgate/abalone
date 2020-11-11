import React from 'react';
import { parseInputFile, downloadTextfile } from '../state_generation';
import { Button } from '@material-ui/core';

export const InputFile = () => {
  const inputRef = React.createRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = parseInputFile(inputRef.current.files[0]);
    // Download output file for states
    downloadTextfile(data[0], 'Test#.state');
    // Download output file for moves
    downloadTextfile(data[1], 'Test#.moves');
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <input type="file" name="input file" id="input" ref={inputRef} />
      <Button type="submit">Do State Generation</Button>
    </form>
  );
};
