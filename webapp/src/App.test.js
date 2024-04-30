import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ContextFun } from './components/Context';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders learn react link', () => {
  render(
  <ContextFun>
    <Router>
      <App />
    </Router>
  </ContextFun>
  );
  const linkElement = screen.getByText(/Bienvenido a WIQEII/i);
  expect(linkElement).toBeInTheDocument();
});

it('alternando entre las vistas de inicio de sesión y añadir usuario', () => {
  render(
    <ContextFun>
      <Router>
        <App />
      </Router>
    </ContextFun>
  );

  expect(screen.getAllByText('Iniciar sesión')).toHaveLength(2);
  fireEvent.click(screen.getByText('¿Todavía no tienes cuenta? Regístrate aquí.'));
  expect(screen.getByText('Registro')).toBeInTheDocument();
});

it('renders correct', () => {
  const { getByText } = render(
    <ContextFun>
      <Router>
        <App />
      </Router>
    </ContextFun>
    );

  expect(getByText('¿Todavía no tienes cuenta? Regístrate aquí.')).toBeInTheDocument();
  fireEvent.click(getByText('¿Todavía no tienes cuenta? Regístrate aquí.'));
  expect(getByText('¿Ya tienes una cuenta? Inicia sesión aquí.')).toBeInTheDocument();
});

it('hacemos clic en el enlace', () => {
  const { getByText } = render(
    <ContextFun>
      <Router>
        <App />
      </Router>
    </ContextFun>
    );

  fireEvent.click(getByText('¿Todavía no tienes cuenta? Regístrate aquí.'));
  expect(getByText('¿Ya tienes una cuenta? Inicia sesión aquí.')).toBeInTheDocument();
});
