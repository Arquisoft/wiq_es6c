import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {MemoryRouter} from 'react-router-dom';
import Menu from './Menu';

const mockAxios = new MockAdapter(axios);
jest.mock('axios');

describe("Menu component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders menu",async () => {
        render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );

        //Comprobamos que esten todos los elementos 
        let linkElement = screen.getByText(/Modos de juego:/i);
        expect(linkElement).toBeInTheDocument();
        const gamesBT = document.getElementsByClassName('modes')[0].childNodes;
        expect(gamesBT).toHaveLength(2);
        linkElement = screen.getByText(/Clásico/i);
        expect(linkElement).toBeInTheDocument();
        linkElement = screen.getByText(/Calculadora Humana/i);
        expect(linkElement).toBeInTheDocument();
        
    });

});