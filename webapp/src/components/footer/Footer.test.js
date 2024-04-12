import { render, screen } from '@testing-library/react';
import { ContextFun } from '../Context';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { Footer } from './Footer';

const mockAxios = new MockAdapter(axios);

describe("Footer component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders footer",async () => {

        render(
            <ContextFun>
                <Router>
                    <Footer/>
                </Router>
            </ContextFun>
        );

        const linkElement = screen.getByText(/© WIQ ES06C/i);
        expect(linkElement).toBeInTheDocument();
    });

});