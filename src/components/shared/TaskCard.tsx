import React, { useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import type { FlatTask } from "../../lib/types/shared";
import { MetaPill } from "../ui/MetaPill";
import { InlineText } from "../ui/InlineText";

export function TaskCard({
  task,
  areaName,
  projectName,
  showHint,
  viewMode,
  onToggle,
  onSaveTitle,
  onSaveDue,
  onAddWeek,
  onAddToday,
  onRemoveWeek,
  onRemoveToday,
  onDelete,
  onCycleDuration,
  onConvertToProject,
}: {
  task: FlatTask;
  areaName: string;
  projectName: string | null;
  showHint: boolean;
  viewMode: "project" | "week" | "today" | "area";
  onToggle: () => void;
  onSaveTitle: (value: string) => void;
  onSaveDue: (value: string) => void;
  onAddWeek: () => void;
  onAddToday: () => void;
  onRemoveWeek: () => void;
  onRemoveToday: () => void;
  onDelete: () => void;
  onCycleDuration: () => void;
  onConvertToProject?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

    const dotColor = task.done
    ? "bg-slate-300 dark:bg-slate-500"
    : task.duration === "quick"
      ? "bg-green-500"
      : task.duration === "medium"
        ? "bg-yellow-400"
        : task.duration === "long"
          ? "bg-red-500"
          : "bg-slate-200 dark:bg-slate-600";

  const dotLabel =
    task.duration === "quick"
      ? "Under 5 minutes"
      : task.duration === "medium"
        ? "Under 30 minutes"
        : task.duration === "long"
          ? "Over 30 minutes"
          : "No duration set";

  const dueLabel = task.due
    ? new Date(`${task.due}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  const canConvertToProject = Boolean(onConvertToProject && !projectName);

  return (
    <div
      className={`rounded-2xl border border-slate-200 px-3 py-3 dark:border-slate-700 ${
        task.done ? "bg-slate-50 opacity-80 dark:bg-slate-900" : "bg-white dark:bg-slate-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={onToggle} className="mt-0.5 shrink-0">
          <CheckCircle2
            className={`h-5 w-5 ${
              task.done ? "text-emerald-600" : "text-slate-300 dark:text-slate-500"
            }`}
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={onCycleDuration}
              title={dotLabel}
              className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`}
            />

            <div className="min-w-0 flex-1">
              <InlineText
                value={task.title}
                onSave={onSaveTitle}
                displayClassName={`w-full rounded-xl px-1 py-1 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                  task.done ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-0.5 shrink-0 rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label={expanded ? "Hide task options" : "Show task options"}
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <MetaPill>{areaName}</MetaPill>
            {projectName ? <MetaPill>{projectName}</MetaPill> : <MetaPill>Task</MetaPill>}
            {task.inWeek ? <MetaPill>Week</MetaPill> : null}
            {task.inToday ? <MetaPill>Today</MetaPill> : null}
            {dueLabel ? (
              <MetaPill>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {dueLabel}
                </span>
              </MetaPill>
            ) : null}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {(viewMode === "project" || viewMode === "area") && (
              <>
                {task.inWeek ? (
                  <button
                    type="button"
                    onClick={onRemoveWeek}
                    className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    Remove from Week
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAddWeek}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    Add to Week
                  </button>
                )}

                {task.inToday ? (
                  <button
                    type="button"
                    onClick={onRemoveToday}
                    className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    Remove from Today
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAddToday}
                    className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                  >
                    Add to Today
                  </button>
                )}
              </>
            )}

            {viewMode === "week" && task.inWeek && (
              <>
                <button
                  type="button"
                  onClick={onRemoveWeek}
                  className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                >
                  Remove
                </button>
                {task.inToday ? (
                  <button
                    type="button"
                    onClick={onRemoveToday}
                    className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    Remove Today
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAddToday}
                    className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                  >
                    Add to Today
                  </button>
                )}
              </>
            )}

            {viewMode === "today" && task.inToday && (
              <button
                type="button"
                onClick={onRemoveToday}
                className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                Remove
              </button>
            )}

            {canConvertToProject ? (
              <button
                type="button"
                onClick={onConvertToProject}
                className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"
              >
                Convert to Project
              </button>
            ) : null}

            <button
              type="button"
              onClick={onDelete}
              className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-200"
            >
              Delete
            </button>
          </div>

          <div className="mt-3">
            <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Due Date
            </div>
            <input
              type="date"
              value={task.due}
              onChange={(e) => onSaveDue(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
