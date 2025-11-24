import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Chatbot Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('opens chatbot when toggle button is clicked', async () => {
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/Training Companion/i)).toBeInTheDocument();
    });
  });

  it('closes chatbot when X button is clicked', async () => {
    // Open chatbot
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/Training Companion/i)).toBeInTheDocument();
    });

    // Close chatbot
    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find(btn => btn.querySelector('svg') && btn.className.includes('cursor-pointer'));

    if (xButton) {
      fireEvent.click(xButton);
    }

    await waitFor(() => {
      expect(screen.queryByText(/Training Companion/i)).not.toBeInTheDocument();
    });
  });

  it('displays welcome message when chatbot opens', async () => {
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/I'm your AI Training Assistant/i)).toBeInTheDocument();
    });
  });

  it('displays quick question buttons', async () => {
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/Summarize this slide/i)).toBeInTheDocument();
      expect(screen.getByText(/Give me a real-world example/i)).toBeInTheDocument();
      expect(screen.getByText(/Why is this important?/i)).toBeInTheDocument();
    });
  });

  it('sends message when user types and clicks send', async () => {
    const user = userEvent.setup();

    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your question/i);
    await user.type(input, 'Hello');

    const sendButton = screen.getByRole('button', { name: '' }); // Send button with icon
    const sendButtons = screen.getAllByRole('button');
    const actualSendButton = sendButtons[sendButtons.length - 1]; // Last button is usually send

    fireEvent.click(actualSendButton);

    await waitFor(() => {
      expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('sends message when user presses Enter', async () => {
    const user = userEvent.setup();

    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your question/i);
    await user.type(input, 'Test message{enter}');

    await waitFor(() => {
      expect(screen.getByText(/Test message/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('responds with greeting when user says hi', async () => {
    const user = userEvent.setup();

    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your question/i);
    await user.type(input, 'Hello{enter}');

    await waitFor(() => {
      expect(screen.getByText(/I'm here to help you navigate the future of finance/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows thinking indicator while processing', async () => {
    const user = userEvent.setup();

    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your question/i);
    await user.type(input, 'Test{enter}');

    // Look for thinking animation (bouncing dots)
    const thinkingDots = document.querySelectorAll('.animate-bounce');
    expect(thinkingDots.length).toBeGreaterThan(0);
  });

  it('handles quick question button clicks', async () => {
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/Summarize this slide/i)).toBeInTheDocument();
    });

    const summaryButton = screen.getByText(/Summarize this slide/i);
    fireEvent.click(summaryButton);

    await waitFor(() => {
      expect(screen.getByText(/Summarize this slide/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('provides context-aware responses based on current slide', async () => {
    const user = userEvent.setup();

    // Navigate to slide 2 (Why AI Matters)
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Why AI Matters in Accounting/i)).toBeInTheDocument();
    });

    // Open chatbot
    const toggleButton = screen.getByLabelText(/Toggle Chatbot/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your question/i);
    await user.type(input, 'Summarize this slide{enter}');

    await waitFor(() => {
      // Should mention slide-specific content
      expect(screen.getByText(/Why AI Matters/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
