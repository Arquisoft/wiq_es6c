import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { Menu } from './Menu';

const mockAxios = new MockAdapter(axios);

describe("Menu", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    

});