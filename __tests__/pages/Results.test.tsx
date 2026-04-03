import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import Results from '../../pages/Results';
import { QuizSeverity } from '../../types';

function renderResults(score: number, severity: QuizSeverity) {
  render(
    <AppProvider initialQuizResult={{ score, severity, answers: {} }}>
      <MemoryRouter initialEntries={['/results']}>
        <Routes>
          <Route path="/results" element={<Results />} />
          <Route path="/quiz" element={<div>Quiz Page</div>} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
}

function renderResultsNoQuiz() {
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/results']}>
        <Routes>
          <Route path="/results" element={<Results />} />
          <Route path="/quiz" element={<div>Quiz Page</div>} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
}

describe('Results page', () => {
  it('redirects to /quiz when quizResult is null', () => {
    renderResultsNoQuiz();
    expect(screen.getByText('Quiz Page')).toBeInTheDocument();
  });

  it('displays MILD severity label', () => {
    renderResults(5, QuizSeverity.MILD);
    expect(screen.getByText('MILD')).toBeInTheDocument();
  });

  it('displays MODERATE severity label', () => {
    renderResults(12, QuizSeverity.MODERATE);
    expect(screen.getByText('MODERATE')).toBeInTheDocument();
  });

  it('displays SEVERE severity label', () => {
    renderResults(25, QuizSeverity.SEVERE);
    expect(screen.getByText('SEVERE')).toBeInTheDocument();
  });
});
