import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Menu from './Menu';

jest.mock('axios');

describe('Menu component', () => {

    beforeEach(() => {
        axios.get.mockClear();
    });

    test('busca temas cuando pulsamos en el juego "clásico"', async () => {
        const topicsData = [{ id: 1, name: 'Topic 1' }, { id: 2, name: 'Topic 2' }];
        axios.get.mockResolvedValueOnce({ data: topicsData });

        const { getByText } = render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );
        fireEvent.click(getByText('Clásico'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/topics');
        });
    });

    test('vamos a GameConfiguration despues de establecer temas', async () => {
        const topicsData = [{ id: 1, name: 'Topic 1' }, { id: 2, name: 'Topic 2' }];
        axios.get.mockResolvedValueOnce({ data: topicsData });

        const { getByText } = render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );
        fireEvent.click(getByText('Clásico'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/topics');
        });

        expect(window.location.pathname).toBe('/');
    });

    test('gestiona error en la busqueda de temas', async () => {
        const errorMessage = 'Network Error';
        axios.get.mockRejectedValueOnce(new Error(errorMessage));

        const { getByText } = render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );
        fireEvent.click(getByText('Clásico'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/topics');
        });
    });

    test('probamos a empezar el juego de la calculadora humana (este no realiza llamadas a la api)', async () => {
        const { getByText } = render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );
        fireEvent.click(getByText('Calculadora Humana'));
    
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(0); 
        });
    });

});
