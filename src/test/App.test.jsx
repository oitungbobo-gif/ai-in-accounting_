import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the intro slide by default', () => {
    expect(screen.getByText(/AI in Accounting: The Next Chapter/i)).toBeInTheDocument();
  });

  it('displays the correct module number in header', () => {
    expect(screen.getByText(/Module 1 of 11/i)).toBeInTheDocument();
  });

  it('navigates to next slide when Next button is clicked', async () => {
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Why AI Matters in Accounting/i)).toBeInTheDocument();
    });
  });

  it('navigates to previous slide when Back button is clicked', async () => {
    // First go to slide 2
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Why AI Matters in Accounting/i)).toBeInTheDocument();
    });

    // Then go back to slide 1
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText(/AI in Accounting: The Next Chapter/i)).toBeInTheDocument();
    });
  });

  it('disables Back button on first slide', () => {
    const backButton = screen.getByRole('button', { name: /Back/i });
    expect(backButton).toBeDisabled();
  });

  it('displays progress bar with correct percentage', () => {
    const progressBar = document.querySelector('.bg-blue-500');
    expect(progressBar).toBeInTheDocument();
    // First slide should show ~9% progress (1/11)
    expect(progressBar.style.width).toBe('9.090909090909092%');
  });

  it('renders chatbot toggle button', () => {
    const chatbotButton = screen.getByLabelText(/Toggle Chatbot/i);
    expect(chatbotButton).toBeInTheDocument();
  });

  it('hides Next button on last slide', async () => {
    // Navigate to last slide (slide 10)
    for (let i = 0; i < 10; i++) {
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);
    }

    await waitFor(() => {
      expect(screen.getByText(/Training Complete/i)).toBeInTheDocument();
    });

    // Next button should not be present
    const nextButton = screen.queryByRole('button', { name: /Next/i });
    expect(nextButton).not.toBeInTheDocument();
  });
});

describe('App - Slide Content', () => {
  it('renders all slide titles correctly', async () => {
    render(<App />);

    const expectedTitles = [
      /AI in Accounting: The Next Chapter/i,
      /Why AI Matters in Accounting/i,
      /Core Modules for AI/i,
      /Developing an AI Mindset/i,
      /Effective Prompting Techniques/i,
      /Smarter Workflows/i,
      /Responsible AI Usage/i,
      /Hands-On: Practical Applications/i,
      /Advanced Simulation Suite/i,
      /Learning Resources/i,
      /Training Complete/i,
    ];

    for (let i = 0; i < expectedTitles.length; i++) {
      if (i > 0) {
        const nextButton = screen.getByRole('button', { name: /Next/i });
        fireEvent.click(nextButton);
      }

      await waitFor(() => {
        expect(screen.getByText(expectedTitles[i])).toBeInTheDocument();
      });
    }
  });
});
