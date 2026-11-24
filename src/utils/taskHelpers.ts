import {
  Task,
  TaskFilter,
  TaskFormErrors,
  TaskFormValues,
  TaskPriority,
  TaskSortOption,
  TaskStats,
} from '../types/task';

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Formats a local Date object as YYYY-MM-DD without UTC timezone drift.
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  return toLocalDateString(new Date());
}

/**
 * Returns a local YYYY-MM-DD string offset by `deltaDays` from today.
 */
export function getRelativeDateString(deltaDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + deltaDays);
  return toLocalDateString(date);
}

/**
 * Determines whether a task is overdue.
 * Completed tasks are never marked overdue.
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) return false;
  return task.dueDate < getTodayDateString();
}

/**
 * Determines whether an incomplete task is due today.
 */
export function isTaskDueToday(task: Task): boolean {
  if (task.completed || !task.dueDate) return false;
  return task.dueDate === getTodayDateString();
}

/**
 * Computes how many days past due a task is (positive integer if overdue).
 */
export function getDaysOverdue(dueDate: string): number {
  if (!dueDate) return 0;
  const todayStr = getTodayDateString();
  if (dueDate >= todayStr) return 0;

  const [ty, tm, td] = todayStr.split('-').map(Number);
  const [dy, dm, dd] = dueDate.split('-').map(Number);
  const todayUtc = Date.UTC(ty, tm - 1, td);
  const dueUtc = Date.UTC(dy, dm - 1, dd);
  return Math.round((todayUtc - dueUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Formats a YYYY-MM-DD string into a concise human-readable date label.
 */
export function formatDueDate(dueDate: string): string {
  if (!dueDate) return 'No due date';

  const today = getTodayDateString();
  if (dueDate === today) return 'Today';
  if (dueDate === getRelativeDateString(1)) return 'Tomorrow';
  if (dueDate === getRelativeDateString(-1)) return 'Yesterday';

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return dueDate;

  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Validates create/edit task form inputs and returns field-level errors.
 */
export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const trimmedTitle = values.title.trim();

  if (!trimmedTitle) {
    errors.title = 'Please enter a task title before saving.';
  } else if (trimmedTitle.length < 2) {
    errors.title = 'Task title must be at least 2 characters long.';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Task title cannot exceed 120 characters.';
  }

  if (values.description.trim().length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  if (values.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate)) {
    errors.dueDate = 'Please choose a valid calendar date.';
  }

  return errors;
}

/**
 * Filters and sorts tasks according to active status filter, search query, and sort order.
 */
export function getVisibleTasks(
  tasks: Task[],
  filter: TaskFilter,
  searchQuery: string,
  sortBy: TaskSortOption
): Task[] {
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (normalizedSearch && !task.title.toLowerCase().includes(normalizedSearch)) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'dueDateAsc': {
        if (!a.dueDate && !b.dueDate) return b.createdAt.localeCompare(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateCmp = a.dueDate.localeCompare(b.dueDate);
        return dateCmp !== 0 ? dateCmp : PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
      case 'dueDateDesc': {
        if (!a.dueDate && !b.dueDate) return b.createdAt.localeCompare(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateCmp = b.dueDate.localeCompare(a.dueDate);
        return dateCmp !== 0 ? dateCmp : PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
      case 'priorityDesc': {
        const weightCmp = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        if (weightCmp !== 0) return weightCmp;
        if (!a.dueDate && !b.dueDate) return b.createdAt.localeCompare(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      case 'priorityAsc': {
        const weightCmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        if (weightCmp !== 0) return weightCmp;
        if (!a.dueDate && !b.dueDate) return b.createdAt.localeCompare(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      case 'createdDesc':
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}

/**
 * Computes dashboard summary metrics from the full task array.
 */
export function computeTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  let completed = 0;
  let overdue = 0;
  let dueToday = 0;

  for (const task of tasks) {
    if (task.completed) {
      completed += 1;
    } else {
      if (isTaskOverdue(task)) overdue += 1;
      if (isTaskDueToday(task)) dueToday += 1;
    }
  }

  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    completed,
    overdue,
    dueToday,
    completionRate,
  };
}

/**
 * Generates a collision-resistant unique identifier for new tasks.
 */
export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
