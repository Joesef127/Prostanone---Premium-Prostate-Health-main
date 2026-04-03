import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import ThankYou from '../../pages/ThankYou';

function renderThankYou(state?: Record<string, unknown>) {
  render(
    <AppProvider>
      <MemoryRouter
        initialEntries={[{ pathname: '/thank-you', state: state ?? null }]}
      >
        <Routes>
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
}

describe('ThankYou page — COD flow', () => {
  it('shows "Order Received!" heading for COD', () => {
    renderThankYou({ paymentMethod: 'cod', phone: '08012345678' });
    expect(screen.getByText('Order Received!')).toBeInTheDocument();
  });

  it('shows the customer phone number in the delivery card', () => {
    renderThankYou({ paymentMethod: 'cod', phone: '08012345678' });
    expect(screen.getByText('08012345678')).toBeInTheDocument();
  });

  it('shows "Pay on Delivery Selected" green card', () => {
    renderThankYou({ paymentMethod: 'cod', phone: '08012345678' });
    expect(screen.getByText('Pay on Delivery Selected')).toBeInTheDocument();
  });

  it('shows "Important Reminders" amber box', () => {
    renderThankYou({ paymentMethod: 'cod', phone: '08012345678' });
    expect(screen.getByText('Important Reminders')).toBeInTheDocument();
  });

  it('shows "Watch out for our call" prompt', () => {
    renderThankYou({ paymentMethod: 'cod', phone: '08012345678' });
    expect(
      screen.getByText(/Watch out for our call or WhatsApp message/i),
    ).toBeInTheDocument();
  });
});

describe('ThankYou page — Online payment flow', () => {
  it('shows "Order Confirmed!" heading for online payment', () => {
    renderThankYou({ paymentMethod: 'online' });
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
  });

  it('shows "Next Steps:" list for online payment', () => {
    renderThankYou({ paymentMethod: 'online' });
    expect(screen.getByText('Next Steps:')).toBeInTheDocument();
  });

  it('does NOT show the COD delivery card for online payment', () => {
    renderThankYou({ paymentMethod: 'online' });
    expect(screen.queryByText('Pay on Delivery Selected')).not.toBeInTheDocument();
  });
});

describe('ThankYou page — no router state (fallback)', () => {
  it('falls back to online / confirmed experience when no state provided', () => {
    renderThankYou();
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
  });
});
