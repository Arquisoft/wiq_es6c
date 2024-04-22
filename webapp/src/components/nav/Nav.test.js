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

    test("renders nav, label history",async () => {

        render(
            <ContextFun>
                <Router>
                    <Nav/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/Historial/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("renders nav, label appQuestion",async () => {

        render(
            <ContextFun>
                <Router>
                    <Nav/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/Almacén de preguntas/i);
        expect(linkElement).toBeInTheDocument();
    });

});

