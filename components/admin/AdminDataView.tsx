import React from 'react';
import { ViewMode } from './adminTypes';
import AdminTableView from './AdminTableView';
import AdminCardView from './AdminCardView';

interface AdminDataViewProps {
  loading: boolean;
  rows: Record<string, unknown>[];
  filteredRows: Record<string, unknown>[];
  viewMode: ViewMode;
  selected: Set<number>;
  allSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
}

const AdminDataView: React.FC<AdminDataViewProps> = ({
  loading, rows, filteredRows, viewMode,
  selected, allSelected, onToggleSelect, onToggleSelectAll,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (filteredRows.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        {rows.length === 0 ? 'No records yet.' : 'No records match your filters.'}
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <AdminTableView
        rows={filteredRows}
        selected={selected}
        allSelected={allSelected}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
      />
    );
  }

  return (
    <AdminCardView
      rows={filteredRows}
      selected={selected}
      onToggleSelect={onToggleSelect}
    />
  );
};

export default AdminDataView;
