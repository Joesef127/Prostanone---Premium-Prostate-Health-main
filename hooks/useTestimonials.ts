import { useEffect, useState } from 'react';
import { TESTIMONIALS as FALLBACK } from '../lib/constants';
import { Testimonial } from '../types';
import { API_BASE } from '../lib/constants';

interface UseTestimonialsResult {
  testimonials: Testimonial[];
  loading: boolean;
  refetch: () => void;
}

export function useTestimonials(): UseTestimonialsResult {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/testimonials`)
      .then((r) => (r.ok ? r.json() : null))
      .then((rows: Testimonial[] | null) => {
        if (rows && rows.length > 0) setTestimonials(rows);
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false));
  }, [tick]);

  const refetch = () => setTick((t) => t + 1);

  return { testimonials, loading, refetch };
}
