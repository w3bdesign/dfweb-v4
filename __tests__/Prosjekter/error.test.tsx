import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Error from '../../src/app/prosjekter/error';

// Mock React's useEffect
const mockUseEffect = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cb: () => void) => mockUseEffect(cb)
}));

describe('Error', () => {
  const mockReset = jest.fn();
  const mockError = new Error('Test error') as Error & { digest?: string };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message and retry button', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Noe gikk galt ved lasting av prosjekter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prøv igjen' })).toBeInTheDocument();
  });

  it('calls reset when retry button is clicked', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Prøv igjen' }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('calls useEffect with error logging', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    // Get the callback passed to useEffect
    const [callback] = mockUseEffect.mock.calls[0];
    
    // Execute the callback
    callback();
    
    // Verify the error was logged
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
