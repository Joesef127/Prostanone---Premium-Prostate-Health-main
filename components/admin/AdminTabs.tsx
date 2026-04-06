import React from 'react';
import { ShoppingBag, Users, Mail, MessageSquare } from 'lucide-react';
import { Tab } from './adminTypes';

interface AdminTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  getBadge: (tab: Tab) => number;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'orders',       label: 'Orders',       icon: <ShoppingBag   className="w-4 h-4" /> },
  { key: 'distributors', label: 'Distributors', icon: <Users         className="w-4 h-4" /> },
  { key: 'subscribers',  label: 'Subscribers',  icon: <Mail          className="w-4 h-4" /> },
  { key: 'contacts',     label: 'Messages',     icon: <MessageSquare className="w-4 h-4" /> },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange, getBadge }) => (
  <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto no-scrollbar">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
          activeTab === tab.key
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text'
        }`}
      >
        {tab.icon}
        {tab.label}
        <span className="ml-1 text-xs bg-surface border border-border rounded-full px-1.5 py-0.5">
          {getBadge(tab.key)}
        </span>
      </button>
    ))}
  </div>
);

export default AdminTabs;
