import React, { useEffect, useState } from "react";

export function InlineText({
  value,
  onSave,
  displayClassName,
}: {
  value: string;
  onSave: (value: string) => void;
  displayClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    const next = draft.trim() || value;
    onSave(next);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-2 ring-indigo-100 dark:bg-slate-800 dark:text-slate-100"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={
        displayClassName ??
        "w-full rounded-xl px-1 py-1 text-left text-sm text-slate-900 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700/60"
      }
    >
      {value}
    </button>
  );
}