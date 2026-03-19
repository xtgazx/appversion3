import React from "react";
import { X } from "lucide-react";
import type { IconKey } from "../../../lib/types/shared";
import { areaColorOptions } from "../../../lib/data/initialData";
import { Card } from "../../../components/ui/Card";
import { IconPicker } from "../../../components/ui/IconPicker";
import { ModalShell } from "../../../components/shared/ModalShell";

export function NewAreaModal({
  open,
  newAreaName,
  newAreaColor,
  newAreaIcon,
  setNewAreaName,
  setNewAreaColor,
  setNewAreaIcon,
  onCreateArea,
  onClose,
}: {
  open: boolean;
  newAreaName: string;
  newAreaColor: (typeof areaColorOptions)[number];
  newAreaIcon: IconKey;
  setNewAreaName: React.Dispatch<React.SetStateAction<string>>;
  setNewAreaColor: React.Dispatch<
    React.SetStateAction<(typeof areaColorOptions)[number]>
  >;
  setNewAreaIcon: React.Dispatch<React.SetStateAction<IconKey>>;
  onCreateArea: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <ModalShell>
      <Card className="w-full max-w-md">
        <div className="space-y-3 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                New Area
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Create a new life area.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Area name"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Icon
            </div>
            <IconPicker selected={newAreaIcon} onSelect={setNewAreaIcon} />
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Color
            </div>
            <div className="grid grid-cols-4 gap-2">
              {areaColorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewAreaColor(color)}
                  className={`h-10 rounded-xl border bg-gradient-to-br dark:from-slate-800 dark:to-slate-700/90 ${color} ${newAreaColor === color ? "border-slate-900 dark:border-slate-100" : "border-slate-200 dark:border-slate-700"}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCreateArea}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
            >
              Create Area
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    </ModalShell>
  );
}