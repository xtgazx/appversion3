import type {
  Area,
  BrainItem,
  Duration,
  Idea,
  Project,
  Task,
} from "../types/shared";
import { uid } from "./ids";

export function normalizeDuration(value: unknown): Duration {
  return value === "quick" || value === "medium" || value === "long"
    ? value
    : null;
}

export function normalizeTask(value: unknown): Task | null {
  if (!value || typeof value !== "object") return null;
  const task = value as Record<string, unknown>;

  return {
    id: typeof task.id === "string" ? task.id : uid("task"),
    title:
      typeof task.title === "string" && task.title.trim()
        ? task.title
        : "Untitled Task",
    done: Boolean(task.done),
    due: typeof task.due === "string" ? task.due : "",
    inWeek: Boolean(task.inWeek),
    inToday: Boolean(task.inToday),
    duration: normalizeDuration(task.duration),
  };
}

export function normalizeProject(value: unknown): Project | null {
  if (!value || typeof value !== "object") return null;
  const project = value as Record<string, unknown>;

  return {
    id: typeof project.id === "string" ? project.id : uid("project"),
    name:
      typeof project.name === "string" && project.name.trim()
        ? project.name
        : "Untitled Project",
    notes: typeof project.notes === "string" ? project.notes : "",
    dueDate: typeof project.dueDate === "string" ? project.dueDate : "",
    status:
      typeof project.status === "string" && project.status.trim()
        ? project.status
        : "Active",
    tasks: Array.isArray(project.tasks)
      ? (project.tasks.map(normalizeTask).filter(Boolean) as Task[])
      : [],
  };
}

export function normalizeIdea(value: unknown): Idea | null {
  if (!value || typeof value !== "object") return null;
  const idea = value as Record<string, unknown>;

  return {
    id: typeof idea.id === "string" ? idea.id : uid("idea"),
    title:
      typeof idea.title === "string" && idea.title.trim()
        ? idea.title
        : "Untitled Idea",
  };
}

export function normalizeArea(
  value: unknown,
  allowedColors: readonly string[]
): Area | null {
  if (!value || typeof value !== "object") return null;
  const area = value as Record<string, unknown>;

  const color =
    typeof area.color === "string" && allowedColors.includes(area.color)
      ? area.color
      : allowedColors[0] ?? "from-slate-100 to-zinc-50";

  return {
    id: typeof area.id === "string" ? area.id : uid("area"),
    name:
      typeof area.name === "string" && area.name.trim()
        ? area.name
        : "Untitled Area",
    iconKey: typeof area.iconKey === "string" ? area.iconKey : "clipboard",
    color,
    ideas: Array.isArray(area.ideas)
      ? (area.ideas.map(normalizeIdea).filter(Boolean) as Idea[])
      : [],
    projects: Array.isArray(area.projects)
      ? (area.projects.map(normalizeProject).filter(Boolean) as Project[])
      : [],
    tasks: Array.isArray(area.tasks)
      ? (area.tasks.map(normalizeTask).filter(Boolean) as Task[])
      : [],
  };
}

export function normalizeBrainItem(value: unknown): BrainItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;

  return {
    id: typeof item.id === "string" ? item.id : uid("brain"),
    text: typeof item.text === "string" ? item.text : "",
  };
}