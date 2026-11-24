/**
 * Priority levels supported by each task item.
 */
export type TaskPriority = 'high' | 'medium' | 'low';

/**
 * Filter options for viewing tasks by completion status.
 */
export type TaskFilter = 'all' | 'pending' | 'completed';

/**
 * Available sorting strategies for the task list.
 */
export type TaskSortOption =
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'priorityDesc'
  | 'priorityAsc'
  | 'createdDesc';

/**
 * Core task entity persisted in Local Storage.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string YYYY-MM-DD, or empty string if unscheduled
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Controlled form payload used for both creating and editing tasks.
 */
export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

/**
 * Validation errors mapped by form field.
 */
export interface TaskFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

/**
 * Aggregate metrics computed from the user's task collection.
 */
export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
}

/**
 * Notification types for non-intrusive feedback toasts.
 */
export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}
