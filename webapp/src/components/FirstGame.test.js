import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import Quiz from './FirstGame'; // Asegúrate de importar correctamente tu componente Quiz
import { BrowserRouter as Router } from 'react-router-dom';
import { ContextFun } from './Context';

beforeEach(() => {
    
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
      state: {
        questions: [
          {
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
          },
          {
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
          }
        ],
        gameId: '123456',
      }
    })
}));

const questions = [
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  }
];

const state = {
  questions: questions,
  gameId: '123456',
};

describe('Quiz Component', () => { 
    jest.setTimeout(13000);
    it('selects the correct answer', async () => {    
        const { getByText, getByTestId } = render(<ContextFun>
            <Router>
              <Quiz />
            </Router>
            </ContextFun>, { initialState: { state } });
    
        // Wait for questions to load
        await waitFor(() => getByText('What is 2 + 2?'));
    
        // Select the correct answer and check if it's green
        fireEvent.click(getByText('4'));
        expect(getByText('4')).toHaveStyle('background-color: green');
        await new Promise((r) => setTimeout(r, 2000));
        expect(getByText('4')).toHaveStyle('background-color: #1a1a1a')
      });
    

  it('selects a wrong answer', async () => {
    

    const { getByText, getByTestId } = render(<ContextFun>
        <Router>
          <Quiz />
        </Router>
        </ContextFun>, { initialState: { state } });

    // Wait for questions to load
    await waitFor(() => getByText('What is 2 + 2?'));

    // Select the correct answer and check if it's green
    fireEvent.click(getByText('5'));
    expect(getByText('5')).toHaveStyle('background-color: red');
    await new Promise((r) => setTimeout(r, 2000));
    expect(getByText('5')).toHaveStyle('background-color: #1a1a1a')


  });

});

