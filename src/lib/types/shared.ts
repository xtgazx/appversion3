export type TabKey = "areas" | "week" | "today" | "brain";
export type Duration = "quick" | "medium" | "long" | null;
export type BrainConvertType = "idea" | "project" | "task" | null;

export type IconKey = string;

export type Task = {
  id: string;
  title: string;
  done: boolean;
  due: string;
  inWeek: boolean;
  inToday: boolean;
  duration: Duration;
};

export type Project = {
  id: string;
  name: string;
  notes: string;
  dueDate: string;
  status: string;
  tasks: Task[];
};

export type Idea = {
  id: string;
  title: string;
};

export type Area = {
  id: string;
  name: string;
  iconKey: IconKey;
  color: string;
  ideas: Idea[];
  projects: Project[];
  tasks: Task[];
};

export type BrainItem = {
  id: string;
  text: string;
};

export type FlatTask = Task & {
  areaId: string;
  areaName: string;
  projectId: string | null;
  projectName: string | null;
  scope: "project" | "area";
};

export type ConfirmState =
  | { kind: "area"; areaId: string; label: string }
  | { kind: "project"; areaId: string; projectId: string; label: string }
  | {
      kind: "task";
      areaId: string;
      projectId: string | null;
      taskId: string;
      label: string;
      scope: "project" | "area";
    }
  | { kind: "brain"; itemId: string; label: string }
  | null;

export type RenameAreaState = { areaId: string; value: string } | null;

export type StoredData = {
  areas: Area[];
  brainItems: BrainItem[];
};