import { render, screen } from '@testing-library/react';
import App from './App';
import { Context } from './components/Context';
import { Router } from 'react-router-dom';


test('renders learn react link', () => {
  render(
  <Context>
    <Router>
      <App />
    </Router>
  </Context>
  );
  const linkElement = screen.getByText(/Welcome to wiq_0/i);
  expect(linkElement).toBeInTheDocument();
});
