import React from 'react';
import { CalendarDays, Hash } from 'lucide-react';
import { detectType, formatDate } from './adminCardHelpers';
import OrderCard       from './ui/OrderCard';
import DistributorCard from './ui/DistributorCard';
import ContactCard     from './ui/ContactCard';
import SubscriberCard  from './ui/SubscriberCard';

interface AdminCardViewProps {
  rows: Record<string, unknown>[];
  selected: Set<number>;
  onToggleSelect: (id: number) => void;
}

const AdminCardView: React.FC<AdminCardViewProps> = ({ rows, selected, onToggleSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {rows.map((row, i) => {
      const id = row.id as number;
      const isSelected = selected.has(id);
      const type = detectType(row);
      const createdAt = row.created_at ?? row.createdAt;

      return (
        <div
          key={i}
          onClick={() => onToggleSelect(id)}
          className={`relative bg-surface border rounded-2xl p-4 cursor-pointer transition-all duration-150 flex flex-col gap-0 ${
            isSelected
              ? 'border-primary ring-2 ring-primary/20 shadow-sm'
              : 'border-border hover:border-primary/50 hover:shadow-sm'
          }`}
        >
          {/* checkbox */}
          <div className="absolute top-3.5 right-3.5">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(id)}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-border accent-primary cursor-pointer w-4 h-4"
            />
          </div>

          {/* body — pad right to avoid overlapping checkbox */}
          <div className="pr-7 flex-1">
            {type === 'order'       && <OrderCard       row={row} />}
            {type === 'distributor' && <DistributorCard row={row} />}
            {type === 'contact'     && <ContactCard     row={row} />}
            {type === 'subscriber'  && <SubscriberCard  row={row} />}
          </div>

          {/* footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="flex items-center gap-1 text-[11px] text-text-light">
              <Hash className="w-3 h-3" />{id}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-light">
              <CalendarDays className="w-3 h-3" />{formatDate(createdAt)}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

export default AdminCardView;
