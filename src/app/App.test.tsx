import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('routing smoke test', () => {
  it('loan page should calculate and show a result', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/loan']}>
        <App />
      </MemoryRouter>
    );

    const principal = screen.getByLabelText('مبلغ وام (تومان)');
    await user.clear(principal);
    await user.type(principal, '120000000');

    const annualRate = screen.getByLabelText('نرخ سود سالانه (درصد)');
    await user.clear(annualRate);
    await user.type(annualRate, '0');

    const months = screen.getByLabelText('مدت (ماه)');
    await user.clear(months);
    await user.type(months, '12');

    await user.click(screen.getByRole('button', { name: 'محاسبه' }));

    expect(await screen.findByText('نتیجه')).toBeInTheDocument();
    expect(await screen.findByText(/قسط ماهانه/)).toBeInTheDocument();
  });
});
