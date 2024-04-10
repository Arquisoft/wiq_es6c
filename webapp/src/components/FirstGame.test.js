import { render, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {MemoryRouter} from 'react-router-dom';
import FirstGame from './FirstGame';
import Menu from './Menu';

const mockAxios = new MockAdapter(axios);

describe("First game component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("one question -> 4 possible answers",async () => {
        render(
            <MemoryRouter>
                <Menu />
            </MemoryRouter>
        );

        const classicGame = document.getElementsByClassName('modes')[0];
        // Simulate new Classic Game
        await act(async () => {
            fireEvent.click(classicGame);
        });

        const gamesBT = document.getElementsByClassName('allAnswers');
        expect(gamesBT).toHaveLength(4);
    });

});