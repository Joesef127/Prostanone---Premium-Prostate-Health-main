import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useContactForm from '../../hooks/useContactForm';

describe('useContactForm Hook', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize form with empty values', () => {
    const { result } = renderHook(() => useContactForm());

    expect(result.current.form).toEqual({
      name: '',
      email: '',
      message: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.status).toBe('idle');
  });

  it('should update form fields on change', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any);
    });

    expect(result.current.form.name).toBe('John Doe');
  });

  it('should validate required fields', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as any);
    });

    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.errors.message).toBeDefined();
  });

  it('should validate email format', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid-email' },
      } as any);
      result.current.handleSubmit({ preventDefault: () => {} } as any);
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it('should accept valid email addresses', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      } as any);
    });

    expect(result.current.form.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should clear field errors when corrected', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: '' },
      } as any);
      result.current.handleSubmit({ preventDefault: () => {} } as any);
    });

    expect(result.current.errors.name).toBeDefined();

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' },
      } as any);
    });

    expect(result.current.form.name).toBe('John');
  });

  it('should reset status', () => {
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.resetStatus();
    });

    expect(result.current.status).toBe('idle');
  });
});
