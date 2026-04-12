import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import { ModalProvider } from '../../context/ModalContext';
import { useCheckout } from '../../hooks/useCheckout';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  global.fetch = vi.fn();
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AppProvider>
      <ModalProvider>{children}</ModalProvider>
    </AppProvider>
  </MemoryRouter>
);

describe('useCheckout Hook', () => {
  it('should initialize with basic structure', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.formData).toBeDefined();
    expect(result.current.step).toBe(1);
    expect(result.current.loading).toBe(false);
  });

  it('should initialize formData with correct fields', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.formData.name).toBeDefined();
    expect(result.current.formData.email).toBeDefined();
    expect(result.current.formData.phone).toBeDefined();
    expect(result.current.formData.address).toBeDefined();
    expect(result.current.formData.city).toBeDefined();
    expect(result.current.formData.state).toBeDefined();
  });

  it('should handle input changes', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'John Doe' },
      } as any);
    });

    expect(result.current.formData.name).toBe('John Doe');
  });

  it('should handle multiple input changes independently', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.handleInputChange({ target: { name: 'name', value: 'John Doe' } } as any);
    });
    act(() => {
      result.current.handleInputChange({ target: { name: 'email', value: 'john@example.com' } } as any);
    });

    expect(result.current.formData.name).toBe('John Doe');
    expect(result.current.formData.email).toBe('john@example.com');
  });

  it('should update step', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setStep(2);
    });

    expect(result.current.step).toBe(2);
  });

  it('should calculate subtotal', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(typeof result.current.subtotal).toBe('number');
    expect(result.current.subtotal).toBeGreaterThanOrEqual(0);
  });

  it('should calculate finalDeliveryFee', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(typeof result.current.finalDeliveryFee).toBe('number');
    expect(result.current.finalDeliveryFee).toBeGreaterThanOrEqual(0);
  });

  it('should calculate total as subtotal + delivery fee', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(typeof result.current.total).toBe('number');
    expect(result.current.total).toBe(result.current.subtotal + result.current.finalDeliveryFee);
  });

  it('should expose payment method functions', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(typeof result.current.setPaymentMethod).toBe('function');
    expect(typeof result.current.setGatewayChoice).toBe('function');
  });

  it('should handle payment method selection', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setPaymentMethod('cod');
    });

    expect(result.current.paymentMethod).toBe('cod');
  });

  it('should handle gateway choice selection', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setGatewayChoice('korapay');
    });

    expect(result.current.gatewayChoice).toBe('korapay');
  });

  it('should support korapay and payaza as gateway choices', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setGatewayChoice('payaza');
    });
    expect(result.current.gatewayChoice).toBe('payaza');

    act(() => {
      result.current.setGatewayChoice('korapay');
    });
    expect(result.current.gatewayChoice).toBe('korapay');
  });

  it('should have form submission handlers', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(typeof result.current.handleNext).toBe('function');
    expect(typeof result.current.handleBack).toBe('function');
    expect(typeof result.current.handlePayment).toBe('function');
    expect(typeof result.current.handleCODSubmit).toBe('function');
  });

  it('should expose cart', () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(Array.isArray(result.current.cart)).toBe(true);
  });

  describe('Step Navigation', () => {
    it('should progress through checkout steps using setStep', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      expect(result.current.step).toBe(1);

      act(() => { result.current.setStep(2); });
      expect(result.current.step).toBe(2);

      act(() => { result.current.setStep(3); });
      expect(result.current.step).toBe(3);
    });

    it('should go back to previous step', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => { result.current.setStep(3); });
      expect(result.current.step).toBe(3);

      act(() => { result.current.setStep(2); });
      expect(result.current.step).toBe(2);
    });

    it('handleBack decrements the step', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => { result.current.setStep(3); });

      act(() => { result.current.handleBack(); });

      expect(result.current.step).toBe(2);
    });
  });

  describe('Delivery Fee Calculation', () => {
    it('should recalculate delivery fee when state changes', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.handleInputChange({ target: { name: 'state', value: 'Lagos' } } as any);
      });

      expect(typeof result.current.finalDeliveryFee).toBe('number');
      expect(result.current.finalDeliveryFee).toBeGreaterThanOrEqual(0);
    });

    it('should recalculate delivery fee when address changes', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.handleInputChange({ target: { name: 'address', value: '10 Broad Street' } } as any);
        result.current.handleInputChange({ target: { name: 'city', value: 'Lagos Island' } } as any);
      });

      expect(typeof result.current.finalDeliveryFee).toBe('number');
    });
  });

  describe('Payment Methods', () => {
    it('should allow COD selection', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => { result.current.setPaymentMethod('cod'); });
      expect(result.current.paymentMethod).toBe('cod');
    });

    it('should allow online payment selection', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => { result.current.setPaymentMethod('online'); });
      expect(result.current.paymentMethod).toBe('online');
    });

    it('should update gateway independently of payment method', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.setPaymentMethod('online');
        result.current.setGatewayChoice('korapay');
      });

      expect(result.current.paymentMethod).toBe('online');
      expect(result.current.gatewayChoice).toBe('korapay');
    });
  });

  describe('Form Data Integrity', () => {
    it('should maintain form data when step changes', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.handleInputChange({ target: { name: 'name', value: 'John Doe' } } as any);
        result.current.handleInputChange({ target: { name: 'email', value: 'john@example.com' } } as any);
      });

      act(() => { result.current.setStep(2); });

      expect(result.current.formData.name).toBe('John Doe');
      expect(result.current.formData.email).toBe('john@example.com');
    });

    it('should not lose data when navigating back', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.handleInputChange({ target: { name: 'name', value: 'Jane Doe' } } as any);
        result.current.setStep(2);
      });

      act(() => { result.current.handleBack(); });

      expect(result.current.formData.name).toBe('Jane Doe');
      expect(result.current.step).toBe(1);
    });

    it('should update address field via handleInputChange', () => {
      const { result } = renderHook(() => useCheckout(), { wrapper });

      act(() => {
        result.current.handleInputChange({ target: { name: 'address', value: '123 Main Street, Ikeja' } } as any);
      });

      expect(result.current.formData.address).toBe('123 Main Street, Ikeja');
    });
  });
});
