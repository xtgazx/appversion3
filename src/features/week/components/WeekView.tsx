import React from "react";
import { Card } from "../../../components/ui/Card";
import { TaskCard } from "../../../components/shared/TaskCard";
import type { FlatTask } from "../../../lib/types/shared";

export function WeekView({
  weekTasks,
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
  weekTasks: FlatTask[];
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
  return (
    <Card>
      <div className="px-5 pb-3 pt-5">
        <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Weekly queue
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Tasks added from areas and projects
        </div>
      </div>

      <div className="space-y-3 px-5 pb-5">
        {weekTasks.length ? (
          weekTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              areaName={task.areaName}
              projectName={task.projectName}
              showHint={false}
              viewMode="week"
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
                removeFromWeek(
                  task.areaId,
                  task.projectId,
                  task.id,
                  task.scope
                )
              }
              onRemoveToday={() =>
                removeFromToday(
                  task.areaId,
                  task.projectId,
                  task.id,
                  task.scope
                )
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
            Nothing in This Week yet.
          </div>
        )}
      </div>
    </Card>
  );
}
