import { render, screen } from '@testing-library/react';
import { ContextFun } from './Context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { Menu } from './Menu';

const mockAxios = new MockAdapter(axios);

describe("Menu component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders menu",async () => {

        render(
            <ContextFun>
                <Router>
                    <Menu/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/Cómo jugar/i);
        expect(linkElement).toBeInTheDocument();
        
    });

});