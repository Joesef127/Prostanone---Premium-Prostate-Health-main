import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import OrderSummaryBox from '../../components/product-page/OrderSummaryBox';
import { PACKAGES } from '../../lib/constants.ts';

const pkg = PACKAGES[0]; // Starter Pack — 1 container, ₦15,000

describe('OrderSummaryBox component', () => {
  it('shows the package name', () => {
    render(
      <OrderSummaryBox
        pkg={pkg}
        deliveryFee={0}
        total={pkg.price}
        deliveryLabel="FREE delivery in your area!"
      />,
    );
    expect(screen.getByText(pkg.name)).toBeInTheDocument();
  });

  it('shows "FREE" badge when deliveryFee is 0', () => {
    render(
      <OrderSummaryBox
        pkg={pkg}
        deliveryFee={0}
        total={pkg.price}
        deliveryLabel="FREE delivery in your area!"
      />,
    );
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('shows the delivery fee amount when deliveryFee is > 0', () => {
    render(
      <OrderSummaryBox
        pkg={pkg}
        deliveryFee={8000}
        total={pkg.price + 8000}
        deliveryLabel="Delivery fee: ₦8,000 (2–5 working days)"
      />,
    );
    expect(screen.getByText('₦8,000')).toBeInTheDocument();
  });

  it('shows the correct formatted total', () => {
    const total = pkg.price + 8000; // 23,000
    render(
      <OrderSummaryBox
        pkg={pkg}
        deliveryFee={8000}
        total={total}
        deliveryLabel="Delivery fee: ₦8,000 (2–5 working days)"
      />,
    );
    expect(screen.getByText(`₦${total.toLocaleString()}`)).toBeInTheDocument();
  });

  it('renders the deliveryLabel text', () => {
    render(
      <OrderSummaryBox
        pkg={pkg}
        deliveryFee={0}
        total={pkg.price}
        deliveryLabel="FREE delivery in your area!"
      />,
    );
    expect(screen.getByText('FREE delivery in your area!')).toBeInTheDocument();
  });
});
