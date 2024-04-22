import { render, screen, fireEvent } from '@testing-library/react';
import { ContextFun } from '../Context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { Nav } from './Nav';

const mockAxios = new MockAdapter(axios);

describe("Nav component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders nav",async () => {

        render(
            <ContextFun>
                <Router>
                    <Nav/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/WIQ/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("renders nav, access to history",async () => {

        render(
            <ContextFun>
                <Router>
                    <Nav/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/Historial/i);
        fireEvent.click(linkElement);

        const textOnPage = screen.getByText(/Historial de/i);
        expect(textOnPage).toBeInTheDocument();
    });

});

