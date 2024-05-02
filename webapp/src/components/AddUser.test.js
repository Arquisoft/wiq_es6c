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

    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getAllByLabelText(/Contraseña/i)[0];
    const confirmPasswordInput = screen.getByLabelText(/Repetir contraseña/i);
    const addUserButton = document.getElementsByClassName('inner')[0];

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUsera' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassw' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassw' } });

    // Probamos a poner una contraseña corta 
    fireEvent.click(addUserButton);
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas deben contener al menos una letra mayúscula, una letra minúscula y un número, y tener más de 8 caracteres./i)).toBeInTheDocument();
    });

    //Modificamos la contraseña para que contenga al menos de 8 caracteres y un numero
    fireEvent.change(passwordInput, { target: { value: 'testPassw2' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassw2' } });
    fireEvent.click(addUserButton);
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
      expect(screen.getByText(/Todos los campos deben de estar rellenos./i)).toBeInTheDocument();
    });
  });

  it('try to add user but different passwords', async () => {
    render(<AddUser />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'userForTest' } });
    fireEvent.change(screen.getAllByLabelText(/Contraseña/i)[0], { target: { value: 'testPassword2' } });
    fireEvent.change(screen.getByLabelText(/Repetir contraseña/i), { target: { value: 'password' } });

    // Trigger the add user button click
    fireEvent.click(document.getElementsByClassName('inner')[0]);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden./i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    render(<AddUser />);
    
    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'a' } });
    fireEvent.change(screen.getAllByLabelText(/Contraseña/i)[0], { target: { value: 'testPassword2' } });
    fireEvent.change(screen.getByLabelText(/Repetir contraseña/i), { target: { value: 'testPassword2' } });

    // Trigger the add user button click
    fireEvent.click(document.getElementsByClassName('inner')[0]);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Usuario ya registrado./i)).toBeInTheDocument();
    });
  });
});
