import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Signup from '../src/pages/Signup';

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
  rest.post('http://localhost:3000/api/auth/signup', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-token', userType: 'shopper' }));
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

describe('Signup Component', () => {
  test('renders signup form', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('submits form and redirects on success', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/Account Type/i), {
      target: { value: 'merchant' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for form submission to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error on failed submission', async () => {
    // Override the handler to return an error
    server.use(
      rest.post('http://localhost:3000/api/auth/signup', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Email already exists' }));
      })
    );
    
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    
    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'existing@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
    
    // Verify navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

function afterEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}
