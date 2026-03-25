"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CalendarDays,
  CheckCircle2,
  Home,
  Sparkles,
  X,
} from "lucide-react";
import { areaColorOptions, defaultColor } from "../lib/data/initialData";
import { readStoredData, saveStoredData } from "../lib/storage/localStorage";
import type {
  Area,
  BrainConvertType,
  BrainItem,
  ConfirmState,
  IconKey,
  RenameAreaState,
  TabKey,
  Task,
} from "../lib/types/shared";
import { uid } from "../lib/utils/ids";
import { Card } from "../components/ui/Card";
import { BottomTab } from "../components/ui/BottomTab";
import { InlineText } from "../components/ui/InlineText";
import { TaskCard } from "../components/shared/TaskCard";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { ModalShell } from "../components/shared/ModalShell";
import { AreaGrid } from "../features/areas/components/AreaGrid";
import { AreaDetailView } from "../features/areas/components/AreaDetailView";
import { NewAreaModal } from "../features/areas/components/NewAreaModal";
import { RenameAreaModal } from "../features/areas/components/RenameAreaModal";
import { ProjectDetailView } from "../features/projects/components/ProjectDetailView";
import {
  selectAllTasks,
  selectCompletedTasks,
  selectTodayTasks,
  selectWeekTasks,
} from "../features/tasks/taskSelectors";
import { WeekView } from "../features/week/components/WeekView";
import { TodayView } from "../features/today/components/TodayView";
import { BrainDumpView } from "../features/brain/components/BrainDumpView";
import { ReviewView } from "../features/review/components/ReviewView";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  hasCompletedOnboarding,
  setCompletedOnboarding,
} from "../lib/storage/localStorage";

