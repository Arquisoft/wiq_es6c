import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import {MemoryRouter} from 'react-router-dom';
import { render, screen, waitFor,} from '@testing-library/react';


jest.mock("axios")
//const mockAxios = new MockAdapter(axios);

describe('App', () => {
  
  beforeEach(async() => {
    const mockQuestions = Array.from({ length: 20 }, (_, index) => ({
      _id: String(index + 1),
      pregunta: `Question ${index + 1}`,
      respuesta_correcta: 'Answer 1',
      respuestas_incorrectas: ['Answer 2', 'Answer 3', 'Answer 4'],
      createdAt: '05/04/2024',
    }));

    // Simula la respuesta de la petición GET
    axios.get.mockResolvedValueOnce({ data: mockQuestions });
  });

  test('renders the app title', async() => {
    await waitFor( () => render(<MemoryRouter><App /></MemoryRouter>));
    expect(screen.getByText('Almacén de preguntas')).toBeInTheDocument();
  });

  test('fetches and displays questions', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
      // Verifica que las preguntas se muestren en el componente
      expect(getByText('Question 1')).toBeInTheDocument();
      expect(getByText('Question 2')).toBeInTheDocument();
    });

    // Verifica que se haya llamado axios.get con el endpoint correcto
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/history/questions');
  });

  test('navigates to the next page', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
      expect(getByText('Question 1')).toBeInTheDocument();
      expect(getByText('Question 10')).toBeInTheDocument();
    });

    userEvent.click(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Question 11')).toBeInTheDocument();
      expect(getByText('Question 20')).toBeInTheDocument();
    });

    userEvent.click(getByText('Anterior'));

    await waitFor(() => {
      expect(getByText('Question 1')).toBeInTheDocument();
      expect(getByText('Question 10')).toBeInTheDocument();
    });

    userEvent.click(getByText('Última'));

    await waitFor(() => {
      expect(getByText('Question 11')).toBeInTheDocument();
      expect(getByText('Question 20')).toBeInTheDocument();
    });

    userEvent.click(getByText('Primera'));

    await waitFor(() => {
      expect(getByText('Question 1')).toBeInTheDocument();
      expect(getByText('Question 10')).toBeInTheDocument();
    });

  });

});

test('handles unknown error when fetching questions', async () => {
  const errorMessage = 'Error fetching questions';
  axios.get.mockRejectedValueOnce(new Error(errorMessage));

  render(<MemoryRouter><App /></MemoryRouter>);

  expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/history/questions');
});

test('handles error with response.data.error when fetching questions', async () => {
  const errorMessage = 'Error fetching questions';
  axios.get.mockRejectedValueOnce({ response: { data: { error: errorMessage } } });

  render(<MemoryRouter><App /></MemoryRouter>);

  expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/history/questions');
});