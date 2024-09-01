import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../src/components/ErrorBoundary/ErrorBoundary';

describe('ErrorBoundary', () => {
  let consoleErrorSpy;
  const errorMock = new Error('Dette er en testfeil');

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test Innhold</div>
      </ErrorBoundary>
    );
    expect(getByText('Test Innhold')).toBeInTheDocument();
  });

  it('should render error fallback when there is an error', () => {
    const ErrorComponent = () => {
      throw errorMock;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(getByText('Har du funnet en feil i Matrix, Neo?')).toBeInTheDocument();
    expect(getByText('Dette er en testfeil')).toBeInTheDocument();
    expect(getByText('Returner til Matrix')).toBeInTheDocument();
  });

  it('should call console.error when an error occurs', () => {
    const ErrorComponent = () => {
      throw errorMock;
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Uventet feil i Matrix:', errorMock, expect.any(Object));
  });
});