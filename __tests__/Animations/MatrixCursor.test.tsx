import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatrixCursor from '../../src/components/Animations/MatrixCursor.component';

describe('MatrixCursor', () => {
  let heroSection: HTMLElement;

  beforeEach(() => {
    // Create and append hero section to document
    heroSection = document.createElement('div');
    heroSection.id = 'main-hero';
    document.body.appendChild(heroSection);
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(heroSection);
  });

  it('should update cursor position on mousemove', () => {
    render(<MatrixCursor />);
    
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });
    
    expect(heroSection.style.getPropertyValue('--cursor-x')).toBe('100px');
    expect(heroSection.style.getPropertyValue('--cursor-y')).toBe('200px');
  });

  it('should add matrix-cursor class on mouseenter', () => {
    render(<MatrixCursor />);
    
    fireEvent.mouseEnter(heroSection);
    
    expect(heroSection.classList.contains('matrix-cursor')).toBe(true);
  });

  it('should remove matrix-cursor class on mouseleave', () => {
    render(<MatrixCursor />);
    
    // First add the class
    fireEvent.mouseEnter(heroSection);
    expect(heroSection.classList.contains('matrix-cursor')).toBe(true);
    
    // Then remove it
    fireEvent.mouseLeave(heroSection);
    expect(heroSection.classList.contains('matrix-cursor')).toBe(false);
  });

  it('should do nothing if hero section is not found', () => {
    // Remove hero section before test
    document.body.removeChild(heroSection);
    
    const { rerender } = render(<MatrixCursor />);
    
    // Should not throw any errors
    expect(() => rerender(<MatrixCursor />)).not.toThrow();
  });

  it('should cleanup event listeners and classes on unmount', () => {
    const { unmount } = render(<MatrixCursor />);
    
    // Add the class first
    fireEvent.mouseEnter(heroSection);
    expect(heroSection.classList.contains('matrix-cursor')).toBe(true);
    
    // Unmount and verify cleanup
    unmount();
    expect(heroSection.classList.contains('matrix-cursor')).toBe(false);
    
    // Verify events are cleaned up by checking if they still work
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });
    expect(heroSection.style.getPropertyValue('--cursor-x')).toBe('');
    expect(heroSection.style.getPropertyValue('--cursor-y')).toBe('');
  });
});
