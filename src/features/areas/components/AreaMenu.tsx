import React from "react";
import type { Area, IconKey } from "../../../lib/types/shared";
import { IconPicker } from "../../../components/ui/IconPicker";

export function AreaMenu({
  area,
  isEditingIcon,
  onRenameArea,
  onCycleAreaColor,
  onToggleEditingIcon,
  onOpenArea,
  onDeleteArea,
  onSetAreaIcon,
}: {
  area: Area;
  isEditingIcon: boolean;
  onRenameArea: () => void;
  onCycleAreaColor: () => void;
  onToggleEditingIcon: () => void;
  onOpenArea: () => void;
  onDeleteArea: () => void;
  onSetAreaIcon: (iconKey: IconKey) => void;
}) {
  return (
    <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={onRenameArea}
        className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Edit name
      </button>
      <button
        type="button"
        onClick={onCycleAreaColor}
        className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Change color
      </button>
      <button
        type="button"
        onClick={onToggleEditingIcon}
        className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Change icon
      </button>
      <button
        type="button"
        onClick={onOpenArea}
        className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Open area
      </button>
      <button
        type="button"
        onClick={onDeleteArea}
        className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
      >
        Delete area
      </button>

      {isEditingIcon && (
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <IconPicker selected={area.iconKey} onSelect={onSetAreaIcon} />
        </div>
      )}
    </div>
  );
}