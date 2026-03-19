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
    id: "personal",
    name: "Personal",
    iconKey: "heart",
    color: "from-pink-100 to-rose-50",
    ideas: [{ id: "i1", title: "Start a simple journaling habit" }],
    projects: [
      {
        id: "p1",
        name: "Morning Routine Refresh",
        notes: "Build a simpler, repeatable start to the day.",
        dueDate: "",
        status: "Active",
        tasks: [
          {
            id: "t1",
            title: "Write ideal routine steps",
            done: false,
            due: "",
            inWeek: true,
            inToday: false,
            duration: null,
          },
          {
            id: "t2",
            title: "Test routine for 3 mornings",
            done: false,
            due: "",
            inWeek: false,
            inToday: false,
            duration: null,
          },
        ],
      },
    ],
    tasks: [
      {
        id: "at1",
        title: "Buy birthday card",
        done: false,
        due: "",
        inWeek: false,
        inToday: false,
        duration: "quick",
      },
    ],
  },
  {
    id: "health",
    name: "Health",
    iconKey: "dumbbell",
    color: "from-emerald-100 to-cyan-50",
    ideas: [],
    projects: [
      {
        id: "p2",
        name: "Weekly Movement Plan",
        notes: "Keep activity simple and consistent.",
        dueDate: "",
        status: "Active",
        tasks: [
          {
            id: "t3",
            title: "Plan 3 movement sessions",
            done: false,
            due: "",
            inWeek: true,
            inToday: true,
            duration: null,
          },
          {
            id: "t4",
            title: "Prepare workout clothes",
            done: false,
            due: "",
            inWeek: false,
            inToday: false,
            duration: null,
          },
        ],
      },
    ],
    tasks: [
      {
        id: "at2",
        title: "Schedule checkup",
        done: false,
        due: "",
        inWeek: true,
        inToday: false,
        duration: "quick",
      },
    ],
  },
  {
    id: "work",
    name: "Work",
    iconKey: "briefcase",
    color: "from-sky-100 to-indigo-50",
    ideas: [{ id: "i2", title: "Create a better meeting notes template" }],
    projects: [
      {
        id: "p3",
        name: "Weekly Review System",
        notes: "Create a lightweight review process.",
        dueDate: "",
        status: "Active",
        tasks: [
          {
            id: "t5",
            title: "List review questions",
            done: false,
            due: "",
            inWeek: true,
            inToday: false,
            duration: null,
          },
          {
            id: "t6",
            title: "Block 20 minutes for Friday review",
            done: false,
            due: "",
            inWeek: false,
            inToday: false,
            duration: null,
          },
        ],
      },
    ],
    tasks: [
      {
        id: "at3",
        title: "Reply to invoice email",
        done: false,
        due: "",
        inWeek: false,
        inToday: true,
        duration: "quick",
      },
    ],
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
    id: "learning",
    name: "Learning",
    iconKey: "lightbulb",
    color: "from-violet-100 to-fuchsia-50",
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

export const initialBrainItems: BrainItem[] = [
  { id: "b1", text: "Look into a better weekly reset routine" },
  { id: "b2", text: "Maybe create a packing checklist template" },
  { id: "b3", text: "Think about a simple meal planning system" },
];