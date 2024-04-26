import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

        const linkElement = screen.getByText(/Modos de juego:/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("game modes",async () => {
        render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );

        const gamesBT = document.getElementsByClassName('modes')
        expect(gamesBT).toHaveLength(1);
    });

    test('fetches topics and navigates to game configuration', async () => {
        render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );

        const topicsData = [{ id: 1, name: 'Topic 1' }, { id: 2, name: 'Topic 2' }];
        axios.get.mockResolvedValueOnce({ data: topicsData });
        const mockNavigation = jest.fn();
        const location = { state: { topics: topicsData } };
        
        fireEvent.click(screen.getByText('Clásico'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(`${apiEndpoint}/topics`);
            expect(mockNavigation).toHaveBeenCalledWith('/gameConfiguration', location);
        });
    });

});