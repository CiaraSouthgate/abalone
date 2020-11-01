import React from 'react';
import { Pause } from './Buttons/Pause';
import { Start } from './Buttons/Start';
import { Stop } from './Buttons/Stop';
import { Undo } from './Buttons/Undo';
import { Reset } from './Buttons/Reset';
import styled from 'styled-components';


const ButtonContainer = () => {

    const Container = styled.div`
        display: flex;
        align-itmes: center;
        justify-content: center;
        margin-top: 10px;
    `;

    return (
        <Container>
            <Start/>
            <Stop/>
            <Reset/>
            <Pause/>
            <Undo/>
        </Container>
    );
};

export { ButtonContainer };