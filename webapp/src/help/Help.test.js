import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Help from './Help';
import { ContextFun } from '../components/Context';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

describe("Help for game", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders Help",async () => {
        render(
            <ContextFun>
                <Router>
                    <Help/>
                </Router>
            </ContextFun>
        );

        expect(screen.getByText(/Cómo jugar/i)).toBeInTheDocument();

        expect(screen.getByText(/Clásico/i)).toBeInTheDocument();
        expect(screen.getByText(/¡Demuestra tus conocimientos!/i)).toBeInTheDocument();

        expect(screen.getByText(/Calculadora humana/i)).toBeInTheDocument();
        expect(screen.getByText(/¿Te atreves a poner a prueba tus habilidades de cálculo mental?/i)).toBeInTheDocument();
    
        const pElements = document.getElementsByTagName('p');
        expect(pElements.length).toBe(7);
        const ulElements = document.getElementsByTagName('ul');
        expect(ulElements.length).toBe(3);
        const liElements = document.getElementsByTagName('li');
        expect(liElements.length).toBe(13);
    });   

});

