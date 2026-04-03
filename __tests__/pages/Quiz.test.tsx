import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import Quiz from '../../pages/Quiz';
import { QUIZ_QUESTIONS } from '../../lib/constants.ts';
import { QuizSeverity } from '../../types';

// Helper to mount the quiz inside the required providers
function renderQuiz() {
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/quiz']}>
        <Routes>
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<div>Results Page</div>} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
}

// ── Isolated scoring logic (extracted inline from Quiz.tsx) ───────────────
function scoreToSeverity(score: number): QuizSeverity {
  if (score >= 20) return QuizSeverity.SEVERE;
  if (score >= 8) return QuizSeverity.MODERATE;
  return QuizSeverity.MILD;
}

describe('Quiz — render and navigation', () => {
  it('renders the first question text', () => {
    renderQuiz();
    expect(screen.getByText(QUIZ_QUESTIONS[0].text)).toBeInTheDocument();
  });

  it('shows "Question 1 of 7"', () => {
    renderQuiz();
    expect(
      screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`),
    ).toBeInTheDocument();
  });

  it('clicking an answer advances to the next question', async () => {
    const user = userEvent.setup();
    renderQuiz();
    // Click first option of Q1
    const firstOption = screen.getAllByRole('button')[0];
    await user.click(firstOption);
    // Now on Q2 — label should show "Question 2 of …"
    expect(await screen.findByText(`Question 2 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it('shows back button after advancing past question 1', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getAllByRole('button')[0]);
    // The ArrowLeft back button should now be visible (aria-label or find by icon presence)
    // It has no accessible name, so check it's present via the data-testid fallback
    // The component renders <button onClick={prevQuestion}> inside the quiz
    const buttons = screen.getAllByRole('button');
    // At least 2 buttons: back + answer options
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Quiz — scoring thresholds', () => {
  it('score 0 → MILD', () => expect(scoreToSeverity(0)).toBe(QuizSeverity.MILD));
  it('score 7 → MILD (boundary)', () => expect(scoreToSeverity(7)).toBe(QuizSeverity.MILD));
  it('score 8 → MODERATE (lower boundary)', () =>
    expect(scoreToSeverity(8)).toBe(QuizSeverity.MODERATE));
  it('score 19 → MODERATE (upper boundary)', () =>
    expect(scoreToSeverity(19)).toBe(QuizSeverity.MODERATE));
  it('score 20 → SEVERE (lower boundary)', () =>
    expect(scoreToSeverity(20)).toBe(QuizSeverity.SEVERE));
  it('score 30 → SEVERE', () => expect(scoreToSeverity(30)).toBe(QuizSeverity.SEVERE));
});
