import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Login from '../src/pages/Login';

// Mock zustand store
jest.mock('../src/store/userStore', () => ({
  useUserStore: () => ({
    setUserType: jest.fn(),
    setToken: jest.fn()
  })
}));

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Setup request mocking
const server = setupServer(
  rest.post('http://localhost:3000/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-token', userType: 'merchant' }));
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => {
  server.resetHandlers();
  mockNavigate.mockReset();
});

// Disable API mocking after the tests are done
afterAll(() => server.close());

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('submits form and redirects on success', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'merchant@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Wait for form submission to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error on failed login', async () => {
    // Override the handler to return an error
    server.use(
      rest.post('http://localhost:3000/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
      })
    );
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
    
    // Verify navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('has link to signup page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const signupLink = screen.getByText(/Sign up/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
  });
});