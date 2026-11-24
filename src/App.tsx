/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StatsStrip } from './components/StatsStrip';
import { TaskComposer } from './components/TaskComposer';
import { TaskEditModal } from './components/TaskEditModal';
import { TaskList } from './components/TaskList';
import { TaskToolbar } from './components/TaskToolbar';
import { ToastContainer } from './components/ToastContainer';
import { TopBar } from './components/TopBar';
import {
  Task,
  TaskFilter,
  TaskFormValues,
  TaskSortOption,
  ToastMessage,
  ToastVariant,
} from './types/task';
import {
  createInitialSampleTasks,
  loadTasksFromStorage,
  saveTasksToStorage,
} from './utils/storage';
import {
  computeTaskStats,
  generateTaskId,
  getVisibleTasks,
} from './utils/taskHelpers';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<TaskSortOption>('dueDateAsc');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const toastTimersRef = useRef<Record<string, number>>({});

  // Persist tasks to Local Storage whenever tasks change
  useEffect(() => {
    const saved = saveTasksToStorage(tasks);
    if (!saved) {
      pushToast(
        'Could not save changes to browser storage.',
        'error'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // Clean up pending toast timers on unmount
  useEffect(() => {
    const timers = toastTimersRef.current;
    return () => {
      Object.values(timers).forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    if (toastTimersRef.current[id]) {
      window.clearTimeout(toastTimersRef.current[id]);
      delete toastTimersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
      toastTimersRef.current[id] = window.setTimeout(() => {
        dismissToast(id);
      }, 3200);
    },
    [dismissToast]
  );

  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);

  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, activeFilter, searchQuery, sortBy),
    [tasks, activeFilter, searchQuery, sortBy]
  );

  const focusCreateForm = useCallback(() => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 120);
  }, []);

  // CREATE
  const handleCreateTask = useCallback(
    (values: TaskFormValues) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: generateTaskId(),
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        priority: values.priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);

      // Ensure newly added task is immediately visible if user was on Completed tab
      if (activeFilter === 'completed') {
        setActiveFilter('all');
      }
      if (searchQuery.trim()) {
        setSearchQuery('');
      }

      pushToast(`Task "${newTask.title}" added.`);
    },
    [activeFilter, searchQuery, pushToast]
  );

  // UPDATE: Toggle completion status
  const handleToggleComplete = useCallback(
    (taskId: string) => {
      let updatedTitle = '';
      let nextCompleted = false;

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          updatedTitle = task.title;
          nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (updatedTitle) {
        pushToast(
          nextCompleted
            ? `Completed "${updatedTitle}".`
            : `Reopened "${updatedTitle}" as pending.`,
          nextCompleted ? 'success' : 'info'
        );
      }
    },
    [pushToast]
  );

  // UPDATE: Save full edits from modal
  const handleSaveEdit = useCallback(
    (
      taskId: string,
      values: TaskFormValues & { completed: boolean }
    ) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                title: values.title,
                description: values.description,
                dueDate: values.dueDate,
                priority: values.priority,
                completed: values.completed,
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );

      setEditingTask(null);
      pushToast(`Updated "${values.title}".`);
    },
    [pushToast]
  );

  // DELETE: Confirmed deletion
  const handleConfirmDelete = useCallback(
    (taskId: string) => {
      const target = tasks.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setTaskToDelete(null);

      if (target) {
        pushToast(`Deleted "${target.title}".`);
      }
    },
    [tasks, pushToast]
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilter('all');
    setSearchQuery('');
  }, []);

  const handleLoadSampleTasks = useCallback(() => {
    const samples = createInitialSampleTasks();
    setTasks(samples);
    setActiveFilter('all');
    setSearchQuery('');
    pushToast('Loaded sample tasks.', 'info');
  }, [pushToast]);

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onAddTaskClick={focusCreateForm}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Heading */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px] [text-wrap:balance]">
              Daily Task Workspace
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Organize priorities, track due dates, and manage your daily checklist.
            </p>
          </div>
        </div>

        {/* Dashboard Statistics Strip */}
        <StatsStrip stats={stats} />

        {/* Two-Column Responsive Workspace */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr] lg:gap-8">
          {/* Left Column: Create Task Form */}
          <div ref={composerRef} className="lg:sticky lg:top-20">
            <TaskComposer
              onCreateTask={handleCreateTask}
              titleInputRef={titleInputRef}
            />
          </div>

          {/* Right Column: Search, Filter, Sort & Task List */}
          <section aria-label="Task list workspace" className="min-w-0 space-y-4">
            <TaskToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              stats={stats}
              visibleCount={visibleTasks.length}
            />

            <TaskList
              tasks={visibleTasks}
              totalTaskCount={tasks.length}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTask}
              onRequestDelete={setTaskToDelete}
              onClearFilters={handleClearFilters}
              onFocusCreateForm={focusCreateForm}
              onLoadSampleTasks={handleLoadSampleTasks}
            />
          </section>
        </div>
      </main>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <DeleteConfirmModal
          task={taskToDelete}
          onConfirmDelete={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {/* Success / Info / Error Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
