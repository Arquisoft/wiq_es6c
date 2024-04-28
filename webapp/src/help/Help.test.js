import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
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

    test("renders GameConfig",async () => {
        render(
            <ContextFun>
                <Router>
                    <Help/>
                </Router>
            </ContextFun>
        );

        expect(screen.getByText(/Cómo jugar/i)).toBeInTheDocument();
        const preElements = document.getElementsByTagName('pre');
        expect(preElements.length).toBe(3);
        expect(preElements[0]).toHaveTextContent('Cuando inicies');
        expect(preElements[1]).toHaveTextContent('Cada vez que');
        expect(preElements[2]).toHaveTextContent('¡Demuestra');
        const ulElements = document.getElementsByTagName('ul');
        expect(ulElements.length).toBe(1);
        const liElements = document.getElementsByTagName('li');
        expect(liElements.length).toBe(4);
        expect(screen.getByText(/¡Demuestra tus conocimientos!/i)).toBeInTheDocument();
    });   

});

