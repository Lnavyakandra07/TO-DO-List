import { TaskStats } from '../types/task';

interface StatsStripProps {
  stats: TaskStats;
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section
      aria-label="Task statistics"
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      <div className="grid grid-cols-2 divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {/* Total Tasks */}
        <div className="p-4 sm:px-6 sm:py-5">
          <p className="text-xs font-medium text-slate-500">Total Tasks</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {stats.total}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {stats.dueToday === 0
              ? 'None due today'
              : `${stats.dueToday} due today`}
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="p-4 sm:px-6 sm:py-5">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {stats.pending}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats.pending === 1 ? 'Active task' : 'Active tasks'}
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="p-4 sm:px-6 sm:py-5">
          <p className="text-xs font-medium text-slate-500">Completed</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-emerald-700 tabular-nums">
            {stats.completed}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {stats.completionRate}% completion rate
          </p>
        </div>

        {/* Overdue Tasks */}
        <div className="p-4 sm:px-6 sm:py-5">
          <p className="text-xs font-medium text-slate-500">Overdue</p>
          <p
            className={`mt-1.5 font-mono text-2xl font-semibold tracking-tight tabular-nums ${
              stats.overdue > 0 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {stats.overdue}
          </p>
          <p
            className={`mt-1 text-xs font-medium ${
              stats.overdue > 0 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {stats.overdue > 0 ? 'Needs attention' : 'All on schedule'}
          </p>
        </div>
      </div>
    </section>
  );
}
