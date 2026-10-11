
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyBookings from '../pages/MyBookings';
import FreelancerBookings from '../pages/FreelancerBookings';
import {
  getMyBookings,
  getFreelancerBookings,
  completeBooking
} from '../services/api';

vi.mock('../services/api', () => ({
  getMyBookings: vi.fn(),
  getFreelancerBookings: vi.fn(),
  completeBooking: vi.fn()
}));

const clientBooking = {
  _id: 'booking123',
  gig: {
    title: 'Logo Design',
    description: 'Professional business logo',
    category: 'Graphic Design'
  },
  freelancer: {
    name: 'Test Freelancer',
    email: 'freelancer@example.com'
  },
  client: {
    name: 'Test Client',
    email: 'client@example.com'
  },
  amount: 500,
  status: 'Pending',
  createdAt: '2026-10-01T10:00:00.000Z'
};

describe('HustleHub+ Client Booking Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the loading message while fetching bookings', () => {
    getMyBookings.mockReturnValue(new Promise(() => {}));

    render(<MyBookings />);

    expect(
      screen.getByText('Loading your bookings...')
    ).toBeInTheDocument();
  });

  it('displays the client bookings page', async () => {
    getMyBookings.mockResolvedValue({ bookings: [] });

    render(<MyBookings />);

    expect(
      await screen.findByRole('heading', { name: 'My Bookings' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('View the services you have booked.')
    ).toBeInTheDocument();
  });

  it('displays a message when the client has no bookings', async () => {
    getMyBookings.mockResolvedValue({ bookings: [] });

    render(<MyBookings />);

    expect(
      await screen.findByText("You don't have any bookings yet.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Browse Gigs' })
    ).toHaveAttribute('href', '/gigs');
  });

  it('displays booking details correctly', async () => {
    getMyBookings.mockResolvedValue({
      bookings: [clientBooking]
    });

    render(<MyBookings />);

    expect(
      await screen.findByText('Logo Design')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Graphic Design')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Test Freelancer')
    ).toBeInTheDocument();

    expect(
      screen.getByText('R500.00')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Pending')
    ).toBeInTheDocument();
  });

  it('displays an error when loading bookings fails', async () => {
    getMyBookings.mockRejectedValue(
      new Error('Unable to load bookings')
    );

    render(<MyBookings />);

    expect(
      await screen.findByText('Unable to load bookings')
    ).toBeInTheDocument();
  });

});

describe('HustleHub+ Freelancer Booking Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    getFreelancerBookings.mockResolvedValue({ bookings: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays the loading message while fetching bookings', () => {
    getFreelancerBookings.mockReturnValue(
      new Promise(() => {})
    );

    render(<FreelancerBookings />);

    expect(
      screen.getByText('Loading bookings...')
    ).toBeInTheDocument();
  });

  it('displays the freelancer bookings page', async () => {
    render(<FreelancerBookings />);

    expect(
      await screen.findByRole('heading', { name: 'Client Bookings' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Manage services booked by your clients.')
    ).toBeInTheDocument();
  });

  it('displays a message when there are no client bookings', async () => {
    render(<FreelancerBookings />);

    expect(
      await screen.findByText('No bookings yet.')
    ).toBeInTheDocument();
  });

  it('displays client booking details', async () => {
    getFreelancerBookings.mockResolvedValue({
      bookings: [clientBooking]
    });

    render(<FreelancerBookings />);

    expect(
      await screen.findByText('Logo Design')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Test Client')
    ).toBeInTheDocument();

    expect(
      screen.getByText('R500.00')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Complete' })
    ).toBeInTheDocument();
  });

  it('does not complete a booking when confirmation is cancelled', async () => {
    const user = userEvent.setup();

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    getFreelancerBookings.mockResolvedValue({
      bookings: [clientBooking]
    });

    render(<FreelancerBookings />);

    await user.click(
      await screen.findByRole('button', { name: 'Complete' })
    );

    expect(window.confirm).toHaveBeenCalledWith(
      'Mark this booking as completed?'
    );

    expect(completeBooking).not.toHaveBeenCalled();
  });

  it('completes a booking successfully', async () => {
    const user = userEvent.setup();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    getFreelancerBookings.mockResolvedValue({
      bookings: [clientBooking]
    });

    completeBooking.mockResolvedValue({
      message: 'Booking completed successfully.'
    });

    render(<FreelancerBookings />);

    await user.click(
      await screen.findByRole('button', { name: 'Complete' })
    );

    await waitFor(() => {
      expect(completeBooking).toHaveBeenCalledWith('booking123');
    });

    expect(
      await screen.findByText('Booking completed successfully.')
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Complete' })
    ).not.toBeInTheDocument();
  });

  it('displays an error when completing a booking fails', async () => {
    const user = userEvent.setup();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    getFreelancerBookings.mockResolvedValue({
      bookings: [clientBooking]
    });

    completeBooking.mockRejectedValue(
      new Error('Unable to complete booking')
    );

    render(<FreelancerBookings />);

    await user.click(
      await screen.findByRole('button', { name: 'Complete' })
    );

    expect(
      await screen.findByText('Unable to complete booking')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Complete' })
    ).toBeInTheDocument();
  });

});
