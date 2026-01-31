import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('routing smoke test', () => {
  it('loan page should load and show title', () => {
    render(
      <MemoryRouter initialEntries={['/loan']}>
        <App />
      </MemoryRouter>,
    );

    // Check if the page title is visible
    expect(screen.getByText('محاسبه‌گر اقساط و سود وام بانکی')).toBeInTheDocument();
  });
});
