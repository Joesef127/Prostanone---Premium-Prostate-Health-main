import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QuizSeverity } from '../../types';
import { render, act } from '@testing-library/react';
import { AppProvider, useApp } from '../../context/AppContext';
import React from 'react';

// Helper: render a component that calls useApp and exposes the context
function TestHarness({ fn }: { fn: (ctx: ReturnType<typeof useApp>) => void }) {
  const ctx = useApp();
  fn(ctx);
  return null;
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('initializes with empty cart', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    expect(ctx.cart).toEqual([]);
  });

  it('initializes with null quizResult', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    expect(ctx.quizResult).toBeNull();
  });

  it('initializes with null payment state', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    expect(ctx.paymentMethod).toBeNull();
    expect(ctx.gatewayChoice).toBeNull();
  });

  it('addToCart adds a new item', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    expect(ctx.cart).toEqual([{ packageId: 'starter', quantity: 1 }]);
  });

  it('addToCart with custom quantity', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('performance', 3));
    expect(ctx.cart).toEqual([{ packageId: 'performance', quantity: 3 }]);
  });

  it('addToCart increments quantity for existing item', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.addToCart('starter', 2));
    expect(ctx.cart).toEqual([{ packageId: 'starter', quantity: 3 }]);
  });

  it('addToCart handles multiple different items', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.addToCart('loyalty'));
    expect(ctx.cart).toHaveLength(2);
  });

  it('removeFromCart removes item by packageId', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.addToCart('loyalty'));
    act(() => ctx.removeFromCart('starter'));
    expect(ctx.cart).toEqual([{ packageId: 'loyalty', quantity: 1 }]);
  });

  it('should provide clearCart function', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    expect(ctx.cart.length).toBeGreaterThan(0);
    
    act(() => ctx.clearCart());
    expect(ctx.cart).toEqual([]);
  });

  it('should handle setPaymentMethod', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.setPaymentMethod('cod'));
    expect(ctx.paymentMethod).toBe('cod');
  });

  it('should handle setGatewayChoice', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.setGatewayChoice('korapay'));
    expect(ctx.gatewayChoice).toBe('korapay');
  });

  it('updateQuantity changes item quantity', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.updateQuantity('starter', 5));
    expect(ctx.cart).toEqual([{ packageId: 'starter', quantity: 5 }]);
  });

  it('updateQuantity < 1 is a no-op', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.updateQuantity('starter', 0));
    expect(ctx.cart).toEqual([{ packageId: 'starter', quantity: 1 }]);
  });

  it('clearCart empties cart', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.addToCart('starter'));
    act(() => ctx.clearCart());
    expect(ctx.cart).toEqual([]);
  });

  it('clearCart resets paymentMethod and gatewayChoice to null', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.setPaymentMethod('cod'));
    act(() => ctx.setGatewayChoice('korapay'));
    act(() => ctx.clearCart());
    expect(ctx.paymentMethod).toBeNull();
    expect(ctx.gatewayChoice).toBeNull();
  });

  it('setPaymentMethod updates paymentMethod', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.setPaymentMethod('online'));
    expect(ctx.paymentMethod).toBe('online');
  });

  it('setGatewayChoice updates gatewayChoice', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    act(() => ctx.setGatewayChoice('korapay'));
    expect(ctx.gatewayChoice).toBe('korapay');
  });

  it('setQuizResult persists result', () => {
    let ctx!: ReturnType<typeof useApp>;
    render(
      <AppProvider>
        <TestHarness fn={(c) => { ctx = c; }} />
      </AppProvider>,
    );
    const result = { score: 15, severity: QuizSeverity.MODERATE, answers: { 1: 3, 2: 4 } };
    act(() => ctx.setQuizResult(result));
    expect(ctx.quizResult).toEqual(result);
  });

  it('useApp throws when used outside AppProvider', () => {
    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestHarness fn={() => {}} />)).toThrow(
      'useApp must be used within an AppProvider',
    );
    spy.mockRestore();
  });
});
