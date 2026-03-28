import React, { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { TaskCard } from "../../../components/shared/TaskCard";
import { InlineText } from "../../../components/ui/InlineText";
import type { Area, BrainItem, FlatTask } from "../../../lib/types/shared";

type ReviewStep = 0 | 1 | 2 | 3 | 4;

export function ReviewView({
  areas,
  brainItems,
  allTasks,
  weekTasks,
  todayTasks,
  openBrainConvert,
  setConfirmState,
  onEditBrainItem,
  onAddProjectTask,
  toggleTask,
  setTaskTitle,
  setTaskDate,
  addToWeek,
  addToToday,
  removeFromWeek,
  removeFromToday,
  deleteTask,
  cycleTaskDuration,
}: {
  areas: Area[];
  brainItems: BrainItem[];
  allTasks: FlatTask[];
  weekTasks: FlatTask[];
  todayTasks: FlatTask[];
  openBrainConvert: (itemId: string) => void;
  setConfirmState: any;
  onEditBrainItem: (id: string, text: string) => void;
  onAddProjectTask: (areaId: string, projectId: string, title: string) => void;
  toggleTask: any;
  setTaskTitle: any;
  setTaskDate: any;
  addToWeek: any;
  addToToday: any;
  removeFromWeek: any;
  removeFromToday: any;
  deleteTask: any;
  cycleTaskDuration: any;
}) {
  const [step, setStep] = useState<ReviewStep>(0);
  const [projectTaskDrafts, setProjectTaskDrafts] = useState<Record<string, string>>(
    {}
  );

  const steps = [
    {
      title: "Brain Dump Cleanup",
      subtitle: "Process loose items before you plan the week",
    },
    {
      title: "Project Review",
      subtitle: "Make sure every project has a next action",
    },
    {
      title: "Build Week",
      subtitle: "Choose what belongs in this week",
    },
    {
      title: "Build Today",
      subtitle: "Optionally choose what deserves immediate focus",
    },
    {
      title: "Complete",
      subtitle: "Your weekly reset is finished",
    },
  ] as const;

  const projectRows = useMemo(
    () =>
      areas.flatMap((area) =>
        area.projects.map((project) => ({
          areaId: area.id,
          areaName: area.name,
          projectId: project.id,
          projectName: project.name,
          taskCount: project.tasks.length,
          tasks: project.tasks,
        }))
      ),
    [areas]
  );

  const projectsMissingNextAction = projectRows.filter(
    (project) => project.taskCount === 0
  ).length;

  const summary = {
    brainItems: brainItems.length,
    projects: projectRows.length,
    projectsWithNextAction: projectRows.filter((project) => project.taskCount > 0)
      .length,
    weekTasks: weekTasks.length,
    todayTasks: todayTasks.length,
  };

  function updateProjectDraft(projectId: string, value: string) {
    setProjectTaskDrafts((current) => ({
      ...current,
      [projectId]: value,
    }));
  }

  function submitProjectTask(areaId: string, projectId: string) {
    const value = (projectTaskDrafts[projectId] ?? "").trim();
    if (!value) return;
    onAddProjectTask(areaId, projectId, value);
    setProjectTaskDrafts((current) => ({
      ...current,
      [projectId]: "",
    }));
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="px-5 pb-4 pt-5">
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Weekly Review
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {steps[step].subtitle}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {steps.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  index === step
                    ? "bg-indigo-600 text-white"
                    : index < step
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {index + 1}. {item.title}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {step === 0 && (
        <Card>
          <div className="px-5 pb-3 pt-5">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Brain Dump Cleanup
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Convert or delete everything loose before moving on.
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5">
            {brainItems.length ? (
              brainItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="min-w-0 flex-1">
                    <InlineText
                      value={item.text}
                      onSave={(value) => onEditBrainItem(item.id, value)}
                    />
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openBrainConvert(item.id)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Convert
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmState({
                          kind: "brain",
                          itemId: item.id,
                          label: item.text,
                        })
                      }
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Brain Dump is clear.
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <div className="px-5 pb-3 pt-5">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Project Review
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Every project should have at least one next action.
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5">
            {projectRows.length ? (
              projectRows.map((project) => {
                const isMissingTask = project.taskCount === 0;

                return (
                  <div
                    key={project.projectId}
                    className={`rounded-2xl border px-4 py-4 ${
                      isMissingTask
                        ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {project.projectName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {project.areaName}
                        </div>
                      </div>

                      <div
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isMissingTask
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                        }`}
                      >
                        {isMissingTask ? "Needs next action" : `${project.taskCount} task${project.taskCount === 1 ? "" : "s"}`}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        value={projectTaskDrafts[project.projectId] ?? ""}
                        onChange={(e) =>
                          updateProjectDraft(project.projectId, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            submitProjectTask(project.areaId, project.projectId);
                          }
                        }}
                        placeholder="Add next task"
                        className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => submitProjectTask(project.areaId, project.projectId)}
                        className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No projects to review yet.
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <div className="px-5 pb-3 pt-5">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Build Week
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Review all tasks and add the right ones to This Week.
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5">
            {allTasks.length ? (
              allTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  areaName={task.areaName}
                  projectName={task.projectName}
                  showHint={false}
                  viewMode="area"
                  onToggle={() =>
                    toggleTask(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onSaveTitle={(value) =>
                    setTaskTitle(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope,
                      value
                    )
                  }
                  onSaveDue={(value) =>
                    setTaskDate(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope,
                      value
                    )
                  }
                  onAddWeek={() =>
                    addToWeek(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onAddToday={() =>
                    addToToday(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onRemoveWeek={() =>
                    removeFromWeek(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onRemoveToday={() =>
                    removeFromToday(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onDelete={() =>
                    deleteTask(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.title,
                      task.scope
                    )
                  }
                  onCycleDuration={() =>
                    cycleTaskDuration(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope
                    )
                  }
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No tasks available yet.
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div className="px-5 pb-3 pt-5">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Build Today
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Optional: choose what deserves immediate attention.
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5">
            {allTasks.length ? (
              allTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  areaName={task.areaName}
                  projectName={task.projectName}
                  showHint={false}
                  viewMode="area"
                  onToggle={() =>
                    toggleTask(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onSaveTitle={(value) =>
                    setTaskTitle(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope,
                      value
                    )
                  }
                  onSaveDue={(value) =>
                    setTaskDate(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope,
                      value
                    )
                  }
                  onAddWeek={() =>
                    addToWeek(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onAddToday={() =>
                    addToToday(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onRemoveWeek={() =>
                    removeFromWeek(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onRemoveToday={() =>
                    removeFromToday(task.areaId, task.projectId, task.id, task.scope)
                  }
                  onDelete={() =>
                    deleteTask(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.title,
                      task.scope
                    )
                  }
                  onCycleDuration={() =>
                    cycleTaskDuration(
                      task.areaId,
                      task.projectId,
                      task.id,
                      task.scope
                    )
                  }
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No tasks available yet.
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <div className="px-5 pb-3 pt-5">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              System reset complete
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Your system is cleaned up and ready.
            </div>
          </div>

          <div className="space-y-3 px-5 pb-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="text-sm text-slate-700 dark:text-slate-200">
                Brain items remaining: <span className="font-semibold">{summary.brainItems}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Projects reviewed: <span className="font-semibold">{summary.projects}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Projects with next action:{" "}
                <span className="font-semibold">{summary.projectsWithNextAction}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Tasks in Week: <span className="font-semibold">{summary.weekTasks}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Tasks in Today: <span className="font-semibold">{summary.todayTasks}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
              System reset complete.
              {projectsMissingNextAction > 0
                ? ` ${projectsMissingNextAction} project${projectsMissingNextAction === 1 ? " still needs" : "s still need"} a next action.`
                : " Every project has at least one next action."}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1) as ReviewStep)}
            disabled={step === 0}
            className={`rounded-2xl px-4 py-2 text-sm ${
              step === 0
                ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                : "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            Back
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Step {step + 1} of {steps.length}
          </div>

          <button
            type="button"
            onClick={() =>
              setStep((current) =>
                Math.min(steps.length - 1, current + 1) as ReviewStep
              )
            }
            disabled={step === steps.length - 1}
            className={`rounded-2xl px-4 py-2 text-sm ${
              step === steps.length - 1
                ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                : "bg-indigo-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}