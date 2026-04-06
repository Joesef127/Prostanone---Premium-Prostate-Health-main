import { useEffect, useState } from 'react';
import { PACKAGES as FALLBACK_PACKAGES } from '../lib/constants';
import { ProductPackage } from '../types';

interface UsePackagesResult {
  packages: ProductPackage[];
  loading: boolean;
  refetch: () => void;
}

export function usePackages(): UsePackagesResult {
  const [packages, setPackages] = useState<ProductPackage[]>(FALLBACK_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch('/api/packages')
      .then((r) => (r.ok ? r.json() : null))
      .then((rows: ProductPackage[] | null) => {
        if (rows && rows.length > 0) setPackages(rows);
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false));
  }, [tick]);

  const refetch = () => setTick((t) => t + 1);

  return { packages, loading, refetch };
}