export default function Page() {
const [areas, setAreas] = useState<Area[]>([]);
const [brainItems, setBrainItems] = useState<BrainItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");  const [tab, setTab] = useState<TabKey>("areas");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [areaMenuOpen, setAreaMenuOpen] = useState<string | null>(null);
  const [editingAreaIconId, setEditingAreaIconId] = useState<string | null>(null);
  const [ideasExpanded, setIdeasExpanded] = useState(true);
  const [showNewArea, setShowNewArea] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaColor, setNewAreaColor] =
    useState<(typeof areaColorOptions)[number]>(defaultColor);
  const [newAreaIcon, setNewAreaIcon] = useState<IconKey>("clipboard");
  const [brainInput, setBrainInput] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newAreaTaskTitle, setNewAreaTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [brainConvertItemId, setBrainConvertItemId] = useState<string | null>(null);
  const [brainConvertAreaId, setBrainConvertAreaId] = useState<string | null>(null);
  const [brainConvertType, setBrainConvertType] =
    useState<BrainConvertType>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [renameAreaState, setRenameAreaState] =
    useState<RenameAreaState>(null);
  const saveTimerRef = useRef<number | null>(null);
  const hasInitializedSyncRef = useRef(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (!hasInitializedSyncRef.current) return;

const now = new Date().toISOString();

saveStoredData({ areas, brainItems, updatedAt: now });

  if (saveTimerRef.current) {
    window.clearTimeout(saveTimerRef.current);
  }

  saveTimerRef.current = window.setTimeout(() => {
    fetch("/api/save-state", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ areas, brainItems, updatedAt: now }),
}).catch(() => {});
  }, 500);
}, [areas, brainItems]);

  useEffect(() => {
  let isMounted = true;

  async function loadCloud() {
  const local = readStoredData();

  try {
    const res = await fetch("/api/load-state", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });
    console.log("LOAD RESPONSE STATUS:", res.status);
    const json = await res.json();
    console.log("LOAD JSON:", json);

    if (!isMounted) return;

    const cloud = json.success ? json.data : null;

    const localTime = new Date(local.updatedAt || 0).getTime();
    const cloudTime = new Date(cloud?.updatedAt || 0).getTime();

    console.log("LOCAL:", local);
    console.log("CLOUD:", cloud);
    console.log("LOCAL TIME:", localTime);
    console.log("CLOUD TIME:", cloudTime);
    
    if (cloud && cloudTime > localTime) {
  setAreas(cloud.areas ?? []);
  setBrainItems(cloud.brainItems ?? []);
  setUpdatedAt(cloud.updatedAt ?? new Date().toISOString());
} else {
  setAreas(local.areas ?? []);
  setBrainItems(local.brainItems ?? []);
  setUpdatedAt(local.updatedAt ?? new Date().toISOString());
}
  } catch (e) {
    console.error("cloud load failed", e);

    if (!isMounted) return;

    const local = readStoredData();
    setAreas(local.areas ?? []);
    setBrainItems(local.brainItems ?? []);
    setUpdatedAt(local.updatedAt ?? new Date().toISOString());
  } finally {
    if (isMounted) {
      hasInitializedSyncRef.current = true;
    }
  }
}

  loadCloud();

  return () => {
    isMounted = false;
  };
}, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setAreaMenuOpen(null);
    setEditingAreaIconId(null);
    setIsAddingTask(false);
    setNewTaskTitle("");
  }, [selectedAreaId, selectedProjectId, tab]);

  useEffect(() => {
  if (!hasCompletedOnboarding()) {
    setShowOnboarding(true);
  }
}, []);

  const selectedArea = areas.find((area) => area.id === selectedAreaId) ?? null;
  const selectedProject =
    selectedArea?.projects.find((project) => project.id === selectedProjectId) ??
    null;
  const activeBrainItem =
    brainItems.find((item) => item.id === brainConvertItemId) ?? null;

  const allTasks = useMemo(() => selectAllTasks(areas), [areas]);
  const weekTasks = useMemo(() => selectWeekTasks(allTasks), [allTasks]);
  const todayTasks = useMemo(() => selectTodayTasks(allTasks), [allTasks]);
  const completedTasks = useMemo(() => selectCompletedTasks(allTasks), [allTasks]);

  function showSaved() {
    saveStoredData({ areas, brainItems, updatedAt });
    setSaveMessage("Saved");
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setSaveMessage(""), 1200);
  }

  function openArea(areaId: string) {
    setSelectedAreaId(areaId);
    setSelectedProjectId(null);
  }

  function updateProjectTask(
    areaId: string,
    projectId: string,
    taskId: string,
    updater: (task: Task) => Task
  ) {
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : {
              ...area,
              projects: area.projects.map((project) =>
                project.id !== projectId
                  ? project
                  : {
                      ...project,
                      tasks: project.tasks.map((task) =>
                        task.id === taskId ? updater(task) : task
                      ),
                    }
              ),
            }
      )
    );
  }

  function updateAreaTask(
    areaId: string,
    taskId: string,
    updater: (task: Task) => Task
  ) {
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : {
              ...area,
              tasks: area.tasks.map((task) =>
                task.id === taskId ? updater(task) : task
              ),
            }
      )
    );
  }

  function toggleTask(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({
        ...task,
        done: !task.done,
      }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({ ...task, done: !task.done }));
    }
  }

  function setTaskDate(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    due: string
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({ ...task, due }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({ ...task, due }));
    }
  }

  function setTaskTitle(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area",
    title: string
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({ ...task, title }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({ ...task, title }));
    }
  }

  function cycleTaskDuration(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    const updater = (task: Task): Task => ({
      ...task,
      duration:
        task.duration === null
          ? "quick"
          : task.duration === "quick"
            ? "medium"
            : task.duration === "medium"
              ? "long"
              : null,
    });
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, updater);
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, updater);
    }
  }

  function addToWeek(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({
        ...task,
        inWeek: true,
      }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({ ...task, inWeek: true }));
    }
  }

  function addToToday(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({
        ...task,
        inWeek: true,
        inToday: true,
      }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({
        ...task,
        inWeek: true,
        inToday: true,
      }));
    }
  }

  function removeFromWeek(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({
        ...task,
        inWeek: false,
        inToday: false,
      }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({
        ...task,
        inWeek: false,
        inToday: false,
      }));
    }
  }

  function removeFromToday(
    areaId: string,
    projectId: string | null,
    taskId: string,
    scope: "project" | "area"
  ) {
    if (scope === "project" && projectId) {
      updateProjectTask(areaId, projectId, taskId, (task) => ({
        ...task,
        inToday: false,
      }));
    }
    if (scope === "area") {
      updateAreaTask(areaId, taskId, (task) => ({ ...task, inToday: false }));
    }
  }

  function deleteTask(
    areaId: string,
    projectId: string | null,
    taskId: string,
    label: string,
    scope: "project" | "area"
  ) {
    setConfirmState({ kind: "task", areaId, projectId, taskId, label, scope });
  }

  function addBrainItem() {
    if (!brainInput.trim()) return;
    setBrainItems((current) => [
      { id: uid("brain"), text: brainInput.trim() },
      ...current,
    ]);
    setBrainInput("");
  }

  function createArea() {
    const name = newAreaName.trim();
    if (!name) return;
    setAreas((current) => [
      ...current,
      {
        id: uid("area"),
        name,
        iconKey: newAreaIcon,
        color: newAreaColor,
        ideas: [],
        projects: [],
        tasks: [],
      },
    ]);
    setNewAreaName("");
    setNewAreaColor(defaultColor);
    setNewAreaIcon("clipboard");
    setShowNewArea(false);
  }

  function addProject(areaId: string) {
    const name = newProjectName.trim();
    if (!name) return;
    const projectId = uid("project");
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : {
              ...area,
              projects: [
                ...area.projects,
                {
                  id: projectId,
                  name,
                  notes: "",
                  dueDate: "",
                  status: "Active",
                  tasks: [],
                },
              ],
            }
      )
    );
    setNewProjectName("");
    setShowAddProjectModal(false);
    setSelectedProjectId(projectId);
  }

  function addAreaTask(areaId: string) {
    const title = newAreaTaskTitle.trim();
    if (!title) return;
    const task: Task = {
      id: uid("task"),
      title,
      done: false,
      due: "",
      inWeek: false,
      inToday: false,
      duration: null,
    };
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : { ...area, tasks: [...area.tasks, task] }
      )
    );
    setNewAreaTaskTitle("");
    setShowAddTaskModal(false);
  }

  function addIdea(areaId: string) {
    const title = newIdeaTitle.trim();
    if (!title) return;
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : {
              ...area,
              ideas: [...area.ideas, { id: uid("idea"), title }],
            }
      )
    );
    setNewIdeaTitle("");
    setShowAddIdeaModal(false);
  }

  function deleteIdea(areaId: string, ideaId: string) {
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId
          ? area
          : {
              ...area,
              ideas: area.ideas.filter((idea) => idea.id !== ideaId),
            }
      )
    );
  }

  function convertIdea(areaId: string, ideaId: string) {
    const nextProjectId = uid("project");
    setAreas((current) =>
      current.map((area) => {
        if (area.id !== areaId) return area;
        const idea = area.ideas.find((item) => item.id === ideaId);
        if (!idea) return area;
        return {
          ...area,
          ideas: area.ideas.filter((item) => item.id !== ideaId),
          projects: [
            ...area.projects,
            {
              id: nextProjectId,
              name: idea.title,
              notes: "",
              dueDate: "",
              status: "Active",
              tasks: [],
            },
          ],
        };
      })
    );
    setSelectedProjectId(nextProjectId);
  }

  function deleteArea(areaId: string) {
    const area = areas.find((item) => item.id === areaId);
    if (!area) return;
    setConfirmState({ kind: "area", areaId, label: area.name });
  }

  function renameArea(areaId: string) {
    const area = areas.find((item) => item.id === areaId);
    if (!area) return;
    setRenameAreaState({ areaId, value: area.name });
  }

  function confirmRenameArea() {
    if (!renameAreaState) return;
    const nextName = renameAreaState.value.trim();
    if (!nextName) return;
    setAreas((current) =>
      current.map((item) =>
        item.id !== renameAreaState.areaId ? item : { ...item, name: nextName }
      )
    );
    setAreaMenuOpen(null);
    setEditingAreaIconId(null);
    setRenameAreaState(null);
  }

  function setAreaIcon(areaId: string, iconKey: IconKey) {
    setAreas((current) =>
      current.map((area) =>
        area.id !== areaId ? area : { ...area, iconKey }
      )
    );
  }

  function cycleAreaColor(areaId: string) {
    setAreas((current) =>
      current.map((area) => {
        if (area.id !== areaId) return area;
        const index = areaColorOptions.indexOf(
          area.color as (typeof areaColorOptions)[number]
        );
        const safeIndex = index === -1 ? 0 : index;
        return {
          ...area,
          color: areaColorOptions[(safeIndex + 1) % areaColorOptions.length],
        };
      })
    );
  }

  function deleteProject(areaId: string, projectId: string) {
    const project = areas
      .find((area) => area.id === areaId)
      ?.projects.find((item) => item.id === projectId);
    if (!project) return;
    setConfirmState({
      kind: "project",
      areaId,
      projectId,
      label: project.name,
    });
  }

  function confirmDelete() {
    if (!confirmState) return;

    if (confirmState.kind === "area") {
      setAreas((current) =>
        current.filter((area) => area.id !== confirmState.areaId)
      );
      if (selectedAreaId === confirmState.areaId) {
        setSelectedAreaId(null);
        setSelectedProjectId(null);
      }
    }

    if (confirmState.kind === "project") {
      setAreas((current) =>
        current.map((area) =>
          area.id !== confirmState.areaId
            ? area
            : {
                ...area,
                projects: area.projects.filter(
                  (project) => project.id !== confirmState.projectId
                ),
              }
        )
      );
      if (selectedProjectId === confirmState.projectId) {
        setSelectedProjectId(null);
      }
    }

    if (confirmState.kind === "task") {
      if (confirmState.scope === "project" && confirmState.projectId) {
        setAreas((current) =>
          current.map((area) =>
            area.id !== confirmState.areaId
              ? area
              : {
                  ...area,
                  projects: area.projects.map((project) =>
                    project.id !== confirmState.projectId
                      ? project
                      : {
                          ...project,
                          tasks: project.tasks.filter(
                            (task) => task.id !== confirmState.taskId
                          ),
                        }
                  ),
                }
          )
        );
      } else {
        setAreas((current) =>
          current.map((area) =>
            area.id !== confirmState.areaId
              ? area
              : {
                  ...area,
                  tasks: area.tasks.filter(
                    (task) => task.id !== confirmState.taskId
                  ),
                }
          )
        );
      }
    }

    if (confirmState.kind === "brain") {
      setBrainItems((current) =>
        current.filter((item) => item.id !== confirmState.itemId)
      );
      if (brainConvertItemId === confirmState.itemId) closeBrainConvert();
    }

    setConfirmState(null);
  }

  function addTaskToSelectedProject() {
    if (!selectedArea || !selectedProject) return;
    const title = newTaskTitle.trim();
    if (!title) return;
    const newTask: Task = {
      id: uid("task"),
      title,
      done: false,
      due: "",
      inWeek: false,
      inToday: false,
      duration: null,
    };
    setAreas((current) =>
      current.map((area) =>
        area.id !== selectedArea.id
          ? area
          : {
              ...area,
              projects: area.projects.map((project) =>
                project.id !== selectedProject.id
                  ? project
                  : { ...project, tasks: [...project.tasks, newTask] }
              ),
            }
      )
    );
    setNewTaskTitle("");
    setIsAddingTask(false);
  }

  function openBrainConvert(itemId: string) {
    setBrainConvertItemId(itemId);
    setBrainConvertAreaId(areas[0]?.id ?? null);
    setBrainConvertType("project");
  }

  function closeBrainConvert() {
    setBrainConvertItemId(null);
    setBrainConvertAreaId(null);
    setBrainConvertType(null);
  }

  function confirmBrainConvert() {
    if (!activeBrainItem || !brainConvertAreaId || !brainConvertType) return;

    if (brainConvertType === "project") {
      const projectId = uid("project");
      setAreas((current) =>
        current.map((area) =>
          area.id !== brainConvertAreaId
            ? area
            : {
                ...area,
                projects: [
                  ...area.projects,
                  {
                    id: projectId,
                    name: activeBrainItem.text,
                    notes: "",
                    dueDate: "",
                    status: "Active",
                    tasks: [],
                  },
                ],
              }
        )
      );
      setSelectedAreaId(brainConvertAreaId);
      setSelectedProjectId(projectId);
      setTab("areas");
    } else if (brainConvertType === "idea") {
      setAreas((current) =>
        current.map((area) =>
          area.id !== brainConvertAreaId
            ? area
            : {
                ...area,
                ideas: [
                  ...area.ideas,
                  { id: uid("idea"), title: activeBrainItem.text },
                ],
              }
        )
      );
      setSelectedAreaId(brainConvertAreaId);
      setSelectedProjectId(null);
      setTab("areas");
    } else {
      const taskId = uid("task");
      setAreas((current) =>
        current.map((area) =>
          area.id !== brainConvertAreaId
            ? area
            : {
                ...area,
                tasks: [
                  ...area.tasks,
                  {
                    id: taskId,
                    title: activeBrainItem.text,
                    done: false,
                    due: "",
                    inWeek: false,
                    inToday: false,
                    duration: null,
                  },
                ],
              }
        )
      );
      setSelectedAreaId(brainConvertAreaId);
      setSelectedProjectId(null);
      setTab("areas");
    }

    setBrainItems((current) =>
      current.filter((item) => item.id !== activeBrainItem.id)
    );
    closeBrainConvert();
  }

  const headerTitle = selectedProject
    ? selectedProject.name
    : selectedArea
      ? selectedArea.name
      : tab === "areas"
        ? "Life Dashboard"
        : tab === "week"
          ? "This Week"
          : tab === "today"
            ? "Today"
            : tab === "review"
              ? "Weekly Review"
              : "Brain Dump";

  const headerSub = selectedProject
    ? "Tasks in this project"
    : selectedArea
      ? "Projects, tasks, and ideas"
      : tab === "areas"
        ? "Areas"
        : tab === "week"
          ? "Current focus queue"
          : tab === "today"
            ? "What matters now"
            : tab === "review"
            ? "Reset and prepare your system"
              : "Capture first, organize later";

  const headerEyebrow = selectedProject
    ? "Project View"
    : selectedArea
      ? "Area View"
      : "Personal System";

  const steps = [
  {
    title: "Capture → Organize → Execute",
    body: "Brain Dump → Areas → Week / Today",
  },
  {
    title: "Areas",
    body: "Work, Home, Health. Everything lives in an Area.",
  },
  {
    title: "Projects, Tasks, Ideas",
    body: "Projects = multi-step. Tasks = one-off. Ideas = maybe later.",
  },
  {
    title: "Week and Today",
    body: "Week = planning. Today = what you do now.",
  },
  {
    title: "Brain Dump",
    body: "Capture fast. Convert later.",
  },
];

