
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { loginUser, saveAuth } from '../services/api';

vi.mock('../services/api', () => ({
  loginUser: vi.fn(),
  saveAuth: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('HustleHub+ Login Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    loginUser.mockReset();
  });

  it('displays the login page correctly', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: 'HustleHub+' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Sign in to your account')
    ).toBeInTheDocument();
  });

  it('displays email and password fields', () => {
    renderLogin();

    expect(
      screen.getByLabelText('Email address')
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Password')
    ).toBeInTheDocument();
  });

  it('displays the Sign In button', () => {
    renderLogin();

    expect(
      screen.getByRole('button', { name: 'Sign In' })
    ).toBeInTheDocument();
  });

  it('allows the user to enter login details', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'client@example.com');
    await user.type(passwordInput, 'Password123!');

    expect(emailInput).toHaveValue('client@example.com');
    expect(passwordInput).toHaveValue('Password123!');
  });

  it('does not submit when required fields are empty', async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    );

    expect(loginUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('logs in successfully using valid details', async () => {
    const user = userEvent.setup();

    loginUser.mockResolvedValue({
      token: 'mock-jwt-token',
      user: {
        id: 'user123',
        name: 'Test Client',
        email: 'client@example.com',
        role: 'client'
      }
    });

    renderLogin();

    await user.type(
      screen.getByLabelText('Email address'),
      'client@example.com'
    );

    await user.type(
      screen.getByLabelText('Password'),
      'Password123!'
    );

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'client@example.com',
        password: 'Password123!'
      });
    });

    expect(saveAuth).toHaveBeenCalledWith(
      'mock-jwt-token',
      expect.objectContaining({
        role: 'client'
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('displays an error when login fails', async () => {
    const user = userEvent.setup();

    loginUser.mockRejectedValue(
      new Error('Invalid email or password')
    );

    renderLogin();

    await user.type(
      screen.getByLabelText('Email address'),
      'client@example.com'
    );

    await user.type(
      screen.getByLabelText('Password'),
      'WrongPassword123!'
    );

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Invalid email or password');

    expect(saveAuth).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays the Create one registration link', () => {
    renderLogin();

    const registerLink = screen.getByRole('link', {
      name: 'Create one'
    });

    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

});
