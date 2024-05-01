import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import {MemoryRouter} from 'react-router-dom';
import { render, screen, waitFor,} from '@testing-library/react';


jest.mock("axios")
//const mockAxios = new MockAdapter(axios);

describe('App', () => {
  
  beforeEach(async() => {
    const mockUser = Array.from({ length: 20 }, (_, index) => ({
      _id: String(index + 1),
      username: `User ${index + 1}`,
      tpoints: 100 + index,
      avgpoints:  100 + index,
      ttime:  100 - index,
      avgtime:  100 - index,
      createdAt: '05/04/2024',
    }));

    // Simula la respuesta de la petición GET
    axios.get.mockResolvedValueOnce({ data: mockUser });
  });

  test('renders the app title', async() => {
    await waitFor( () => render(<MemoryRouter><App /></MemoryRouter>));
    expect(screen.getAllByText('Almacén de usuarios')).toHaveLength(1);
  });

  test('fetches and displays users', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
      // Verifica que las preguntas se muestren en el componente
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 2')).toBeInTheDocument();
    });

    // Verifica que se haya llamado axios.get con el endpoint correcto
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8100/usersStats');
  });

  test('navigates to the next page', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);

    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });

    userEvent.click(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('User 11')).toBeInTheDocument();
      expect(getByText('User 20')).toBeInTheDocument();
    });

    userEvent.click(getByText('Anterior'));

    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });

    userEvent.click(getByText('Última'));

    await waitFor(() => {
      expect(getByText('User 11')).toBeInTheDocument();
      expect(getByText('User 20')).toBeInTheDocument();
    });

    userEvent.click(getByText('Primera'));

    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });

  });

  test('sorts users by username', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  
    userEvent.click(getByText('Nombre de Usuario'));
  
    await waitFor(() => {
      expect(getByText('User 10')).toBeInTheDocument();
      expect(getByText('User 11')).toBeInTheDocument();
    });
  });
  
  test('sorts users by tpoints', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  
    userEvent.click(getByText('Puntos totales'));
  
    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });
  });
  
  test('sorts users by avgpoints', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  
    userEvent.click(getByText('Puntos promedio'));

    await waitFor(() => {
      expect(getByText('User 11')).toBeInTheDocument();
      expect(getByText('User 20')).toBeInTheDocument();
    });
  });
  
  test('sorts users by ttime', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  
    userEvent.click(getByText('Tiempo Total'));
  
    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });
  });
  
  test('sorts users by avgtime', async () => {
    const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  
    userEvent.click(getByText('Tiempo promedio'));
  
    await waitFor(() => {
      expect(getByText('User 1')).toBeInTheDocument();
      expect(getByText('User 10')).toBeInTheDocument();
    });
  });

});

test('handles unknown error when fetching users', async () => {
  const errorMessage = 'Error fetching uers';
  axios.get.mockRejectedValueOnce(new Error(errorMessage));

  render(<MemoryRouter><App /></MemoryRouter>);

  expect(axios.get).toHaveBeenCalledWith('http://localhost:8100/usersStats');
});

test('handles error with response.data.error when fetching users', async () => {
  const errorMessage = 'Error fetching users';
  axios.get.mockRejectedValueOnce({ response: { data: { error: errorMessage } } });

  render(<MemoryRouter><App /></MemoryRouter>);

  expect(axios.get).toHaveBeenCalledWith('http://localhost:8100/usersStats');
});

