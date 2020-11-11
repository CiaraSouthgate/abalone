import React from 'react';
import { parseInputFile } from '../state_generation';
import { Button } from '@material-ui/core';

export const InputFile = () => {
  const inputRef = React.createRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    parseInputFile(inputRef.current.files[0]);
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <input type="file" name="input file" id="input" ref={inputRef} />
      <Button type="submit">Do State Generation</Button>
    </form>
  );
};
