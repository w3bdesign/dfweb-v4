import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkipLink from '@/components/UI/SkipLink.component';

describe('SkipLink', () => {
  it('renders without crashing', () => {
    render(<SkipLink />);
    expect(screen.getByText('Hopp til hovedinnhold')).toBeInTheDocument();
  });

  it('contains a Button with correct props', () => {
    render(<SkipLink />);
    const button = screen.getByRole('link', { name: 'Hopp til hovedinnhold' });
    expect(button).toHaveAttribute('href', '#main-content');
  });

  it('is only visible when focused', () => {
    render(<SkipLink />);
    const skipLink = screen.getByText('Hopp til hovedinnhold').closest('div');
    expect(skipLink).toHaveClass('sr-only');
    expect(skipLink).toHaveClass('focus-within:not-sr-only');
    expect(skipLink).toHaveClass('focus-within:absolute');
    expect(skipLink).toHaveClass('focus-within:top-4');
    expect(skipLink).toHaveClass('focus-within:left-4');
    expect(skipLink).toHaveClass('focus-within:z-50');
  });
});