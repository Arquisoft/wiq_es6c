import { render, screen, fireEvent } from '@testing-library/react';
import { ContextFun } from './Context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import FirstGame from './FirstGame';
import GameConfiguration from './game/GameConfiguration';

const mockAxios = new MockAdapter(axios);

describe("First game component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("one question -> 4 possible answers",async () => {
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );

        //Marcar la primera temática
        let topic1 = document.getElementById('t0');
        fireEvent.click(topic1);
        expect(topic1).toBeChecked();
        //Iniciamos el juego 
        let bt = screen.getByText('Comenzar Juego');
        fireEvent.click(bt);  
        //comprobamos que haya 2 botones para responder
        const gamesBT = document.getElementsByClassName('allAnswers');
        //expect(gamesBT).toHaveLength(2);
    });

});