import React from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  Trash2,
} from "lucide-react";
import type { Area, IconKey } from "../../../lib/types/shared";
import { iconMap } from "../../../lib/icons/iconMap";
import { Card } from "../../../components/ui/Card";
import { MetaPill } from "../../../components/ui/MetaPill";
import { IconPicker } from "../../../components/ui/IconPicker";
import { InlineText } from "../../../components/ui/InlineText";
import { TaskCard } from "../../../components/shared/TaskCard";

export function AreaDetailView({
  selectedArea,
  editingAreaIconId,
  ideasExpanded,
  newProjectName,
  newAreaTaskTitle,
  newIdeaTitle,
  setNewProjectName,
  setNewAreaTaskTitle,
  setNewIdeaTitle,
  setIdeasExpanded,
  setEditingAreaIconId,
  setAreas,
  onRenameArea,
  onCycleAreaColor,
  onDeleteArea,
  onSetAreaIcon,
  onAddProject,
  onOpenProject,
  onDeleteProject,
  onAddAreaTask,
  onToggleTask,
  onSetTaskTitle,
  onSetTaskDate,
  onAddToWeek,
  onAddToToday,
  onRemoveFromWeek,
  onRemoveFromToday,
  onDeleteTask,
  onCycleTaskDuration,
  onAddIdea,
  onDeleteIdea,
  onConvertIdea,
}: {
  selectedArea: Area;
  editingAreaIconId: string | null;
  ideasExpanded: boolean;
  newProjectName: string;
  newAreaTaskTitle: string;
  newIdeaTitle: string;
  setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
  setNewAreaTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewIdeaTitle: React.Dispatch<React.SetStateAction<string>>;
  setIdeasExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingAreaIconId: React.Dispatch<React.SetStateAction<string | null>>;
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  onRenameArea: (areaId: string) => void;
  onCycleAreaColor: (areaId: string) => void;
  onDeleteArea: (areaId: string) => void;
  onSetAreaIcon: (areaId: string, iconKey: IconKey) => void;
  onAddProject: (areaId: string) => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (areaId: string, projectId: string) => void;
  onAddAreaTask: (areaId: string) => void;
  onToggleTask: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onSetTaskTitle: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    title: string
  ) => void;
  onSetTaskDate: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    due: string
  ) => void;
  onAddToWeek: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onAddToToday: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onRemoveFromWeek: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onRemoveFromToday: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onDeleteTask: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    label: string,
    scope: "project" | "area"
  ) => void;
  onCycleTaskDuration: (
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) => void;
  onAddIdea: (areaId: string) => void;
  onDeleteIdea: (areaId: string, ideaId: string) => void;
  onConvertIdea: (areaId: string, ideaId: string) => void;
}) {
  const AreaIcon =
    iconMap[selectedArea.iconKey as keyof typeof iconMap] ?? iconMap.clipboard;

  return (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <Card
        className={`bg-gradient-to-b dark:from-slate-800 dark:to-slate-700/90 dark:shadow-black/30 md:col-span-2 ${selectedArea.color}`}
      >
        <div className="px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/85 p-3 shadow-sm dark:bg-slate-900/80">
                <AreaIcon className="h-5 w-5 text-slate-700 dark:text-slate-100" />
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {selectedArea.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Projects, tasks, and ideas
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => onRenameArea(selectedArea.id)}
                className="rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              >
                Edit Name
              </button>
              <button
                type="button"
                onClick={() => onCycleAreaColor(selectedArea.id)}
                className="rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              >
                Color
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingAreaIconId((current) =>
                    current === selectedArea.id ? null : selectedArea.id
                  )
                }
                className="rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              >
                Icon
              </button>
              <button
                type="button"
                onClick={() => onDeleteArea(selectedArea.id)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
              >
                Delete
              </button>
            </div>
          </div>

          {editingAreaIconId === selectedArea.id && (
            <div className="mt-4">
              <IconPicker
                selected={selectedArea.iconKey}
                onSelect={(icon) => {
                  onSetAreaIcon(selectedArea.id, icon);
                  setEditingAreaIconId(null);
                }}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="border-l-4 border-l-slate-400 bg-white dark:bg-slate-800 md:col-span-1">
        <div className="px-5 pb-3 pt-5">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <ClipboardList className="h-4 w-4" />
            Projects
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 px-5 pb-5 pt-4 dark:border-slate-700">
          
          {selectedArea.projects.length ? (
            selectedArea.projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="flex-1 text-left"
                  >
                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {project.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {project.notes || "No notes yet"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <MetaPill>{project.dueDate || "No due date"}</MetaPill>
                      <MetaPill>Status: {project.status}</MetaPill>
                      <MetaPill>{project.tasks.length} tasks</MetaPill>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project.id)}
                      className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(selectedArea.id, project.id)}
                      className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No projects yet.
            </div>
          )}
        </div>
      </Card>

      <Card className="border-l-4 border-l-green-400 bg-slate-50/90 dark:bg-slate-900/90 md:col-span-1">
        <div className="px-5 pb-3 pt-5">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <CheckCircle2 className="h-4 w-4" />
            Tasks
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            One-off tasks for this area
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 px-5 pb-5 pt-4 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              value={newAreaTaskTitle}
              onChange={(e) => setNewAreaTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onAddAreaTask(selectedArea.id);
              }}
              placeholder="Add one-off task"
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => onAddAreaTask(selectedArea.id)}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
            >
              Add Task
            </button>
          </div>

          {selectedArea.tasks.length ? (
            selectedArea.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  ...task,
                  areaId: selectedArea.id,
                  areaName: selectedArea.name,
                  projectId: null,
                  projectName: null,
                  scope: "area",
                }}
                areaName={selectedArea.name}
                projectName={null}
                showHint={true}
                viewMode="area"
                onToggle={() => onToggleTask(selectedArea.id, null, task.id, "area")}
                onSaveTitle={(value) =>
                  onSetTaskTitle(selectedArea.id, null, task.id, "area", value)
                }
                onSaveDue={(value) =>
                  onSetTaskDate(selectedArea.id, null, task.id, "area", value)
                }
                onAddWeek={() => onAddToWeek(selectedArea.id, null, task.id, "area")}
                onAddToday={() =>
                  onAddToToday(selectedArea.id, null, task.id, "area")
                }
                onRemoveWeek={() =>
                  onRemoveFromWeek(selectedArea.id, null, task.id, "area")
                }
                onRemoveToday={() =>
                  onRemoveFromToday(selectedArea.id, null, task.id, "area")
                }
                onDelete={() =>
                  onDeleteTask(selectedArea.id, null, task.id, task.title, "area")
                }
                onCycleDuration={() =>
                  onCycleTaskDuration(selectedArea.id, null, task.id, "area")
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              No one-off tasks yet.
            </div>
          )}
        </div>
      </Card>

      <Card className="border-l-4 border-l-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/30 md:col-span-2">
        <div className="px-5 pb-3 pt-5">
          <button
            type="button"
            onClick={() => setIdeasExpanded((current) => !current)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                <Lightbulb className="h-4 w-4" />
                Ideas
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Lightweight ideas before they become projects
              </div>
            </div>
            {ideasExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </div>

        {ideasExpanded && (
          <div className="space-y-3 border-t border-slate-200/70 px-5 pb-5 pt-4 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAddIdea(selectedArea.id);
                }}
                placeholder="Add an idea"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => onAddIdea(selectedArea.id)}
                className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>

            {selectedArea.ideas.length ? (
              selectedArea.ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <InlineText
                        value={idea.title}
                        onSave={(value) =>
                          setAreas((current) =>
                            current.map((area) =>
                              area.id !== selectedArea.id
                                ? area
                                : {
                                    ...area,
                                    ideas: area.ideas.map((item) =>
                                      item.id !== idea.id
                                        ? item
                                        : { ...item, title: value }
                                    ),
                                  }
                            )
                          )
                        }
                        displayClassName="w-full rounded-xl px-1 py-1 text-left text-sm text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700/60"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onConvertIdea(selectedArea.id, idea.id)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        Convert
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteIdea(selectedArea.id, idea.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No ideas yet.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
