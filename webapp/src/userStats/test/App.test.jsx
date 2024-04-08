import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import {MemoryRouter} from 'react-router-dom';

jest.mock('axios');

describe('App', () => {
    beforeEach(() => {
        localStorage.setItem('username', 'testuser');
    })

    afterEach(() => {
        localStorage.removeItem('username');
    })

  it('should fetch and display games', async () => {
    const games = [
        { id: 1, username: 'testuser', points: 100, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [1,1] }], createdAt: "07/04/2024"},
        { id: 2, username: 'testuser', points: 0, questions: [{ title: 'Question 2', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [0,1] }], createdAt: "07/04/2024"}
    ];

    axios.get.mockResolvedValueOnce({ data: games });

    render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
        const elementos = screen.getAllByText('▼');

        // Haz clic en cada elemento encontrado
        elementos.forEach(elemento => {
        userEvent.click(elemento);
        });
    })

    await waitFor(() => {
      expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });
  });

  it('should navigate to next and previous pages', async () => {
    const games = Array.from({ length: 20 }, (_, index) => ({
        _id: String(index + 1),
        username: 'testuser', 
        points: 100, 
        questions: [
            {
                 title: `Question ${index+1}`, 
                 answers: ['Answer 1', 'Answer 2', 'Answer 3'], 
                 ansIndex: [1,1] 
            }
        ], 
        createdAt: "07/04/2024"
      }));

    axios.get.mockResolvedValueOnce({ data: games });

    render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
        const elementos = screen.getAllByText('▼');

        // Haz clic en cada elemento encontrado
        elementos.forEach(elemento => {
        userEvent.click(elemento);
        });
    })

    await waitFor(() => {  
      expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 10')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByText('Siguiente');
    const prevPageButton = screen.getByText('Anterior');
    const firstPageButton = screen.getByText('Primera');
    const lastPageButton = screen.getByText('Última');

    userEvent.click(nextPageButton);

    await waitFor(() => {
        expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
        expect(screen.getByText('Question 11')).toBeInTheDocument();
        expect(screen.getByText('Question 20')).toBeInTheDocument();
    });

    userEvent.click(prevPageButton);

    await waitFor(() => {
        expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Question 10')).toBeInTheDocument();
    });

    userEvent.click(lastPageButton);

    await waitFor(() => {
        expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
        expect(screen.getByText('Question 11')).toBeInTheDocument();
        expect(screen.getByText('Question 20')).toBeInTheDocument();
    });

    userEvent.click(firstPageButton);

    await waitFor(() => {
        expect(screen.getByText('Historial de testuser')).toBeInTheDocument();
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Question 10')).toBeInTheDocument();
    });
  });

  test('handles unknown error when fetching games', async () => {
    const errorMessage = 'Error fetching games';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    render(<MemoryRouter><App /></MemoryRouter>);
  
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/history/games/testuser');
  });
});