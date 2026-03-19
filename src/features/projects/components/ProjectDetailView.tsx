import React from "react";
import { Card } from "../../../components/ui/Card";
import { MetaPill } from "../../../components/ui/MetaPill";
import { TaskCard } from "../../../components/shared/TaskCard";
import type { Area, Project } from "../../../lib/types/shared";

export function ProjectDetailView({
  area,
  project,
  isAddingTask,
  newTaskTitle,
  setNewTaskTitle,
  setIsAddingTask,
  setAreas,
  addTaskToSelectedProject,
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
  area: Area;
  project: Project;
  isAddingTask: boolean;
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  addTaskToSelectedProject: () => void;
  toggleTask: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  setTaskTitle: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    title: string
  ) => void;
  setTaskDate: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    due: string
  ) => void;
  addToWeek: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  addToToday: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  removeFromWeek: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  removeFromToday: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  deleteTask: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    label: string,
    scope: "project" | "area"
  ) => void;
  cycleTaskDuration: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-3 px-5 py-5">
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Project Overview
          </div>
          <input
            value={project.name}
            onChange={(e) =>
              setAreas((current) =>
                current.map((currentArea) =>
                  currentArea.id !== area.id
                    ? currentArea
                    : {
                        ...currentArea,
                        projects: currentArea.projects.map((currentProject) =>
                          currentProject.id !== project.id
                            ? currentProject
                            : { ...currentProject, name: e.target.value }
                        ),
                      }
                )
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <textarea
            value={project.notes}
            onChange={(e) =>
              setAreas((current) =>
                current.map((currentArea) =>
                  currentArea.id !== area.id
                    ? currentArea
                    : {
                        ...currentArea,
                        projects: currentArea.projects.map((currentProject) =>
                          currentProject.id !== project.id
                            ? currentProject
                            : { ...currentProject, notes: e.target.value }
                        ),
                      }
                )
              )
            }
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <div>
            <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Due Date
            </div>
            <input
              type="date"
              value={project.dueDate}
              onChange={(e) =>
                setAreas((current) =>
                  current.map((currentArea) =>
                    currentArea.id !== area.id
                      ? currentArea
                      : {
                          ...currentArea,
                          projects: currentArea.projects.map((currentProject) =>
                            currentProject.id !== project.id
                              ? currentProject
                              : { ...currentProject, dueDate: e.target.value }
                          ),
                        }
                  )
                )
              }
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <MetaPill>{project.dueDate || "No due date"}</MetaPill>
            <MetaPill>Status: {project.status}</MetaPill>
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-5 pb-3 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Tasks
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                This project’s task list
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingTask((value) => !value)}
              className="rounded-full bg-indigo-600 px-3 py-2 text-sm text-white"
            >
              Add Task
            </button>
          </div>
        </div>
        <div className="space-y-3 px-5 pb-5">
          {isAddingTask && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="space-y-3">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTaskToSelectedProject();
                  }}
                  placeholder="Task title"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTaskToSelectedProject}
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
                  >
                    Save Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {project.tasks.length ? (
            project.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  ...task,
                  areaId: area.id,
                  areaName: area.name,
                  projectId: project.id,
                  projectName: project.name,
                  scope: "project",
                }}
                areaName={area.name}
                projectName={project.name}
                showHint={true}
                viewMode="project"
                onToggle={() => toggleTask(area.id, project.id, task.id, "project")}
                onSaveTitle={(value) =>
                  setTaskTitle(area.id, project.id, task.id, "project", value)
                }
                onSaveDue={(value) =>
                  setTaskDate(area.id, project.id, task.id, "project", value)
                }
                onAddWeek={() => addToWeek(area.id, project.id, task.id, "project")}
                onAddToday={() => addToToday(area.id, project.id, task.id, "project")}
                onRemoveWeek={() =>
                  removeFromWeek(area.id, project.id, task.id, "project")
                }
                onRemoveToday={() =>
                  removeFromToday(area.id, project.id, task.id, "project")
                }
                onDelete={() =>
                  deleteTask(area.id, project.id, task.id, task.title, "project")
                }
                onCycleDuration={() =>
                  cycleTaskDuration(area.id, project.id, task.id, "project")
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No tasks yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}