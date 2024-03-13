import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FirstGame from './FirstGame';
import { ContextFun } from './Context';
import { BrowserRouter as Router } from 'react-router-dom';


test('renders learn react link', () => {
    render(
    <ContextFun>
      <Router>
        <FirstGame />
      </Router>
    </ContextFun>
    );
    const linkElement = screen.getByText(/¿Cual es/i);
    expect(linkElement).toBeInTheDocument();
  });