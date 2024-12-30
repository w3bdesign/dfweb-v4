import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from '@/app/prosjekter/loading';

// Mock the components used in Loading
jest.mock('@/components/UI/PageHeader.component', () => {
  return function MockPageHeader({ children }: { children: React.ReactNode }) {
    return <h1>{children}</h1>;
  };
});

jest.mock('@/components/Animations/RotatingLoader.component', () => {
  return function MockRotatingLoader() {
    return <div data-testid="rotating-loader">Loading...</div>;
  };
});

jest.mock('@/app/RootLayout', () => {
  return function MockRootLayout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

describe('Loading', () => {
  it('renders loading state correctly', () => {
    render(<Loading />);
    
    // Check if the header is rendered
    expect(screen.getByText('Prosjekter')).toBeInTheDocument();
    
    // Check if the loading spinner is rendered
    expect(screen.getByTestId('rotating-loader')).toBeInTheDocument();
    
    // Check if the main element has correct attributes
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label', 'Laster portefølje');
    expect(main).toHaveClass('mt-32', 'bg-graybg');
  });
});
