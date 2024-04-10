import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {MemoryRouter} from 'react-router-dom';
import FirstGame from './FirstGame';

const mockAxios = new MockAdapter(axios);

describe("First game component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("one question -> 4 possible answers",async () => {
        render(
            <MemoryRouter>
                <FirstGame />
            </MemoryRouter>
        );

        const gamesBT = document.getElementsByClass('allAnswers');
        expect(gamesBT).toHaveLength(4);
    });

});