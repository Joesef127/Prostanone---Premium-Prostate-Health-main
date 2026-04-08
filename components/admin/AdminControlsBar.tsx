import React from 'react';
import { Search, X, LayoutList, LayoutGrid, RefreshCw, Trash2 } from 'lucide-react';
import { TimeRange, ViewMode, TIME_OPTIONS } from './adminTypes';
import CustomDropdown from '../ui/CustomDropdown';

interface AdminControlsBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (v: TimeRange) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  onRefresh: () => void;
  selectedSize: number;
  onDeleteSelected: () => void;
  onClearAll: () => void;
}

const AdminControlsBar: React.FC<AdminControlsBarProps> = ({
  search, onSearchChange,
  timeRange, onTimeRangeChange,
  viewMode, onViewModeChange,
  onRefresh,
  selectedSize, onDeleteSelected, onClearAll,
}) => (
  <div className="flex flex-wrap items-center gap-3 mb-5">

    {/* Search */}
    <div className="relative flex-1 min-w-48">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search records…"
        className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {search && (
        <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Time Range */}
    <CustomDropdown
      value={timeRange}
      onChange={(val) => onTimeRangeChange(val as TimeRange)}
      options={TIME_OPTIONS}
      className="w-40"
    />

    {/* Layout Toggle */}
    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('table')}
        title="Table view"
        className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
      >
        <LayoutList className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        title="Card view"
        className={`p-1.5 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>

    {/* Refresh */}
    <button
      onClick={onRefresh}
      title="Refresh"
      className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
    </button>

    {/* Delete Selected */}
    {selectedSize > 0 && (
      <button
        onClick={onDeleteSelected}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-sm font-medium transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete {selectedSize} selected
      </button>
    )}

    {/* Clear All */}
    <button
      onClick={onClearAll}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text-muted hover:text-rose-600 hover:border-rose-300 text-sm transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Clear all
    </button>
  </div>
);

export default AdminControlsBar;
