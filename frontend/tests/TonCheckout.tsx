import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TonCheckout from '../src/components/TonCheckout';

// Setup request mocking
const server = setupServer(
  rest.get('http://localhost:3000/health', (req, res, ctx) => {
    return res(ctx.json({ status: 'OK' }));
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());

describe('TonCheckout Component', () => {
  test('renders wallet addresses', () => {
    render(<TonCheckout />);
    
    // Check if both wallet addresses are displayed
    expect(screen.getByText(/Shopper Wallet:/i)).toBeInTheDocument();
    expect(screen.getByText(/Seller Wallet:/i)).toBeInTheDocument();
  });

  test('displays backend status after clicking Pay with TON button', async () => {
    render(<TonCheckout />);
    
    // Click the payment button
    fireEvent.click(screen.getByText('Pay with TON'));
    
    // Wait for the backend status to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Backend Status: OK/i)).toBeInTheDocument();
    });
  });

  test('handles backend error', async () => {
    // Override the handler to return an error
    server.use(
      rest.get('http://localhost:3000/health', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<TonCheckout />);
    
    // Click the payment button
    fireEvent.click(screen.getByText('Pay with TON'));
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });
});