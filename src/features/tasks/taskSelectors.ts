import type { Area, FlatTask } from "../../lib/types/shared";

export function selectAllTasks(areas: Area[]): FlatTask[] {
  return areas.flatMap((area) => [
    ...area.tasks.map((task) => ({
      ...task,
      areaId: area.id,
      areaName: area.name,
      projectId: null,
      projectName: null,
      scope: "area" as const,
    })),
    ...area.projects.flatMap((project) =>
      project.tasks.map((task) => ({
        ...task,
        areaId: area.id,
        areaName: area.name,
        projectId: project.id,
        projectName: project.name,
        scope: "project" as const,
      }))
    ),
  ]);
}

export function selectWeekTasks(allTasks: FlatTask[]): FlatTask[] {
  return allTasks.filter((task) => task.inWeek);
}

export function selectTodayTasks(allTasks: FlatTask[]): FlatTask[] {
  return allTasks.filter((task) => task.inToday);
}

export function selectCompletedTasks(allTasks: FlatTask[]): FlatTask[] {
  return allTasks.filter((task) => task.done).slice(0, 3);
}