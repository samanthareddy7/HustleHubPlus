
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import FreelancerIncome from '../pages/FreelancerIncome';
import { getFreelancerIncome } from '../services/api';

vi.mock('../services/api', () => ({
  getFreelancerIncome: vi.fn()
}));

const incomeData = {
  summary: {
    totalIncome: 1000,
    estimatedTax: 150,
    netIncome: 850
  },
  transactions: [
    {
      _id: 'transaction1',
      gig: {
        title: 'Logo Design',
        category: 'Graphic Design'
      },
      amount: 500,
      taxEstimated: 75,
      freelancerIncome: 425,
      status: 'Completed',
      createdAt: '2026-10-01T10:00:00.000Z'
    },
    {
      _id: 'transaction2',
      gig: {
        title: 'Website Development',
        category: 'Web Development'
      },
      amount: 500,
      taxEstimated: 75,
      freelancerIncome: 425,
      status: 'Pending',
      createdAt: '2026-10-02T10:00:00.000Z'
    }
  ]
};

describe('HustleHub+ Freelancer Income Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading while fetching income', () => {
    getFreelancerIncome.mockReturnValue(
      new Promise(() => {})
    );

    render(<FreelancerIncome />);

    expect(
      screen.getByText('Loading income information...')
    ).toBeInTheDocument();
  });

  it('displays the freelancer income page', async () => {
    getFreelancerIncome.mockResolvedValue(incomeData);

    render(<FreelancerIncome />);

    expect(
      await screen.findByRole('heading', {
        name: 'Freelancer Income'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Track your earnings, estimated tax and net income.'
      )
    ).toBeInTheDocument();
  });

  it('displays total income, tax and net income', async () => {
    getFreelancerIncome.mockResolvedValue(incomeData);

    render(<FreelancerIncome />);

    const total = await screen.findByText('Total Income');
    const tax = screen.getByText('Estimated Tax', {
      selector: 'p'
    });
    const net = screen.getByText('Net Income', {
      selector: 'p'
    });

    expect(
      total.closest('.card')
    ).toHaveTextContent('R1000.00');

    expect(
      tax.closest('.card')
    ).toHaveTextContent('R150.00');

    expect(
      net.closest('.card')
    ).toHaveTextContent('R850.00');
  });

  it('displays the transaction history', async () => {
    getFreelancerIncome.mockResolvedValue(incomeData);

    render(<FreelancerIncome />);

    expect(
      await screen.findByText('Transaction History')
    ).toBeInTheDocument();

    expect(
      screen.getByText('2 Transactions')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Logo Design')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Website Development')
    ).toBeInTheDocument();
  });

  it('displays completed and pending transaction statuses', async () => {
    getFreelancerIncome.mockResolvedValue(incomeData);

    render(<FreelancerIncome />);

    const table = await screen.findByRole('table');

    expect(
      within(table).getByText('Completed')
    ).toBeInTheDocument();

    expect(
      within(table).getByText('Pending')
    ).toBeInTheDocument();
  });

  it('displays an empty transaction message', async () => {
    getFreelancerIncome.mockResolvedValue({
      summary: {
        totalIncome: 0,
        estimatedTax: 0,
        netIncome: 0
      },
      transactions: []
    });

    render(<FreelancerIncome />);

    expect(
      await screen.findByText('No transactions yet')
    ).toBeInTheDocument();

    expect(
      screen.getByText('0 Transactions')
    ).toBeInTheDocument();
  });

  it('displays zero values when the income summary is missing', async () => {
    getFreelancerIncome.mockResolvedValue({
      transactions: []
    });

    render(<FreelancerIncome />);

    const total = await screen.findByText('Total Income');

    expect(
      total.closest('.card')
    ).toHaveTextContent('R0.00');

    expect(
      screen.getByText('No transactions yet')
    ).toBeInTheDocument();
  });

  it('displays an error when income cannot be loaded', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    getFreelancerIncome.mockRejectedValue(
      new Error('Unable to retrieve income')
    );

    render(<FreelancerIncome />);

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Unable to retrieve income');

    expect(
      screen.getByText('No transactions yet')
    ).toBeInTheDocument();

    errorSpy.mockRestore();
  });

});
