import React from 'react';
import { Mail } from 'lucide-react';

interface SubscriberCardProps {
  row: Record<string, unknown>;
}

const SubscriberCard: React.FC<SubscriberCardProps> = ({ row }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
      <Mail className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-text truncate leading-tight">{String(row.email ?? '—')}</p>
      {row.name != null && (
        <p className="text-xs text-text-muted truncate">{String(row.name)}</p>
      )}
    </div>
  </div>
);

export default SubscriberCard;
