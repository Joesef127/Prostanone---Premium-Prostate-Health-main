import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import { useFinalCTAForm } from '../../hooks/useFinalCTAForm';
import { PACKAGES } from '../../lib/constants.ts';

// Suppress useNavigate calls going nowhere
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

// Prevent real fetch calls
beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({}),
  } as Response);
  // Provide a stub Korapay on window
  (global as any).window.Korapay = { initialize: vi.fn() };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AppProvider>{children}</AppProvider>
  </MemoryRouter>
);

describe('useFinalCTAForm', () => {
  it('form starts with empty firstName and state="Lagos"', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    expect(result.current.form.firstName).toBe('');
    expect(result.current.form.state).toBe('Lagos');
  });

  it('paymentMethod starts as null', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    expect(result.current.paymentMethod).toBeNull();
  });

  it('default package is the RECOMMENDED one', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    const recommended = PACKAGES.find((p) => p.badge === 'RECOMMENDED');
    expect(result.current.selectedPkg.id).toBe(recommended!.id);
  });

  it('deliveryFee is 0 for default state (Lagos)', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    expect(result.current.deliveryFee).toBe(0);
  });

  it('deliveryLabel contains "FREE" for Lagos', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    expect(result.current.deliveryLabel).toMatch(/FREE/i);
  });

  it('total = selectedPkg.price + deliveryFee', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    expect(result.current.total).toBe(
      result.current.selectedPkg.price + result.current.deliveryFee,
    );
  });

  it('deliveryFee > 0 when state is changed to Rivers', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'state', value: 'Rivers' },
      } as React.ChangeEvent<HTMLSelectElement>);
    });
    expect(result.current.deliveryFee).toBeGreaterThan(0);
  });

  it('deliveryLabel mentions "Delivery fee" when state is non-Lagos', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'state', value: 'Kano' },
      } as React.ChangeEvent<HTMLSelectElement>);
    });
    expect(result.current.deliveryLabel).toMatch(/Delivery fee/i);
  });

  it('handleChange updates form field value', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'firstName', value: 'John' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.form.firstName).toBe('John');
  });

  it('selectedPkg updates when packageId changes', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    const starter = PACKAGES.find((p) => p.id === 'starter')!;
    act(() => {
      result.current.handleChange({
        target: { name: 'packageId', value: 'starter' },
      } as React.ChangeEvent<HTMLSelectElement>);
    });
    expect(result.current.selectedPkg.id).toBe(starter.id);
  });

  it('inputClass returns red variant when field has an error', async () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    // Submit with empty form to trigger errors
    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });
    // After attempted submit, firstName should have an error
    await vi.waitFor(() => {
      expect(result.current.fieldErrors.firstName).toBeDefined();
    });
    const cls = result.current.inputClass('firstName');
    expect(cls).toContain('border-red-400');
  });

  it('inputClass returns normal variant when field has no error', () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    const cls = result.current.inputClass('firstName');
    expect(cls).toContain('border-gray-200');
  });

  it('handleChange clears an existing field error', async () => {
    const { result } = renderHook(() => useFinalCTAForm(), { wrapper });
    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });
    await vi.waitFor(() => expect(result.current.fieldErrors.firstName).toBeDefined());

    act(() => {
      result.current.handleChange({
        target: { name: 'firstName', value: 'Jo' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.fieldErrors.firstName).toBeUndefined();
  });
});
