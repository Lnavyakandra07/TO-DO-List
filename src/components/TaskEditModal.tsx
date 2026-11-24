import { FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { Task, TaskFormErrors, TaskFormValues, TaskPriority } from '../types/task';
import { validateTaskForm } from '../utils/taskHelpers';

interface TaskEditModalProps {
  task: Task;
  onSave: (taskId: string, values: TaskFormValues & { completed: boolean }) => void;
  onClose: () => void;
}

export function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
  });
  const [completed, setCompleted] = useState<boolean>(task.completed);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.title) {
        titleInputRef.current?.focus();
      }
      return;
    }

    onSave(task.id, {
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      completed,
    });
  };

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2
            id="edit-task-modal-title"
            className="font-display text-base font-semibold text-slate-900"
          >
            Edit Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit modal"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
          <div>
            <label
              htmlFor="edit-task-title"
              className="block text-sm font-medium text-slate-700"
            >
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="edit-task-title"
              type="text"
              maxLength={120}
              value={values.title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setValues((prev) => ({ ...prev, title: nextTitle }));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'edit-task-title-error' : undefined}
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 bg-white focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {errors.title && (
              <p
                id="edit-task-title-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-task-description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <span className="font-mono text-xs text-slate-400 tabular-nums">
                {values.description.length}/500
              </span>
            </div>
            <textarea
              id="edit-task-description"
              rows={3}
              maxLength={500}
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Optional task details..."
              className="mt-1.5 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-task-due-date"
                className="block text-sm font-medium text-slate-700"
              >
                Due Date
              </label>
              <input
                id="edit-task-due-date"
                type="date"
                value={values.dueDate}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700">
                Priority
              </span>
              <div
                role="radiogroup"
                aria-label="Edit task priority"
                className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1"
              >
                {priorities.map((option) => {
                  const selected = values.priority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          priority: option.value,
                        }))
                      }
                      className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                        selected
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Completion status checkbox */}
          <div className="pt-1">
            <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium text-slate-700">
                Mark task as completed
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
