export type Tab = 'orders' | 'distributors' | 'subscribers' | 'contacts';
export type TimeRange = '1h' | '12h' | 'today' | '3d' | '7d' | '30d' | '365d' | 'all';
export type ViewMode = 'table' | 'cards';

export interface Stats {
  orders: number;
  paidOrders: number;
  distributors: number;
  subscribers: number;
  contacts: number;
}

export const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '1h', label: 'Last Hour' },
  { value: '12h', label: 'Last 12 Hours' },
  { value: 'today', label: 'Today' },
  { value: '3d', label: '3 Days' },
  { value: '7d', label: 'Weekly' },
  { value: '30d', label: 'Monthly' },
  { value: '365d', label: 'Annual' },
  { value: 'all', label: 'All Time' },
];

export function getTimeCutoff(range: TimeRange): Date | null {
  if (range === 'all') return null;
  const now = new Date();
  if (range === '1h') { now.setHours(now.getHours() - 1); return now; }
  if (range === '12h') { now.setHours(now.getHours() - 12); return now; }
  if (range === 'today') { now.setHours(0, 0, 0, 0); return now; }
  const days: Record<string, number> = { '3d': 3, '7d': 7, '30d': 30, '365d': 365 };
  now.setDate(now.getDate() - days[range]);
  return now;
}
