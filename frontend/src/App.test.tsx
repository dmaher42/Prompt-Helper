import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

const mockFetch = vi.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe('App', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders the landing page when logged out', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' })
    });

    render(<App />);

    expect(await screen.findByRole('heading', { name: /PromptHelper/i })).toBeInTheDocument();
  });

  it('navigates to dashboard when logged in', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ user: { id: '1', email: 'user@example.com' } })
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ prompts: [] })
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
    });
  });
});
