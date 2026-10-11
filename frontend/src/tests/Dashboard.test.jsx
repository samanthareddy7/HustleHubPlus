
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import {
  getGigs,
  getMyGigs,
  getMyBookings,
  getFreelancerBookings,
  getFreelancerIncome
} from '../services/api';

vi.mock('../services/api', () => ({
  getGigs: vi.fn(),
  getMyGigs: vi.fn(),
  getMyBookings: vi.fn(),
  getFreelancerBookings: vi.fn(),
  getFreelancerIncome: vi.fn()
}));

const client = {
  _id: 'client123',
  name: 'Test Client',
  role: 'client'
};

const freelancer = {
  _id: 'freelancer123',
  name: 'Test Freelancer',
  role: 'freelancer'
};

const gigs = [
  {
    _id: 'gig1',
    title: 'Logo Design',
    category: 'Graphic Design',
    price: 500,
    isActive: true
  },
  {
    _id: 'gig2',
    title: 'Website Development',
    category: 'Web Development',
    price: 1200,
    isActive: false
  }
];

const bookings = [
  {
    _id: 'booking1',
    gig: { title: 'Logo Design' },
    amount: 500,
    status: 'Pending'
  },
  {
    _id: 'booking2',
    gig: { title: 'Website Development' },
    amount: 1200,
    status: 'Completed'
  }
];

const income = {
  summary: {
    totalIncome: 1700,
    estimatedTax: 255,
    netIncome: 1445
  },
  transactions: []
};

function renderDashboard(user) {
  if (user === null) {
    sessionStorage.removeItem('user');
  } else {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<h1>Admin Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('HustleHub+ Dashboard Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    getGigs.mockResolvedValue({ gigs });
    getMyBookings.mockResolvedValue({ bookings });
    getMyGigs.mockResolvedValue({ gigs });
    getFreelancerBookings.mockResolvedValue({ bookings });
    getFreelancerIncome.mockResolvedValue(income);
  });

  it('shows an error when account information is missing', () => {
    renderDashboard(null);

    expect(
      screen.getByText('Unable to load your account information.')
    ).toBeInTheDocument();
  });

  it('displays a warning for unsupported dashboard roles', () => {
    renderDashboard({
      name: 'Test Admin',
      role: 'admin'
    });

    expect(
      screen.getByText('Your account does not have a recognised role.')
    ).toBeInTheDocument();

    expect(getGigs).not.toHaveBeenCalled();
    expect(getMyGigs).not.toHaveBeenCalled();
    expect(getMyBookings).not.toHaveBeenCalled();
    expect(getFreelancerBookings).not.toHaveBeenCalled();
    expect(getFreelancerIncome).not.toHaveBeenCalled();
  });

  it('displays the client dashboard correctly', async () => {
    renderDashboard(client);

    expect(
      await screen.findByRole('heading', {
        name: 'Welcome, Test Client'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Find freelance services and manage your bookings.')
    ).toBeInTheDocument();

    expect(getGigs).toHaveBeenCalledTimes(1);
    expect(getMyBookings).toHaveBeenCalledTimes(1);
  });

  it('displays client gig and booking statistics', async () => {
    renderDashboard(client);

    await screen.findByText('Available Gigs');

    expect(
      screen.getByText('Available Gigs').closest('.card')
    ).toHaveTextContent('2');

    expect(
      screen.getByText('Pending Bookings').closest('.card')
    ).toHaveTextContent('1');

    expect(
      screen.getByText('Completed Bookings').closest('.card')
    ).toHaveTextContent('1');
  });

  it('displays recent client bookings and navigation links', async () => {
    renderDashboard(client);

    const table = await screen.findByRole('table');

    expect(
      within(table).getByText('Logo Design')
    ).toBeInTheDocument();

    expect(
      within(table).getByText('Website Development')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Browse Gigs' })
    ).toHaveAttribute('href', '/gigs');

    expect(
      screen.getByRole('link', { name: 'My Bookings' })
    ).toHaveAttribute('href', '/my-bookings');
  });

  it('displays a message when the client has no bookings', async () => {
    getMyBookings.mockResolvedValue({ bookings: [] });

    renderDashboard(client);

    expect(
      await screen.findByText(
        "You haven't made any bookings yet."
      )
    ).toBeInTheDocument();
  });

  it('displays the freelancer dashboard correctly', async () => {
    renderDashboard(freelancer);

    expect(
      await screen.findByRole('heading', {
        name: 'Welcome, Test Freelancer'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Manage your freelance business from one place.')
    ).toBeInTheDocument();

    expect(getMyGigs).toHaveBeenCalledTimes(1);
    expect(getFreelancerBookings).toHaveBeenCalledTimes(1);
    expect(getFreelancerIncome).toHaveBeenCalledTimes(1);
  });

  it('displays freelancer income and tax information', async () => {
    renderDashboard(freelancer);

    const heading = await screen.findByText('Income Summary');
    const card = heading.closest('.card');

    expect(card).toHaveTextContent('R1700.00');
    expect(card).toHaveTextContent('R255.00');
    expect(card).toHaveTextContent('R1445.00');
  });

  it('displays freelancer gigs and management links', async () => {
    renderDashboard(freelancer);

    const table = await screen.findByRole('table');

    expect(
      within(table).getByText('Logo Design')
    ).toBeInTheDocument();

    expect(
      within(table).getByText('Website Development')
    ).toBeInTheDocument();

    expect(
      within(table).getByText('Active')
    ).toBeInTheDocument();

    expect(
      within(table).getByText('Inactive')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Create New Gig' })
    ).toHaveAttribute('href', '/gigs/create');

    expect(
      screen.getByRole('link', { name: 'Manage My Gigs' })
    ).toHaveAttribute('href', '/my-gigs');
  });

  it('displays an error when dashboard data cannot be loaded', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    getGigs.mockRejectedValue(
      new Error('Unable to load dashboard data')
    );

    renderDashboard(client);

    expect(
      await screen.findByText('Unable to load dashboard data')
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

});
