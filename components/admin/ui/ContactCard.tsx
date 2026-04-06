import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ContactCardProps {
  row: Record<string, unknown>;
}

const ContactCard: React.FC<ContactCardProps> = ({ row }) => (
  <>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
        <MessageSquare className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text truncate leading-tight">{String(row.name ?? '—')}</p>
        <p className="text-xs text-text-muted truncate">{String(row.email ?? '—')}</p>
      </div>
    </div>

    {row.message != null && (
      <p className="text-sm text-text-muted leading-relaxed line-clamp-4 whitespace-normal mb-1">
        {String(row.message)}
      </p>
    )}
  </>
);

export default ContactCard;
