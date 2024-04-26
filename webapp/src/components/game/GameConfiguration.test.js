import { render, screen, fireEvent } from '@testing-library/react';
import { ContextFun } from '../Context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import GameConfiguration from './GameConfiguration';

const mockAxios = new MockAdapter(axios);

describe("Game Configuration", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders GameConfig",async () => {
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration/>
                </Router>
            </ContextFun>
        );

        let linkElement = screen.getByText(/Configuración de la partida/i);
        expect(linkElement).toBeInTheDocument();
        linkElement = screen.getByText(/Selecciona las temáticas/i);
        expect(linkElement).toBeInTheDocument();
        linkElement = screen.getByText(/Selecciona el número de preguntas/i);
        expect(linkElement).toBeInTheDocument();
        linkElement = screen.getByText(/Comenzar Juego/i);
        expect(linkElement).toBeInTheDocument();

        let tematics = document.getElementsByClassName('configureTopic');
        expect(tematics).toHaveLength(1);

        let numPreguntas = document.getElementsByClassName('configureNumberOfQuestions');
        expect(numPreguntas).toHaveLength(1);
    });

    test("modify number of questions for game",async () => {

        const { getByLabelText } = 
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );

        const input = getByLabelText('Número de preguntas:');
        fireEvent.change(input, { target: { value: '5' } });
        expect(input.value).toBe('5');
        // try to put number of questions = 0
        fireEvent.change(input, { target: { value: '0' } });
        expect(input.value).toBe('5');
        expect(screen.getAllByText(/El número de preguntas debe ser mayor que 0/i)[0]).toBeInTheDocument();
    });

    test("modify number of answers for game",async () => {

        const { getByLabelText } = 
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );

        const input = getByLabelText('Número de respuestas:');
        fireEvent.change(input, { target: { value: '5' } });
        expect(input.value).toBe('5');
        //try to put number of answers < 2
        fireEvent.change(input, { target: { value: '1' } });
        expect(input.value).toBe('5');
        expect(screen.getAllByText(/El número de respuestas debe ser mayor que 2/i)[0]).toBeInTheDocument();
    });

});

