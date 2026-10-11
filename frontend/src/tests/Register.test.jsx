
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { registerUser } from '../services/api';

vi.mock('../services/api', () => ({
  registerUser: vi.fn()
}));

const mockNavigate = vi.fn();

const pendingRedirects = new Set();
const originalSetTimeout = globalThis.setTimeout;
const originalClearTimeout = globalThis.clearTimeout;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

async function fillRegistrationForm(user, role = 'client') {
  await user.type(
    screen.getByLabelText('Full Name'),
    'Test User'
  );

  await user.type(
    screen.getByLabelText('Email Address'),
    'test@example.com'
  );

  await user.type(
    screen.getByLabelText('Password'),
    'Password123!'
  );

  await user.selectOptions(
    screen.getByLabelText('Account Type'),
    role
  );
}

describe('HustleHub+ Registration Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    registerUser.mockReset();

    vi.spyOn(globalThis, 'setTimeout').mockImplementation(
      (callback, delay, ...args) => {
        const id = originalSetTimeout(() => {
          pendingRedirects.delete(id);
          callback(...args);
        }, delay);

        pendingRedirects.add(id);
        return id;
      }
    );
  });

  afterEach(() => {
    for (const id of pendingRedirects) {
      originalClearTimeout(id);
    }

    pendingRedirects.clear();
    vi.restoreAllMocks();
  });

  it('displays the registration page correctly', () => {
    renderRegister();

    expect(
      screen.getByRole('heading', { name: 'HustleHub+' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Create your account')
    ).toBeInTheDocument();
  });

  it('displays all required registration fields', () => {
    renderRegister();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument();
  });

  it('sets Client as the default account type', () => {
    renderRegister();

    expect(
      screen.getByLabelText('Account Type')
    ).toHaveValue('client');
  });

  it('allows the user to select Freelancer', async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.selectOptions(
      screen.getByLabelText('Account Type'),
      'freelancer'
    );

    expect(
      screen.getByLabelText('Account Type')
    ).toHaveValue('freelancer');
  });

  it('allows the user to enter registration details', async () => {
    const user = userEvent.setup();

    renderRegister();
    await fillRegistrationForm(user);

    expect(
      screen.getByLabelText('Full Name')
    ).toHaveValue('Test User');

    expect(
      screen.getByLabelText('Email Address')
    ).toHaveValue('test@example.com');

    expect(
      screen.getByLabelText('Password')
    ).toHaveValue('Password123!');
  });

  it('does not submit when required fields are empty', async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('sets a minimum password length of 8 characters', () => {
    renderRegister();

    const passwordInput = screen.getByLabelText('Password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('minlength', '8');
  });

  it('registers a client successfully', async () => {
    const user = userEvent.setup();

    registerUser.mockResolvedValue({
      message: 'Registration successful'
    });

    renderRegister();
    await fillRegistrationForm(user, 'client');

    await user.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'client'
      });
    });

    expect(
      await screen.findByText(
        'Registration successful! Redirecting to login...'
      )
    ).toBeInTheDocument();
  });

  it('registers a freelancer successfully', async () => {
    const user = userEvent.setup();

    registerUser.mockResolvedValue({
      message: 'Registration successful'
    });

    renderRegister();
    await fillRegistrationForm(user, 'freelancer');

    await user.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'freelancer'
      });
    });

    expect(
      await screen.findByText(
        'Registration successful! Redirecting to login...'
      )
    ).toBeInTheDocument();
  });

  it('displays an error when registration fails', async () => {
    const user = userEvent.setup();

    registerUser.mockRejectedValue(
      new Error('Email already registered')
    );

    renderRegister();
    await fillRegistrationForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Create Account' })
    );

    expect(
      await screen.findByText('Email already registered')
    ).toBeInTheDocument();

    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays a link to the login page', () => {
    renderRegister();

    const loginLink = screen.getByRole('link', {
      name: 'Sign in'
    });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

});
