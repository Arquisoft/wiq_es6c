import { render, screen } from '@testing-library/react';
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
    });

    test("check number of elements on topics section and configure number of questions",async () => {

        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );

        let tematics = document.getElementsByClassName('configureTopic');
        expect(tematics).toHaveLength(1);

        let numPreguntas = document.getElementsByClassName('configureNumberOfQuestions');
        expect(tematics).toHaveLength(2);
    });

});

