import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import { Menu } from './Menu';

const mockAxios = new MockAdapter(axios);

describe("Menu component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    /* test("renders menu",async () => {

        render(
            <ContextFun>
                <Router>
                    <Menu/>
                </Router>
            </ContextFun>
        );

        
    }); */

    test("renders component",async () => {
        render(
            <MemoryRouter>
                <Menu/>
            </MemoryRouter>);
        
        await act(async () => {});

        expect(screen.getByText(/Cómo jugar/i)).toBeInTheDocument();

        // const linkElement = screen.getByText(/Cómo jugar/i);
        // expect(linkElement).toBeInTheDocument();

    });

});