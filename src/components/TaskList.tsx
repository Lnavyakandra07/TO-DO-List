import { ClipboardList, Plus, SearchX } from 'lucide-react';
import { Task, TaskFilter } from '../types/task';
import { TaskRow } from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  totalTaskCount: number;
  activeFilter: TaskFilter;
  searchQuery: string;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
  onClearFilters: () => void;
  onFocusCreateForm: () => void;
  onLoadSampleTasks: () => void;
}

export function TaskList({
  tasks,
  totalTaskCount,
  activeFilter,
  searchQuery,
  onToggleComplete,
  onEdit,
  onRequestDelete,
  onClearFilters,
  onFocusCreateForm,
  onLoadSampleTasks,
}: TaskListProps) {
  if (totalTaskCount === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <ClipboardList className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
          No tasks yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
          Your workspace is clear. Add a new task with a due date and priority to get organized.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onFocusCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Create First Task</span>
          </button>
          <button
            type="button"
            onClick={onLoadSampleTasks}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Load Sample Tasks
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    const filterLabel =
      activeFilter === 'pending'
        ? 'pending'
        : activeFilter === 'completed'
          ? 'completed'
          : '';

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
          No matching tasks
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
          {searchQuery.trim()
            ? `No ${filterLabel ? `${filterLabel} ` : ''}tasks matched "${searchQuery.trim()}".`
            : `You have no ${filterLabel} tasks right now.`}
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Reset Search &amp; Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}
