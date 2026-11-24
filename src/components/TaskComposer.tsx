import { FormEvent, RefObject, useState } from 'react';
import { AlertCircle, Plus, RotateCcw } from 'lucide-react';
import { TaskFormErrors, TaskFormValues, TaskPriority } from '../types/task';
import { getTodayDateString, validateTaskForm } from '../utils/taskHelpers';

interface TaskComposerProps {
  onCreateTask: (values: TaskFormValues) => void;
  titleInputRef: RefObject<HTMLInputElement | null>;
}

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
};

export function TaskComposer({
  onCreateTask,
  titleInputRef,
}: TaskComposerProps) {
  const [values, setValues] = useState<TaskFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const isDirty =
    values.title.length > 0 ||
    values.description.length > 0 ||
    values.dueDate.length > 0 ||
    values.priority !== 'medium';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.title && titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    onCreateTask({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
    });

    setValues(INITIAL_VALUES);
    setErrors({});
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
  };

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <section
      aria-labelledby="create-task-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2
          id="create-task-heading"
          className="font-display text-base font-semibold text-slate-900"
        >
          Create New Task
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Add a task with due date and priority. Saved automatically in your browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Task Title */}
        <div>
          <label
            htmlFor="new-task-title"
            className="block text-sm font-medium text-slate-700"
          >
            Task Title <span className="text-red-600">*</span>
          </label>
          <input
            ref={titleInputRef}
            id="new-task-title"
            type="text"
            value={values.title}
            maxLength={120}
            onChange={(e) => {
              const nextTitle = e.target.value;
              setValues((prev) => ({ ...prev, title: nextTitle }));
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="e.g., Review Q4 engineering roadmap"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'new-task-title-error' : undefined}
            className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 ${
              errors.title
                ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 bg-white focus:border-blue-600 focus:ring-blue-100'
            }`}
          />
          {errors.title && (
            <p
              id="new-task-title-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-task-description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              {values.description.length}/500
            </span>
          </div>
          <textarea
            id="new-task-description"
            rows={3}
            maxLength={500}
            value={values.description}
            onChange={(e) => {
              const nextDesc = e.target.value;
              setValues((prev) => ({ ...prev, description: nextDesc }));
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Optional notes, context, or subtasks..."
            aria-invalid={Boolean(errors.description)}
            className="mt-1.5 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.description && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-task-due-date"
              className="block text-sm font-medium text-slate-700"
            >
              Due Date
            </label>
            <button
              type="button"
              onClick={() =>
                setValues((prev) => ({ ...prev, dueDate: getTodayDateString() }))
              }
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Set Today
            </button>
          </div>
          <input
            id="new-task-due-date"
            type="date"
            value={values.dueDate}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, dueDate: e.target.value }));
              if (errors.dueDate) {
                setErrors((prev) => ({ ...prev, dueDate: undefined }));
              }
            }}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.dueDate && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.dueDate}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <span className="block text-sm font-medium text-slate-700">
            Priority
          </span>
          <div
            role="radiogroup"
            aria-label="Task priority"
            className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1"
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
                    setValues((prev) => ({ ...prev, priority: option.value }))
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
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

        {/* Submit & Reset Actions */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 active:bg-blue-800 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Add Task</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Clear form"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
