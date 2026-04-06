import React from 'react';
import { ShoppingBag, CheckCircle, Users, Mail, MessageSquare } from 'lucide-react';
import { Stats } from './adminTypes';

interface AdminStatCardsProps {
  stats: Stats;
}

const AdminStatCards: React.FC<AdminStatCardsProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Orders',  value: stats.orders,       icon: <ShoppingBag className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50'   },
    { label: 'Paid / COD',    value: stats.paidOrders,   icon: <CheckCircle  className="w-5 h-5" />, color: 'text-green-600 bg-green-50'  },
    { label: 'Distributors',  value: stats.distributors, icon: <Users        className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Subscribers',   value: stats.subscribers,  icon: <Mail         className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50' },
    { label: 'Messages',      value: stats.contacts,     icon: <MessageSquare className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50'    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-text">{card.value}</p>
          <p className="text-xs text-text-muted">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatCards;
