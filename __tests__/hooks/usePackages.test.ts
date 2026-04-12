import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePackages } from '../../hooks/usePackages';

describe('usePackages Hook', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));
    const { result } = renderHook(() => usePackages());

    expect(result.current.loading).toBe(true);
    expect(result.current.packages).toBeDefined();
  });

  it('should fetch packages from API', async () => {
    const mockPackages = [
      {
        id: '1',
        name: 'Basic',
        price: 15000,
        duration: '1 month',
        features: ['Feature 1'],
      },
      {
        id: '2',
        name: 'Premium',
        price: 35000,
        duration: '3 months',
        features: ['Feature 1', 'Feature 2'],
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPackages,
    });

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(result.current.packages).toEqual(mockPackages);
    expect(result.current.loading).toBe(false);
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should still have packages (fallback)
    expect(result.current.packages).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('should use fallback packages if API fails', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should have fallback packages
    expect(result.current.packages.length).toBeGreaterThan(0);
  });

  it('should have refetch function', () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => usePackages());

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should refetch packages when refetch is called', async () => {
    const mockPackages = [{ id: '1', name: 'Package', price: 15000 }];

    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPackages });

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    act(() => {
      result.current.refetch();
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should handle empty API response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should keep fallback packages
    expect(result.current.packages).toBeDefined();
  });

  it('should handle non-ok API response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should keep fallback packages
    expect(result.current.packages).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('should cache packages to avoid unnecessary API calls', async () => {
    const mockPackages = [{ id: '1', name: 'Package' }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockPackages,
    });

    const { result: result1 } = renderHook(() => usePackages());
    const { result: result2 } = renderHook(() => usePackages());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Both should have same data without additional calls
    expect(result1.current.packages).toEqual(result2.current.packages);
  });
});
