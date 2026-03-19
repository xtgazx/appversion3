import React from "react";

export function BottomTab({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition ${active ? "bg-indigo-100 text-indigo-700 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-200" : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-medium tracking-wide">{label}</span>
    </button>
  );
}