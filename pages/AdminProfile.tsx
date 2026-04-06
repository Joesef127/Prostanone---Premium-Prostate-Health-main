import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShoppingBag, Users, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDynamicTitle } from '../hooks/useDynamicTitle';

type Tab = 'orders' | 'distributors' | 'subscribers';

const AdminProfile: React.FC = () => {
  useDynamicTitle('Admin Dashboard');
  const { adminEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [data, setData] = useState<Record<Tab, unknown[]>>({ orders: [], distributors: [], subscribers: [] });
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/${activeTab}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((rows) => setData((prev) => ({ ...prev, [activeTab]: rows })))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'distributors', label: 'Distributors', icon: <Users className="w-4 h-4" /> },
    { key: 'subscribers', label: 'Subscribers', icon: <Mail className="w-4 h-4" /> },
  ];

  const rows = data[activeTab] as Record<string, unknown>[];

  return (
    <div className="pt-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">Admin Dashboard</h1>
              <p className="text-text-muted text-sm">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 text-xs bg-surface border border-border rounded-full px-1.5 py-0.5">
                {data[tab.key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-text-muted">No records yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface border-b border-border">
                <tr>
                  {Object.keys(rows[0]).map((key) => (
                    <th key={key} className="px-4 py-3 font-medium text-text capitalize whitespace-nowrap">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-3 text-text-muted max-w-xs truncate">
                        {val == null ? '—' : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
