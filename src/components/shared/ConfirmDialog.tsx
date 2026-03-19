import React from "react";
import { X } from "lucide-react";
import { Card } from "../ui/Card";
import { ModalShell } from "./ModalShell";

export function ConfirmDialog({
  open,
  label,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <ModalShell>
      <Card className="w-full max-w-md">
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Confirm Delete
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                This action cannot be undone.
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            {label}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-2xl bg-red-600 px-4 py-2 text-white"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onCancel}
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