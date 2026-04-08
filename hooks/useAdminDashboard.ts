import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tab, TimeRange, ViewMode, Stats, getTimeCutoff } from '../components/admin/adminTypes';
import { API_BASE } from '../lib/constants';

export function useAdminDashboard() {
  const { adminEmail, logout, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [data, setData] = useState<Record<Tab, Record<string, unknown>[]>>({
    orders: [], distributors: [], subscribers: [], contacts: [],
  });
  const [fetched, setFetched] = useState<Set<Tab>>(new Set());
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmClear, setConfirmClear] = useState<'all' | 'selected' | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = useCallback(() => {
    fetch(`${API_BASE}/api/stats`, {
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((s: Stats) => setStats(s))
      .catch(() => {});
  }, [token]);

  const fetchTab = useCallback((tab: Tab) => {
    setLoading(true);
    fetch(`${API_BASE}/api/${tab}`, {
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((rows: Record<string, unknown>[]) => {
        setData((prev) => ({ ...prev, [tab]: rows }));
        setFetched((prev) => new Set(prev).add(tab));
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Stats on mount
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Fetch active tab on tab change, reset selection
  useEffect(() => {
    fetchTab(activeTab);
    setSelected(new Set());
  }, [activeTab, fetchTab]);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const rows = data[activeTab];

  const filteredRows = (() => {
    let result = rows;
    const cutoff = getTimeCutoff(timeRange);
    if (cutoff) {
      result = result.filter((row) => {
        const raw = row.created_at ?? row.createdAt;
        if (!raw) return true;
        return new Date(String(raw)) >= cutoff;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => v != null && String(v).toLowerCase().includes(q)),
      );
    }
    return result;
  })();

  const allIds = filteredRows.map((r) => r.id as number).filter(Boolean);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggleSelect = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelected(allSelected ? new Set() : new Set(allIds));

  const doDelete = async (ids?: number[]) => {
    setDeleting(true);
    await fetch(`${API_BASE}/api/${activeTab}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(ids ? { ids } : {}),
    }).catch(() => {});
    setSelected(new Set());
    setConfirmClear(null);
    await Promise.all([fetchTab(activeTab), fetchStats()]);
    setDeleting(false);
  };

  const tabStatKey: Record<Tab, keyof Stats> = {
    orders: 'orders',
    distributors: 'distributors',
    subscribers: 'subscribers',
    contacts: 'contacts',
  };

  const getBadge = (tab: Tab): number => {
    if (fetched.has(tab)) return data[tab].length;
    return stats ? stats[tabStatKey[tab]] : 0;
  };

  return {
    adminEmail,
    activeTab,
    setActiveTab,
    loading,
    stats,
    timeRange,
    setTimeRange,
    search,
    setSearch,
    viewMode,
    setViewMode,
    selected,
    confirmClear,
    setConfirmClear,
    deleting,
    rows,
    filteredRows,
    allSelected,
    toggleSelect,
    toggleSelectAll,
    doDelete,
    handleLogout,
    fetchTab,
    fetchStats,
    getBadge,
  };
}
