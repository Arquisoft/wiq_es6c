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
        linkElement = screen.getByText(/Comenzar Juego/i);
        expect(linkElement).toBeInTheDocument();

        let tematics = document.getElementsByClassName('configureTopic');
        expect(tematics).toHaveLength(1);

        let numPreguntas = document.getElementsByClassName('configureNumberOfQuestions');
        expect(numPreguntas).toHaveLength(1);
    });

    test("modify number of questions and number of answers for game",async () => {
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );
        
        //NUMBER OF QUESTIONS
        let input = document.getElementById('questionsSpinner');
        expect(input).toBeInTheDocument(); 
        expect(input.textContent).toBe("10");
        fireEvent.change(input, { target: { textContent: "1" } });
        expect(input.textContent).toBe("1");

        //NUMBER OF ANSWRES
        input = document.getElementById('answersSpinner');;
        expect(input).toBeInTheDocument(); 
        expect(input.textContent).toBe("2");
        fireEvent.change(input, { target: { textContent: "4" } });
        expect(input.textContent).toBe("4");
    });

    test('test por topics of questions', async () => {
        render(
            <ContextFun>
                <Router>
                    <GameConfiguration />
                </Router>
            </ContextFun>
        );

        //comprobamos que los elementos están correctamente 
        let div = document.getElementsByClassName('configureTopic')[0];
        let divChild = div.childNodes;
        expect(divChild).toHaveLength(2);
        //Probamos a marcar la primera temática
        let topic1 = document.getElementById('t0');
        expect(topic1).toHaveAttribute('type', 'checkbox');
        expect(topic1).not.toBeChecked();
        fireEvent.click(topic1);
        expect(topic1).toBeChecked();
        //Probamos a marcar la segunda temática
        let topic2 = document.getElementById('t1');
        expect(topic2).toHaveAttribute('type', 'checkbox');
        expect(topic2).not.toBeChecked();
        fireEvent.click(topic2);
        expect(topic2).toBeChecked();
        //Desmarcamos ambas 
        fireEvent.click(topic1);
        expect(topic1).not.toBeChecked();
        fireEvent.click(topic2);
        expect(topic2).not.toBeChecked();
    });
    
    test('init game', async () => {
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
    });

});

