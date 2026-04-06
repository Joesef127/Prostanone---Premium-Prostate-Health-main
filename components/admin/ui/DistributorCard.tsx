import React from 'react';
import { Users, Phone, Package, ShoppingBag, MessageSquare } from 'lucide-react';
import InfoRow from './InfoRow';

interface DistributorCardProps {
  row: Record<string, unknown>;
}

const DistributorCard: React.FC<DistributorCardProps> = ({ row }) => {
  const name         = row.full_name ?? row.fullName ?? row.name;
  const bizType      = row.business_type ?? row.businessType;
  const monthlyOrder = row.expected_monthly_order ?? row.expectedMonthlyOrder;

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text truncate leading-tight">{String(name ?? '—')}</p>
          <p className="text-xs text-text-muted truncate">{String(row.email ?? '—')}</p>
        </div>
        {row.state != null && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200 shrink-0">
            {String(row.state)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {row.phone != null && (
          <InfoRow icon={<Phone className="w-3.5 h-3.5" />}>{String(row.phone)}</InfoRow>
        )}
        {bizType != null && (
          <InfoRow icon={<Package className="w-3.5 h-3.5" />}>{String(bizType)}</InfoRow>
        )}
        {monthlyOrder != null && (
          <InfoRow icon={<ShoppingBag className="w-3.5 h-3.5" />}>
            Expected: {String(monthlyOrder)}
          </InfoRow>
        )}
        {row.message != null && (
          <InfoRow icon={<MessageSquare className="w-3.5 h-3.5" />}>
            <span className="line-clamp-2 whitespace-normal">{String(row.message)}</span>
          </InfoRow>
        )}
      </div>
    </>
  );
};

export default DistributorCard;
