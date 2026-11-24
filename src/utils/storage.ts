import { Task } from '../types/task';
import { getRelativeDateString } from './taskHelpers';

const STORAGE_KEY = 'taskledger_tasks_v1';

/**
 * Generates initial sample tasks strictly on a user's very first visit
 * (when Local Storage has never been initialized for this key).
 */
export function createInitialSampleTasks(): Task[] {
  const now = new Date().toISOString();

  return [
    {
      id: 'sample-1',
      title: 'Finalize quarterly budget reconciliation',
      description: 'Cross-check vendor invoices against Q4 department ledger and export summary report.',
      dueDate: getRelativeDateString(-2), // Overdue by 2 days to demonstrate overdue state
      priority: 'high',
      completed: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-2',
      title: 'Prepare sprint review presentation slides',
      description: 'Outline completed milestones, velocity metrics, and upcoming product priorities.',
      dueDate: getRelativeDateString(0), // Due today
      priority: 'high',
      completed: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-3',
      title: 'Update client onboarding checklist',
      description: 'Add new security questionnaire link and clarify welcome call agenda.',
      dueDate: getRelativeDateString(3),
      priority: 'medium',
      completed: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-4',
      title: 'Archive completed October project briefs',
      description: 'Move finalized PDFs to shared archive folder and verify access permissions.',
      dueDate: getRelativeDateString(-4),
      priority: 'low',
      completed: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Validates that a parsed JSON entry conforms to the Task shape.
 */
function isValidTaskRecord(item: unknown): item is Task {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.dueDate === 'string' &&
    (candidate.priority === 'high' ||
      candidate.priority === 'medium' ||
      candidate.priority === 'low') &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

/**
 * Loads tasks from Local Storage. If no entry exists yet, initializes with
 * sample tasks and persists them so subsequent reloads stay consistent.
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = createInitialSampleTasks();
      saveTasksToStorage(seeded);
      return seeded;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTaskRecord);
  } catch (error) {
    console.error('Failed to read tasks from Local Storage:', error);
    return [];
  }
}

/**
 * Persists the current task array to Local Storage.
 * Returns true if persistence succeeded, false otherwise.
 */
export function saveTasksToStorage(tasks: Task[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Failed to save tasks to Local Storage:', error);
    return false;
  }
}
