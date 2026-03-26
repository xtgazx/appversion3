import React from "react";
import { Card } from "../../../components/ui/Card";
import { InlineText } from "../../../components/ui/InlineText";

export function BrainDumpView({
  brainInput,
  setBrainInput,
  addBrainItem,
  brainItems,
  openBrainConvert,
  setConfirmState,
  onEditBrainItem,
}: {
  brainInput: string;
  setBrainInput: (value: string) => void;
  addBrainItem: () => void;
  brainItems: any[];
  openBrainConvert: (itemId: string) => void;
  setConfirmState: any;
  onEditBrainItem: (id: string, text: string) => void;
}) {
  return (
    <Card>
      <div className="px-5 pb-3 pt-5">
        <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Brain Dump
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Capture now, organize later
        </div>
      </div>

      <div className="space-y-3 px-5 pb-5">
        <textarea
          value={brainInput}
          onChange={(e) => setBrainInput(e.target.value)}
          placeholder="Type a thought, task, project idea, reminder, or loose note..."
          className="min-h-[80px] w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <button
          type="button"
          onClick={addBrainItem}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
        >
          Add
        </button>

        {brainItems.length ? (
          brainItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex-1">
                <InlineText
  value={item.text}
  onSave={(val) => onEditBrainItem(item.id, val)}
/>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openBrainConvert(item.id)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Convert
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirmState({
                      kind: "brain",
                      itemId: item.id,
                      label: item.text,
                    })
                  }
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Nothing captured yet.
          </div>
        )}
      </div>
    </Card>
  );
}