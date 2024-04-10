import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {MemoryRouter} from 'react-router-dom';
import Menu from './Menu';

const mockAxios = new MockAdapter(axios);

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

        const linkElement = screen.getByText(/Cómo jugar/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("game modes",async () => {
        render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );

        const gamesBT = document.getElementsByClassName('modes')
        expect(gamesBT[0].text).toBeInTheDocument();
    });

});