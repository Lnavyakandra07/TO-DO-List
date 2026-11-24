import {
  AlertCircle,
  Calendar,
  Check,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Task, TaskPriority } from '../types/task';
import {
  formatDueDate,
  getDaysOverdue,
  isTaskDueToday,
  isTaskOverdue,
} from '../utils/taskHelpers';

interface TaskRowProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
}

const PRIORITY_META: Record<
  TaskPriority,
  { label: string; textClass: string }
> = {
  high: {
    label: 'High Priority',
    textClass: 'text-red-600 font-medium',
  },
  medium: {
    label: 'Medium Priority',
    textClass: 'text-amber-700 font-medium',
  },
  low: {
    label: 'Low Priority',
    textClass: 'text-slate-600 font-medium',
  },
};

export function TaskRow({
  task,
  onToggleComplete,
  onEdit,
  onRequestDelete,
}: TaskRowProps) {
  const overdue = isTaskOverdue(task);
  const dueToday = isTaskDueToday(task);
  const daysOverdue = overdue ? getDaysOverdue(task.dueDate) : 0;
  const priorityMeta = PRIORITY_META[task.priority];

  return (
    <article
      className={`group px-4 py-4 sm:px-6 transition-colors duration-150 ${
        overdue
          ? 'bg-red-50/45 hover:bg-red-50/75'
          : task.completed
            ? 'bg-slate-50/60 hover:bg-slate-50'
            : 'bg-white hover:bg-slate-50/80'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        {/* Left: Completion Toggle + Task Details */}
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            aria-label={
              task.completed
                ? `Mark "${task.title}" as pending`
                : `Mark "${task.title}" as completed`
            }
            aria-pressed={task.completed}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
              task.completed
                ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                : overdue
                  ? 'border-red-400 bg-white text-transparent hover:border-red-600'
                  : 'border-slate-300 bg-white text-transparent hover:border-blue-600'
            }`}
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`font-display text-[15px] font-semibold leading-snug break-words ${
                task.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`mt-1 text-sm leading-relaxed break-words ${
                  task.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Unboxed Metadata Row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span
                className={
                  task.completed ? 'text-slate-400' : priorityMeta.textClass
                }
              >
                {priorityMeta.label}
              </span>

              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>

              <span
                className={`inline-flex items-center gap-1 tabular-nums ${
                  overdue
                    ? 'font-medium text-red-600'
                    : dueToday && !task.completed
                      ? 'font-medium text-amber-700'
                      : task.completed
                        ? 'text-slate-400'
                        : 'text-slate-600'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {task.dueDate
                    ? `Due ${formatDueDate(task.dueDate)}`
                    : 'No due date'}
                </span>
              </span>

              {overdue && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-red-600 tabular-nums">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      Overdue by {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                    </span>
                  </span>
                </>
              )}

              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>

              <span
                className={
                  task.completed
                    ? 'font-medium text-emerald-700'
                    : 'text-slate-500'
                }
              >
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Clearly Distinguishable Action Buttons */}
        <div className="flex items-center gap-1.5 pl-8 sm:pl-0 shrink-0">
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2.5 sm:px-2.5 sm:py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              task.completed
                ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {task.completed ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Reopen</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Complete</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Pencil className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(task)}
            aria-label={`Delete "${task.title}"`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-600 transition-colors duration-150 hover:border-red-300 hover:bg-red-50 hover:text-red-700 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
