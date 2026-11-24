import { ArrowUpDown, Search, X } from 'lucide-react';
import { TaskFilter, TaskSortOption, TaskStats } from '../types/task';

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  sortBy: TaskSortOption;
  onSortChange: (sort: TaskSortOption) => void;
  stats: TaskStats;
  visibleCount: number;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  stats,
  visibleCount,
}: TaskToolbarProps) {
  const filterTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search by Title */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title..."
            aria-label="Search tasks by title"
            className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="task-sort-select"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Sort:</span>
          </label>
          <select
            id="task-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="priorityDesc">Priority (High to Low)</option>
            <option value="priorityAsc">Priority (Low to High)</option>
            <option value="createdDesc">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs & Task Count Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1"
        >
          {filterTabs.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onFilterChange(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 tabular-nums">
          Showing <span className="font-semibold text-slate-700">{visibleCount}</span>{' '}
          of <span className="font-semibold text-slate-700">{stats.total}</span>{' '}
          {stats.total === 1 ? 'task' : 'tasks'}
        </p>
      </div>
    </div>
  );
}
