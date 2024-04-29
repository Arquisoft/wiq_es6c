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
  const linkElement = screen.getByText(/Welcome to wiq_0/i);
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

  expect(screen.getAllByText('Login')).toHaveLength(2);
  fireEvent.click(screen.getByText('Don\'t have an account? Register here.'));
  expect(screen.getByText('Añadir Usuario')).toBeInTheDocument();
});

it('renders correct', () => {
  const { getByText } = render(
    <ContextFun>
      <Router>
        <App />
      </Router>
    </ContextFun>
    );

  expect(getByText('Don\'t have an account? Register here.')).toBeInTheDocument();
  fireEvent.click(getByText('Don\'t have an account? Register here.'));
  expect(getByText('Already have an account? Login here.')).toBeInTheDocument();
});

it('hacemos clic en el enlace', () => {
  const { getByText } = render(
    <ContextFun>
      <Router>
        <App />
      </Router>
    </ContextFun>
    );

  fireEvent.click(getByText('Don\'t have an account? Register here.'));
  expect(getByText('Already have an account? Login here.')).toBeInTheDocument();
});
