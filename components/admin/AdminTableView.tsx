import React from 'react';

interface AdminTableViewProps {
  rows: Record<string, unknown>[];
  selected: Set<number>;
  allSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
}

const AdminTableView: React.FC<AdminTableViewProps> = ({
  rows, selected, allSelected, onToggleSelect, onToggleSelectAll,
}) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-sm text-left">
      <thead className="bg-surface border-b border-border">
        <tr>
          <th className="px-4 py-3 w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              className="rounded border-border accent-primary cursor-pointer"
            />
          </th>
          {Object.keys(rows[0]).map((key) => (
            <th key={key} className="px-4 py-3 font-medium text-text capitalize whitespace-nowrap">
              {key.replace(/_/g, ' ')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const id = row.id as number;
          const isSelected = selected.has(id);
          return (
            <tr
              key={i}
              className={`border-b border-border last:border-0 transition-colors ${
                isSelected ? 'bg-primary/5' : 'hover:bg-surface/50'
              }`}
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(id)}
                  className="rounded border-border accent-primary cursor-pointer"
                />
              </td>
              {Object.values(row).map((val, j) => (
                <td key={j} className="px-4 py-3 text-text-muted max-w-xs truncate">
                  {val == null ? '—' : String(val)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default AdminTableView;
