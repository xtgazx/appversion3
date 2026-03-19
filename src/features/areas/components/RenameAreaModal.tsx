import React from "react";
import { X } from "lucide-react";
import type { RenameAreaState } from "../../../lib/types/shared";
import { Card } from "../../../components/ui/Card";
import { ModalShell } from "../../../components/shared/ModalShell";

export function RenameAreaModal({
  renameAreaState,
  setRenameAreaState,
  onSave,
  onClose,
}: {
  renameAreaState: RenameAreaState;
  setRenameAreaState: React.Dispatch<React.SetStateAction<RenameAreaState>>;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!renameAreaState) return null;

  return (
    <ModalShell>
      <Card className="w-full max-w-md">
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Edit Area Name
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Update the name for this area.
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
            value={renameAreaState.value}
            onChange={(e) =>
              setRenameAreaState((current) =>
                current ? { ...current, value: e.target.value } : current
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
            }}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
            >
              Save
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