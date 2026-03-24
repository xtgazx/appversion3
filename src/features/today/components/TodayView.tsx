import React from "react";
import { Card } from "../../../components/ui/Card";
import { TaskCard } from "../../../components/shared/TaskCard";
import type { FlatTask } from "../../../lib/types/shared";

export function TodayView({
  todayTasks,
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
  todayTasks: FlatTask[];
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
          Today
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Focus on what matters now
        </div>
      </div>

      <div className="space-y-3 px-5 pb-5">
        {todayTasks.length ? (
          todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              areaName={task.areaName}
              projectName={task.projectName}
              showHint={false}
              viewMode="today"
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
            Nothing in Today yet.
          </div>
        )}
      </div>
    </Card>
  );
}
