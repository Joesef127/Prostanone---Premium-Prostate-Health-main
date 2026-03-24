import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PaymentSelector from '../../components/product-page/PaymentSelector';

function renderSelector(
  paymentMethod: 'cod' | 'online' | null = null,
  gatewayChoice: 'korapay' | 'payaza' | null = null,
  setPaymentMethod = vi.fn(),
  setGatewayChoice = vi.fn(),
) {
  render(
    <PaymentSelector
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      gatewayChoice={gatewayChoice}
      setGatewayChoice={setGatewayChoice}
    />,
  );
  return { setPaymentMethod, setGatewayChoice };
}

describe('PaymentSelector component', () => {
  it('renders both "Pay on Delivery" and "Pay Online" options', () => {
    renderSelector();
    expect(screen.getByText('Pay on Delivery')).toBeInTheDocument();
    expect(screen.getByText('Pay Online')).toBeInTheDocument();
  });

  it('clicking "Pay on Delivery" calls setPaymentMethod("cod")', async () => {
    const user = userEvent.setup();
    const { setPaymentMethod } = renderSelector();
    await user.click(screen.getByText('Pay on Delivery'));
    expect(setPaymentMethod).toHaveBeenCalledWith('cod');
  });

  it('clicking "Pay Online" calls setPaymentMethod("online")', async () => {
    const user = userEvent.setup();
    const { setPaymentMethod } = renderSelector();
    await user.click(screen.getByText('Pay Online'));
    expect(setPaymentMethod).toHaveBeenCalledWith('online');
  });

  it('shows the COD disclaimer when paymentMethod is "cod"', () => {
    renderSelector('cod');
    expect(screen.getByText(/only proceed if you are READY/i)).toBeInTheDocument();
  });

  it('shows the gateway sub-selector when paymentMethod is "online"', () => {
    renderSelector('online');
    expect(screen.getByText('Select Gateway')).toBeInTheDocument();
    expect(screen.getByText('Korapay')).toBeInTheDocument();
    expect(screen.getByText('Payaza')).toBeInTheDocument();
  });

  it('clicking Korapay calls setGatewayChoice("korapay")', async () => {
    const user = userEvent.setup();
    const { setGatewayChoice } = renderSelector('online');
    await user.click(screen.getByText('Korapay'));
    expect(setGatewayChoice).toHaveBeenCalledWith('korapay');
  });

  it('Payaza button is disabled', () => {
    renderSelector('online');
    // Find the button that contains "Payaza"
    const payazaBtn = screen.getByText('Payaza').closest('button');
    expect(payazaBtn).toBeDisabled();
  });
});
