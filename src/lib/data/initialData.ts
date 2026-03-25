import type { Area, BrainItem } from "../types/shared";

export const areaColorOptions = [
  "from-pink-100 to-rose-50",
  "from-emerald-100 to-cyan-50",
  "from-sky-100 to-indigo-50",
  "from-orange-100 to-yellow-50",
  "from-violet-100 to-fuchsia-50",
  "from-slate-100 to-zinc-50",
  "from-indigo-100 to-cyan-50",
  "from-amber-100 to-rose-50",
] as const;

export const defaultColor = areaColorOptions[5];

export const initialAreas: Area[] = [
  {
    id: "faith",
    name: "Faith",
    iconKey: "heart",
    color: "from-pink-100 to-rose-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
  {
    id: "health",
    name: "Health",
    iconKey: "dumbbell",
    color: "from-emerald-100 to-cyan-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
  {
    id: "home",
    name: "Home",
    iconKey: "house",
    color: "from-orange-100 to-yellow-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
  {
    id: "family",
    name: "Family",
    iconKey: "users",
    color: "from-violet-100 to-fuchsia-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
  {
    id: "career",
    name: "Career",
    iconKey: "briefcase",
    color: "from-sky-100 to-indigo-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
  {
    id: "admin",
    name: "Admin",
    iconKey: "clipboard",
    color: "from-slate-100 to-zinc-50",
    ideas: [],
    projects: [],
    tasks: [],
  },
];

export const initialBrainItems: BrainItem[] = [];