const step = steps[onboardingStep];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.10),_transparent_28%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] md:max-w-6xl md:flex-row dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.14),_transparent_24%),linear-gradient(180deg,_#0f172a,_#020617)]">
        <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:border-slate-200 md:bg-white/80 md:p-4 md:backdrop-blur-xl dark:md:border-slate-700 dark:md:bg-slate-900/80">
          <div className="mb-6 px-2">
            <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.24em]">
                Personal System
              </span>
            </div>
            <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Life Dashboard
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("areas");
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${!selectedArea && !selectedProject && tab === "areas" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <Home className="h-5 w-5" />
              Areas
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("week");
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${!selectedArea && !selectedProject && tab === "week" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <CalendarDays className="h-5 w-5" />
              Week
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("today");
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${!selectedArea && !selectedProject && tab === "today" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <CheckCircle2 className="h-5 w-5" />
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("brain");
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${!selectedArea && !selectedProject && tab === "brain" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <Brain className="h-5 w-5" />
              Brain
            </button>

            <button
  type="button"
  onClick={() => {
    setSelectedAreaId(null);
    setSelectedProjectId(null);
    setTab("review");
  }}
  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${
    !selectedArea && !selectedProject && tab === "review"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`}
>
  <Sparkles className="h-5 w-5" />
  Review
</button>

            
          </div>
          <div className="mt-6 space-y-2 px-2 text-sm text-slate-500 dark:text-slate-400">
            <div>Areas {areas.length}</div>
            <div>This Week {weekTasks.length}</div>
            <div>Today {todayTasks.length}</div>
            <div>Brain Dump {brainItems.length}</div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80 md:px-6">
            <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              {selectedArea || selectedProject ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="text-xs font-medium uppercase tracking-[0.24em]">
                {headerEyebrow}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(selectedArea || selectedProject) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedProject) setSelectedProjectId(null);
                      else setSelectedAreaId(null);
                    }}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {headerTitle}
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {headerSub}
                  </p>
                </div>
              </div>        

<SignedOut>
  <SignInButton mode="modal">
    <button
      type="button"
      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      Sign in
    </button>
  </SignInButton>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
                
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 md:px-6 md:pb-10">
            {!selectedArea && !selectedProject && tab === "areas" && (
              <div className="space-y-4">
                <AreaGrid
                  areas={areas}
                  areaMenuOpen={areaMenuOpen}
                  editingAreaIconId={editingAreaIconId}
                  onOpenArea={openArea}
                  onOpenNewArea={() => setShowNewArea(true)}
                  onToggleAreaMenu={(areaId) => {
                    setAreaMenuOpen((current) => (current === areaId ? null : areaId));
                    setEditingAreaIconId(null);
                  }}
                  onToggleEditingAreaIcon={(areaId) => {
                    setEditingAreaIconId((current) =>
                      current === areaId ? null : areaId
                    );
                  }}
                  onRenameArea={renameArea}
                  onCycleAreaColor={cycleAreaColor}
                  onDeleteArea={deleteArea}
                  onSetAreaIcon={(areaId, iconKey) => {
                    setAreaIcon(areaId, iconKey);
                    setEditingAreaIconId(null);
                    setAreaMenuOpen(null);
                  }}
                />

                <Card>
                  <div className="px-5 pb-3 pt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Recently completed
                  </div>
                  <div className="space-y-3 px-5 pb-5">
                    {completedTasks.length ? (
                      completedTasks.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-900"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm text-slate-500 line-through decoration-slate-400 dark:text-slate-400">
                            {item.title}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        Nothing completed yet.
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {selectedArea && !selectedProject && (
              <AreaDetailView
  selectedArea={selectedArea}
  editingAreaIconId={editingAreaIconId}
  ideasExpanded={ideasExpanded}
  setIdeasExpanded={setIdeasExpanded}
  setEditingAreaIconId={setEditingAreaIconId}
  setAreas={setAreas}
  onRenameArea={renameArea}
  onCycleAreaColor={cycleAreaColor}
  onDeleteArea={deleteArea}
  onSetAreaIcon={setAreaIcon}
  onOpenAddProject={() => {
    setNewProjectName("");
    setShowAddProjectModal(true);
  }}
  onOpenAddTask={() => {
    setNewAreaTaskTitle("");
    setShowAddTaskModal(true);
  }}
  onOpenAddIdea={() => {
    setNewIdeaTitle("");
    setShowAddIdeaModal(true);
  }}
  onOpenProject={(projectId) => setSelectedProjectId(projectId)}
  onDeleteProject={deleteProject}
  onToggleTask={toggleTask}
  onSetTaskTitle={setTaskTitle}
  onSetTaskDate={setTaskDate}
  onAddToWeek={addToWeek}
  onAddToToday={addToToday}
  onRemoveFromWeek={removeFromWeek}
  onRemoveFromToday={removeFromToday}
  onDeleteTask={deleteTask}
  onCycleTaskDuration={cycleTaskDuration}
  onDeleteIdea={deleteIdea}
  onConvertIdea={convertIdea}
/>
            )}

            {selectedArea && selectedProject && (
              <ProjectDetailView
                area={selectedArea}
                project={selectedProject}
                isAddingTask={isAddingTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                setIsAddingTask={setIsAddingTask}
                setAreas={setAreas}
                addTaskToSelectedProject={addTaskToSelectedProject}
                toggleTask={toggleTask}
                setTaskTitle={setTaskTitle}
                setTaskDate={setTaskDate}
                addToWeek={addToWeek}
                addToToday={addToToday}
                removeFromWeek={removeFromWeek}
                removeFromToday={removeFromToday}
                deleteTask={deleteTask}
                cycleTaskDuration={cycleTaskDuration}
              />
            )}

            {!selectedArea && !selectedProject && tab === "week" && (
  <WeekView
    weekTasks={weekTasks}
    toggleTask={toggleTask}
    setTaskTitle={setTaskTitle}
    setTaskDate={setTaskDate}
    addToWeek={addToWeek}
    addToToday={addToToday}
    removeFromWeek={removeFromWeek}
    removeFromToday={removeFromToday}
    deleteTask={deleteTask}
    cycleTaskDuration={cycleTaskDuration}
  />
)}

           {!selectedArea && !selectedProject && tab === "today" && (
  <TodayView
    todayTasks={todayTasks}
    toggleTask={toggleTask}
    setTaskTitle={setTaskTitle}
    setTaskDate={setTaskDate}
    addToWeek={addToWeek}
    addToToday={addToToday}
    removeFromWeek={removeFromWeek}
    removeFromToday={removeFromToday}
    deleteTask={deleteTask}
    cycleTaskDuration={cycleTaskDuration}
  />
)}

           {!selectedArea && !selectedProject && tab === "brain" && (
  <BrainDumpView
    brainInput={brainInput}
    setBrainInput={setBrainInput}
    addBrainItem={addBrainItem}
    brainItems={brainItems}
    openBrainConvert={openBrainConvert}
    setConfirmState={setConfirmState}
  />
)}

                    {!selectedArea && !selectedProject && tab === "review" && (
  <ReviewView />
)}
            
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-slate-200 bg-white px-4 pb-5 pt-3 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="grid grid-cols-5 items-center gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
            <BottomTab
              active={!selectedArea && !selectedProject && tab === "areas"}
              icon={Home}
              label="Areas"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("areas");
              }}
            />
            <BottomTab
              active={!selectedArea && !selectedProject && tab === "week"}
              icon={CalendarDays}
              label="Week"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("week");
              }}
            />
            <BottomTab
              active={!selectedArea && !selectedProject && tab === "today"}
              icon={CheckCircle2}
              label="Today"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("today");
              }}
            />
            <BottomTab
              active={!selectedArea && !selectedProject && tab === "brain"}
              icon={Brain}
              label="Brain"
              onClick={() => {
                setSelectedAreaId(null);
                setSelectedProjectId(null);
                setTab("brain");
              }}
            />
            <BottomTab
  active={!selectedArea && !selectedProject && tab === "review"}
  icon={Sparkles}
  label="Review"
  onClick={() => {
    setSelectedAreaId(null);
    setSelectedProjectId(null);
    setTab("review");
  }}
/>
          </div>
        </div>
        
      {showAddProjectModal && selectedArea && (
  <ModalShell>
    <Card className="w-full max-w-md">
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              New Project
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddProjectModal(false);
              setNewProjectName("");
            }}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addProject(selectedArea.id);
            }
          }}
          placeholder="Project name"
          autoFocus
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              addProject(selectedArea.id);
            }}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddProjectModal(false);
              setNewProjectName("");
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  </ModalShell>
)}

    {showAddTaskModal && selectedArea && (
  <ModalShell>
    <Card className="w-full max-w-md">
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              New Task
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddTaskModal(false);
              setNewAreaTaskTitle("");
            }}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          value={newAreaTaskTitle}
          onChange={(e) => setNewAreaTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addAreaTask(selectedArea.id);            }
          }}
          placeholder="Task name"
          autoFocus
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              addAreaTask(selectedArea.id);
            }}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddTaskModal(false);
              setNewAreaTaskTitle("");
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  </ModalShell>
)}

       {showAddIdeaModal && selectedArea && (
  <ModalShell>
    <Card className="w-full max-w-md">
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              New Idea
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddIdeaModal(false);
              setNewIdeaTitle("");
            }}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          value={newIdeaTitle}
          onChange={(e) => setNewIdeaTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addIdea(selectedArea.id);
            }
          }}
          placeholder="Idea"
          autoFocus
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              addIdea(selectedArea.id);
            }}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddIdeaModal(false);
              setNewIdeaTitle("");
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  </ModalShell>
)}
        
        <NewAreaModal
          open={showNewArea}
          newAreaName={newAreaName}
          newAreaColor={newAreaColor}
          newAreaIcon={newAreaIcon}
          setNewAreaName={setNewAreaName}
          setNewAreaColor={setNewAreaColor}
          setNewAreaIcon={setNewAreaIcon}
          onCreateArea={createArea}
          onClose={() => setShowNewArea(false)}
        />

        {brainConvertItemId && activeBrainItem && (
          <ModalShell>
            <Card className="w-full max-w-md">
              <div className="space-y-4 px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Convert Brain Dump Item
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Choose the destination area and type.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeBrainConvert}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {activeBrainItem.text}
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Area
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setBrainConvertAreaId(area.id)}
                        className={`rounded-full px-3 py-2 text-sm ${brainConvertAreaId === area.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                      >
                        {area.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Convert to
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBrainConvertType("idea")}
                      className={`rounded-2xl px-4 py-2 text-sm ${brainConvertType === "idea" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                    >
                      Idea
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrainConvertType("project")}
                      className={`rounded-2xl px-4 py-2 text-sm ${brainConvertType === "project" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                    >
                      Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrainConvertType("task")}
                      className={`rounded-2xl px-4 py-2 text-sm ${brainConvertType === "task" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}
                    >
                      Task
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={confirmBrainConvert}
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
                  >
                    Convert
                  </button>
                  <button
                    type="button"
                    onClick={closeBrainConvert}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          </ModalShell>
        )}


{showOnboarding && (
  <ModalShell>
    <Card className="w-full max-w-md">
 <div className="space-y-5 px-5 py-5">
  <div>
    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
      {step.title}
    </div>
    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
      {step.body}
    </div>
  </div>

  <div className="flex items-center justify-between">
    <div className="text-xs text-slate-500">
      {onboardingStep + 1} / {steps.length}
    </div>

    <div className="flex gap-2">
      {onboardingStep > 0 && (
        <button
          onClick={() => setOnboardingStep((s) => s - 1)}
          className="rounded-2xl border px-3 py-2 text-sm"
        >
          Back
        </button>
      )}

      {onboardingStep < steps.length - 1 ? (
        <button
          onClick={() => setOnboardingStep((s) => s + 1)}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
        >
          Next
        </button>
      ) : (
        <button
          onClick={() => {
            setCompletedOnboarding(true);
            setShowOnboarding(false);
          }}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
        >
          Get Started
        </button>
      )}
    </div>
  </div>
</div>
    </Card>
  </ModalShell>
)}




        <ConfirmDialog
          open={Boolean(confirmState)}
          label={confirmState?.label ?? ""}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmState(null)}
        />

        <RenameAreaModal
          renameAreaState={renameAreaState}
          setRenameAreaState={setRenameAreaState}
          onSave={confirmRenameArea}
          onClose={() => setRenameAreaState(null)}
        />
      </div>
    </div>
  );
}
