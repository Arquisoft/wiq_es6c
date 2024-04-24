import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';

const mockAxios = new MockAdapter(axios);

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    render(<AddUser />);

    const nameInput = screen.getByLabelText(/Nombre/);
    const surnameInput = screen.getByLabelText(/Apellidos/i);
    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getAllByLabelText(/Contraseña/i)[0];
    const confirmPasswordInput = screen.getByLabelText(/Repetir contraseña/i);
    const addUserButton = document.getElementsByClassName('inner')[0]

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(surnameInput, { target: { value: 'testUser' } });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Usuario añadido correctamente/i)).toBeInTheDocument();
    });
  });

  it('try to add user but not introduce name', async () => {
    render(<AddUser />);

    const addUserButton = document.getElementsByClassName('inner')[0];

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Por favor, introduzca tanto el nombre como los apellidos./i)).toBeInTheDocument();
    });
  });

  it('try to add user but not introduce surname', async () => {
    render(<AddUser />);

    const nameInput = screen.getByLabelText(/Nombre/);
    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getAllByLabelText(/Contraseña/i)[0];
    const confirmPasswordInput = screen.getByLabelText(/Repetir contraseña/i);
    const addUserButton = document.getElementsByClassName('inner')[0]

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Por favor, introduzca tanto el nombre como los apellidos./i)).toBeInTheDocument();
    });
  });

  it('try to add user but different passwords', async () => {
    render(<AddUser />);

    const nameInput = screen.getByLabelText(/Nombre/);
    const surnameInput = screen.getByLabelText(/Apellidos/i);
    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getAllByLabelText(/Contraseña/i)[0];
    const confirmPasswordInput = screen.getByLabelText(/Repetir contraseña/i);
    const addUserButton = document.getElementsByClassName('inner')[0]

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(surnameInput, { target: { value: 'testUser' } });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden./i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    render(<AddUser />);

    const nameInput = screen.getByLabelText(/Nombre/);
    const surnameInput = screen.getByLabelText(/Apellidos/i);
    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getAllByLabelText(/Contraseña/i)[0];
    const confirmPasswordInput = screen.getByLabelText(/Repetir contraseña/i);
    const addUserButton = document.getElementsByClassName('inner')[0]

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(surnameInput, { target: { value: 'testUser' } });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument();
    });
  });
});
