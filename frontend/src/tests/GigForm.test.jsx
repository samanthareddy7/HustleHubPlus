
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GigForm from '../pages/GigForm';
import { createGig, getGigById, updateGig } from '../services/api';

vi.mock('../services/api', () => ({
  createGig: vi.fn(),
  getGigById: vi.fn(),
  updateGig: vi.fn()
}));

const mockNavigate = vi.fn();
let routeId;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: routeId })
  };
});

function renderGigForm() {
  return render(
    <MemoryRouter>
      <GigForm />
    </MemoryRouter>
  );
}

async function fillGigForm(user) {
  await user.type(
    screen.getByLabelText('Gig Title'),
    'Professional Logo Design'
  );

  await user.type(
    screen.getByLabelText('Description'),
    'I will create a professional logo for your business.'
  );

  await user.selectOptions(
    screen.getByLabelText('Category'),
    'Graphic Design'
  );

  await user.type(
    screen.getByLabelText('Price (R)'),
    '500'
  );
}

describe('HustleHub+ Gig Form Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    routeId = undefined;
  });

  it('displays the create gig page correctly', () => {
    renderGigForm();

    expect(
      screen.getByRole('heading', { name: 'Create a Gig' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Tell clients about the service you offer.')
    ).toBeInTheDocument();
  });

  it('displays all gig form fields', () => {
    renderGigForm();

    expect(screen.getByLabelText('Gig Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (R)')).toBeInTheDocument();
    expect(screen.getByLabelText('Make this gig active')).toBeInTheDocument();
  });

  it('displays available gig categories', () => {
    renderGigForm();

    const category = screen.getByLabelText('Category');

    expect(category).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Graphic Design' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Web Development' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Writing' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Marketing' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Photography' })).toBeInTheDocument();
  });

  it('allows the user to enter gig details', async () => {
    const user = userEvent.setup();

    renderGigForm();
    await fillGigForm(user);

    expect(screen.getByLabelText('Gig Title')).toHaveValue('Professional Logo Design');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'I will create a professional logo for your business.'
    );
    expect(screen.getByLabelText('Category')).toHaveValue('Graphic Design');
    expect(screen.getByLabelText('Price (R)')).toHaveValue(500);
  });

  it('sets new gigs as active by default', async () => {
    const user = userEvent.setup();

    renderGigForm();

    const checkbox = screen.getByLabelText('Make this gig active');

    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('prevents submitting an empty form', () => {
    renderGigForm();

    fireEvent.submit(
      screen.getByRole('button', { name: 'Create Gig' }).closest('form')
    );

    expect(screen.getByText('Gig title is required.')).toBeInTheDocument();
    expect(screen.getByText('Price is required.')).toBeInTheDocument();
    expect(createGig).not.toHaveBeenCalled();
  });

  it('rejects a gig title shorter than three characters', async () => {
    const user = userEvent.setup();

    renderGigForm();

    await user.type(screen.getByLabelText('Gig Title'), 'AB');

    fireEvent.submit(
      screen.getByRole('button', { name: 'Create Gig' }).closest('form')
    );

    expect(
      screen.getByText('Gig title must contain at least 3 characters.')
    ).toBeInTheDocument();

    expect(createGig).not.toHaveBeenCalled();
  });

  it('rejects a gig price of zero', async () => {
    const user = userEvent.setup();

    renderGigForm();

    await user.type(screen.getByLabelText('Price (R)'), '0');

    fireEvent.submit(
      screen.getByRole('button', { name: 'Create Gig' }).closest('form')
    );

    expect(
      screen.getByText('Price must be greater than R0.')
    ).toBeInTheDocument();

    expect(createGig).not.toHaveBeenCalled();
  });

  it('creates a gig successfully', async () => {
    const user = userEvent.setup();

    createGig.mockResolvedValue({
      gig: { _id: 'gig123' }
    });

    renderGigForm();
    await fillGigForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Create Gig' })
    );

    await waitFor(() => {
      expect(createGig).toHaveBeenCalledWith({
        title: 'Professional Logo Design',
        description: 'I will create a professional logo for your business.',
        category: 'Graphic Design',
        price: 500,
        isActive: true
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error when gig creation fails', async () => {
    const user = userEvent.setup();

    createGig.mockRejectedValue(
      new Error('Unable to create gig')
    );

    renderGigForm();
    await fillGigForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Create Gig' })
    );

    expect(
      await screen.findByText('Unable to create gig')
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('loads and updates an existing gig successfully', async () => {
    const user = userEvent.setup();

    routeId = 'gig123';

    getGigById.mockResolvedValue({
      gig: {
        _id: 'gig123',
        title: 'Existing Logo Design',
        description: 'An existing professional design service.',
        category: 'Graphic Design',
        price: 300,
        isActive: true
      }
    });

    updateGig.mockResolvedValue({
      gig: { _id: 'gig123' }
    });

    renderGigForm();

    expect(
      screen.getByText('Loading gig...')
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Edit Gig' })
    ).toBeInTheDocument();

    expect(getGigById).toHaveBeenCalledWith('gig123');

    expect(
      screen.getByLabelText('Gig Title')
    ).toHaveValue('Existing Logo Design');

    await user.clear(screen.getByLabelText('Price (R)'));
    await user.type(screen.getByLabelText('Price (R)'), '650');

    await user.click(
      screen.getByRole('button', { name: 'Save Changes' })
    );

    await waitFor(() => {
      expect(updateGig).toHaveBeenCalledWith(
        'gig123',
        expect.objectContaining({
          price: 650,
          title: 'Existing Logo Design'
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

});
